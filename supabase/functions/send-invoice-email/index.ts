import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    country?: string;
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
    const emailSubject = `Facture ${invoice.invoice_number} - AVS Innovation Institut`;
    const emailBody = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
        <!-- Modern Tech Header -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0ea5e9 100%); padding: 40px 30px; text-align: center; position: relative; overflow: hidden;">
          <!-- Decorative circuit pattern -->
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #0ea5e9, #8b5cf6, #06b6d4);"></div>
          
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 1px;">AVS INNOVATION INSTITUT</h1>
          <p style="color: #06b6d4; margin: 12px 0 0 0; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 2px;">Institut d'Innovation et de Formation Technologique</p>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="color: #94a3b8; margin: 0; font-size: 12px;">Avenue Allal El Fassi – Alpha 2000, Marrakech – MAROC</p>
            <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 12px;">Email: info@avs.ma | Web: www.avs.ma</p>
          </div>
        </div>
        
        <div style="padding: 40px 30px; background: white;">
          <!-- Invoice Title -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #0ea5e9; margin: 0; font-size: 28px; font-weight: 700;">FACTURE</h2>
            <div style="width: 100px; height: 3px; background: linear-gradient(90deg, #8b5cf6, #0ea5e9); margin: 10px auto;"></div>
          </div>
          
          <p style="color: #1e293b; line-height: 1.8; font-size: 15px;">
            Bonjour <strong style="color: #0ea5e9;">${student.full_name || 'Cher étudiant'}</strong>,
          </p>
          
          <p style="color: #475569; line-height: 1.8; font-size: 14px;">
            Veuillez trouver ci-joint votre facture <strong style="color: #0ea5e9;">${invoice.invoice_number}</strong> 
            d'un montant de <strong style="color: #0ea5e9; font-size: 16px;">${invoice.total_amount.toFixed(2)} MAD</strong>.
          </p>
          
          <!-- Client Info Card -->
          <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #8b5cf6;">
            <h3 style="margin: 0 0 18px 0; color: #06b6d4; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Informations Client</h3>
            <p style="margin: 0; color: #cbd5e1; line-height: 2; font-size: 14px;">
              <strong style="color: #94a3b8;">Nom:</strong> <span style="color: white;">${student.full_name || 'N/A'}</span><br>
              <strong style="color: #94a3b8;">Email:</strong> <span style="color: white;">${student.email}</span><br>
              ${student.phone ? `<strong style="color: #94a3b8;">Téléphone:</strong> <span style="color: white;">${student.phone}</span><br>` : ''}
              ${student.address ? `<strong style="color: #94a3b8;">Adresse:</strong> <span style="color: white;">${student.address}</span><br>` : ''}
              ${student.city || student.postal_code ? `<strong style="color: #94a3b8;">Ville:</strong> <span style="color: white;">${student.postal_code || ''} ${student.city || ''}</span><br>` : ''}
              ${student.country ? `<strong style="color: #94a3b8;">Pays:</strong> <span style="color: white;">${student.country}</span>` : ''}
            </p>
          </div>
          
          <!-- Invoice Details Card -->
          <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 25px; margin: 25px 0; border-top: 4px solid #0ea5e9;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; color: #64748b; font-size: 13px; font-weight: 500;">Numéro de facture:</td>
                <td style="padding: 12px 0; text-align: right; font-weight: 700; color: #1e293b; font-family: 'Courier New', monospace;">${invoice.invoice_number}</td>
              </tr>
              <tr style="border-top: 1px solid #e2e8f0;">
                <td style="padding: 12px 0; color: #64748b; font-size: 13px; font-weight: 500;">Date:</td>
                <td style="padding: 12px 0; text-align: right; color: #1e293b;">${new Date(invoice.invoice_date).toLocaleDateString('fr-FR')}</td>
              </tr>
              <tr style="border-top: 1px solid #e2e8f0;">
                <td style="padding: 12px 0; color: #64748b; font-size: 13px; font-weight: 500;">Montant HT:</td>
                <td style="padding: 12px 0; text-align: right; color: #1e293b; font-weight: 600;">${invoice.amount.toFixed(2)} MAD</td>
              </tr>
              ${invoice.tax_amount > 0 ? `
              <tr style="border-top: 1px solid #e2e8f0;">
                <td style="padding: 12px 0; color: #64748b; font-size: 13px; font-weight: 500;">TVA (20%):</td>
                <td style="padding: 12px 0; text-align: right; color: #1e293b; font-weight: 600;">${invoice.tax_amount.toFixed(2)} MAD</td>
              </tr>
              ` : ''}
              <tr style="border-top: 3px solid #0ea5e9; background: linear-gradient(135deg, #0f172a, #1e293b);">
                <td style="padding: 18px 12px; font-weight: 700; color: #06b6d4; font-size: 15px; border-radius: 8px 0 0 8px;">TOTAL:</td>
                <td style="padding: 18px 12px; text-align: right; font-weight: 700; color: #0ea5e9; font-size: 20px; border-radius: 0 8px 8px 0;">${invoice.total_amount.toFixed(2)} MAD</td>
              </tr>
            </table>
          </div>
          
          <!-- Payment Info -->
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <p style="color: #92400e; margin: 0; font-size: 13px; line-height: 1.8;">
              <strong style="font-size: 14px;">💳 Informations de paiement:</strong><br>
              Virement bancaire, espèces ou carte acceptés<br>
              <strong>RIB:</strong> 007 810 0001172000012345 67<br>
              <strong>IBAN:</strong> MA64 007 810 0001172000012345 67
            </p>
          </div>
          
          <p style="color: #475569; line-height: 1.8; font-size: 14px; margin-top: 30px;">
            Pour toute question concernant cette facture, n'hésitez pas à nous contacter.
          </p>
          
          <!-- Legal Info -->
          <div style="margin-top: 30px; padding: 20px; background: #f1f5f9; border-radius: 8px;">
            <p style="color: #64748b; font-size: 11px; margin: 0; line-height: 1.6;">
              <strong style="color: #334155;">Informations légales:</strong><br>
              ICE: 002876419000039 | RC: 145892 | IF: 40254941 | CNSS: 8514623
            </p>
          </div>
          
          <div style="margin-top: 25px; padding-top: 25px; border-top: 2px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.8;">
              <strong style="color: #0f172a;">AVS INNOVATION INSTITUT</strong><br>
              Avenue Allal El Fassi – Alpha 2000<br>
              Marrakech – MAROC<br>
              Email: info@avs.ma | Web: www.avs.ma<br>
              Tél: +212 6 62 63 29 53 / +212 5 24 31 19 82
            </p>
          </div>
        </div>
        
        <!-- Modern Footer -->
        <div style="background: linear-gradient(135deg, #0f172a, #1e293b); padding: 25px; text-align: center; border-top: 3px solid #8b5cf6;">
          <p style="color: #cbd5e1; margin: 0 0 8px 0; font-size: 13px;">
            Merci pour votre confiance et votre engagement dans votre formation technologique.
          </p>
          <p style="color: #64748b; margin: 0; font-size: 11px;">
            © ${new Date().getFullYear()} AVS Innovation Institut. Tous droits réservés.
          </p>
        </div>
      </div>
    `;

    // Call the existing send-hostinger-email function to send the email
    const { error: emailError } = await supabaseClient.functions.invoke('send-hostinger-email', {
      body: {
        type: 'custom',
        to: [student.email],
        subject: emailSubject,
        html: emailBody
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
