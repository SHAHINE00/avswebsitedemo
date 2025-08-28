import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Basic in-memory rate limiter (per Deno isolate)
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 60; // max events per IP per minute

function isRateLimited(ip: string) {
  const now = Date.now();
  const bucket = rateMap.get(ip);
  if (!bucket || now > bucket.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT;
}

// Minimal sanitization for details object
function sanitize(value: unknown, depth = 0): any {
  if (depth > 4) return '[truncated]';
  if (value == null) return value;
  if (typeof value === 'string') {
    // strip script tags and inline handlers
    return value
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
      .slice(0, 4000);
  }
  if (Array.isArray(value)) return value.slice(0, 50).map(v => sanitize(v, depth + 1));
  if (typeof value === 'object') {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (k.length > 100) continue;
      out[k] = sanitize(v, depth + 1);
    }
    return out;
  }
  return value;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json', ...corsHeaders },
    });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: 'Server misconfiguration' }), {
        status: 500,
        headers: { 'content-type': 'application/json', ...corsHeaders },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json().catch(() => ({}));

    const action: string = (body?.action || '').toString().slice(0, 100);
    const severity: string = (body?.severity || '').toString();
    const details: any = body?.details ?? {};
    const user_id: string | null = body?.user_id ?? null;
    const user_agent: string = (body?.user_agent || req.headers.get('user-agent') || '').toString().slice(0, 500);

    if (!action) {
      return new Response(JSON.stringify({ error: 'Missing action' }), {
        status: 400,
        headers: { 'content-type': 'application/json', ...corsHeaders },
      });
    }

    const allowedSeverities = new Set(['low', 'medium', 'high', 'critical']);
    if (!allowedSeverities.has(severity)) {
      return new Response(JSON.stringify({ error: 'Invalid severity' }), {
        status: 400,
        headers: { 'content-type': 'application/json', ...corsHeaders },
      });
    }

    // Derive client IP (best effort)
    const ip = (
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('cf-connecting-ip') ||
      'unknown'
    );

    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: { 'content-type': 'application/json', ...corsHeaders },
      });
    }

    // Sanitize details and augment
    const cleanDetails = {
      ...sanitize(details),
      severity,
      event_type: action,
      timestamp: new Date().toISOString(),
    };

    const { error } = await supabase.from('user_activity_logs').insert({
      action,
      details: cleanDetails,
      user_id: user_id ?? null,
      ip_address: ip,
      user_agent,
    });

    if (error) {
      console.error('Failed to insert security event:', error);
      return new Response(JSON.stringify({ error: 'Insert failed' }), {
        status: 500,
        headers: { 'content-type': 'application/json', ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'content-type': 'application/json', ...corsHeaders },
    });
  } catch (e) {
    console.error('Unexpected error in log-security-event:', e);
    return new Response(JSON.stringify({ error: 'Unexpected error' }), {
      status: 500,
      headers: { 'content-type': 'application/json', ...corsHeaders },
    });
  }
});
