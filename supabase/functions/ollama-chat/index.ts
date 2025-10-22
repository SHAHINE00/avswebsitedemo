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

function extractKeywords(text: string): string[] {
  return text.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3)
    .slice(0, 10);
}

function isOffTopicQuery(message: string): boolean {
  const offTopicKeywords = [
    // Travel & Tourism
    'hôtel', 'hotel', 'restaurant', 'voyage', 'tourisme', 'marrakech', 'casablanca', 'rabat',
    'réservation', 'booking', 'vol', 'avion', 'train', 'taxi',
    
    // Weather & News
    'météo', 'weather', 'actualité', 'news', 'sport', 'football', 'match',
    
    // Food & Health
    'recette', 'cuisine', 'santé', 'médecin', 'maladie', 'pharmacie',
    
    // Entertainment
    'film', 'série', 'musique', 'jeu', 'game', 'concert',
    
    // Shopping & Services
    'shopping', 'magasin', 'boutique', 'prix', 'acheter',
    
    // General knowledge unrelated to education
    'capitale', 'président', 'roi'
  ];
  
  const lowerMessage = message.toLowerCase();
  const hasOffTopicKeyword = offTopicKeywords.some(kw => lowerMessage.includes(kw));
  
  // Check if message mentions AVS, education, or platform terms
  const hasEducationContext = /\b(avs|cours|formation|étudiant|professeur|certificat|inscription|plateforme|éducation|apprendre|enseigner|leçon|module|quiz|examen)\b/i.test(message);
  
  // If has off-topic keyword AND no education context, likely off-topic
  return hasOffTopicKeyword && !hasEducationContext;
}

async function getRelevantContext(supabaseClient: any, userMessage: string, userRole: string): Promise<string> {
  try {
    const keywords = extractKeywords(userMessage);
    
    const { data: docs } = await supabaseClient
      .from('knowledge_base')
      .select('title, content')
      .or(`keywords.cs.{${keywords.join(',')}}${userRole !== 'visitor' ? `,role_access.is.null,role_access.cs.{${userRole}}` : ',role_access.is.null'}`)
      .order('priority', { ascending: false })
      .limit(2);
    
    if (!docs || docs.length === 0) return '';
    
    return docs.map((d: any) => `[${d.title}]\n${d.content}`).join('\n\n');
  } catch (error) {
    console.error('Error fetching context:', error);
    return '';
  }
}

async function determineUserRole(supabaseClient: any, userId: string | null): Promise<'admin' | 'professor' | 'student' | 'visitor'> {
  if (!userId) return 'visitor';
  
  try {
    // Parallelize role checks for faster response
    const [adminRes, profRes] = await Promise.all([
      supabaseClient.rpc('is_admin', { _user_id: userId }),
      supabaseClient.rpc('is_professor', { _user_id: userId })
    ]);
    
    if (adminRes?.data) return 'admin';
    if (profRes?.data) return 'professor';
    
    return 'student';
  } catch (error) {
    console.error('Error determining role:', error);
    return 'visitor';
  }
}

