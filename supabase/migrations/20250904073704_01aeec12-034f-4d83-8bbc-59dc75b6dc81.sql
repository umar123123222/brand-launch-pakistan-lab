-- Fix the create_client_auth trigger function to handle missing lms_password field
CREATE OR REPLACE FUNCTION public.create_client_auth()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Only create auth record if email exists
  -- Removed lms_password reference since it doesn't exist in clients table
  IF NEW.email IS NOT NULL THEN
    -- Create a default auth record without password for now
    -- Password can be set later through admin interface
    INSERT INTO public.client_auth (client_id, email, password_hash, is_active)
    VALUES (NEW.id, NEW.email, '', false)
    ON CONFLICT (client_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$function$;