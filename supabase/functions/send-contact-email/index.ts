import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// SMTP Configuration
const SMTP_CONFIG = {
  hostname: Deno.env.get("SMTP_HOST") || "",
  port: parseInt(Deno.env.get("SMTP_PORT") || "587"),
  username: Deno.env.get("SMTP_USERNAME") || "",
  password: Deno.env.get("SMTP_PASSWORD") || "",
  tls: Deno.env.get("SMTP_SECURE") === "true",
};

// Check if SMTP is configured
const SMTP_ENABLED = SMTP_CONFIG.hostname && SMTP_CONFIG.username && SMTP_CONFIG.password;

// SMTP Helper Functions
async function sendViaSMTP(to: string[], subject: string, html: string, from: string) {
  const client = new SMTPClient(SMTP_CONFIG);
  
  console.log(`Sending via SMTP to: ${to.join(', ')}`);
  
  for (const recipient of to) {
    await client.send({
      from: from,
      to: recipient,
      subject: subject,
      content: html,
      html: html,
    });
  }
  
  await client.close();
}

async function sendViaResend(to: string[], subject: string, html: string, from: string) {
  console.log(`Sending via Resend to: ${to.join(', ')}`);
  return await resend.emails.send({
    from: from,
    to: to,
    subject: subject,
    html: html,
  });
}

async function sendEmail(to: string[], subject: string, html: string, from: string, method: 'smtp' | 'resend') {
  try {
    if (method === 'smtp') {
      await sendViaSMTP(to, subject, html, from);
      return { success: true };
    } else {
      const result = await sendViaResend(to, subject, html, from);
      return result;
    }
  } catch (error) {
    console.error(`Error sending via ${method}:`, error);
    // If SMTP fails, fallback to Resend if available
    if (method === 'smtp' && Deno.env.get("RESEND_API_KEY")) {
      console.log("SMTP failed, falling back to Resend...");
      return await sendViaResend(to, subject, html, from);
    }
    throw error;
  }
}

interface ContactEmailRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, lastName, email, phone, subject, message }: ContactEmailRequest = await req.json();

    console.log("Processing contact form submission:", { firstName, lastName, email, subject });

    const FROM_EMAIL = Deno.env.get("HOSTINGER_FROM_EMAIL") || "AVS Institute <info@avs.ma>";
    const ADMIN_RECIPIENTS = (Deno.env.get("NEWSLETTER_ADMIN_EMAIL") || "contact@avs-academy.ma").split(/[ ,;]+/).filter(Boolean);

    if (!SMTP_ENABLED && !Deno.env.get("RESEND_API_KEY")) {
      console.error("Missing both SMTP and Resend configuration");
      return new Response(JSON.stringify({ success: false, error: "Configuration d'email manquante" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    console.log(`Email mode: ${SMTP_ENABLED ? 'SMTP (Hostinger)' : 'Resend'} | FROM: ${FROM_EMAIL}`);
    
    // Choose sending method
    const sendMethod = SMTP_ENABLED ? 'smtp' : 'resend';

    // Send email to the company (supports multiple admin recipients)
    if (ADMIN_RECIPIENTS.length > 0) {
      await sendEmail(
        ADMIN_RECIPIENTS,
        `Nouveau message de contact: ${subject}`,
        `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Téléphone:</strong> ${phone}</p>` : ''}
        <p><strong>Sujet:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        `,
        FROM_EMAIL,
        sendMethod
      );
    }

    // Send confirmation email to the user
    await sendEmail(
      [email],
      "Confirmation de réception de votre message",
      `
        <h1>Merci pour votre message, ${firstName}!</h1>
        <p>Nous avons bien reçu votre message concernant: <strong>${subject}</strong></p>
        <p>Nous vous répondrons dans les plus brefs délais.</p>
        <p>Cordialement,<br>L'équipe AVS INSTITUTE</p>
      `,
      FROM_EMAIL,
      sendMethod
    );

    console.log("Emails sent successfully");

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
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: "Erreur lors de l'envoi du message"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);