// Admin Create Student Edge Function - v2.0 (Enhanced Logging)
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log('🚀 Admin Create Student function loaded successfully');

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
  parent_name?: string;
  parent_phone?: string;
  parent_email?: string;
  parent_relationship?: string;
}

serve(async (req) => {
  console.log(`📨 Received ${req.method} request to admin-create-student`);
  
  if (req.method === 'OPTIONS') {
    console.log('✅ Handling CORS preflight');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔐 Starting authentication check...');
    
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
    console.log('👤 User fetched:', user ? `ID: ${user.id}, Email: ${user.email}` : 'NO USER');
    
    if (!user) {
      console.error('❌ Authentication failed: No user found');
      throw new Error('Not authenticated');
    }

    console.log('🔍 Checking admin role for user:', user.id);
    const { data: isAdminData, error: adminError } = await supabaseClient
      .rpc('is_admin', { _user_id: user.id });

    console.log('👮 Admin check result:', { isAdminData, adminError });
    
    if (adminError || !isAdminData) {
      console.error('❌ Admin check failed:', adminError);
      throw new Error('Access denied. Admin role required.');
    }

    console.log('📥 Parsing request body...');
    const studentData: CreateStudentRequest = await req.json();
    console.log('📋 Student data received:', {
      email: studentData.email,
      full_name: studentData.full_name,
      hasPassword: !!studentData.password
    });

    // Validate required fields
    if (!studentData.email || !studentData.password || !studentData.full_name) {
      console.error('❌ Validation failed: Missing required fields');
      throw new Error('Email, password, and full name are required');
    }

    // Normalize email to avoid case/space issues
    studentData.email = studentData.email.trim().toLowerCase();
    console.log('✅ Email normalized to:', studentData.email);

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

    // Create auth user (or link to existing one if email already registered)
    let newUserId = '';
    let createdNewUser = false;

    console.log('👥 Attempting to create auth user for:', studentData.email);
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: studentData.email,
      password: studentData.password,
      email_confirm: true,
      user_metadata: {
        full_name: studentData.full_name
      }
    });

    if (authError) {
      console.error('⚠️ Auth creation error:', authError.message);
      const msg = (authError as any)?.message?.toLowerCase?.() || '';
      const alreadyExists = msg.includes('already been registered') || msg.includes('already registered');

      if (alreadyExists) {
        console.log('🔄 Email already registered, attempting to find existing user...');
        // Try to find existing user by email and link profile/role
        let page = 1;
        const perPage = 1000;
        let foundUser: any = null;

        while (!foundUser) {
          console.log(`🔍 Searching users page ${page}...`);
          const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
          if (listError) {
            console.error('❌ Error listing users:', listError);
            break;
          }
          const users = (listData as any)?.users || [];
          foundUser = users.find((u: any) => (u.email || '').toLowerCase() === studentData.email);
          if (foundUser || users.length < perPage) break;
          page += 1;
          if (page > 10) break; // safety stop
        }

        if (!foundUser) {
          console.error('❌ Could not find existing user with email:', studentData.email);
          throw new Error(`Failed to create user: ${authError.message}`);
        }

        console.log('✅ Found existing user:', foundUser.id);
        newUserId = foundUser.id;

        // Ensure metadata has full_name
        try {
          const metaName = (foundUser.user_metadata?.full_name || '').trim();
          if (!metaName && studentData.full_name) {
            await supabaseAdmin.auth.admin.updateUserById(newUserId, {
              user_metadata: { full_name: studentData.full_name }
            });
          }
        } catch (e) {
          console.error('Metadata update warning:', e);
        }
      } else {
        throw new Error(`Failed to create user: ${ (authError as any)?.message || 'unknown error' }`);
      }
    } else {
      console.log('✅ New auth user created successfully:', authData.user.id);
      newUserId = authData!.user.id;
      createdNewUser = true;
    }

    // Create or update profile
    console.log('📝 Creating/updating profile for user:', newUserId);
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
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
        formation_type: studentData.formation_type,
        formation_domaine: studentData.formation_domaine,
        formation_programme: studentData.formation_programme,
        formation_tag: studentData.formation_tag,
        status: 'approved'
      }, { onConflict: 'id' });

    if (profileError) {
      console.error('❌ Profile creation error:', profileError.message);
      // Try to clean up the auth user if profile creation fails and we just created it
      if (createdNewUser) {
        console.log('🧹 Cleaning up newly created auth user...');
        await supabaseAdmin.auth.admin.deleteUser(newUserId);
      }
      throw new Error(`Failed to create profile: ${profileError.message}`);
    }
    console.log('✅ Profile created/updated successfully');

    // Insert parent information if provided
    if (studentData.parent_name || studentData.parent_email || studentData.parent_phone) {
      console.log('👨‍👩‍👧 Saving parent information...');
      const { error: parentError } = await supabaseAdmin
        .from('student_parents')
        .insert({
          student_id: newUserId,
          parent_name: studentData.parent_name,
          parent_phone: studentData.parent_phone,
          parent_email: studentData.parent_email,
          parent_relationship: studentData.parent_relationship || 'Autre'
        });
      
      if (parentError) {
        console.error('⚠️ Parent information error:', parentError.message);
        // Continue even if parent info fails - not critical
      } else {
        console.log('✅ Parent information saved successfully');
      }
    }

    // Assign student role
    console.log('🎓 Assigning student role...');
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: newUserId,
        role: 'student'
      });

    if (roleError) {
      console.error('⚠️ Role assignment error:', roleError.message);
      console.log('⚠️ Continuing despite role error - can be fixed manually');
      // Continue even if role assignment fails - can be fixed manually
    } else {
      console.log('✅ Student role assigned successfully');
    }

    // Log admin activity
    console.log('📊 Logging admin activity...');
    await supabaseClient.rpc('log_admin_activity', {
      p_action: createdNewUser ? 'student_created_manually' : 'student_linked_existing_auth',
      p_entity_type: 'user',
      p_entity_id: newUserId,
      p_details: {
        email: studentData.email,
        full_name: studentData.full_name,
        formation_type: studentData.formation_type,
        formation_tag: studentData.formation_tag
      }
    });

    console.log(`✅✅✅ Student created successfully: ${studentData.email} (ID: ${newUserId})`);

    return new Response(
      JSON.stringify({
        success: true,
        user_id: newUserId,
        email: studentData.email,
        full_name: studentData.full_name,
        created_new: createdNewUser
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('❌❌❌ ERROR in admin-create-student:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
        details: {
          type: error.name,
          timestamp: new Date().toISOString()
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
