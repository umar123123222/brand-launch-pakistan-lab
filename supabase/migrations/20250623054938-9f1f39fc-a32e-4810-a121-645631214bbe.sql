
-- Let's check what policies currently exist on the consultations table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'consultations';

-- If there are existing policies, let's drop all of them and create a fresh one
DROP POLICY IF EXISTS "Public can insert consultations" ON public.consultations;
DROP POLICY IF EXISTS "Allow public insertions on consultations" ON public.consultations;

-- Create a simple, clear policy for public insertions
CREATE POLICY "consultations_insert_policy" 
    ON public.consultations 
    FOR INSERT 
    WITH CHECK (true);
