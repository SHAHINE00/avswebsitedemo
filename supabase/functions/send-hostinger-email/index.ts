import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

interface ContactEmailRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

interface NewsletterSubscriptionRequest {
  email: string;
  fullName?: string;
  interests?: string[];
  source?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, ...data } = await req.json();

    // Get email configuration
    const FROM_EMAIL = Deno.env.get("HOSTINGER_FROM_EMAIL") || "AVS Institute <info@avs.ma>";
    const ADMIN_EMAIL = Deno.env.get("NEWSLETTER_ADMIN_EMAIL");

    if (!Deno.env.get("RESEND_API_KEY")) {
      console.error("Missing Resend API key");
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Configuration d'email manquante" 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Processing email request of type: ${type}`);
    console.log(`Using FROM_EMAIL: ${FROM_EMAIL} | ADMIN_EMAIL: ${ADMIN_EMAIL ?? 'not set'}`);

    switch (type) {
      case "contact":
        return await handleContactEmail(data as ContactEmailRequest, { FROM_EMAIL, ADMIN_EMAIL });
      
      case "newsletter":
        return await handleNewsletterSubscription(data as NewsletterSubscriptionRequest, { FROM_EMAIL, ADMIN_EMAIL });
      
      case "custom":
        return await handleCustomEmail(data as EmailRequest, { FROM_EMAIL });
      
      default:
        return new Response(
          JSON.stringify({ 
            success: false,
            error: "Type d'email non supporté" 
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
    }
  } catch (error: any) {
    console.error("Error in send-hostinger-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: "Erreur lors de l'envoi de l'email"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

async function handleContactEmail(
  { firstName, lastName, email, phone, subject, message }: ContactEmailRequest,
  { FROM_EMAIL, ADMIN_EMAIL }: any
): Promise<Response> {
  
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Nouveau message de contact</h2>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Nom:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Téléphone:</strong> ${phone}</p>` : ''}
        <p><strong>Sujet:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #2563eb;">
          ${message.replace(/\n/g, '<br>')}
        </div>
      </div>
    </div>
  `;

  const confirmationHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Merci pour votre message!</h1>
      </div>
      <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; color: #374151;">Bonjour ${firstName},</p>
        <p style="color: #6b7280;">Nous avons bien reçu votre message concernant: <strong style="color: #2563eb;">${subject}</strong></p>
        <p style="color: #6b7280;">Notre équipe vous répondra dans les plus brefs délais.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; color: #4b5563; font-size: 14px;">
            <strong>Besoin d'une réponse urgente?</strong><br>
            Contactez-nous directement au: +212 XXX XXX XXX
          </p>
        </div>
        <p style="color: #6b7280;">Cordialement,<br><strong style="color: #2563eb;">L'équipe AVS INSTITUTE</strong></p>
      </div>
    </div>
  `;

  try {
    const promises = [];

    // Send notification to admin if admin email is configured (supports multiple addresses)
    const adminRecipients = ADMIN_EMAIL ? ADMIN_EMAIL.split(/[ ,;]+/).filter(Boolean) : [];
    if (adminRecipients.length > 0) {
      console.log(`Sending admin contact notification to: ${adminRecipients.join(', ')}`);
      promises.push(
        resend.emails.send({
          from: FROM_EMAIL,
          to: adminRecipients,
          subject: `Nouveau message de contact: ${subject}`,
          html: emailHtml,
        })
      );
    }

    // Send confirmation to user
    promises.push(
      resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        subject: "Confirmation de réception - AVS INSTITUTE",
        html: confirmationHtml,
      })
    );

    await Promise.all(promises);
    console.log("Contact emails sent successfully");

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Message envoyé avec succès"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error sending contact emails:", error);
    throw error;
  }
}

async function handleNewsletterSubscription(
  { email, fullName, interests, source }: NewsletterSubscriptionRequest,
  { FROM_EMAIL, ADMIN_EMAIL }: any
): Promise<Response> {
  
  const welcomeHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Bienvenue à AVS INSTITUTE!</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Votre inscription à notre newsletter a été confirmée</p>
      </div>
      <div style="background: white; padding: 40px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; color: #374151;">Bonjour ${fullName || 'Cher(e) abonné(e)'},</p>
        <p style="color: #6b7280;">Merci de vous être inscrit(e) à notre newsletter! Vous recevrez désormais:</p>
        <ul style="color: #6b7280; padding-left: 20px;">
          <li>Les dernières actualités de nos formations</li>
          <li>Des conseils exclusifs de nos experts</li>
          <li>Les offres spéciales réservées aux abonnés</li>
          <li>Les nouvelles dates de formations</li>
        </ul>
        ${interests && interests.length > 0 ? `
          <div style="background: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; color: #4b5563; font-weight: bold;">Vos centres d'intérêt:</p>
            <p style="margin: 0; color: #6b7280;">${interests.join(', ')}</p>
          </div>
        ` : ''}
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://avs-institute.ma/curriculum" style="background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Découvrir nos formations
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
          Vous pouvez vous désabonner à tout moment en cliquant 
          <a href="#" style="color: #2563eb;">ici</a>
        </p>
      </div>
    </div>
  `;

  const adminNotificationHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Nouvelle inscription newsletter</h2>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Email:</strong> ${email}</p>
        ${fullName ? `<p><strong>Nom:</strong> ${fullName}</p>` : ''}
        ${source ? `<p><strong>Source:</strong> ${source}</p>` : ''}
        ${interests && interests.length > 0 ? `<p><strong>Centres d'intérêt:</strong> ${interests.join(', ')}</p>` : ''}
        <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
      </div>
    </div>
  `;

  try {
    const promises = [];

    // Send welcome email to subscriber
    promises.push(
      resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        subject: "Bienvenue à AVS INSTITUTE - Votre guide IA gratuit",
        html: welcomeHtml,
      })
    );

    // Send notification to admin if configured (supports multiple addresses)
    const adminRecipients = ADMIN_EMAIL ? ADMIN_EMAIL.split(/[ ,;]+/).filter(Boolean) : [];
    if (adminRecipients.length > 0) {
      console.log(`Sending admin newsletter notification to: ${adminRecipients.join(', ')}`);
      promises.push(
        resend.emails.send({
          from: FROM_EMAIL,
          to: adminRecipients,
          subject: "Nouvelle inscription newsletter",
          html: adminNotificationHtml,
        })
      );
    }

    await Promise.all(promises);
    console.log("Newsletter emails sent successfully");

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Inscription confirmée avec succès"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error sending newsletter emails:", error);
    throw error;
  }
}

async function handleCustomEmail(
  { to, subject, html, text, replyTo }: EmailRequest,
  { FROM_EMAIL }: any
): Promise<Response> {
  
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: to,
      subject: subject,
      html: html,
      text: text,
      replyTo: replyTo,
    });

    console.log(`Custom email sent to ${to.length} recipients`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Email envoyé avec succès"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error sending custom email:", error);
    throw error;
  }
}

serve(handler);