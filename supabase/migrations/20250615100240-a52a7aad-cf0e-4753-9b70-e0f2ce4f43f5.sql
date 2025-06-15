
-- Create a table to store consultation form submissions
CREATE TABLE public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  category TEXT,
  vision TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
