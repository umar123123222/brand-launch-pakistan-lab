-- Enable RLS on full_applications table if not already enabled
ALTER TABLE public.full_applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert full applications (for public form submissions)
CREATE POLICY "Allow anonymous inserts on full_applications"
ON public.full_applications
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow admins to view full applications
CREATE POLICY "Admin applications access"
ON public.full_applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE auth_user_id = auth.uid() 
    AND role IN ('SuperAdmin', 'Admin', 'SalesAgent')
  )
);