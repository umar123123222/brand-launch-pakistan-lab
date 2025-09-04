-- Test insertion as anonymous user with explicit policy
-- First ensure RLS is enabled
ALTER TABLE public.full_applications ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies and recreate them properly
DROP POLICY IF EXISTS "Admin applications access" ON public.full_applications;
DROP POLICY IF EXISTS "Anyone can insert full applications" ON public.full_applications;
DROP POLICY IF EXISTS "Anyone can update their own application" ON public.full_applications;

-- Create a simple insert policy for all users (anonymous and authenticated)
CREATE POLICY "full_applications_insert_policy"
ON public.full_applications
FOR INSERT
WITH CHECK (true);

-- Create select policy for authenticated admin users
CREATE POLICY "full_applications_select_policy" 
ON public.full_applications 
FOR SELECT 
USING (auth.role() = 'authenticated' AND EXISTS (
  SELECT 1 FROM user_profiles
  WHERE user_profiles.auth_user_id = auth.uid() 
  AND user_profiles.role = ANY(ARRAY['SuperAdmin'::"Role", 'Admin'::"Role", 'SalesAgent'::"Role"])
));

-- Create update policy to allow updates
CREATE POLICY "full_applications_update_policy"
ON public.full_applications
FOR UPDATE  
USING (true)
WITH CHECK (true);