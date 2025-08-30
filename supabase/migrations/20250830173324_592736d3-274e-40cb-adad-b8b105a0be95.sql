-- Allow anonymous bookings by updating RLS policy
DROP POLICY IF EXISTS "Authenticated admins can manage bookings" ON public.bookings;

-- Allow anyone to insert bookings (for website visitors)
CREATE POLICY "Allow anonymous booking insertions" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

-- Restrict viewing and managing bookings to authenticated admins only
CREATE POLICY "Authenticated admins can view bookings" 
ON public.bookings 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE auth_user_id = auth.uid() 
    AND role IN ('SuperAdmin', 'Admin', 'SalesAgent')
  )
);

CREATE POLICY "Authenticated admins can update bookings" 
ON public.bookings 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE auth_user_id = auth.uid() 
    AND role IN ('SuperAdmin', 'Admin', 'SalesAgent')
  )
);

CREATE POLICY "Authenticated admins can delete bookings" 
ON public.bookings 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE auth_user_id = auth.uid() 
    AND role IN ('SuperAdmin', 'Admin', 'SalesAgent')
  )
);