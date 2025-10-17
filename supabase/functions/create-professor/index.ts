import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateProfessorRequest {
  email: string;
  full_name: string;
  phone?: string;
  specialization?: string;
  bio?: string;
}

Deno.serve(async (req) => {
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

    // Check if user is admin
    const { data: roles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roles) {
      throw new Error('Admin access required');
    }

    const requestData: CreateProfessorRequest = await req.json();
    const { email, full_name, phone, specialization, bio } = requestData;

    console.log('Creating professor:', { email, full_name });

    // Generate a random password for the professor
    const randomPassword = crypto.randomUUID();

    // Create the auth user
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
      email,
      password: randomPassword,
      email_confirm: true,
      user_metadata: {
        full_name,
      },
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      throw authError;
    }

    console.log('Auth user created:', authData.user.id);

    // Create the professor record
    const { data: professorData, error: professorError } = await supabaseClient
      .from('professors')
      .insert({
        user_id: authData.user.id,
        full_name,
        email,
        phone,
        specialization,
        bio,
        status: 'active',
      })
      .select()
      .single();

    if (professorError) {
      console.error('Error creating professor record:', professorError);
      // Try to clean up the auth user
      await supabaseClient.auth.admin.deleteUser(authData.user.id);
      throw professorError;
    }

    console.log('Professor record created:', professorData.id);

    // Assign professor role
    const { error: roleError } = await supabaseClient
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        role: 'professor',
        assigned_by: user.id,
      });

    if (roleError) {
      console.error('Error assigning professor role:', roleError);
    }

    // Log admin activity
    await supabaseClient
      .from('admin_activity_logs')
      .insert({
        admin_id: user.id,
        action: 'professor_created',
        entity_type: 'professor',
        entity_id: professorData.id,
        details: {
          email,
          full_name,
          auth_user_id: authData.user.id,
        },
      });

    console.log('Professor created successfully');

    return new Response(
      JSON.stringify({
        success: true,
        professor: professorData,
        message: 'Professor created successfully. They will receive an email to set their password.',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in create-professor function:', error);
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
