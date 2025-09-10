import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConvertRequest {
  subscriberId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { subscriberId }: ConvertRequest = await req.json();

    console.log('Converting subscriber to pending user:', subscriberId);

    // Get subscriber data
    const { data: subscriber, error: subscriberError } = await supabase
      .from('subscribers')
      .select('*')
      .eq('id', subscriberId)
      .single();

    if (subscriberError || !subscriber) {
      console.error('Subscriber not found:', subscriberError);
      return new Response(
        JSON.stringify({ error: { code: 'SUBSCRIBER_NOT_FOUND', message: 'Abonné introuvable' } }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Check if user already exists in pending_users with this email
    const { data: existingPending } = await supabase
      .from('pending_users')
      .select('id')
      .eq('email', subscriber.email)
      .single();

    if (existingPending) {
      return new Response(
        JSON.stringify({ error: { code: 'PENDING_EXISTS', message: 'Un compte en attente existe déjà pour cet email' } }),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Generate a secure random password
    const generatePassword = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      let password = '';
      for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    };

    const temporaryPassword = generatePassword();

    // Create pending user from subscriber data
    const { data: pendingUser, error: pendingError } = await supabase
      .from('pending_users')
      .insert({
        email: subscriber.email,
        full_name: subscriber.full_name,
        phone: subscriber.phone,
        formation_type: subscriber.formation_type,
        formation_domaine: subscriber.formation_domaine,
        formation_programme: subscriber.formation_programme,
        formation_programme_title: subscriber.formation_programme_title,
        formation_tag: subscriber.formation_tag,
        encrypted_password: temporaryPassword, // Will be properly hashed when user is approved
        status: 'pending',
        metadata: {
          converted_from_subscriber: true,
          original_subscriber_id: subscriber.id,
          conversion_date: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (pendingError) {
      console.error('Error creating pending user:', pendingError);
      return new Response(
        JSON.stringify({ error: { code: 'INSERT_FAILED', message: 'Erreur lors de la création du compte en attente' } }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log('Successfully converted subscriber to pending user:', pendingUser.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        pendingUserId: pendingUser.id,
        message: 'Abonné converti en compte en attente avec succès'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in convert-subscriber-to-user function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);