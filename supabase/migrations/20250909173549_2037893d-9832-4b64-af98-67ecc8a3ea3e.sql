-- Create new clean form submission tables with simple RLS policies

-- 1. Contact Form Submissions (replaces front_leads)
CREATE TABLE public.contact_form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT,
  message TEXT,
  product_category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contact_form_anonymous_insert" 
ON public.contact_form_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "contact_form_authenticated_select" 
ON public.contact_form_submissions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 2. Funnel Step 1 Submissions (replaces full_applications)
CREATE TABLE public.funnel_step1_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT,
  has_business TEXT,
  category TEXT,
  investment_range TEXT,
  motivation TEXT,
  build_support TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.funnel_step1_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "funnel_step1_anonymous_insert" 
ON public.funnel_step1_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "funnel_step1_authenticated_select" 
ON public.funnel_step1_submissions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 3. Booking Form Submissions (replaces bookings)
CREATE TABLE public.booking_form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  categories TEXT[] NOT NULL,
  booking_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  seen_elyscents BOOLEAN NOT NULL,
  investment_ready BOOLEAN NOT NULL,
  business_timeline TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.booking_form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "booking_form_anonymous_insert" 
ON public.booking_form_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "booking_form_authenticated_select" 
ON public.booking_form_submissions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 4. Consultation Form Submissions (replaces consultations)
CREATE TABLE public.consultation_form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  category TEXT,
  vision TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.consultation_form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "consultation_form_anonymous_insert" 
ON public.consultation_form_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "consultation_form_authenticated_select" 
ON public.consultation_form_submissions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 5. Elevate Booking Submissions (replaces bookings_elevate)
CREATE TABLE public.elevate_booking_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  agenda TEXT,
  slot_id UUID,
  lead_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.elevate_booking_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "elevate_booking_anonymous_insert" 
ON public.elevate_booking_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "elevate_booking_authenticated_select" 
ON public.elevate_booking_submissions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);