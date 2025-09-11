import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const body = await req.json()
    const {
      fullName,
      email,
      whatsappNumber,
      categories,
      businessTimeline,
      investmentReady,
      seenElyscents,
      bookingDatetime
    } = body

    // Validate required fields
    if (!fullName || !email || !whatsappNumber || !categories || !businessTimeline || 
        investmentReady === undefined || seenElyscents === undefined || !bookingDatetime) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields',
          error_code: 'VALIDATION_ERROR'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid email format',
          error_code: 'VALIDATION_ERROR'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate future datetime
    const bookingDate = new Date(bookingDatetime)
    const now = new Date()
    if (bookingDate <= now) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Booking time must be in the future',
          error_code: 'VALIDATION_ERROR'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Creating atomic booking for:', { email, bookingDatetime })

    // Call the atomic booking function
    const { data, error } = await supabaseClient.rpc('create_booking_atomic', {
      p_full_name: fullName,
      p_email: email,
      p_whatsapp_number: whatsappNumber,
      p_categories: categories,
      p_business_timeline: businessTimeline,
      p_investment_ready: investmentReady,
      p_seen_elyscents: seenElyscents,
      p_booking_datetime: bookingDatetime
    })

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Database error occurred',
          error_code: 'DATABASE_ERROR',
          details: error.message
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse the JSON response from the database function
    const result = typeof data === 'string' ? JSON.parse(data) : data

    console.log('Booking result:', result)

    if (!result.success) {
      // Return the specific error from the database function
      return new Response(
        JSON.stringify(result),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Success response
    return new Response(
      JSON.stringify({
        success: true,
        booking_id: result.booking_id,
        message: result.message || 'Booking created successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'An unexpected error occurred',
        error_code: 'INTERNAL_ERROR'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})