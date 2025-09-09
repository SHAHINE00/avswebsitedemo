import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ApprovalRequest {
  pending_user_id: string;
  action: 'approve' | 'reject';
  rejection_reason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    const adminEmail = Deno.env.get('NEWSLETTER_ADMIN_EMAIL') || 'admin@avsinstitute.com';

    // Get admin user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid authentication token');
    }

    const requestData: ApprovalRequest = await req.json();
    console.log(`Processing ${requestData.action} for pending user:`, requestData.pending_user_id);

    if (requestData.action === 'approve') {
      // Call the approval function
      const { data: approvalResult, error: approvalError } = await supabase
        .rpc('approve_pending_user', {
          p_pending_user_id: requestData.pending_user_id,
          p_admin_id: user.id
        });

      if (approvalError) {
        console.error('Error approving user:', approvalError);
        throw approvalError;
      }

      const userData = approvalResult;
      console.log('User approved, creating Supabase auth user...');

      // Create the actual Supabase auth user
      const { data: newUser, error: createUserError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: atob(userData.encrypted_password), // Decode the password
        email_confirm: true,
        user_metadata: {
          full_name: userData.full_name,
          formation_tag: userData.formation_tag
        }
      });

      if (createUserError) {
        console.error('Error creating Supabase user:', createUserError);
        throw createUserError;
      }

      console.log('Supabase auth user created:', newUser.user?.id);

      // Send welcome email to approved user
      const welcomeEmailResponse = await resend.emails.send({
        from: `AVS Institute <${adminEmail}>`,
        to: [userData.email],
        subject: "🎉 Votre compte a été approuvé !",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #16a34a;">Félicitations ! Votre compte est activé</h1>
            <p>Bonjour ${userData.full_name},</p>
            
            <div style="background-color: #dcfce7; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #16a34a; margin: 0 0 8px 0;">✅ Compte approuvé avec succès</h3>
              <p style="color: #16a34a; margin: 0;">Votre inscription à l'AVS Institute a été approuvée. Vous pouvez maintenant vous connecter à votre compte.</p>
            </div>

            <h3>Informations de connexion :</h3>
            <ul>
              <li><strong>Email :</strong> ${userData.email}</li>
              <li><strong>Mot de passe :</strong> Celui que vous avez choisi lors de l'inscription</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.vercel.app') || 'https://your-app.vercel.app'}/auth" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Se connecter maintenant
              </a>
            </div>

            <p>Bienvenue dans la communauté AVS Institute ! Nous sommes ravis de vous accompagner dans votre parcours de formation.</p>
            
            <p>Cordialement,<br>L'équipe AVS Institute</p>
          </div>
        `,
      });

      console.log('Welcome email sent:', welcomeEmailResponse.id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Utilisateur approuvé avec succès. Un email de bienvenue a été envoyé.',
          user_id: newUser.user?.id
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );

    } else if (requestData.action === 'reject') {
      // Call the rejection function
      const { data: rejectionResult, error: rejectionError } = await supabase
        .rpc('reject_pending_user', {
          p_pending_user_id: requestData.pending_user_id,
          p_admin_id: user.id,
          p_rejection_reason: requestData.rejection_reason
        });

      if (rejectionError) {
        console.error('Error rejecting user:', rejectionError);
        throw rejectionError;
      }

      const userData = rejectionResult;
      console.log('User rejected, sending notification email...');

      // Send rejection email
      const rejectionEmailResponse = await resend.emails.send({
        from: `AVS Institute <${adminEmail}>`,
        to: [userData.email],
        subject: "Mise à jour de votre demande d'inscription",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #dc2626;">Mise à jour de votre demande d'inscription</h1>
            <p>Bonjour ${userData.full_name},</p>
            
            <p>Nous vous remercions pour l'intérêt que vous portez à l'AVS Institute.</p>
            
            <div style="background-color: #fef2f2; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #dc2626; margin: 0;">Après examen de votre dossier, nous ne pouvons pas donner suite à votre demande d'inscription pour le moment.</p>
            </div>

            ${userData.rejection_reason ? `
              <h3>Raison :</h3>
              <p style="background-color: #f3f4f6; padding: 12px; border-radius: 6px;">${userData.rejection_reason}</p>
            ` : ''}

            <p>Cette décision ne remet pas en question vos compétences. N'hésitez pas à nous recontacter si vous souhaitez plus d'informations ou si votre situation évolue.</p>
            
            <p>Nous vous souhaitons beaucoup de succès dans vos projets futurs.</p>
            
            <p>Cordialement,<br>L'équipe AVS Institute</p>
          </div>
        `,
      });

      console.log('Rejection email sent:', rejectionEmailResponse.id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Utilisateur rejeté. Un email de notification a été envoyé.'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      throw new Error('Invalid action. Must be "approve" or "reject"');
    }

  } catch (error: any) {
    console.error('Error in approve-pending-user:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);