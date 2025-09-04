-- Fix full_applications RLS policies
-- Drop existing policies first
DROP POLICY IF EXISTS "Admin applications access" ON public.full_applications;
DROP POLICY IF EXISTS "Anyone can insert full applications" ON public.full_applications;

-- Recreate the insert policy with proper permissions
CREATE POLICY "Anyone can insert full applications" 
ON public.full_applications 
FOR INSERT 
TO public
WITH CHECK (true);

-- Recreate the select policy for admins
CREATE POLICY "Admin applications access" 
ON public.full_applications 
FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM user_profiles
  WHERE user_profiles.auth_user_id = auth.uid() 
  AND user_profiles.role = ANY(ARRAY['SuperAdmin'::Role, 'Admin'::Role, 'SalesAgent'::Role])
));