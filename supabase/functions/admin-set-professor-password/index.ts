import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SetPasswordRequest {
  professorId: string;
  professorEmail: string;
  newPassword: string;
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

    const { professorId, professorEmail, newPassword }: SetPasswordRequest = await req.json();

    if (!professorId || !professorEmail || !newPassword) {
      throw new Error('Professor ID, email, and new password are required');
    }

    // Validate password strength
    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    console.log('Setting password for professor:', professorEmail);

    // Get professor's user_id from professors table
    const { data: professor, error: professorError } = await supabaseClient
      .from('professors')
      .select('user_id')
      .eq('id', professorId)
      .single();

    if (professorError || !professor) {
      throw new Error('Professor not found');
    }

    // Set the new password using admin API
    const { data: updateData, error: updateError } = await supabaseClient.auth.admin.updateUserById(
      professor.user_id,
      { password: newPassword }
    );

    if (updateError) {
      console.error('Password update error:', updateError);
      
      // Handle weak/pwned password errors
      if (updateError.code === 'weak_password' || updateError.name === 'AuthWeakPasswordError') {
        return new Response(
          JSON.stringify({
            success: false,
            code: 'weak_password',
            error: 'Ce mot de passe a été trouvé dans des bases de données de mots de passe compromis. Veuillez en choisir un différent ou utiliser le générateur.',
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }
      
      throw updateError;
    }

    // Log admin activity
    await supabaseClient
      .from('admin_activity_logs')
      .insert({
        admin_id: user.id,
        action: 'professor_password_set',
        entity_type: 'professor',
        entity_id: professorId,
        details: {
          email: professorEmail,
          method: 'admin_panel_direct_set'
        },
      });

    console.log('Password set successfully for professor');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Password set successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error in admin-set-professor-password function:', error);

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
