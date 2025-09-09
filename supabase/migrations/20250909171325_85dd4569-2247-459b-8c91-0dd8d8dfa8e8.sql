-- Add policy to allow system functions to operate on clients table for anonymous form submissions
-- This allows the trigger functions (create_client_from_front_lead, create_client_from_full_application, create_client_from_booking)
-- to insert/update client records even when called by anonymous users

CREATE POLICY "Allow system functions to manage clients for form submissions" 
ON public.clients 
FOR ALL 
USING (true)
WITH CHECK (true);