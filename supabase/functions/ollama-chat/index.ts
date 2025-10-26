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

let lastWarmAt = 0;

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
    const keywords = extractKeywords(userMessage).slice(0, 5); // Reduce from 10 to 5
    
    const { data: doc } = await supabaseClient
      .from('knowledge_base')
      .select('content') // Only content, not title
      .or(`keywords.cs.{${keywords.join(',')}}${userRole !== 'visitor' ? `,role_access.is.null,role_access.cs.{${userRole}}` : ',role_access.is.null'}`)
      .order('priority', { ascending: false })
      .limit(1) // Reduce from 2 to 1
      .maybeSingle();
    
    if (!doc) return '';
    
    return doc.content?.substring(0, 400) || ''; // Max 400 chars
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

function buildSystemPrompt(role: 'admin' | 'professor' | 'student' | 'visitor', context: string, historyLength: number, language: 'fr' | 'ar' | 'en' = 'fr'): string {
  const prompts = {
    fr: {
      admin: "Assistant AVS.ma pour admins. Aide à la gestion plateforme.",
      professor: "Assistant AVS.ma pour profs. Aide création cours & gestion étudiants.",
      student: "Assistant AVS.ma pour étudiants. Aide inscriptions & progression.",
      visitor: "Assistant AVS.ma. Informe sur formations & inscription."
    },
    en: {
      admin: "AVS.ma assistant for admins. Help with platform management.",
      professor: "AVS.ma assistant for professors. Help with courses & students.",
      student: "AVS.ma assistant for students. Help with enrollment & progress.",
      visitor: "AVS.ma assistant. Info about programs & enrollment."
    },
    ar: {
      admin: "مساعد AVS.ma للمسؤولين. مساعدة في إدارة المنصة.",
      professor: "مساعد AVS.ma للأساتذة. مساعدة في الدورات والطلاب.",
      student: "مساعد AVS.ma للطلاب. مساعدة في التسجيل والتقدم.",
      visitor: "مساعد AVS.ma. معلومات عن البرامج والتسجيل."
    }
  };

  const rules = {
    fr: "Réponds en français, concis (max 150 mots). Si hors-sujet éducation/AVS.ma, refuse poliment.",
    en: "Respond in English, concise (max 150 words). If off-topic education/AVS.ma, politely refuse.",
    ar: "أجب بالعربية، موجز (150 كلمة كحد أقصى). إذا خارج الموضوع، ارفض بأدب."
  };

  return `${prompts[language][role]}

${rules[language]}

${context ? `CONTEXTE:\n${context}\n` : ''}
${historyLength > 0 ? `${historyLength} msg précédents` : ''}`;
}

