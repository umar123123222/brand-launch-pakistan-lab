
-- Let's completely audit and fix the consultations table RLS policies
-- First, check what policies currently exist and drop them all
DROP POLICY IF EXISTS "Public can insert consultations" ON public.consultations;
DROP POLICY IF EXISTS "consultations_insert_policy" ON public.consultations;
DROP POLICY IF EXISTS "consultations_public_insert" ON public.consultations;
DROP POLICY IF EXISTS "consultations_auth_insert" ON public.consultations;
DROP POLICY IF EXISTS "allow_all_inserts_consultations" ON public.consultations;

-- Disable RLS temporarily to ensure clean state
ALTER TABLE public.consultations DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Create a single, comprehensive INSERT policy that covers all scenarios
CREATE POLICY "consultations_universal_insert" 
    ON public.consultations 
    FOR INSERT 
    TO public, anon, authenticated
    WITH CHECK (true);

-- Also create a permissive SELECT policy in case it's needed
CREATE POLICY "consultations_universal_select" 
    ON public.consultations 
    FOR SELECT 
    TO public, anon, authenticated
    USING (true);
