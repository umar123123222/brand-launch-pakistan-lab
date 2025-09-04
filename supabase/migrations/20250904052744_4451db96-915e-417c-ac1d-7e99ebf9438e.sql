-- Fix consultations table RLS policies to allow anonymous submissions (corrected)

-- Disable RLS to clean up
ALTER TABLE public.consultations DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "consultations_insert_policy" ON public.consultations;
DROP POLICY IF EXISTS "consultations_select_policy" ON public.consultations;
DROP POLICY IF EXISTS "allow_all_inserts_consultations" ON public.consultations;
DROP POLICY IF EXISTS "allow_admin_select_consultations" ON public.consultations;

-- Re-enable RLS
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Create a completely open INSERT policy for everyone (anon and authenticated)
CREATE POLICY "public_consultation_inserts" 
ON public.consultations 
FOR INSERT 
TO public
WITH CHECK (true);

-- Create SELECT policy for authenticated admin users only
CREATE POLICY "admin_consultation_reads" 
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

-- Grant table permissions to anon and authenticated roles
GRANT INSERT ON public.consultations TO anon;
GRANT INSERT ON public.consultations TO authenticated;