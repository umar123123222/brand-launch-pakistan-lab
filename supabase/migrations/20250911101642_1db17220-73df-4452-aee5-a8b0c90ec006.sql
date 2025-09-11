-- Phase 1A: Populate agent schedules first
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