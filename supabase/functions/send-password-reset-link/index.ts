import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  email?: string;
  redirectTo?: string;
}

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, redirectTo }: RequestBody = await req.json();
    console.log("send-password-reset-link invoked", { email_present: !!email, redirectTo });

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "invalid_email" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") as string;
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      console.error("Missing Supabase env vars in send-password-reset-link");
      return new Response(JSON.stringify({ error: "server_misconfigured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // Check if caller is admin (only for authenticated calls)
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: userError } = await adminClient.auth.getUser(token);
      
      if (userError || !user) {
        console.error("Invalid auth token:", userError);
        return new Response(JSON.stringify({ error: "unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // Check if user is admin
      const { data: profile, error: profileError } = await adminClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || profile?.role !== 'admin') {
        console.error("Non-admin user attempted to use reset function:", user.id);
        return new Response(JSON.stringify({ error: "admin_required" }), {
          status: 403,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // Log admin activity
      await adminClient.rpc('log_admin_activity', {
        p_action: 'password_reset_requested',
        p_entity_type: 'user',
        p_entity_id: null,
        p_details: { target_email: email, method: 'smtp_fallback' }
      });
    }

    // Generate a password recovery link without sending an email via Supabase
    const defaultRedirectTo = `https://preview--avswebsitedemo.lovable.app/reset-password`;
    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: redirectTo || defaultRedirectTo,
      },
    });
    console.log("Recovery link generated", { ok: !linkError, email_present: !!email });

    if (linkError) {
      console.error("generateLink error:", linkError);
      return new Response(JSON.stringify({ error: linkError.message }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const actionLink = (linkData as any)?.properties?.action_link || (linkData as any)?.action_link;
    if (!actionLink) {
      console.error("No action_link returned by generateLink", linkData);
      return new Response(JSON.stringify({ error: "no_action_link" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Send email via existing Hostinger SMTP edge function to bypass GoTrue rate limits
    console.log("Invoking send-hostinger-email via admin client");
    const { data: emailData, error: emailError } = await adminClient.functions.invoke('send-hostinger-email', {
      body: {
        type: 'custom',
        to: [email],
        subject: 'Réinitialisation de mot de passe',
        html: `
          <div style="font-family: Arial, sans-serif; line-height:1.6;">
            <h2>Réinitialisation de votre mot de passe</h2>
            <p>Bonjour,</p>
            <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour continuer:</p>
            <p style="margin:24px 0;">
              <a href="${actionLink}" style="display:inline-block;padding:12px 18px;background:#4f46e5;color:#fff;border-radius:6px;text-decoration:none;">Réinitialiser mon mot de passe</a>
            </p>
            <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur:</p>
            <p style="word-break:break-all;color:#111">${actionLink}</p>
            <p style="color:#555;font-size:12px;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
          </div>
        `,
      },
    });
    console.log("send-hostinger-email response", { hasError: !!emailError, data: emailData });

    if (emailError || (emailData as any)?.error) {
      console.error("SMTP send error:", emailError || (emailData as any)?.error);
      return new Response(JSON.stringify({ error: "smtp_send_failed" }), {
        status: 502,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("Password reset email sent successfully via SMTP");
    return new Response(JSON.stringify({ ok: true, actionLink }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err: any) {
    console.error("Unhandled error in send-password-reset-link:", err);
    return new Response(JSON.stringify({ error: err?.message || "unknown_error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});