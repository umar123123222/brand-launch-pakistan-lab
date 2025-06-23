
-- Fix consultations table RLS policy
DROP POLICY IF EXISTS "consultations_insert_policy" ON public.consultations;
CREATE POLICY "consultations_public_insert" 
    ON public.consultations 
    FOR INSERT 
    TO anon 
    WITH CHECK (true);

-- Also allow authenticated users to insert
CREATE POLICY "consultations_auth_insert" 
    ON public.consultations 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

-- Fix seminar_registrations table RLS policy (if it doesn't exist)
ALTER TABLE public.seminar_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "seminar_public_insert" ON public.seminar_registrations;
CREATE POLICY "seminar_public_insert" 
    ON public.seminar_registrations 
    FOR INSERT 
    TO anon 
    WITH CHECK (true);

-- Also allow authenticated users to insert
CREATE POLICY "seminar_auth_insert" 
    ON public.seminar_registrations 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (true);
