import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateStudentRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  date_of_birth?: string;
  academic_level?: string;
  previous_education?: string;
  career_goals?: string;
  formation_type?: string;
  formation_domaine?: string;
  formation_programme?: string;
  formation_tag?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with user's JWT
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Check if user is admin
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const { data: isAdminData, error: adminError } = await supabaseClient
      .rpc('is_admin', { _user_id: user.id });

    if (adminError || !isAdminData) {
      throw new Error('Access denied. Admin role required.');
    }

    const studentData: CreateStudentRequest = await req.json();

    // Validate required fields
    if (!studentData.email || !studentData.password || !studentData.full_name) {
      throw new Error('Email, password, and full name are required');
    }

    // Create Supabase admin client for auth operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: studentData.email,
      password: studentData.password,
      email_confirm: true,
      user_metadata: {
        full_name: studentData.full_name
      }
    });

    if (authError) {
      console.error('Auth creation error:', authError);
      throw new Error(`Failed to create user: ${authError.message}`);
    }

    const newUserId = authData.user.id;

    // Create profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: newUserId,
        email: studentData.email,
        full_name: studentData.full_name,
        phone: studentData.phone,
        address: studentData.address,
        city: studentData.city,
        postal_code: studentData.postal_code,
        country: studentData.country || 'Morocco',
        date_of_birth: studentData.date_of_birth,
        academic_level: studentData.academic_level,
        previous_education: studentData.previous_education,
        career_goals: studentData.career_goals,
        status: 'approved'
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Try to clean up the auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(newUserId);
      throw new Error(`Failed to create profile: ${profileError.message}`);
    }

    // Assign student role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: newUserId,
        role: 'student'
      });

    if (roleError) {
      console.error('Role assignment error:', roleError);
      // Continue even if role assignment fails - can be fixed manually
    }

    // Log admin activity
    await supabaseClient.rpc('log_admin_activity', {
      p_action: 'student_created_manually',
      p_entity_type: 'user',
      p_entity_id: newUserId,
      p_details: {
        email: studentData.email,
        full_name: studentData.full_name,
        formation_type: studentData.formation_type,
        formation_tag: studentData.formation_tag
      }
    });

    console.log(`Student created successfully: ${studentData.email}`);

    return new Response(
      JSON.stringify({
        success: true,
        user_id: newUserId,
        email: studentData.email,
        full_name: studentData.full_name
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('Error in admin-create-student:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
