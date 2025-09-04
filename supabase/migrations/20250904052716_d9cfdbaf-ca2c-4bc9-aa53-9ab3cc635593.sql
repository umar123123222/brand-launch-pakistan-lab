-- Fix consultations table RLS policies to allow anonymous submissions

-- First, disable RLS to clean up
ALTER TABLE public.consultations DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies completely
DROP POLICY IF EXISTS "consultations_insert_policy" ON public.consultations;
DROP POLICY IF EXISTS "consultations_select_policy" ON public.consultations;

-- Re-enable RLS
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Create a completely permissive INSERT policy for all users (authenticated and anonymous)
CREATE POLICY "allow_all_inserts_consultations" 
ON public.consultations 
FOR INSERT 
TO public
WITH CHECK (true);

-- Create SELECT policy for authenticated admin users only
CREATE POLICY "allow_admin_select_consultations" 
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

-- Ensure anon role has explicit permissions
GRANT INSERT ON public.consultations TO anon;
GRANT INSERT ON public.consultations TO authenticated;
GRANT USAGE ON SEQUENCE consultations_id_seq TO anon;
GRANT USAGE ON SEQUENCE consultations_id_seq TO authenticated;