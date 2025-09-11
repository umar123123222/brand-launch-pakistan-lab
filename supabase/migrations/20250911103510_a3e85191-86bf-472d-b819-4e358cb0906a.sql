-- Phase 1E: Create validation trigger and slot availability function
CREATE OR REPLACE FUNCTION public.validate_booking_capacity()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  booking_date DATE;
  booking_time TIME;
  capacity_available BOOLEAN;
  target_datetime_pkt TIMESTAMP;
BEGIN
  -- Only check for confirmed bookings
  IF NEW.status != 'confirmed' THEN
    RETURN NEW;
  END IF;
  
  -- Convert to Pakistan timezone for validation
  target_datetime_pkt := NEW.booking_datetime AT TIME ZONE 'Asia/Karachi';
  booking_date := target_datetime_pkt::date;
  booking_time := target_datetime_pkt::time;
  
  -- Check capacity (exclude current booking from count if this is an update)
  IF TG_OP = 'INSERT' THEN
    SELECT public.check_booking_capacity(booking_date, booking_time, 2) INTO capacity_available;
  ELSE
    -- For updates, temporarily exclude the old booking from capacity check
    UPDATE public.booking_form_submissions 
    SET status = 'temp_excluded' 
    WHERE id = OLD.id;
    
    SELECT public.check_booking_capacity(booking_date, booking_time, 2) INTO capacity_available;
    
    -- Restore the old status
    UPDATE public.booking_form_submissions 
    SET status = OLD.status 
    WHERE id = OLD.id;
  END IF;
  
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

-- Create function to get real-time slot availability
CREATE OR REPLACE FUNCTION public.get_slot_availability(
  p_date DATE,
  p_start_hour INTEGER DEFAULT 9,
  p_end_hour INTEGER DEFAULT 17
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
  target_datetime_pkt TIMESTAMP;
  target_datetime_utc TIMESTAMP WITH TIME ZONE;
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
    
    -- Convert Pakistan time to UTC for storage
    target_datetime_pkt := (p_date::text || ' ' || slot_time::text)::timestamp;
    target_datetime_utc := target_datetime_pkt AT TIME ZONE 'Asia/Karachi';
    
    -- Count current bookings for this slot
    SELECT COUNT(*) INTO current_bookings
    FROM public.booking_form_submissions
    WHERE booking_datetime = target_datetime_utc
      AND status = 'confirmed';
    
    available_capacity := max_capacity - current_bookings;
    
    slot_info := json_build_object(
      'time', to_char(slot_time, 'HH12:MI AM'),
      'datetime', target_datetime_utc,
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