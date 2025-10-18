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

    // Basic input validation
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email address');
    }
    if (!full_name || full_name.trim().length < 2) {
      throw new Error('Full name is required');
    }

    console.log('Creating professor:', { email, full_name });

    // Generate a random password for the professor (fallback)
    const randomPassword = crypto.randomUUID();

    // Create the auth user (or reuse existing if email already registered)
    let authUserId: string | null = null;
    let userCreated = false;

    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
      email,
      password: randomPassword,
      email_confirm: true,
      user_metadata: {
        full_name,
      },
    });

    if (authError) {
      // Handle already-registered email without failing the whole operation
      // @ts-ignore access supabase error fields
      const code = (authError as any).code || (authError as any).error || '';
      // @ts-ignore status field on error
      const status = (authError as any).status;
      if (status === 422 || code === 'email_exists') {
        console.warn('Auth user already exists for email, reusing existing account');
        // Try to resolve the existing user id from profiles table
        const { data: existingProfile, error: profileErr } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('email', email)
          .maybeSingle();

        if (profileErr) {
          console.error('Error fetching existing profile by email:', profileErr);
          throw authError; // bubble up original
        }

        if (!existingProfile) {
          // Without a profile we can't assign roles or link professor
          throw new Error('Email already registered but no profile found. Ask the user to log in once, then try again.');
        }

        authUserId = existingProfile.id;
      } else {
        console.error('Error creating auth user:', authError);
        throw authError;
      }
    } else {
      authUserId = authData.user.id;
      userCreated = true;
      console.log('Auth user created:', authUserId);
    }

    // Generate password reset link for the professor
    let resetLink = null;
    try {
      const { data: resetData, error: resetError } = await supabaseClient.auth.admin.generateLink({
        type: 'recovery',
        email: email,
      });
      
      if (resetError) {
        console.error('Password reset link generation error:', resetError);
      } else {
        resetLink = resetData.properties.action_link;
        console.log('Password reset link generated successfully');
      }
    } catch (e) {
      console.error('Failed to generate password reset link:', e);
    }


    // Create the professor record
    const { data: professorData, error: professorError } = await supabaseClient
      .from('professors')
      .insert({
        user_id: authUserId!,
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
      if (userCreated && authUserId) {
        await supabaseClient.auth.admin.deleteUser(authUserId);
      }
      throw professorError;
    }

    console.log('Professor record created:', professorData.id);

    // Assign professor role
    const { error: roleError } = await supabaseClient
      .from('user_roles')
      .upsert(
        { user_id: authUserId!, role: 'professor', assigned_by: user.id },
        { onConflict: 'user_id,role', ignoreDuplicates: true }
      );

    if (roleError) {
      console.error('Error assigning professor role:', roleError);
      // Cleanup on partial failure
      try { await supabaseClient.from('professors').delete().eq('id', professorData.id); } catch (_) {}
      try { if (userCreated && authUserId) { await supabaseClient.auth.admin.deleteUser(authUserId); } } catch (_) {}
      throw roleError;
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
          auth_user_id: authUserId,
        },
      });

    console.log('Professor created successfully');

    return new Response(
      JSON.stringify({
        success: true,
        professor: professorData,
        resetLink: resetLink,
        message: resetLink 
          ? 'Professor created successfully. Use the reset link to set their password.'
          : 'Professor created successfully, but password reset link generation failed. Use manual reset.',
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
