-- Disable RLS temporarily to reset policies
ALTER TABLE public.consultations DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow anonymous consultation submissions" ON public.consultations;
DROP POLICY IF EXISTS "Allow authenticated users to view consultations" ON public.consultations;

-- Re-enable RLS
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Create a simple, permissive INSERT policy for anonymous users
CREATE POLICY "consultations_insert_policy" 
ON public.consultations 
FOR INSERT 
WITH CHECK (true);

-- Create SELECT policy for authenticated admin users
CREATE POLICY "consultations_select_policy" 
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

-- Grant necessary permissions
GRANT INSERT ON public.consultations TO anon;
GRANT INSERT ON public.consultations TO authenticated;
GRANT SELECT ON public.consultations TO authenticated;