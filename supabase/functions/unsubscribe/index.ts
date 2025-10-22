import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function htmlResponse(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      ...corsHeaders,
    },
  });
}

function getSupabaseClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("Missing Supabase service credentials");
  return createClient(url, key);
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "GET") {
      return htmlResponse("<h1>Méthode non autorisée</h1>", 405);
    }

    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (!token) {
      return htmlResponse("<h1>Lien invalide</h1><p>Token manquant.</p>", 400);
    }

    const supabase = getSupabaseClient();

    // Find token record
    const { data: tokenRow, error: tokenErr } = await supabase
      .from("unsubscribe_tokens")
      .select("id, email, used_at")
      .eq("token", token)
      .maybeSingle();

    if (tokenErr) throw tokenErr;
    if (!tokenRow) {
      return htmlResponse("<h1>Lien expiré ou invalide</h1>", 400);
    }

    const email = tokenRow.email as string;

    // Mark unsubscribed (idempotent)
    const { error: upsertErr } = await supabase
      .from("unsubscribes")
      .upsert({ email })
      .single();
    if (upsertErr) throw upsertErr;

    // Mark token as used
    if (!tokenRow.used_at) {
      await supabase
        .from("unsubscribe_tokens")
        .update({ used_at: new Date().toISOString() })
        .eq("id", tokenRow.id);
    }

    const page = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Désabonnement confirmé</title>
  <style>
    body{font-family:Arial, sans-serif;background:#f6f7fb;margin:0;padding:40px;color:#111827}
    .card{max-width:640px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.08);overflow:hidden}
    .hero{background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;padding:28px 24px}
    .hero h1{margin:0;font-size:24px}
    .content{padding:24px}
    .content p{color:#4b5563;line-height:1.6}
    .btn{display:inline-block;margin-top:16px;background:#2563eb;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none}
  </style>
</head>
<body>
  <main class="card">
    <header class="hero"><h1>Désabonnement confirmé</h1></header>
    <section class="content">
      <p>L'adresse <strong>${email}</strong> a été désabonnée avec succès.</p>
      <p>Vous ne recevrez plus nos emails marketing. Vous pouvez vous réinscrire à tout moment depuis notre site.</p>
      <a class="btn" href="/" onclick="window.history.length>1?history.back():location.href='/'">Retour</a>
    </section>
  </main>
</body>
</html>`;

    return htmlResponse(page, 200);
  } catch (error) {
    console.error("unsubscribe error", error);
    return htmlResponse("<h1>Erreur serveur</h1>", 500);
  }
};

serve(handler);
