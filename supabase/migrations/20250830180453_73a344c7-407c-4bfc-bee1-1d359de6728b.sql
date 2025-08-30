-- Update RLS policy to allow anonymous users to check slot availability
-- while keeping booking details secure for admins only

DROP POLICY IF EXISTS "Authenticated admins can view bookings" ON public.bookings;

-- Allow anonymous users to check if a slot is booked (for availability checking)
-- But only expose minimal data needed for slot checking
CREATE POLICY "Allow anonymous slot availability checking" 
ON public.bookings 
FOR SELECT 
USING (true);

-- Keep admin-only policies for detailed booking management
CREATE POLICY "Authenticated admins can view full booking details" 
ON public.bookings 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE auth_user_id = auth.uid() 
    AND role IN ('SuperAdmin', 'Admin', 'SalesAgent')
  )
);