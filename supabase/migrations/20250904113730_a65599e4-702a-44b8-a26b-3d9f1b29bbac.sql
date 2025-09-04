-- Drop the current INSERT policy and create a more explicit one
DROP POLICY IF EXISTS "Allow public booking insertions" ON public.bookings;

-- Create a policy that explicitly allows both anonymous and authenticated users
CREATE POLICY "Enable booking insertions for all users" 
ON public.bookings 
FOR INSERT 
TO public, anon, authenticated
WITH CHECK (true);

-- Also ensure that the anon role has the necessary permissions
GRANT INSERT ON public.bookings TO anon;
GRANT INSERT ON public.bookings TO authenticated;