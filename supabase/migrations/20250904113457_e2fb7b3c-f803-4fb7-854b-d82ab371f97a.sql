-- Drop ALL existing policies on bookings table and recreate them properly
DROP POLICY IF EXISTS "Allow anonymous booking insertions" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated admins can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated admins can delete bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated admins can view full booking details" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated team can view bookings" ON public.bookings;

-- Create a simple policy for anonymous users to insert bookings
CREATE POLICY "Allow public booking insertions" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

-- Create policies for authenticated team members
CREATE POLICY "Authenticated team can view bookings" 
ON public.bookings 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE auth_user_id = auth.uid() 
    AND role IN ('SuperAdmin', 'Admin', 'SalesAgent')
  )
);

CREATE POLICY "Authenticated team can update bookings" 
ON public.bookings 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE auth_user_id = auth.uid() 
    AND role IN ('SuperAdmin', 'Admin', 'SalesAgent')
  )
);

CREATE POLICY "Authenticated team can delete bookings" 
ON public.bookings 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE auth_user_id = auth.uid() 
    AND role IN ('SuperAdmin', 'Admin', 'SalesAgent')
  )
);

-- Ensure RLS is enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;