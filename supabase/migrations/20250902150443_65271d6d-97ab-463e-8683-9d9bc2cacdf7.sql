-- Create lead_client_mapping table to track relationships
CREATE TABLE IF NOT EXISTS public.lead_client_mapping (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_type TEXT NOT NULL,
  lead_id UUID NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on lead_client_mapping
ALTER TABLE public.lead_client_mapping ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for lead_client_mapping
DROP POLICY IF EXISTS "Authenticated users can manage lead client mapping" ON public.lead_client_mapping;
CREATE POLICY "Authenticated users can manage lead client mapping" 
ON public.lead_client_mapping 
FOR ALL 
USING (true);

-- Add indexes for efficient lookups (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_clients_phone_new ON public.clients(phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_lead_client_mapping_lead ON public.lead_client_mapping(lead_type, lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_client_mapping_client ON public.lead_client_mapping(client_id);

-- Function to normalize phone numbers
CREATE OR REPLACE FUNCTION public.normalize_phone(phone_input TEXT)
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to find existing client by email or phone
CREATE OR REPLACE FUNCTION public.find_existing_client(
  email_input TEXT DEFAULT NULL,
  phone_input TEXT DEFAULT NULL
)
RETURNS UUID AS $$
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
$$ LANGUAGE plpgsql;

-- Function to get or create client by contact info
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
RETURNS UUID AS $$
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
$$ LANGUAGE plpgsql;