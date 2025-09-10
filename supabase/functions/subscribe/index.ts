import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SubscribeRequest {
  email: string;
  fullName?: string;
  phone?: string;
  source?: string;
  interests?: string[];
  formationType?: string;
  formationDomaine?: string;
  formationProgramme?: string;
  formationProgrammeTitle?: string;
  formationTag?: string;
}

function sanitizeString(input: unknown, max = 200): string | null {
  if (typeof input !== "string") return null;
  let s = input.trim().replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  s = s.replace(/on\w+\s*=\s*"[^"]*"/gi, "");
  return s.slice(0, max);
}

function sanitizeEmail(input: unknown): string | null {
  const s = sanitizeString(input, 254);
  if (!s) return null;
  const email = s.toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? email : null;
}

function sanitizePhone(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const digits = input.replace(/[^0-9+]/g, "").slice(0, 20);
  return digits || null;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const raw: any = await req.json();

    // Normalize both camelCase and snake_case payloads
    const body: SubscribeRequest = {
      email: raw.email ?? raw.Email,
      fullName: raw.fullName ?? raw.full_name ?? raw.name,
      phone: raw.phone ?? raw.phone_number ?? raw.phoneNumber,
      source: raw.source ?? raw.Source,
      interests: Array.isArray(raw.interests)
        ? raw.interests
        : (typeof raw.interests === 'string' ? raw.interests.split(/[ ,;]+/) : undefined),
      formationType: raw.formationType ?? raw.formation_type,
      formationDomaine: raw.formationDomaine ?? raw.formation_domaine,
      formationProgramme: raw.formationProgramme ?? raw.formation_programme,
      formationProgrammeTitle: raw.formationProgrammeTitle ?? raw.formation_programme_title,
      formationTag: raw.formationTag ?? raw.formation_tag,
    };

    const email = sanitizeEmail(body.email);
    const fullName = sanitizeString(body.fullName, 100) || (email ? email.split("@")[0] : null);
    const phone = sanitizePhone(body.phone);
    const formationType = sanitizeString(body.formationType, 50);
    const formationDomaine = sanitizeString(body.formationDomaine, 50);
    const formationProgramme = sanitizeString(body.formationProgramme, 100);
    const formationProgrammeTitle = sanitizeString(body.formationProgrammeTitle, 150);
    const formationTag = sanitizeString(body.formationTag, 200);

    // Enhanced logging for troubleshooting
    console.log("Subscribe sanitized payload:", {
      email,
      hasFullName: Boolean(fullName),
      hasPhone: Boolean(phone),
      formationType,
      formationDomaine,
      formationProgramme,
      formationProgrammeTitle,
      hasTag: Boolean(formationTag)
    });

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid email" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Allow missing full name - will fall back to email local-part for storage


    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      console.error("Missing Supabase env vars for subscribe function");
      return new Response(
        JSON.stringify({ success: false, error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Check for existing subscriber
    const { data: existing, error: selectError } = await admin
      .from("subscribers")
      .select("id")
      .eq("email", email)
      .limit(1);

    if (selectError) {
      console.error("Subscribe select error:", selectError);
      return new Response(
        JSON.stringify({ success: false, error: "Database error" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({ success: true, status: "already_subscribed" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { error: insertError } = await admin
      .from("subscribers")
      .insert({
        email,
        full_name: fullName,
        phone,
        formation_type: formationType,
        formation_domaine: formationDomaine,
        formation_programme: formationProgramme,
        formation_programme_title: formationProgrammeTitle,
        formation_tag: formationTag,
      });

    if (insertError) {
      console.error("Subscribe insert error:", insertError);
      return new Response(
        JSON.stringify({ success: false, error: "Database insert error" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, status: "subscribed" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Subscribe function error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Unexpected error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
