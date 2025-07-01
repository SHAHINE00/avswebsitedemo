import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

    // Send email to the company
    const companyEmailResponse = await resend.emails.send({
      from: "Contact Form <contact@resend.dev>",
      to: ["contact@avs-academy.ma"],
      subject: `Nouveau message de contact: ${subject}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Téléphone:</strong> ${phone}</p>` : ''}
        <p><strong>Sujet:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Send confirmation email to the user
    const userEmailResponse = await resend.emails.send({
      from: "AVS Academy <contact@resend.dev>",
      to: [email],
      subject: "Confirmation de réception de votre message",
      html: `
        <h1>Merci pour votre message, ${firstName}!</h1>
        <p>Nous avons bien reçu votre message concernant: <strong>${subject}</strong></p>
        <p>Nous vous répondrons dans les plus brefs délais.</p>
        <p>Cordialement,<br>L'équipe AVS Academy</p>
      `,
    });

    console.log("Emails sent successfully:", { companyEmailResponse, userEmailResponse });

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