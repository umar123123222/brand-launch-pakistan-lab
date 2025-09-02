-- Fix function search path issues and create triggers
-- Update functions with proper search_path setting
CREATE OR REPLACE FUNCTION public.normalize_phone(phone_input TEXT)
RETURNS TEXT 
LANGUAGE plpgsql 
IMMUTABLE 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF phone_input IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Remove all non-digit characters except leading +
  RETURN REGEXP_REPLACE(
    REGEXP_REPLACE(phone_input, '^[+]', '00'), 
    '[^0-9]', '', 'g'
  );
END;
$$;

-- Update find_existing_client function with proper security
CREATE OR REPLACE FUNCTION public.find_existing_client(
  email_input TEXT DEFAULT NULL,
  phone_input TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  client_id UUID;
  normalized_phone TEXT;
BEGIN
  -- First try exact email match (case insensitive)
  IF email_input IS NOT NULL AND email_input != '' THEN
    SELECT id INTO client_id 
    FROM public.clients 
    WHERE LOWER(email) = LOWER(email_input)
    LIMIT 1;
    
    IF client_id IS NOT NULL THEN
      RETURN client_id;
    END IF;
  END IF;
  
  -- Then try normalized phone match
  IF phone_input IS NOT NULL AND phone_input != '' THEN
    normalized_phone := public.normalize_phone(phone_input);
    
    SELECT id INTO client_id 
    FROM public.clients 
    WHERE public.normalize_phone(phone) = normalized_phone
    LIMIT 1;
    
    IF client_id IS NOT NULL THEN
      RETURN client_id;
    END IF;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Update get_or_create_client_by_contact function with proper security
CREATE OR REPLACE FUNCTION public.get_or_create_client_by_contact(
  email_input TEXT DEFAULT NULL,
  phone_input TEXT DEFAULT NULL,
  name_input TEXT DEFAULT NULL,
  city_input TEXT DEFAULT NULL,
  brand_name_input TEXT DEFAULT NULL,
  domain_input TEXT DEFAULT NULL,
  business_email_input TEXT DEFAULT NULL,
  niche_input TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_client_id UUID;
  new_client_id UUID;
BEGIN
  -- Try to find existing client
  existing_client_id := public.find_existing_client(email_input, phone_input);
  
  IF existing_client_id IS NOT NULL THEN
    -- Update existing client with new non-null information
    UPDATE public.clients 
    SET 
      name = COALESCE(NULLIF(name, ''), name_input, name),
      email = COALESCE(NULLIF(email, ''), email_input, email),
      phone = COALESCE(NULLIF(phone, ''), phone_input, phone),
      city = COALESCE(NULLIF(city, ''), city_input, city),
      brand_name = COALESCE(NULLIF(brand_name, ''), brand_name_input, brand_name),
      domain = COALESCE(NULLIF(domain, ''), domain_input, domain),
      business_email = COALESCE(NULLIF(business_email, ''), business_email_input, business_email),
      niche = COALESCE(NULLIF(niche, ''), niche_input, niche),
      updated_at = now()
    WHERE id = existing_client_id;
    
    RETURN existing_client_id;
  ELSE
    -- Create new client
    INSERT INTO public.clients (
      name, email, phone, city, brand_name, domain, business_email, niche
    ) VALUES (
      name_input, email_input, phone_input, city_input, brand_name_input, domain_input, business_email_input, niche_input
    ) RETURNING id INTO new_client_id;
    
    RETURN new_client_id;
  END IF;
END;
$$;

-- Create trigger functions with proper security settings
CREATE OR REPLACE FUNCTION public.create_client_from_consultation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  client_id UUID;
BEGIN
  -- Get or create client
  client_id := public.get_or_create_client_by_contact(
    email_input := NEW.email,
    phone_input := NEW.phone,
    name_input := NEW.name,
    niche_input := NEW.category
  );
  
  -- Create mapping record
  INSERT INTO public.lead_client_mapping (lead_type, lead_id, client_id)
  VALUES ('consultation', NEW.id, client_id);
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_client_from_front_lead()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  client_id UUID;
BEGIN
  -- Get or create client
  client_id := public.get_or_create_client_by_contact(
    email_input := NEW.email,
    name_input := NEW.name
  );
  
  -- Create mapping record
  INSERT INTO public.lead_client_mapping (lead_type, lead_id, client_id)
  VALUES ('front_lead', NEW.id, client_id);
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_client_from_full_application()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  client_id UUID;
BEGIN
  -- Get or create client
  client_id := public.get_or_create_client_by_contact(
    email_input := NEW.email,
    phone_input := NEW.phone,
    city_input := NEW.city,
    niche_input := NEW.category
  );
  
  -- Create mapping record
  INSERT INTO public.lead_client_mapping (lead_type, lead_id, client_id)
  VALUES ('full_application', NEW.id, client_id);
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_client_from_booking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  client_id UUID;
BEGIN
  -- Get or create client
  client_id := public.get_or_create_client_by_contact(
    email_input := NEW.email,
    phone_input := NEW.whatsapp_number,
    name_input := NEW.full_name
  );
  
  -- Create mapping record
  INSERT INTO public.lead_client_mapping (lead_type, lead_id, client_id)
  VALUES ('booking', NEW.id, client_id);
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_client_from_elevate_lead()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  client_id UUID;
  phone_combined TEXT;
BEGIN
  -- Combine phone and whatsapp, prefer phone
  phone_combined := COALESCE(NULLIF(NEW.phone, ''), NEW.whatsapp);
  
  -- Get or create client
  client_id := public.get_or_create_client_by_contact(
    email_input := NEW.email,
    phone_input := phone_combined,
    name_input := NEW.contact_name,
    brand_name_input := NEW.brand_name,
    domain_input := NEW.website,
    niche_input := NEW.vertical
  );
  
  -- Create mapping record
  INSERT INTO public.lead_client_mapping (lead_type, lead_id, client_id)
  VALUES ('elevate_lead', NEW.id, client_id);
  
  RETURN NEW;
END;
$$;

-- Drop existing triggers if they exist and create new ones
DROP TRIGGER IF EXISTS trigger_create_client_from_consultation ON public.consultations;
DROP TRIGGER IF EXISTS trigger_create_client_from_front_lead ON public.front_leads;
DROP TRIGGER IF EXISTS trigger_create_client_from_full_application ON public.full_applications;
DROP TRIGGER IF EXISTS trigger_create_client_from_booking ON public.bookings;
DROP TRIGGER IF EXISTS trigger_create_client_from_elevate_lead ON public.leads_elevate;

CREATE TRIGGER trigger_create_client_from_consultation
  AFTER INSERT ON public.consultations
  FOR EACH ROW
  EXECUTE FUNCTION public.create_client_from_consultation();

CREATE TRIGGER trigger_create_client_from_front_lead
  AFTER INSERT ON public.front_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.create_client_from_front_lead();

CREATE TRIGGER trigger_create_client_from_full_application
  AFTER INSERT ON public.full_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.create_client_from_full_application();

CREATE TRIGGER trigger_create_client_from_booking
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.create_client_from_booking();

CREATE TRIGGER trigger_create_client_from_elevate_lead
  AFTER INSERT ON public.leads_elevate
  FOR EACH ROW
  EXECUTE FUNCTION public.create_client_from_elevate_lead();