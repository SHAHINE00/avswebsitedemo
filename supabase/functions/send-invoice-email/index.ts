import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvoiceEmailRequest {
  invoice: {
    id?: string;
    invoice_number: string;
    invoice_date: string;
    amount: number;
    tax_amount: number;
    total_amount: number;
    status: string;
  };
  student: {
    id?: string;
    email: string;
    full_name?: string;
    address?: string;
  };
  user_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { invoice, student, user_id }: InvoiceEmailRequest = await req.json();

    console.log('Sending invoice email:', { invoice_number: invoice.invoice_number, email: student.email });

    // Prepare email content
    const emailSubject = `Facture ${invoice.invoice_number} - AVS Institute`;
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">AVS INSTITUTE</h1>
          <p style="color: white; margin: 10px 0 0 0;">Centre de Formation Professionnelle</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937; margin-top: 0;">Bonjour ${student.full_name || 'Cher étudiant'},</h2>
          
          <p style="color: #4b5563; line-height: 1.6;">
            Veuillez trouver ci-joint votre facture <strong>${invoice.invoice_number}</strong> 
            d'un montant de <strong>${invoice.total_amount.toFixed(2)} MAD</strong>.
          </p>
          
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Numéro de facture:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${invoice.invoice_number}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Date:</td>
                <td style="padding: 8px 0; text-align: right;">${new Date(invoice.invoice_date).toLocaleDateString('fr-FR')}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Montant HT:</td>
                <td style="padding: 8px 0; text-align: right;">${invoice.amount.toFixed(2)} MAD</td>
              </tr>
              ${invoice.tax_amount > 0 ? `
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">TVA:</td>
                <td style="padding: 8px 0; text-align: right;">${invoice.tax_amount.toFixed(2)} MAD</td>
              </tr>
              ` : ''}
              <tr style="border-top: 2px solid #3B82F6;">
                <td style="padding: 12px 0; font-weight: bold; color: #1f2937;">Total:</td>
                <td style="padding: 12px 0; text-align: right; font-weight: bold; color: #3B82F6; font-size: 18px;">${invoice.total_amount.toFixed(2)} MAD</td>
              </tr>
            </table>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6;">
            Pour toute question concernant cette facture, n'hésitez pas à nous contacter.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
              AVS Institute<br>
              Casablanca, Morocco<br>
              Email: contact@avs-institute.com<br>
              Tél: +212 XXX-XXXXXX
            </p>
          </div>
        </div>
        
        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">
            © ${new Date().getFullYear()} AVS Institute. Tous droits réservés.
          </p>
        </div>
      </div>
    `;

    // Call the existing send-hostinger-email function to send the email
    const { error: emailError } = await supabaseClient.functions.invoke('send-hostinger-email', {
      body: {
        to: student.email,
        subject: emailSubject,
        html: emailBody,
        attachInvoice: true,
        invoice: invoice
      }
    });

    if (emailError) {
      console.error('Error sending email:', emailError);
      throw emailError;
    }

    // Log communication in database
    const { error: logError } = await supabaseClient
      .from('communication_log')
      .insert({
        user_id: user_id,
        communication_type: 'email',
        subject: emailSubject,
        message: `Facture ${invoice.invoice_number} envoyée`,
        direction: 'outbound',
        status: 'sent',
        metadata: {
          invoice_id: invoice.id,
          invoice_number: invoice.invoice_number,
          amount: invoice.total_amount
        }
      });

    if (logError) {
      console.error('Error logging communication:', logError);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error in send-invoice-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
