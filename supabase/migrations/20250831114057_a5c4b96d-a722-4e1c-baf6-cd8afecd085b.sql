-- Create supplier_leads table for perfume supply page
CREATE TABLE public.supplier_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  selected_oil TEXT,
  concentration TEXT,
  selected_bottle TEXT,
  selected_packaging TEXT,
  moq INTEGER NOT NULL,
  estimated_per_unit_cost NUMERIC,
  estimated_total_cost NUMERIC,
  status TEXT NOT NULL DEFAULT 'New',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.supplier_leads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public inserts on supplier_leads" 
ON public.supplier_leads 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view supplier_leads" 
ON public.supplier_leads 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE auth_user_id = auth.uid() 
  AND role IN ('SuperAdmin', 'Admin', 'SalesAgent')
));

-- Add trigger for updated_at
CREATE TRIGGER update_supplier_leads_updated_at
BEFORE UPDATE ON public.supplier_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();