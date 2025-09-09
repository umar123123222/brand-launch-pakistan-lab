-- COMPLETE OVERWRITE: Simple form submission policies only

-- Step 1: Drop ALL existing RLS policies on form tables
DROP POLICY IF EXISTS "Allow anonymous inserts on front_leads" ON public.front_leads;
DROP POLICY IF EXISTS "Admins can view front_leads" ON public.front_leads;
DROP POLICY IF EXISTS "front_leads_public_insert" ON public.front_leads;

DROP POLICY IF EXISTS "Allow anonymous operations on full_applications" ON public.full_applications;
DROP POLICY IF EXISTS "Admins can view full_applications" ON public.full_applications;
DROP POLICY IF EXISTS "full_applications_public_insert" ON public.full_applications;

DROP POLICY IF EXISTS "Allow anonymous inserts on bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can manage bookings" ON public.bookings;
DROP POLICY IF EXISTS "bookings_public_insert" ON public.bookings;

DROP POLICY IF EXISTS "Allow anonymous inserts on bookings_elevate" ON public.bookings_elevate;
DROP POLICY IF EXISTS "Admins can view bookings_elevate" ON public.bookings_elevate;

DROP POLICY IF EXISTS "consultation_public_insert" ON public.consultations;
DROP POLICY IF EXISTS "consultation_admin_select" ON public.consultations;

-- Step 2: Drop all form-related triggers that cause "User role not found" errors
DROP TRIGGER IF EXISTS create_client_from_front_lead_trigger ON public.front_leads;
DROP TRIGGER IF EXISTS create_client_from_full_application_trigger ON public.full_applications;
DROP TRIGGER IF EXISTS create_client_from_booking_trigger ON public.bookings;
DROP TRIGGER IF EXISTS create_client_from_consultation_trigger ON public.consultations;
DROP TRIGGER IF EXISTS create_client_from_elevate_lead_trigger ON public.leads_elevate;

-- Step 3: Drop problematic admin_users policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;

-- Step 4: Drop complex client policies that reference user_profiles
DROP POLICY IF EXISTS "Admins can access all clients" ON public.clients;
DROP POLICY IF EXISTS "SalesAgents can access assigned clients" ON public.clients;
DROP POLICY IF EXISTS "SuperAdmins can manage all clients" ON public.clients;
DROP POLICY IF EXISTS "WebDevelopers and MediaTeam can access all clients" ON public.clients;
DROP POLICY IF EXISTS "MediaTeam can update drive_link" ON public.clients;
DROP POLICY IF EXISTS "WebDeveloper can update ecommerce and social fields" ON public.clients;

-- Step 5: Create SIMPLE form submission policies

-- FRONT LEADS (Contact forms)
CREATE POLICY "front_leads_anonymous_insert" 
ON public.front_leads 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "front_leads_authenticated_select" 
ON public.front_leads 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- FULL APPLICATIONS (Funnel forms)
CREATE POLICY "full_applications_anonymous_all" 
ON public.full_applications 
FOR ALL 
WITH CHECK (true);

CREATE POLICY "full_applications_authenticated_select" 
ON public.full_applications 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- BOOKINGS
CREATE POLICY "bookings_anonymous_insert" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "bookings_authenticated_all" 
ON public.bookings 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- BOOKINGS ELEVATE
CREATE POLICY "bookings_elevate_anonymous_insert" 
ON public.bookings_elevate 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "bookings_elevate_authenticated_select" 
ON public.bookings_elevate 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- CONSULTATIONS
CREATE POLICY "consultations_anonymous_insert" 
ON public.consultations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "consultations_authenticated_select" 
ON public.consultations 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Step 6: Create SIMPLE client policies (no role checking)
CREATE POLICY "clients_authenticated_all" 
ON public.clients 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Step 7: Fix admin_users table (simple policy)
CREATE POLICY "admin_users_authenticated_select" 
ON public.admin_users 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Step 8: Ensure all form tables have RLS enabled
ALTER TABLE public.front_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.full_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings_elevate ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;