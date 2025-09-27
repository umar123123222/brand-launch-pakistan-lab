-- Update check_booking_capacity function to only count SalesAgent roles
CREATE OR REPLACE FUNCTION public.check_booking_capacity(booking_date date, booking_time time without time zone, max_capacity integer DEFAULT NULL)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_bookings INTEGER;
  available_agents INTEGER;
  day_of_week_num INTEGER;
  target_datetime_utc TIMESTAMP WITH TIME ZONE;
  target_datetime_pkt TIMESTAMP WITH TIME ZONE;
  actual_capacity INTEGER;
BEGIN
  -- Get day of week (0=Sunday, 6=Saturday)
  day_of_week_num := EXTRACT(DOW FROM booking_date);
  
  -- Count available SalesAgent users for this time slot (only SalesAgent role)
  SELECT COUNT(*) INTO available_agents
  FROM public.user_profiles up
  JOIN public.agent_schedules sch ON up.auth_user_id = sch.user_id
  WHERE up.role = 'SalesAgent'
    AND sch.day_of_week = day_of_week_num
    AND sch.is_active = true
    AND booking_time >= sch.duty_start_time
    AND booking_time < sch.duty_end_time;
  
  -- If no agents available, return false
  IF available_agents = 0 THEN
    RETURN FALSE;
  END IF;
  
  -- Use the provided max_capacity or default to available agents count
  actual_capacity := COALESCE(max_capacity, available_agents);
  
  -- Create target datetime in Pakistan timezone, then convert to UTC for comparison
  target_datetime_pkt := (booking_date::text || ' ' || booking_time::text)::timestamp;
  target_datetime_utc := target_datetime_pkt AT TIME ZONE 'Asia/Karachi';
  
  -- Count current confirmed bookings for this exact time slot
  SELECT COUNT(*) INTO current_bookings
  FROM public.booking_form_submissions
  WHERE booking_datetime = target_datetime_utc
    AND status = 'confirmed';
  
  -- Return true if we have capacity
  RETURN current_bookings < actual_capacity;
END;
$function$;

-- Update get_next_available_agent function to only consider SalesAgent roles
CREATE OR REPLACE FUNCTION public.get_next_available_agent(booking_date date, booking_time time without time zone)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  selected_agent_id UUID;
  day_of_week_num INTEGER;
BEGIN
  -- Get day of week (0=Sunday, 6=Saturday)
  day_of_week_num := EXTRACT(DOW FROM booking_date);
  
  -- Find SalesAgent with minimum bookings for that date who is available at that time
  SELECT up.auth_user_id INTO selected_agent_id
  FROM public.user_profiles up
  JOIN public.agent_schedules sch ON up.auth_user_id = sch.user_id
  LEFT JOIN public.agent_capacity_tracking act ON up.auth_user_id = act.agent_id AND act.tracking_date = booking_date
  WHERE up.role = 'SalesAgent'
    AND sch.day_of_week = day_of_week_num
    AND sch.is_active = true
    AND booking_time >= sch.duty_start_time
    AND booking_time < sch.duty_end_time
  ORDER BY COALESCE(act.booking_count, 0) ASC, RANDOM()
  LIMIT 1;
  
  RETURN selected_agent_id;
END;
$function$;