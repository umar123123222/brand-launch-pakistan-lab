
-- Enable RLS on the consultations table
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including unauthenticated users) to insert consultations
CREATE POLICY "Public can insert consultations"
    ON public.consultations
    FOR INSERT
    WITH CHECK (true);