serve(async (req) => {
  const requestStartTime = Date.now();
  const requestId = crypto.randomUUID();
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log(`[${requestId}] 🚀 Chat request started`);

    // Background prewarm if idle >8m
    if (Date.now() - lastWarmAt > 8 * 60 * 1000) {
      lastWarmAt = Date.now();
      console.log(`[${requestId}] 🔥 Prewarming model in background`);
      (async () => {
        try {
          await fetch('https://ai.avs.ma/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'mistral:7b-instruct-q4_K_M',
              messages: [{ role: 'system', content: 'ping' }, { role: 'user', content: 'ok' }],
              stream: false,
              keep_alive: '10m',
              options: { num_predict: 1 }
            })
          });
        } catch (_) {}
      })();
    }
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;

    if (authHeader) {
      try {
        const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
        userId = user?.id || null;
      } catch (authError) {
        console.error(`[${requestId}] ⚠️ Auth error:`, authError);
      }
    }

    const rateLimitKey = userId || req.headers.get('x-forwarded-for') || 'anonymous';
    if (!checkRateLimit(rateLimitKey)) {
      console.warn(`[${requestId}] ⛔ Rate limit exceeded for ${rateLimitKey}`);
      return new Response(
        JSON.stringify({ error: 'Trop de requêtes. Veuillez patienter une minute.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, sessionId, visitorId, language = 'fr', model } = await req.json();
    const sanitizedMessage = sanitizeInput(message);
    console.log(`[${requestId}] 📝 Message length: ${sanitizedMessage.length}, User: ${userId || 'anonymous'}, Language: ${language}`);

    if (!sanitizedMessage) {
      console.error(`[${requestId}] ❌ Invalid message received`);
      return new Response(
        JSON.stringify({ error: 'Message invalide' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Pre-filter off-topic queries
    if (isOffTopicQuery(sanitizedMessage)) {
      console.log(`[${requestId}] 🚫 Off-topic query detected`);
      
      const offTopicResponses = {
        fr: `Désolé, je suis l'assistant AVS.ma et je ne peux répondre qu'aux questions concernant notre plateforme éducative. 📚

Pour toute information sur nos **cours d'IA et Tech**, nos **formations certifiantes**, ou l'**utilisation de la plateforme**, je suis là pour vous aider!

**Puis-je vous renseigner sur:**
- Les formations disponibles
- Le processus d'inscription
- Les fonctionnalités de la plateforme
- Votre progression ou vos cours`,
        en: `Sorry, I am the AVS.ma assistant and can only answer questions about our educational platform. 📚

For any information about our **AI and Tech courses**, our **certification programs**, or **platform usage**, I'm here to help!

**Can I help you with:**
- Available courses
- Enrollment process
- Platform features
- Your progress or courses`,
        ar: `عذرًا، أنا مساعد AVS.ma ولا يمكنني الإجابة إلا على الأسئلة المتعلقة بمنصتنا التعليمية. 📚

لأي معلومات حول **دورات الذكاء الاصطناعي والتقنية**، أو **برامج الشهادات**، أو **استخدام المنصة**، أنا هنا للمساعدة!

**هل يمكنني مساعدتك في:**
- الدورات المتاحة
- عملية التسجيل
- ميزات المنصة
- تقدمك أو دوراتك`
      };
      
      const offTopicResponse = offTopicResponses[language as 'fr' | 'ar' | 'en'] || offTopicResponses.fr;

      // Get or create conversation for saving messages
      let currentConversationId = sessionId;
      if (!currentConversationId) {
        const { data: newConversation } = await supabase
          .from('chatbot_conversations')
          .insert({ user_id: userId })
          .select()
          .single();
        currentConversationId = newConversation?.id;
      }

      // Save both messages
      await supabase.from('chatbot_messages').insert([
        { conversation_id: currentConversationId, role: 'user', content: sanitizedMessage },
        { conversation_id: currentConversationId, role: 'assistant', content: offTopicResponse }
      ]);

      const responseTime = Date.now() - requestStartTime;
      console.log(`[${requestId}] ✅ Off-topic response sent in ${responseTime}ms`);
      
      return new Response(JSON.stringify({ message: offTopicResponse, sessionId: currentConversationId }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const t0 = Date.now();
    const rolePromise = determineUserRole(supabase, userId);
    console.log(`[${requestId}] 🌍 Using language: ${language}`);
    
    let updateActivityPromise: Promise<any> | undefined;
    // Get or create conversation
    let currentConversationId = sessionId;
    if (!currentConversationId) {
      const { data: newConversation } = await supabase
        .from('chatbot_conversations')
        .insert({ user_id: userId })
        .select()
        .single();
      currentConversationId = newConversation?.id;
    } else {
      // Update last activity (background)
      updateActivityPromise = supabase
        .from('chatbot_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentConversationId);
    }
    
    // Fetch history in parallel while resolving role and context
    const historyPromise = supabase
      .from('chatbot_messages')
      .select('role, content')
      .eq('conversation_id', currentConversationId)
      .order('created_at', { ascending: false })
      .limit(4); // Reduce from 6 to 4
    
    const userRole = await rolePromise;
    console.log(`[${requestId}] 👤 User role: ${userRole}`);
    
    const contextPromise = getRelevantContext(supabase, sanitizedMessage, userRole);
    const [{ data: history }, context] = await Promise.all([historyPromise, contextPromise]);
    
    const conversationHistory = (history || []).reverse();
    console.log(`[${requestId}] 📚 History loaded: ${conversationHistory.length} messages`);
    console.log(`[${requestId}] 🔍 Context length: ${context.length} chars`);
    
    const systemPrompt = buildSystemPrompt(userRole, context, conversationHistory.length, language as 'fr' | 'ar' | 'en');
    console.log(`[${requestId}] 📝 System prompt length: ${systemPrompt.length} chars`);

    const persistUserPromise = supabase.from('chatbot_messages').insert({
      conversation_id: currentConversationId,
      role: 'user',
      content: sanitizedMessage
    });
    
    console.log(`[${requestId}] 🤖 Calling Ollama API...`);
    const numPredict = sanitizedMessage.length <= 40 ? 48 : 80; // Aggressive limits for speed
    console.log(`[${requestId}] 🔧 num_predict: ${numPredict}`);
    const selectedModel = model || 'mistral:7b-instruct-q4_K_M'; // Switch to Mistral
    const ollamaStartTime = Date.now();
    console.log(`[${requestId}] ⏱️ Pre-AI overhead: ${ollamaStartTime - requestStartTime}ms`);
    const ollamaResponse = await fetch('https://ai.avs.ma/api/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: sanitizedMessage }
        ],
        stream: true,
        keep_alive: -1, // Never unload model
        stop: ["</s>", "\n\n\n", "Contact:", "support@avs.ma"], // Smart stops
        options: {
          num_predict: numPredict,
          temperature: 0.2, // More deterministic = faster
          top_p: 0.85, // Slightly lower = faster sampling
          top_k: 40, // Add for speed
          repeat_penalty: 1.1, // Prevent loops
          num_ctx: 2048, // Reduce context window from default 4096
          f16_kv: true, // Use FP16 for key/value cache (faster)
          num_thread: 8 // Adjust based on VPS CPU cores
        }
      })
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text().catch(() => 'Unknown error');
      console.error(`[${requestId}] ❌ Ollama gateway error: ${ollamaResponse.status} - ${errorText}`);
      
      // Track error in analytics
      const { error: analyticsError } = await supabase.from('chatbot_analytics').insert({
        conversation_id: currentConversationId,
        event_type: 'error',
        event_data: { 
          error: 'OLLAMA_ERROR',
          status: ollamaResponse.status,
          message: errorText.substring(0, 200)
        }
      });
      if (analyticsError) console.error(`[${requestId}] Failed to log error:`, analyticsError);
      
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

    const ollamaResponseTime = Date.now() - ollamaStartTime;
    console.log(`[${requestId}] ✅ Ollama responded in ${ollamaResponseTime}ms, starting stream...`);

    // Stream response: convert Ollama JSON lines to OpenAI-style SSE
    const reader = ollamaResponse.body?.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let buffer = '';
    let fullResponse = '';
    let firstChunkAt: number | null = null;
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader!.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            
            // Process complete JSON lines
            let newlineIndex;
            while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
              let line = buffer.slice(0, newlineIndex);
              buffer = buffer.slice(newlineIndex + 1);
              
              line = line.trim();
              if (!line) continue;
              
              // Some gateways may prefix with "data:", strip it
              if (line.startsWith('data:')) line = line.slice(5).trim();
              
              try {
                const json = JSON.parse(line);
                
                // Ollama signals completion with done: true
                if (json.done) {
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                  break;
                }
                
                // Extract content from Ollama's format: {message: {content: "..."}}
                const chunk = json.message?.content || '';
                if (chunk) {
                  if (!firstChunkAt) {
                    firstChunkAt = Date.now();
                    console.log(`[${requestId}] ⚡ First token in ${firstChunkAt - requestStartTime}ms`);
                  }
                  fullResponse += chunk;
                  // Convert to OpenAI SSE format
                  const payload = { choices: [{ delta: { content: chunk } }] };
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
                }
              } catch (parseError) {
                // Incomplete JSON, put line back and wait for more data
                buffer = line + '\n' + buffer;
                break;
              }
            }
          }
          
          // Save assistant message
          if (fullResponse && currentConversationId) {
            try {
              await supabase.from('chatbot_messages').insert({
                conversation_id: currentConversationId,
                role: 'assistant',
                content: fullResponse
              });
            } catch (msgError) {
              console.error(`[${requestId}] Failed to save message:`, msgError);
            }
            
            // Track performance metrics
            const totalTime = Date.now() - requestStartTime;
            const firstTokenTime = firstChunkAt ? firstChunkAt - requestStartTime : null;
            console.log(`[${requestId}] ✅ Complete response in ${totalTime}ms (${fullResponse.length} chars)`);
            
            const { error: analyticsError } = await supabase.from('chatbot_analytics').insert({
              conversation_id: currentConversationId,
              event_type: 'response_completed',
              event_data: {
                response_time_ms: totalTime,
                first_token_ms: firstTokenTime,
                response_length: fullResponse.length,
                user_role: userRole
              }
            });
            if (analyticsError) console.error(`[${requestId}] Failed to log analytics:`, analyticsError);

            // Ensure background operations are settled
            await Promise.allSettled([persistUserPromise, updateActivityPromise].filter(Boolean));
          }
          
          controller.close();
        } catch (err) {
          console.error(`[${requestId}] ❌ Stream error:`, err);
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
        'X-Session-Id': currentConversationId || ''
      }
    });

  } catch (error) {
    const errorTime = Date.now() - requestStartTime;
    console.error(`[${requestId}] ❌ Fatal error after ${errorTime}ms:`, error);
    
    // Attempt to log critical error to database
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      await supabase.from('chatbot_analytics').insert({
        event_type: 'critical_error',
        event_data: {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack?.substring(0, 500) : undefined,
          duration_ms: errorTime
        }
      });
    } catch (logError) {
      console.error(`[${requestId}] Failed to log critical error:`, logError);
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Service temporairement indisponible',
        requestId: requestId 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