function buildSystemPrompt(role: 'admin' | 'professor' | 'student' | 'visitor', context: string, historyLength: number): string {
  const rolePrompts = {
    admin: "Tu es l'assistant AVS.ma pour administrateurs. Tu aides avec la gestion de la plateforme.",
    professor: "Tu es l'assistant AVS.ma pour professeurs. Tu aides avec la création de cours et gestion étudiants.",
    student: "Tu es l'assistant AVS.ma pour étudiants. Tu aides avec les inscriptions et progression des cours.",
    visitor: "Tu es l'assistant AVS.ma. Tu informes sur les programmes et processus d'inscription."
  };

  return `${rolePrompts[role]}

⛔ RÈGLE CRITIQUE - DOMAINE STRICTEMENT LIMITÉ:
Tu es UNIQUEMENT un assistant pour la plateforme AVS.ma (African Virtual School).
AVS.ma est une plateforme éducative marocaine spécialisée dans l'IA, Tech, et formations professionnelles.

TU NE DOIS RÉPONDRE QU'AUX QUESTIONS SUR:
✅ Les cours et formations disponibles sur AVS.ma (IA, Data Science, Cybersécurité, etc.)
✅ Les inscriptions, certifications, et progression des étudiants
✅ Les fonctionnalités de la plateforme (création de cours, gestion, tableau de bord)
✅ Les informations pratiques (tarifs, contact, support technique AVS.ma)
✅ L'utilisation de la plateforme selon le rôle (admin/professeur/étudiant)

❌ REFUSE POLIMENT TOUTE QUESTION HORS SUJET:
- Hôtels, restaurants, voyage → Refuse poliment
- Météo, actualités, sport → Refuse poliment
- Santé, cuisine, divertissement → Refuse poliment
- Shopping, services généraux → Refuse poliment
- Questions générales sans lien avec éducation/plateforme → Redirige vers AVS.ma

RÉPONSE TYPE POUR QUESTIONS HORS SUJET:
"Désolé, je suis l'assistant AVS.ma et je ne peux répondre qu'aux questions concernant notre plateforme éducative. 📚

Pour toute information sur nos **cours d'IA et Tech**, nos **formations certifiantes**, ou l'**utilisation de la plateforme**, je suis là pour vous aider!

**Puis-je vous renseigner sur:**
- Les formations disponibles
- Le processus d'inscription
- Les fonctionnalités de la plateforme
- Votre progression ou vos cours"

${context ? `CONTEXTE PLATEFORME:\n${context}\n` : ''}

RÈGLES DE FORMATAGE IMPORTANTES:
- Utilise des listes à puces (- item) pour énumérer plusieurs points
- Mets en **gras** les mots et concepts importants
- Structure tes réponses avec des paragraphes courts et aérés
- Utilise des émojis pertinents pour améliorer la lisibilité 🎯
- Pour les titres de section, utilise le format: **Titre** 📚
- Sépare les différentes sections avec des lignes vides

STRUCTURE DE RÉPONSE:
- Pour des informations multiples, utilise ce format:

**Titre de section** 📚
- Premier point important
- Deuxième point avec détails
- Troisième point

- Pour une seule info: réponds directement en 2-3 phrases courtes et claires.

RÈGLES GÉNÉRALES:
- Réponds en français, clair et concis (max 200 mots)
- Base tes réponses sur le CONTEXTE fourni
- Si tu ne sais pas, recommande de contacter support@avs.ma
- Reste strictement dans le domaine AVS.ma (plateforme éducative IA/Tech au Maroc)

${historyLength > 0 ? `HISTORIQUE: ${historyLength} messages dans cette conversation` : ''}`;
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

    const { message, sessionId, visitorId } = await req.json();
    const sanitizedMessage = sanitizeInput(message);

    if (!sanitizedMessage) {
      return new Response(
        JSON.stringify({ error: 'Message invalide' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Pre-filter off-topic queries
    if (isOffTopicQuery(sanitizedMessage)) {
      const offTopicResponse = `Désolé, je suis l'assistant AVS.ma et je ne peux répondre qu'aux questions concernant notre plateforme éducative. 📚

Pour toute information sur nos **cours d'IA et Tech**, nos **formations certifiantes**, ou l'**utilisation de la plateforme**, je suis là pour vous aider!

**Puis-je vous renseigner sur:**
- Les formations disponibles
- Le processus d'inscription
- Les fonctionnalités de la plateforme
- Votre progression ou vos cours`;

      // Get or create session for saving messages
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        const { data: newSession } = await supabase
          .from('chat_sessions')
          .insert({ user_id: userId, visitor_id: visitorId })
          .select()
          .single();
        currentSessionId = newSession?.id;
      }

      // Save both messages
      await supabase.from('chat_messages').insert([
        { session_id: currentSessionId, role: 'user', content: sanitizedMessage },
        { session_id: currentSessionId, role: 'assistant', content: offTopicResponse }
      ]);

      return new Response(JSON.stringify({ message: offTopicResponse, sessionId: currentSessionId }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const t0 = Date.now();
    const userRole = await determineUserRole(supabase, userId);
    
    // Get or create session
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const { data: newSession } = await supabase
        .from('chat_sessions')
        .insert({ user_id: userId, visitor_id: visitorId })
        .select()
        .single();
      currentSessionId = newSession?.id;
    } else {
      // Update last activity
      await supabase
        .from('chat_sessions')
        .update({ last_activity_at: new Date().toISOString() })
        .eq('id', currentSessionId);
    }
    
    // Get conversation history (last 10 messages)
    const { data: history } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('session_id', currentSessionId)
      .order('created_at', { ascending: false })
      .limit(10);
    
    const conversationHistory = (history || []).reverse();
    
    // Get relevant context from knowledge base
    const context = await getRelevantContext(supabase, sanitizedMessage, userRole);
    
    const systemPrompt = buildSystemPrompt(userRole, context, conversationHistory.length);

    // Save user message
    await supabase.from('chat_messages').insert({
      session_id: currentSessionId,
      role: 'user',
      content: sanitizedMessage
    });
    
    const ollamaResponse = await fetch('https://ai.avs.ma/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral:latest',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: sanitizedMessage }
        ],
        stream: true,
        options: {
          num_predict: 256,
          temperature: 0.3,
          top_p: 0.9
        }
      })
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text().catch(() => 'Unknown error');
      console.error(`❌ Ollama gateway error: ${ollamaResponse.status} - ${errorText}`);
      
      if (ollamaResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'RATE_LIMIT', message: 'Trop de requêtes. Veuillez réessayer dans quelques instants.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (ollamaResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'PAYMENT_REQUIRED', message: 'Crédits insuffisants. Contactez l\'administrateur.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'GATEWAY_ERROR', message: 'Service AI temporairement indisponible.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`✅ Streaming started in ${Date.now() - t0}ms`);

    // Stream response and collect for saving
    const reader = ollamaResponse.body?.getReader();
    const encoder = new TextEncoder();
    let fullResponse = '';
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader!.read();
            if (done) break;
            
            // Collect response text
            const text = new TextDecoder().decode(value);
            const lines = text.split('\n').filter(line => line.trim());
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const jsonStr = line.slice(6);
                if (jsonStr !== '[DONE]') {
                  try {
                    const parsed = JSON.parse(jsonStr);
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) fullResponse += content;
                  } catch {}
                }
              }
            }
            
            controller.enqueue(value);
          }
          
          // Save assistant message
          if (fullResponse && currentSessionId) {
            await supabase.from('chat_messages').insert({
              session_id: currentSessionId,
              role: 'assistant',
              content: fullResponse
            });
          }
          
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      }
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Session-Id': currentSessionId || ''
      }
    });

  } catch (error) {
    console.error('Error in ollama-chat:', error);
    return new Response(
      JSON.stringify({ error: 'Service temporairement indisponible' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
