-- Phase 1C: Create capacity checking function with simplified timezone handling
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
  target_datetime_utc TIMESTAMP WITH TIME ZONE;
  target_datetime_pkt TIMESTAMP WITH TIME ZONE;
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
  
  -- Create target datetime in Pakistan timezone, then convert to UTC for comparison
  target_datetime_pkt := (booking_date::text || ' ' || booking_time::text)::timestamp;
  target_datetime_utc := target_datetime_pkt AT TIME ZONE 'Asia/Karachi';
  
  -- Count current confirmed bookings for this exact time slot
  SELECT COUNT(*) INTO current_bookings
  FROM public.booking_form_submissions
  WHERE booking_datetime = target_datetime_utc
    AND status = 'confirmed';
  
  -- Return true if we have capacity
  RETURN current_bookings < max_capacity;
END;
$$;