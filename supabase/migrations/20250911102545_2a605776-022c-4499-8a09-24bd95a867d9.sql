-- Phase 1D: Create atomic booking function and trigger
CREATE OR REPLACE FUNCTION public.create_booking_atomic(
  p_full_name TEXT,
  p_email TEXT,
  p_whatsapp_number TEXT,
  p_categories TEXT[],
  p_business_timeline TEXT,
  p_investment_ready BOOLEAN,
  p_seen_elyscents BOOLEAN,
  p_booking_datetime TIMESTAMP WITH TIME ZONE
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  booking_date DATE;
  booking_time TIME;
  capacity_available BOOLEAN;
  new_booking_id UUID;
  result JSON;
  target_datetime_pkt TIMESTAMP;
BEGIN
  -- Convert UTC datetime to Pakistan timezone for date/time extraction
  target_datetime_pkt := p_booking_datetime AT TIME ZONE 'Asia/Karachi';
  booking_date := target_datetime_pkt::date;
  booking_time := target_datetime_pkt::time;
  
  -- Start transaction with advisory lock to prevent race conditions
  PERFORM pg_advisory_xact_lock(
    hashtext(booking_date::text || booking_time::text)
  );
  
  -- Check if capacity is available
  SELECT public.check_booking_capacity(booking_date, booking_time, 2) INTO capacity_available;
  
  IF NOT capacity_available THEN
    result := json_build_object(
      'success', false,
      'error', 'This time slot is fully booked. Please select another time.',
      'error_code', 'CAPACITY_EXCEEDED'
    );
    RETURN result;
  END IF;
  
  -- Check for duplicate booking from same email/phone
  IF EXISTS (
    SELECT 1 FROM public.booking_form_submissions 
    WHERE (email = p_email OR whatsapp_number = p_whatsapp_number)
      AND booking_datetime = p_booking_datetime
      AND status = 'confirmed'
  ) THEN
    result := json_build_object(
      'success', false,
      'error', 'You already have a booking for this time slot.',
      'error_code', 'DUPLICATE_BOOKING'
    );
    RETURN result;
  END IF;
  
  -- Create the booking
  INSERT INTO public.booking_form_submissions (
    full_name,
    email, 
    whatsapp_number,
    categories,
    business_timeline,
    investment_ready,
    seen_elyscents,
    booking_datetime,
    status
  ) VALUES (
    p_full_name,
    p_email,
    p_whatsapp_number, 
    p_categories,
    p_business_timeline,
    p_investment_ready,
    p_seen_elyscents,
    p_booking_datetime,
    'confirmed'
  ) RETURNING id INTO new_booking_id;
  
  result := json_build_object(
    'success', true,
    'booking_id', new_booking_id,
    'message', 'Booking created successfully'
  );
  
  RETURN result;
  
EXCEPTION WHEN OTHERS THEN
  -- Log the error
  INSERT INTO public.error_logs (message, context, created_at, timestamp)
  VALUES (
    'Failed to create atomic booking: ' || SQLERRM,
    jsonb_build_object(
      'email', p_email,
      'booking_datetime', p_booking_datetime,
      'error', SQLERRM
    ),
    now(),
    now()
  );
  
  result := json_build_object(
    'success', false,
    'error', 'An error occurred while creating your booking. Please try again.',
    'error_code', 'BOOKING_ERROR'
  );
  
  RETURN result;
END;
$$;