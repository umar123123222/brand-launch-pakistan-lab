-- Phase 1: Database-Level Protection for Booking System

-- First, let's populate the agent_schedules table with proper working hours
-- Get all agents who can handle bookings and set their schedules (Monday-Saturday, 9 AM - 5 PM PKT)
INSERT INTO public.agent_schedules (user_id, day_of_week, duty_start_time, duty_end_time, is_active)
SELECT 
  up.auth_user_id,
  dow.day_num,
  '09:00:00'::time,
  '17:00:00'::time,
  true
FROM public.user_profiles up
CROSS JOIN (
  SELECT generate_series(1, 6) as day_num  -- Monday(1) to Saturday(6), exclude Sunday(0)
) dow
WHERE up.role IN ('SuperAdmin', 'Admin', 'SalesAgent')
ON CONFLICT (user_id, day_of_week) 
DO UPDATE SET 
  duty_start_time = EXCLUDED.duty_start_time,
  duty_end_time = EXCLUDED.duty_end_time,
  is_active = EXCLUDED.is_active;

-- Create function to check booking capacity atomically
CREATE OR REPLACE FUNCTION public.check_booking_capacity(
  booking_date DATE,
  booking_time TIME,
  max_capacity INTEGER DEFAULT 2
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_bookings INTEGER;
  available_agents INTEGER;
  day_of_week_num INTEGER;
BEGIN
  -- Get day of week (0=Sunday, 6=Saturday)
  day_of_week_num := EXTRACT(DOW FROM booking_date);
  
  -- Count available agents for this time slot
  SELECT COUNT(*) INTO available_agents
  FROM public.user_profiles up
  JOIN public.agent_schedules sch ON up.auth_user_id = sch.user_id
  WHERE up.role IN ('SuperAdmin', 'Admin', 'SalesAgent')
    AND sch.day_of_week = day_of_week_num
    AND sch.is_active = true
    AND booking_time >= sch.duty_start_time
    AND booking_time < sch.duty_end_time;
  
  -- If no agents available, return false
  IF available_agents = 0 THEN
    RETURN FALSE;
  END IF;
  
  -- Use the minimum of max_capacity or available_agents
  max_capacity := LEAST(max_capacity, available_agents);
  
  -- Count current confirmed bookings for this exact time slot
  SELECT COUNT(*) INTO current_bookings
  FROM public.booking_form_submissions bfs
  WHERE DATE(bfs.booking_datetime AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Karachi') = booking_date
    AND TIME(bfs.booking_datetime AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Karachi') = booking_time
    AND bfs.status = 'confirmed';
  
  -- Return true if we have capacity
  RETURN current_bookings < max_capacity;
END;
$$;

-- Create function for atomic booking insertion
CREATE OR REPLACE FUNCTION public.create_booking_atomic(
  p_full_name TEXT,
  p_email TEXT,
  p_whatsapp_number TEXT,
  p_categories TEXT[],
  p_business_timeline TEXT,
  p_investment_ready BOOLEAN,
  p_seen_elyscents BOOLEAN,
  p_booking_datetime TIMESTAMP WITH TIME ZONE
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  booking_date DATE;
  booking_time TIME;
  capacity_available BOOLEAN;
  new_booking_id UUID;
  result JSON;
BEGIN
  -- Extract date and time in Pakistan timezone
  booking_date := DATE(p_booking_datetime AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Karachi');
  booking_time := TIME(p_booking_datetime AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Karachi');
  
  -- Start transaction
  BEGIN
    -- Lock the booking table for this specific time slot to prevent race conditions
    PERFORM pg_advisory_xact_lock(
      hashtext(booking_date::text || booking_time::text)
    );
    
    -- Check if capacity is available
    SELECT public.check_booking_capacity(booking_date, booking_time, 2) INTO capacity_available;
    
    IF NOT capacity_available THEN
      result := json_build_object(
        'success', false,
        'error', 'This time slot is fully booked. Please select another time.',
        'error_code', 'CAPACITY_EXCEEDED'
      );
      RETURN result;
    END IF;
    
    -- Check for duplicate booking from same email/phone
    IF EXISTS (
      SELECT 1 FROM public.booking_form_submissions 
      WHERE (email = p_email OR whatsapp_number = p_whatsapp_number)
        AND DATE(booking_datetime AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Karachi') = booking_date
        AND TIME(booking_datetime AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Karachi') = booking_time
        AND status = 'confirmed'
    ) THEN
      result := json_build_object(
        'success', false,
        'error', 'You already have a booking for this time slot.',
        'error_code', 'DUPLICATE_BOOKING'
      );
      RETURN result;
    END IF;
    
    -- Create the booking
    INSERT INTO public.booking_form_submissions (
      full_name,
      email, 
      whatsapp_number,
      categories,
      business_timeline,
      investment_ready,
      seen_elyscents,
      booking_datetime,
      status
    ) VALUES (
      p_full_name,
      p_email,
      p_whatsapp_number, 
      p_categories,
      p_business_timeline,
      p_investment_ready,
      p_seen_elyscents,
      p_booking_datetime,
      'confirmed'
    ) RETURNING id INTO new_booking_id;
    
    result := json_build_object(
      'success', true,
      'booking_id', new_booking_id,
      'message', 'Booking created successfully'
    );
    
    RETURN result;
    
  EXCEPTION WHEN OTHERS THEN
    -- Log the error
    INSERT INTO public.error_logs (message, context, created_at, timestamp)
    VALUES (
      'Failed to create atomic booking: ' || SQLERRM,
      jsonb_build_object(
        'email', p_email,
        'booking_datetime', p_booking_datetime,
        'error', SQLERRM
      ),
      now(),
      now()
    );
    
    result := json_build_object(
      'success', false,
      'error', 'An error occurred while creating your booking. Please try again.',
      'error_code', 'BOOKING_ERROR'
    );
    
    RETURN result;
  END;
END;
$$;

-- Create function to get real-time slot availability
CREATE OR REPLACE FUNCTION public.get_slot_availability(
  p_date DATE,
  p_start_hour INTEGER DEFAULT 9,
  p_end_hour INTEGER DEFAULT 17,
  p_slot_duration_minutes INTEGER DEFAULT 60
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  slot_time TIME;
  slot_datetime TIMESTAMP WITH TIME ZONE;
  current_bookings INTEGER;
  max_capacity INTEGER := 2;
  available_capacity INTEGER;
  slots JSON[] := '{}';
  slot_info JSON;
  hour_counter INTEGER;
BEGIN
  -- Check if date is a working day (not Sunday and not a holiday)
  IF EXTRACT(DOW FROM p_date) = 0 THEN
    RETURN json_build_object('slots', '[]'::json, 'error', 'Sundays are not available for bookings');
  END IF;
  
  IF EXISTS (SELECT 1 FROM public.holidays WHERE date = p_date) THEN
    RETURN json_build_object('slots', '[]'::json, 'error', 'This date is a holiday');
  END IF;
  
  -- Generate slots for the day
  FOR hour_counter IN p_start_hour..(p_end_hour - 1) LOOP
    slot_time := (hour_counter || ':00:00')::TIME;
    
    -- Convert to proper timezone for storage (UTC)
    slot_datetime := (p_date::text || ' ' || slot_time::text)::timestamp AT TIME ZONE 'Asia/Karachi' AT TIME ZONE 'UTC';
    
    -- Count current bookings for this slot
    SELECT COUNT(*) INTO current_bookings
    FROM public.booking_form_submissions bfs
    WHERE DATE(bfs.booking_datetime AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Karachi') = p_date
      AND TIME(bfs.booking_datetime AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Karachi') = slot_time
      AND bfs.status = 'confirmed';
    
    available_capacity := max_capacity - current_bookings;
    
    slot_info := json_build_object(
      'time', to_char(slot_time, 'HH12:MI AM'),
      'datetime', slot_datetime,
      'available', available_capacity > 0,
      'capacity', max_capacity,
      'booked', current_bookings,
      'remaining', GREATEST(0, available_capacity)
    );
    
    slots := slots || slot_info;
  END LOOP;
  
  RETURN json_build_object('slots', array_to_json(slots));
END;
$$;

-- Add constraint to prevent overbooking at database level
CREATE OR REPLACE FUNCTION public.validate_booking_capacity()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  booking_date DATE;
  booking_time TIME;
  capacity_available BOOLEAN;
BEGIN
  -- Only check for confirmed bookings
  IF NEW.status != 'confirmed' THEN
    RETURN NEW;
  END IF;
  
  booking_date := DATE(NEW.booking_datetime AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Karachi');
  booking_time := TIME(NEW.booking_datetime AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Karachi');
  
  -- Check capacity
  SELECT public.check_booking_capacity(booking_date, booking_time, 2) INTO capacity_available;
  
  IF NOT capacity_available THEN
    RAISE EXCEPTION 'Booking capacity exceeded for % at %', booking_date, booking_time;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to enforce capacity limits
DROP TRIGGER IF EXISTS validate_booking_capacity_trigger ON public.booking_form_submissions;
CREATE TRIGGER validate_booking_capacity_trigger
  BEFORE INSERT OR UPDATE ON public.booking_form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_booking_capacity();