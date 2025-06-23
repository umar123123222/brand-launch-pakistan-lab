
-- First, let's completely reset the RLS policies for consultations
DROP POLICY IF EXISTS "Public can insert consultations" ON public.consultations;
DROP POLICY IF EXISTS "consultations_insert_policy" ON public.consultations;
DROP POLICY IF EXISTS "consultations_public_insert" ON public.consultations;
DROP POLICY IF EXISTS "consultations_auth_insert" ON public.consultations;

-- Create a single comprehensive policy for consultations
CREATE POLICY "allow_all_inserts_consultations" 
    ON public.consultations 
    FOR INSERT 
    WITH CHECK (true);

-- Reset seminar_registrations policies
DROP POLICY IF EXISTS "Public can insert seminar registrations" ON public.seminar_registrations;
DROP POLICY IF EXISTS "seminar_public_insert" ON public.seminar_registrations;
DROP POLICY IF EXISTS "seminar_auth_insert" ON public.seminar_registrations;

-- Create a single comprehensive policy for seminar_registrations
CREATE POLICY "allow_all_inserts_seminar" 
    ON public.seminar_registrations 
    FOR INSERT 
    WITH CHECK (true);

-- Ensure both tables have RLS enabled
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seminar_registrations ENABLE ROW LEVEL SECURITY;
