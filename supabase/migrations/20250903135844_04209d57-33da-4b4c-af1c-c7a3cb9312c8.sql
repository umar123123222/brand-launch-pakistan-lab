-- Drop existing restrictive policies on consultations table
DROP POLICY IF EXISTS "Admin consultation access" ON public.consultations;
DROP POLICY IF EXISTS "consultations_universal_insert" ON public.consultations;

-- Create new policies that allow anonymous consultation submissions
CREATE POLICY "Allow anonymous consultation submissions" 
ON public.consultations 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view consultations" 
ON public.consultations 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE auth_user_id = auth.uid() 
    AND role IN ('SuperAdmin', 'Admin', 'SalesAgent')
  )
);