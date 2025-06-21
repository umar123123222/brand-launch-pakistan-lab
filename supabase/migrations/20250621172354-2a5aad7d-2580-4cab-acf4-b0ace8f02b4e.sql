
-- Create a table to store seminar registration form submissions
CREATE TABLE public.seminar_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  age INTEGER NOT NULL,
  current_work TEXT NOT NULL,
  work_details TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on the seminar_registrations table
ALTER TABLE public.seminar_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including unauthenticated users) to insert seminar registrations
CREATE POLICY "Public can insert seminar registrations"
    ON public.seminar_registrations
    FOR INSERT
    WITH CHECK (true);
