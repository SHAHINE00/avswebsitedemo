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

    // Create Supabase client with service role key (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert appointment with explicit null user_id for anonymous bookings
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        user_id: null, // Explicitly set to null for anonymous bookings
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