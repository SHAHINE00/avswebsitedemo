import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SetupAuthRequest {
  professorId: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role (admin privileges)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Verify admin authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify admin role
    const { data: adminCheck } = await supabaseClient.rpc('is_admin', { _user_id: user.id });
    if (!adminCheck) {
      console.error('User is not admin:', user.id);
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { professorId }: SetupAuthRequest = await req.json();
    console.log('Setting up auth for professor:', professorId);

    // Get professor details
    const { data: professor, error: professorError } = await supabaseClient
      .from('professors')
      .select('user_id, email, full_name')
      .eq('id', professorId)
      .single();

    if (professorError || !professor) {
      console.error('Professor not found:', professorError);
      return new Response(
        JSON.stringify({ error: 'Professor not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Professor details:', professor);

    // Check if auth user already exists
    const { data: existingUser } = await supabaseClient.auth.admin.listUsers();
    const userExists = existingUser?.users?.some(u => u.email === professor.email);

    if (userExists) {
      console.log('Auth user already exists, generating password reset link');
      
      // User exists, just generate reset link
      const { data: resetData, error: resetError } = await supabaseClient.auth.admin.generateLink({
        type: 'recovery',
        email: professor.email,
      });

      if (resetError) {
        console.error('Error generating reset link:', resetError);
        throw resetError;
      }

      // Log admin activity
      await supabaseClient.from('admin_activity_logs').insert({
        admin_id: user.id,
        action: 'password_reset_generated',
        entity_type: 'professor',
        entity_id: professorId,
        details: { email: professor.email }
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          resetLink: resetData.properties.action_link,
          message: 'Password reset link generated'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create new auth user with a random password
    const temporaryPassword = crypto.randomUUID();
    
    console.log('Creating new auth user for:', professor.email);
    
    const { data: newUser, error: createError } = await supabaseClient.auth.admin.createUser({
      email: professor.email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        full_name: professor.full_name
      }
    });

    if (createError) {
      console.error('Error creating auth user:', createError);
      throw createError;
    }

    console.log('Auth user created:', newUser.user.id);

    // Update professor record with correct user_id if needed
    if (professor.user_id !== newUser.user.id) {
      const { error: updateError } = await supabaseClient
        .from('professors')
        .update({ user_id: newUser.user.id })
        .eq('id', professorId);

      if (updateError) {
        console.error('Error updating professor user_id:', updateError);
      }
    }

    // Generate password reset link
    const { data: resetData, error: resetError } = await supabaseClient.auth.admin.generateLink({
      type: 'recovery',
      email: professor.email,
    });

    if (resetError) {
      console.error('Error generating reset link:', resetError);
      throw resetError;
    }

    // Log admin activity
    await supabaseClient.from('admin_activity_logs').insert({
      admin_id: user.id,
      action: 'professor_auth_created',
      entity_type: 'professor',
      entity_id: professorId,
      details: { 
        email: professor.email,
        auth_user_id: newUser.user.id
      }
    });

    console.log('Successfully set up authentication for professor');

    return new Response(
      JSON.stringify({ 
        success: true, 
        resetLink: resetData.properties.action_link,
        message: 'Authentication account created and password reset link generated'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in setup-professor-auth:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
