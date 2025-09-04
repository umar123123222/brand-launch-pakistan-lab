-- Fix the create_client_from_full_application trigger function to include name parameter
CREATE OR REPLACE FUNCTION public.create_client_from_full_application()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  client_id UUID;
BEGIN
  -- Get or create client with name parameter included
  client_id := public.get_or_create_client_by_contact(
    email_input := NEW.email,
    phone_input := NEW.phone,
    name_input := NEW.name,
    city_input := NEW.city,
    niche_input := NEW.category
  );
  
  -- Create mapping record
  INSERT INTO public.lead_client_mapping (lead_type, lead_id, client_id)
  VALUES ('full_application', NEW.id, client_id);
  
  RETURN NEW;
END;
$function$;