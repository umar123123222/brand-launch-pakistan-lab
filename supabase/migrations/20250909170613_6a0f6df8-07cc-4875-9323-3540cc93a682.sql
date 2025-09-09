-- Fix RLS policies for anonymous form submissions
-- Drop conflicting policies on bookings table that check for user roles

DROP POLICY IF EXISTS "Authenticated team can delete bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated team can update bookings" ON public.bookings; 
DROP POLICY IF EXISTS "Authenticated team can view bookings" ON public.bookings;

-- Keep only the public insert policies for anonymous users
-- The existing "Allow anyone to create bookings" and "Enable booking insertions for all users" policies are fine

-- Ensure front_leads table allows public inserts (should already exist)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.front_leads;
CREATE POLICY "Allow public inserts on front_leads" ON public.front_leads
  FOR INSERT WITH CHECK (true);

-- Ensure full_applications table allows public inserts (should already exist)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.full_applications;  
CREATE POLICY "Allow public inserts on full_applications" ON public.full_applications
  FOR INSERT WITH CHECK (true);