-- Check if there are any conflicting RLS policies on bookings table
-- and fix the anonymous booking insertion policy

-- Drop existing policies
DROP POLICY IF EXISTS "Allow anonymous booking insertions" ON public.bookings;

-- Create a proper policy for anonymous booking insertions
CREATE POLICY "Allow anonymous booking insertions" 
ON public.bookings 
FOR INSERT 
TO anon, public
WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;