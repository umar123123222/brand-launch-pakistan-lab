-- Create tables for Hire Us marketing services page

-- Leads table for calculator and pre-qualification data
CREATE TABLE public.leads_elevate (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_name TEXT,
  website TEXT,
  contact_name TEXT,
  email TEXT,
  whatsapp TEXT,
  phone TEXT,
  currency TEXT NOT NULL DEFAULT 'PKR',
  aov NUMERIC,
  gross_margin_pct NUMERIC,
  monthly_ad_budget NUMERIC,
  current_orders_per_month INTEGER,
  per_sale_fee NUMERIC,
  gp_per_order NUMERIC,
  cps_breakeven NUMERIC,
  roas_breakeven NUMERIC,
  target_net_margin_pct NUMERIC,
  cps_target NUMERIC,
  vertical TEXT,
  geo TEXT,
  notes TEXT,
  source TEXT NOT NULL, -- 'calculator' or 'prequal'
  status TEXT NOT NULL DEFAULT 'new', -- 'new', 'qualified', 'rejected', 'booked'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Availability slots for scheduling
CREATE TABLE public.availability_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_booked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bookings table for scheduled appointments
CREATE TABLE public.bookings_elevate (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads_elevate(id),
  slot_id UUID REFERENCES public.availability_slots(id),
  brand_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  agenda TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- MSA contracts table
CREATE TABLE public.msas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads_elevate(id),
  json_payload JSONB NOT NULL,
  html_snapshot TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Admin users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.leads_elevate ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings_elevate ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.msas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads_elevate - allow anonymous inserts and admin read
CREATE POLICY "Allow anonymous inserts on leads_elevate" 
ON public.leads_elevate 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow anonymous updates on leads_elevate" 
ON public.leads_elevate 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can view leads_elevate" 
ON public.leads_elevate 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- RLS Policies for availability_slots - allow read for slot checking, admin manage
CREATE POLICY "Allow read on availability_slots" 
ON public.availability_slots 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage availability_slots" 
ON public.availability_slots 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- RLS Policies for bookings_elevate - allow anonymous inserts, admin read
CREATE POLICY "Allow anonymous inserts on bookings_elevate" 
ON public.bookings_elevate 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view bookings_elevate" 
ON public.bookings_elevate 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- RLS Policies for msas - allow anonymous inserts, admin read
CREATE POLICY "Allow anonymous inserts on msas" 
ON public.msas 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view msas" 
ON public.msas 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- RLS Policies for admin_users - only admins can read
CREATE POLICY "Admins can view admin_users" 
ON public.admin_users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- Create triggers for updated_at
CREATE TRIGGER update_leads_elevate_updated_at
  BEFORE UPDATE ON public.leads_elevate
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_availability_slots_updated_at
  BEFORE UPDATE ON public.availability_slots
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_elevate_updated_at
  BEFORE UPDATE ON public.bookings_elevate
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_msas_updated_at
  BEFORE UPDATE ON public.msas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample availability slots (next 2 weeks, weekdays 9 AM to 5 PM)
INSERT INTO public.availability_slots (start_time, end_time)
SELECT 
  day_date + (hour_val || ' hours')::interval as start_time,
  day_date + (hour_val || ' hours')::interval + INTERVAL '1 hour' as end_time
FROM generate_series(
  date_trunc('day', now() + INTERVAL '1 day'),
  date_trunc('day', now() + INTERVAL '14 days'),
  INTERVAL '1 day'
) AS day_date
CROSS JOIN generate_series(9, 16) AS hour_val
WHERE EXTRACT(dow FROM day_date) BETWEEN 1 AND 5 -- Monday to Friday
AND (day_date + (hour_val || ' hours')::interval) > now();

-- Insert admin user (replace with actual admin email)
INSERT INTO public.admin_users (email) VALUES ('admin@elevate51.com');