-- Fix consultations table RLS policies to allow anonymous submissions (final fix)

-- Disable RLS temporarily to clean up
ALTER TABLE public.consultations DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies (if any)
DROP POLICY IF EXISTS "consultations_insert_policy" ON public.consultations;
DROP POLICY IF EXISTS "consultations_select_policy" ON public.consultations;
DROP POLICY IF EXISTS "allow_all_inserts_consultations" ON public.consultations;
DROP POLICY IF EXISTS "allow_admin_select_consultations" ON public.consultations;
DROP POLICY IF EXISTS "public_consultation_inserts" ON public.consultations;
DROP POLICY IF EXISTS "admin_consultation_reads" ON public.consultations;

-- Re-enable RLS
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Create INSERT policy for everyone (anon and authenticated)
CREATE POLICY "consultation_public_insert" 
ON public.consultations 
FOR INSERT 
TO public
WITH CHECK (true);

-- Create SELECT policy for authenticated admin users
CREATE POLICY "consultation_admin_select" 
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