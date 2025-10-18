import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ResetRequest {
  userId: string;
  userEmail: string;
}

Deno.serve(async (req) => {
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
    );

    // Verify the caller is an admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { data: roles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roles) {
      throw new Error('Admin access required');
    }

    const { userId, userEmail }: ResetRequest = await req.json();

    if (!userId || !userEmail) {
      throw new Error('User ID and email are required');
    }

    console.log('Generating password reset link for:', userEmail);

    // Generate password reset link using admin API
    const { data: resetData, error: resetError } = await supabaseClient.auth.admin.generateLink({
      type: 'recovery',
      email: userEmail,
    });

    if (resetError) {
      console.error('Reset link generation error:', resetError);
      throw resetError;
    }

    // Log admin activity
    await supabaseClient
      .from('admin_activity_logs')
      .insert({
        admin_id: user.id,
        action: 'password_reset_link_generated',
        entity_type: 'user',
        entity_id: userId,
        details: {
          email: userEmail,
          method: 'admin_panel'
        },
      });

    console.log('Password reset link generated successfully');

    return new Response(
      JSON.stringify({
        success: true,
        resetLink: resetData.properties.action_link,
        message: 'Password reset link generated successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in admin-generate-reset-link function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
