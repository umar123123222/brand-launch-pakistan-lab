-- Fix RLS policies for anonymous users completely
-- Drop all existing policies 
DROP POLICY IF EXISTS "full_applications_insert_policy" ON public.full_applications;
DROP POLICY IF EXISTS "full_applications_select_policy" ON public.full_applications;
DROP POLICY IF EXISTS "full_applications_update_policy" ON public.full_applications;

-- Create insert policy that allows ALL users (anonymous + authenticated)
CREATE POLICY "allow_all_inserts"
ON public.full_applications
FOR INSERT
TO public, anon, authenticated
WITH CHECK (true);

-- Create update policy that allows ALL users  
CREATE POLICY "allow_all_updates"
ON public.full_applications
FOR UPDATE
TO public, anon, authenticated
USING (true)
WITH CHECK (true);

-- Create select policy for authenticated admin users only
CREATE POLICY "admin_select_only"
ON public.full_applications 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.auth_user_id = auth.uid() 
    AND user_profiles.role = ANY(ARRAY['SuperAdmin'::"Role", 'Admin'::"Role", 'SalesAgent'::"Role"])
  )
);