import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PendingRegistrationRequest {
  email: string;
  full_name: string;
  phone?: string;
  formation_type?: string;
  formation_domaine?: string;
  formation_programme?: string;
  formation_programme_title?: string;
  formation_tag?: string;
  password: string;
  metadata?: any;
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
    const fromEmail = Deno.env.get('HOSTINGER_FROM_EMAIL') || 'AVS Institute <info@avs.ma>';

    const registrationData: PendingRegistrationRequest = await req.json();
    
    console.log('Processing pending registration for:', registrationData.email);

    // Hash the password (simple base64 encoding for demo - use proper bcrypt in production)
    const encryptedPassword = btoa(registrationData.password);

    // Insert into pending_users table
    const { data: pendingUser, error: insertError } = await supabase
      .from('pending_users')
      .insert({
        email: registrationData.email,
        full_name: registrationData.full_name,
        phone: registrationData.phone,
        formation_type: registrationData.formation_type,
        formation_domaine: registrationData.formation_domaine,
        formation_programme: registrationData.formation_programme,
        formation_programme_title: registrationData.formation_programme_title,
        formation_tag: registrationData.formation_tag,
        encrypted_password: encryptedPassword,
        metadata: registrationData.metadata || {}
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting pending user:', insertError);
      throw insertError;
    }

    console.log('Pending user created:', pendingUser.id);

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: fromEmail,
      to: [registrationData.email],
      subject: "Inscription reçue - En attente d'approbation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Merci pour votre inscription !</h1>
          <p>Bonjour ${registrationData.full_name},</p>
          <p>Nous avons bien reçu votre demande d'inscription à l'AVS Institute.</p>
          
          <div style="background-color: #fef3c7; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin: 0 0 8px 0;">⏳ Votre compte est en attente d'approbation</h3>
            <p style="color: #92400e; margin: 0;">Un administrateur doit approuver votre inscription avant que vous puissiez accéder à votre compte. Vous recevrez un email de confirmation dès que votre compte sera activé.</p>
          </div>

          <h3>Détails de votre inscription :</h3>
          <ul>
            <li><strong>Email :</strong> ${registrationData.email}</li>
            <li><strong>Nom complet :</strong> ${registrationData.full_name}</li>
            ${registrationData.formation_tag ? `<li><strong>Formation :</strong> ${registrationData.formation_tag}</li>` : ''}
          </ul>

          <p><strong>Délai habituel :</strong> L'approbation prend généralement 24-48 heures.</p>
          
          <p>Si vous avez des questions urgentes, n'hésitez pas à nous contacter.</p>
          
          <p>Cordialement,<br>L'équipe AVS Institute</p>
        </div>
      `,
    });

    console.log('User confirmation email sent:', userEmailResponse.id);

    // Get all admin users for notification
    const { data: adminUsers, error: adminError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('role', 'admin')
      .not('email', 'is', null);

    if (adminError) {
      console.error('Error fetching admin users:', adminError);
    } else if (adminUsers && adminUsers.length > 0) {
      // Send notification to all admins
      const adminEmails = adminUsers.map(admin => admin.email).filter(Boolean);
      
      if (adminEmails.length > 0) {
        const adminEmailResponse = await resend.emails.send({
          from: fromEmail,
          to: adminEmails,
          subject: "Nouvelle demande d'inscription - Action requise",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #dc2626;">Nouvelle demande d'inscription</h1>
              <p>Une nouvelle demande d'inscription nécessite votre approbation :</p>
              
              <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <h3>Détails du candidat :</h3>
                <ul>
                  <li><strong>Nom complet :</strong> ${registrationData.full_name}</li>
                  <li><strong>Email :</strong> ${registrationData.email}</li>
                  ${registrationData.phone ? `<li><strong>Téléphone :</strong> ${registrationData.phone}</li>` : ''}
                  ${registrationData.formation_tag ? `<li><strong>Formation demandée :</strong> ${registrationData.formation_tag}</li>` : ''}
                  <li><strong>Date de soumission :</strong> ${new Date().toLocaleString('fr-FR')}</li>
                </ul>
              </div>

              <p style="background-color: #dbeafe; padding: 12px; border-radius: 6px;">
                <strong>Action requise :</strong> Connectez-vous au panneau d'administration pour approuver ou rejeter cette demande.
              </p>
              
              <p>Le candidat a été informé que son inscription est en attente d'approbation.</p>
            </div>
          `,
        });

        console.log('Admin notification email sent:', adminEmailResponse.id);

        // Log the notification in the database
        await supabase
          .from('approval_notifications')
          .insert({
            pending_user_id: pendingUser.id,
            notification_type: 'new_registration',
            email_sent: true,
            metadata: {
              admin_emails: adminEmails,
              email_id: adminEmailResponse.id
            }
          });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Inscription reçue. Vous recevrez un email de confirmation dès que votre compte sera approuvé.',
        pending_user_id: pendingUser.id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in handle-pending-registration:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Une erreur est survenue lors du traitement de votre inscription. Veuillez réessayer.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);