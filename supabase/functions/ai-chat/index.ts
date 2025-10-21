import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting: in-memory store (resets on function restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + 60000 }); // 1 minute window
    return true;
  }

  if (userLimit.count >= 10) {
    return false; // Rate limit exceeded (10 requests/minute)
  }

  userLimit.count++;
  return true;
}

function sanitizeInput(text: string): string {
  // Remove HTML tags
  let clean = text.replace(/<[^>]*>/g, '');
  // Limit length
  clean = clean.slice(0, 1000);
  // Trim whitespace
  return clean.trim();
}

async function determineUserRole(
  supabaseClient: any,
  userId: string | null
): Promise<'admin' | 'professor' | 'student' | 'visitor'> {
  if (!userId) {
    return 'visitor';
  }

  try {
    // Check if admin
    const { data: isAdminData, error: adminError } = await supabaseClient
      .rpc('is_admin', { _user_id: userId });
    
    if (!adminError && isAdminData === true) {
      return 'admin';
    }

    // Check if professor
    const { data: isProfData, error: profError } = await supabaseClient
      .rpc('is_professor', { _user_id: userId });
    
    if (!profError && isProfData === true) {
      return 'professor';
    }

    return 'student';
  } catch (error) {
    console.error('Error determining role:', error);
    return 'student'; // Default to most restrictive
  }
}

function buildSystemPrompt(role: 'admin' | 'professor' | 'student' | 'visitor'): string {
  const baseInfo = `Tu es un assistant IA pour AVS Innovation Institute (avs.ma), une plateforme éducative marocaine.`;

  const rolePrompts = {
    visitor: `${baseInfo} Tu aides les visiteurs avec des informations publiques uniquement:
- Les formations proposées (IA & Data Science, Programmation & Infrastructure, Marketing Digital)
- Les certifications disponibles (Harvard, MIT, Stanford, Google, Microsoft, IBM)
- Les conditions d'admission et processus d'inscription
- Les tarifs et facilités de paiement
- Les débouchés professionnels et salaires moyens
- Les informations de contact (email, téléphone, adresse)
- Les horaires et modalités des formations (présentiel, en ligne, soir, weekend)
- Les questions fréquentes (FAQ)

STRICTEMENT INTERDIT de partager:
- Toute information personnelle d'étudiants, professeurs ou administrateurs
- Données de notes, présences ou performances
- Informations financières ou de paiement d'utilisateurs
- Accès aux tableaux de bord ou données privées
- Calendriers personnels ou emplois du temps individuels

Si l'utilisateur demande des informations privées ou sensibles, suggère-lui de se connecter ou de contacter directement l'administration.

Réponds en français de manière accueillante et informative. Encourage les visiteurs à s'inscrire pour accéder à plus de fonctionnalités.`,

    student: `${baseInfo} Tu aides les étudiants avec:
- Informations sur leurs cours et emploi du temps
- Leurs notes et présences personnelles
- Comment contacter les professeurs
- Procédures d'inscription et de paiement
- Navigation sur la plateforme

Tu NE PEUX PAS accéder à:
- Informations d'autres étudiants
- Données financières administratives
- Cours d'autres étudiants

Réponds en français de manière concise et utile. Pour des requêtes de données spécifiques, guide l'utilisateur vers la section appropriée du tableau de bord.`,

    professor: `${baseInfo} Tu aides les professeurs avec:
- Leurs cours assignés et étudiants inscrits
- Suivi des présences et notes
- Procédures de notation
- Création d'annonces et de supports de cours
- Calendrier académique

Tu NE PEUX PAS accéder à:
- Cours et étudiants d'autres professeurs
- Données financières ou administratives

Réponds en français de manière concise. Pour des données détaillées, dirige vers les sections pertinentes du tableau de bord professeur.`,

    admin: `${baseInfo} Tu aides les administrateurs avec:
- Navigation du système CRM
- Gestion des utilisateurs et des cours
- Procédures d'inscription et de paiement
- Fonctionnalités et paramètres du système
- Conseils généraux sur la plateforme

Pour des requêtes spécifiques (ex: "Montre-moi tous les étudiants"), guide l'utilisateur vers la section appropriée du tableau de bord admin plutôt que de récupérer les données directement.

Réponds en français de manière professionnelle et claire.`,
  };

  return rolePrompts[role];
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Get authenticated user (optional for visitors)
    const authHeader = req.headers.get('Authorization');
    let user = null;

    if (authHeader) {
      const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser(
        authHeader.replace('Bearer ', '')
      );

      if (!authError && authUser) {
        user = authUser;
      }
    }

    // Check rate limit for authenticated users
    if (user && !checkRateLimit(user.id)) {
      return new Response(
        JSON.stringify({ error: 'Trop de requêtes. Veuillez patienter une minute.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message invalide' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize input
    const sanitizedMessage = sanitizeInput(message);
    if (!sanitizedMessage) {
      return new Response(
        JSON.stringify({ error: 'Message vide après nettoyage' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine user role
    const userRole = await determineUserRole(supabaseClient, user?.id || null);
    console.log(`User ${user?.id || 'visitor'} role: ${userRole}`);

    // Build system prompt
    const systemPrompt = buildSystemPrompt(userRole);

    // Call Ollama API (running on VPS localhost)
    const OLLAMA_API_URL = 'http://localhost:11434/api/chat';
    const OLLAMA_MODEL = 'mistral';

    let aiResponse: string;
    try {
      const ollamaResponse = await fetch(OLLAMA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: sanitizedMessage },
          ],
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            num_predict: 500, // Max tokens
          },
        }),
      });

      if (!ollamaResponse.ok) {
        throw new Error(`Ollama API error: ${ollamaResponse.status}`);
      }

      const ollamaData = await ollamaResponse.json();
      aiResponse = ollamaData.message?.content || 'Aucune réponse générée';
    } catch (ollamaError) {
      console.error('Ollama error:', ollamaError);
      aiResponse = 'Le chatbot est temporairement indisponible. Veuillez réessayer dans quelques instants.';
    }

    // Log conversation (async, don't block response) - only for authenticated users
    if (user) {
      const responseTime = Date.now() - startTime;
      supabaseClient
        .from('chat_logs')
        .insert({
          user_id: user.id,
          user_role: userRole,
          user_message: sanitizedMessage,
          ai_response: aiResponse,
          metadata: {
            response_time_ms: responseTime,
            model: OLLAMA_MODEL,
          },
        })
        .then(({ error }) => {
          if (error) console.error('Error logging chat:', error);
        });
    }

    // Return response
    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ error: 'Une erreur est survenue. Veuillez réessayer.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
