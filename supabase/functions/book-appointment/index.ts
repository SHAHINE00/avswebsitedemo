import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Book appointment function called');
    
    const { appointmentData } = await req.json();
    console.log('Appointment data received:', appointmentData);

    // Validate required fields
    if (!appointmentData.firstName || !appointmentData.lastName || !appointmentData.email || 
        !appointmentData.phone || !appointmentData.appointmentDate || !appointmentData.appointmentTime || 
        !appointmentData.appointmentType) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown';

    // Create Supabase client with service role key (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check rate limiting (5 appointments per hour per IP)
    const { data: rateLimitCheck, error: rateLimitError } = await supabase.rpc('check_rate_limit', {
      p_user_identifier: clientIP,
      p_action: 'book_appointment',
      p_max_attempts: 5,
      p_time_window_minutes: 60
    });

    if (rateLimitError || !rateLimitCheck) {
      console.log('Rate limit exceeded for IP:', clientIP);
      return new Response(
        JSON.stringify({ 
          error: 'Too many appointment requests. Please try again later.' 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if user is authenticated
    const authHeader = req.headers.get('authorization');
    let userId = null;
    
    if (authHeader) {
      // Extract user from auth header if present
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && user) {
        userId = user.id;
      }
    }

    // For anonymous bookings, create a special system user ID to avoid RLS issues
    if (!userId) {
      userId = '00000000-0000-0000-0000-000000000000'; // Special system user for public appointments
    }

    // Insert appointment
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        user_id: userId,
        first_name: appointmentData.firstName,
        last_name: appointmentData.lastName,
        email: appointmentData.email,
        phone: appointmentData.phone,
        appointment_date: appointmentData.appointmentDate,
        appointment_time: appointmentData.appointmentTime,
        appointment_type: appointmentData.appointmentType,
        subject: appointmentData.subject || 'Consultation générale',
        message: appointmentData.message || '',
        status: 'pending'
      })
      .select()
      .single();

    // Log security event
    await supabase.functions.invoke('log-security-event', {
      body: {
        action: 'appointment_created',
        severity: 'low',
        details: {
          client_ip: clientIP,
          user_authenticated: authHeader ? true : false,
          appointment_type: appointmentData.appointmentType
        },
        user_id: userId !== '00000000-0000-0000-0000-000000000000' ? userId : null
      }
    });

    console.log('Appointment creation result:', { data, error });

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create appointment' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Appointment created successfully:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        appointment: data 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in book-appointment function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});