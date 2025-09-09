-- Add RLS policies for anonymous form submissions

-- Enable RLS on the tables if not already enabled
ALTER TABLE public.front_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.full_applications ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert into front_leads (contact form)
CREATE POLICY "Allow anonymous inserts on front_leads" 
ON public.front_leads 
FOR INSERT 
WITH CHECK (true);

-- Allow admins and sales agents to view front_leads
CREATE POLICY "Admins can view front_leads" 
ON public.front_leads 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE auth_user_id = auth.uid() 
  AND role IN ('SuperAdmin', 'Admin', 'SalesAgent')
));

-- Allow anonymous users to insert and update full_applications (funnel forms)
CREATE POLICY "Allow anonymous operations on full_applications" 
ON public.full_applications 
FOR ALL 
WITH CHECK (true);

-- Allow admins and sales agents to view full_applications
CREATE POLICY "Admins can view full_applications" 
ON public.full_applications 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE auth_user_id = auth.uid() 
  AND role IN ('SuperAdmin', 'Admin', 'SalesAgent')
));

-- Allow anonymous users to insert into bookings
CREATE POLICY "Allow anonymous inserts on bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

-- Allow admins and sales agents to view and manage bookings
CREATE POLICY "Admins can manage bookings" 
ON public.bookings 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE auth_user_id = auth.uid() 
  AND role IN ('SuperAdmin', 'Admin', 'SalesAgent')
));