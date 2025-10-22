import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting: 10 requests per minute per user
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userRequests = rateLimitMap.get(userId) || [];
  const recentRequests = userRequests.filter(time => now - time < 60000);
  
  if (recentRequests.length >= 10) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(userId, recentRequests);
  return true;
}

function sanitizeInput(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .substring(0, 1000)
    .trim();
}

async function determineUserRole(supabaseClient: any, userId: string | null): Promise<'admin' | 'professor' | 'student' | 'visitor'> {
  if (!userId) return 'visitor';
  
  try {
    const { data: isAdminData } = await supabaseClient.rpc('is_admin', { _user_id: userId });
    if (isAdminData) return 'admin';
    
    const { data: isProfData } = await supabaseClient.rpc('is_professor', { _user_id: userId });
    if (isProfData) return 'professor';
    
    return 'student';
  } catch (error) {
    console.error('Error determining role:', error);
    return 'visitor';
  }
}

function buildSystemPrompt(role: 'admin' | 'professor' | 'student' | 'visitor'): string {
  const basePrompt = `Tu es un assistant virtuel intelligent pour AVS.ma, une plateforme éducative marocaine. 
Tu réponds en français de manière professionnelle, claire et concise.`;

  const rolePrompts = {
    admin: `${basePrompt}
Tu assistes un administrateur. Tu peux répondre aux questions sur:
- Gestion des utilisateurs et des cours
- Statistiques et analyses de la plateforme
- Configuration système et sécurité
- Opérations administratives`,
    
    professor: `${basePrompt}
Tu assistes un professeur. Tu peux aider avec:
- Gestion de cours et de contenus
- Suivi des étudiants et présences
- Création d'évaluations et de notes
- Organisation des sessions de cours`,
    
    student: `${basePrompt}
Tu assistes un étudiant. Tu peux aider avec:
- Questions sur les cours et le contenu
- Suivi de progression et calendrier
- Informations sur les certifications
- Questions générales sur la plateforme`,
    
    visitor: `${basePrompt}
Tu assistes un visiteur. Tu peux fournir:
- Informations générales sur AVS.ma
- Description des cours disponibles
- Procédure d'inscription
- Informations de contact`
  };

  return rolePrompts[role];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;

    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      userId = user?.id || null;
    }

    const rateLimitKey = userId || req.headers.get('x-forwarded-for') || 'anonymous';
    if (!checkRateLimit(rateLimitKey)) {
      return new Response(
        JSON.stringify({ error: 'Trop de requêtes. Veuillez patienter une minute.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message } = await req.json();
    const sanitizedMessage = sanitizeInput(message);

    if (!sanitizedMessage) {
      return new Response(
        JSON.stringify({ error: 'Message invalide' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userRole = await determineUserRole(supabase, userId);
    const systemPrompt = buildSystemPrompt(userRole);

    const ollamaResponse = await fetch('https://ai.avs.ma/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: sanitizedMessage }
        ],
        stream: false
      })
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama error: ${ollamaResponse.status}`);
    }

    const data = await ollamaResponse.json();
    const assistantMessage = data.message?.content || 'Désolé, je n\'ai pas pu générer une réponse.';

    if (userId) {
      await supabase.from('chat_logs').insert({
        user_id: userId,
        user_role: userRole,
        user_message: sanitizedMessage,
        assistant_message: assistantMessage,
        model_used: 'llama3.2',
        tokens_used: (sanitizedMessage.length + assistantMessage.length) / 4
      });
    }

    return new Response(
      JSON.stringify({ message: assistantMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ollama-chat:', error);
    return new Response(
      JSON.stringify({ error: 'Service temporairement indisponible' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
