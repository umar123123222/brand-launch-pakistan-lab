-- Fix security issues: Set search_path for new trigger functions

-- Update all the copy functions to have proper search_path
CREATE OR REPLACE FUNCTION public.copy_contact_to_front_leads()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  BEGIN
    INSERT INTO public.front_leads (
      id, name, email, phone_number, product_category, message, created_at
    ) VALUES (
      NEW.id, NEW.name, NEW.email, NEW.phone_number, NEW.product_category, NEW.message, NEW.created_at
    );
  EXCEPTION WHEN OTHERS THEN
    INSERT INTO public.error_logs (message, context, created_at, timestamp)
    VALUES (
      'Failed to copy contact submission to front_leads: ' || SQLERRM,
      jsonb_build_object('source_id', NEW.id, 'source_table', 'contact_form_submissions'),
      now(),
      now()
    );
  END;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.copy_funnel_to_full_applications()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  BEGIN
    INSERT INTO public.full_applications (
      id, name, email, phone, city, category, has_business, investment_range, 
      motivation, build_support, created_at
    ) VALUES (
      NEW.id, NEW.name, NEW.email, NEW.phone, NEW.city, NEW.category, NEW.has_business,
      NEW.investment_range, NEW.motivation, NEW.build_support, NEW.created_at
    );
  EXCEPTION WHEN OTHERS THEN
    INSERT INTO public.error_logs (message, context, created_at, timestamp)
    VALUES (
      'Failed to copy funnel submission to full_applications: ' || SQLERRM,
      jsonb_build_object('source_id', NEW.id, 'source_table', 'funnel_step1_submissions'),
      now(),
      now()
    );
  END;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.copy_booking_to_bookings()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  BEGIN
    INSERT INTO public.bookings (
      id, full_name, email, whatsapp_number, categories, business_timeline,
      investment_ready, seen_elyscents, booking_datetime, status, created_at, updated_at
    ) VALUES (
      NEW.id, NEW.full_name, NEW.email, NEW.whatsapp_number, NEW.categories, NEW.business_timeline,
      NEW.investment_ready, NEW.seen_elyscents, NEW.booking_datetime, NEW.status, NEW.created_at, NEW.updated_at
    );
  EXCEPTION WHEN OTHERS THEN
    INSERT INTO public.error_logs (message, context, created_at, timestamp)
    VALUES (
      'Failed to copy booking submission to bookings: ' || SQLERRM,
      jsonb_build_object('source_id', NEW.id, 'source_table', 'booking_form_submissions'),
      now(),
      now()
    );
  END;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.copy_consultation_to_consultations()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  BEGIN
    INSERT INTO public.consultations (
      id, name, email, phone, category, vision, submitted_at
    ) VALUES (
      NEW.id, NEW.name, NEW.email, NEW.phone, NEW.category, NEW.vision, NEW.submitted_at
    );
  EXCEPTION WHEN OTHERS THEN
    INSERT INTO public.error_logs (message, context, created_at, timestamp)
    VALUES (
      'Failed to copy consultation submission to consultations: ' || SQLERRM,
      jsonb_build_object('source_id', NEW.id, 'source_table', 'consultation_form_submissions'),
      now(),
      now()
    );
  END;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.copy_elevate_booking_to_bookings_elevate()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  BEGIN
    INSERT INTO public.bookings_elevate (
      id, contact_name, brand_name, email, phone, whatsapp, agenda, 
      lead_id, slot_id, created_at, updated_at
    ) VALUES (
      NEW.id, NEW.contact_name, NEW.brand_name, NEW.email, NEW.phone, NEW.whatsapp, NEW.agenda,
      NEW.lead_id, NEW.slot_id, NEW.created_at, NEW.updated_at
    );
  EXCEPTION WHEN OTHERS THEN
    INSERT INTO public.error_logs (message, context, created_at, timestamp)
    VALUES (
      'Failed to copy elevate booking submission to bookings_elevate: ' || SQLERRM,
      jsonb_build_object('source_id', NEW.id, 'source_table', 'elevate_booking_submissions'),
      now(),
      now()
    );
  END;
  
  RETURN NEW;
END;
$$;