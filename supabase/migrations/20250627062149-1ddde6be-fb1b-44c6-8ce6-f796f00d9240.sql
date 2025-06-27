
-- Create table for front leads (Page 1)
CREATE TABLE public.front_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for full applications (Page 2)
CREATE TABLE public.full_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  has_business TEXT NOT NULL,
  category TEXT NOT NULL,
  investment_range TEXT NOT NULL,
  motivation TEXT NOT NULL,
  build_support TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.front_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.full_applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for front_leads
CREATE POLICY "Anyone can insert front leads" 
  ON public.front_leads 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "No one can read front leads" 
  ON public.front_leads 
  FOR SELECT 
  USING (false);

-- Create RLS policies for full_applications
CREATE POLICY "Anyone can insert full applications" 
  ON public.full_applications 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "No one can read full applications" 
  ON public.full_applications 
  FOR SELECT 
  USING (false);
