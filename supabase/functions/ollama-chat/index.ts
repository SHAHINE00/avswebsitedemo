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

function buildSystemPrompt(role: 'admin' | 'professor' | 'student' | 'visitor', context: string, historyLength: number, language: 'fr' | 'ar' | 'en' = 'fr'): string {
  const rolePrompts = {
    fr: {
      admin: "Tu es l'assistant AVS.ma pour administrateurs. Tu aides avec la gestion de la plateforme.",
      professor: "Tu es l'assistant AVS.ma pour professeurs. Tu aides avec la création de cours et gestion étudiants.",
      student: "Tu es l'assistant AVS.ma pour étudiants. Tu aides avec les inscriptions et progression des cours.",
      visitor: "Tu es l'assistant AVS.ma. Tu informes sur les programmes et processus d'inscription."
    },
    en: {
      admin: "You are the AVS.ma assistant for administrators. You help with platform management.",
      professor: "You are the AVS.ma assistant for professors. You help with course creation and student management.",
      student: "You are the AVS.ma assistant for students. You help with enrollment and course progression.",
      visitor: "You are the AVS.ma assistant. You inform about programs and enrollment process."
    },
    ar: {
      admin: "أنت مساعد AVS.ma للمسؤولين. تساعد في إدارة المنصة.",
      professor: "أنت مساعد AVS.ma للأساتذة. تساعد في إنشاء الدورات وإدارة الطلاب.",
      student: "أنت مساعد AVS.ma للطلاب. تساعد في التسجيل وتقدم الدورات.",
      visitor: "أنت مساعد AVS.ma. تقدم معلومات حول البرامج وعملية التسجيل."
    }
  };

  const languageInstructions = {
    fr: "\n\n⚠️ CRITIQUE: Tu dois TOUJOURS répondre en français, même si la question est posée dans une autre langue.",
    en: "\n\n⚠️ CRITICAL: You must ALWAYS respond in English, even if the question is asked in another language.",
    ar: "\n\n⚠️ هام: يجب عليك الرد دائمًا باللغة العربية، حتى لو تم طرح السؤال بلغة أخرى."
  };

  const adminTabsContext = `
📊 ONGLETS DASHBOARD ADMIN (13 au total):
1. **Vue d'ensemble** - Statistiques globales (étudiants, cours, revenus), graphiques de croissance
2. **Étudiants** - CRM complet : segments, communication, timeline, analytics à risque
3. **Professeurs** - Gestion professeurs, spécialisations, assignments aux cours
4. **Cours** - Catalogue, création, modification, visibilité, prix
5. **Classes** - Groupes d'étudiants, horaires, salles, assignments
6. **Utilisateurs** - Rôles, permissions, approbations pending
7. **Documents** - Upload, organisation, partage de supports de cours
8. **Abonnements** - Newsletter subscribers, exports CSV
9. **Rendez-vous** - Calendrier, gestion demandes RDV
10. **Visibilité** - Show/hide sections site web, personnalisation
11. **Sécurité** - RLS policies, audit logs, monitoring
12. **Analytics** - Traffic, engagement, conversion, performance
13. **Système** - Edge functions health, DB monitoring`;

  const studentTabsContext = `
🎓 ONGLETS DASHBOARD ÉTUDIANT (10 au total):
1. **Vue d'ensemble** - Dashboard personnel, stats progression, rappels
2. **Progression** - Pourcentage complétion, modules terminés, analytics
3. **Mes Cours** - Liste cours actifs/terminés, accès contenus, notes
4. **Calendrier** - Sessions à venir, examens, deadlines, synchro Google
5. **Assiduité** - Taux présence, absences justifiées, upload justificatifs
6. **Certificats** - Téléchargement diplômes, codes vérification, partage LinkedIn
7. **Récompenses** - Badges, achievements, XP, leaderboard
8. **Notifications** - Alertes notes, messages profs, rappels, préférences
9. **Profil** - Photo, coordonnées, password, préférences langue
10. **Confidentialité** - Export données RGPD, consentements, suppression compte`;

  const professorWorkflowsContext = `
👨‍🏫 WORKFLOWS PROFESSEUR:
- **Dashboard** : Stats cours, étudiants, assiduité, prochaines sessions
- **Page Cours (/professor/course/{id})** : 
  • Liste étudiants inscrits
  • Marquer présences/absences (onglet Présence)
  • Entrer notes et commentaires (onglet Notes)
  • Publier annonces en masse (onglet Communication)
  • Upload supports de cours (onglet Matériels)
  • Calendrier des sessions, analytics classe
- **Actions communes** :
  • Envoyer emails groupés à tous les étudiants d'un cours
  • Export Excel des notes et assiduité
  • Alertes automatiques étudiants à risque (<75% présence)`;

  const commonTaskWorkflows = {
    admin: `
📋 TÂCHES COURANTES ADMIN:
• **Créer une classe** : Admin → Classes → Nouvelle Classe → Assigner professeur → Ajouter étudiants
• **Envoyer email groupé** : Admin → Étudiants → Communication Center → Sélectionner segment → Composer
• **Voir analytics revenus** : Admin → Étudiants → CRM Analytics → Onglet Revenus
• **Créer un professeur** : Admin → Professeurs → Nouveau Professeur → Remplir infos → Assigner cours
• **Gérer visibilité site** : Admin → Visibilité → Toggle sections homepage`,
    
    professor: `
📋 TÂCHES COURANTES PROFESSEUR:
• **Marquer présences** : Cours → Onglet Présence → Cocher présents/absents → Sauvegarder
• **Entrer notes** : Cours → Onglet Notes → Sélectionner étudiant → Note/Max/Commentaire
• **Envoyer annonce** : Cours → Communication → Rédiger message → Envoyer à tous
• **Upload support** : Cours → Matériels → Upload fichier → Titre/Description → Publier
• **Voir étudiants à risque** : Cours → Analytics → Section "À risque"`,
    
    student: `
📋 TÂCHES COURANTES ÉTUDIANT:
• **Voir ma progression** : Dashboard → Onglet Progression ou cartes Vue d'ensemble
• **Télécharger certificat** : Dashboard → Onglet Certificats → Sélectionner → Télécharger PDF
• **Justifier absence** : Dashboard → Onglet Assiduité → Trouver absence → Upload justificatif
• **M'inscrire à un cours** : Catalogue (/curriculum) → Choisir cours → Bouton S'inscrire
• **Voir mes notes** : Dashboard → Mes Cours → Sélectionner cours → Section Notes`
  };

  const navigationPaths = {
    admin: `
NAVIGATION ADMIN:
- 📊 Dashboard général: /admin (onglet Vue d'ensemble)
- 👥 Gestion étudiants (CRM): /admin (onglet Étudiants)
  • Student CRM Dashboard - Statistiques, segments, à risque
  • Communication Center - Envoyer emails, créer templates
  • Timeline étudiants - Historique complet
  • Actions en masse - Inscription, emails groupés
- 👨‍🏫 Gestion professeurs: /admin (onglet Professeurs)
- 📚 Gestion cours: /admin (onglet Cours)
- 🏫 Classes: /admin (onglet Classes)
- 👤 Utilisateurs: /admin (onglet Utilisateurs)
- 📄 Documents: /admin (onglet Documents)
- 📅 Rendez-vous: /admin (onglet Rendez-vous)
- 📈 Analytics: /admin (onglet Analytics)
- 🔒 Sécurité: /admin (onglet Sécurité)
- 🗂️ Abonnements: /admin (onglet Abonnements)
- 👁️ Visibilité: /admin (onglet Visibilité)
- ⚙️ Système: /admin (onglet Système)
${adminTabsContext}
${commonTaskWorkflows.admin}`,
    
    professor: `
NAVIGATION PROFESSEUR:
- 📚 Dashboard: /professor
- ➕ Créer un cours: Dashboard → Créer un nouveau cours
- 👥 Voir les étudiants: Sélectionner un cours → Onglet Étudiants
- 📝 Gérer les notes: Cours → Onglet Notes
- ✅ Marquer présences: Cours → Onglet Présence
- 📢 Annonces: Cours → Onglet Communication
- 📎 Supports: Cours → Onglet Matériels
${professorWorkflowsContext}
${commonTaskWorkflows.professor}`,
    
    student: `
NAVIGATION ÉTUDIANT:
- 🏠 Mon Dashboard: /student ou /dashboard
- 📚 Mes cours: Dashboard → Onglet "Mes Cours"
- 📊 Ma progression: Dashboard → Onglet "Progression"
- 📅 Mon calendrier: Dashboard → Onglet "Calendrier"
- ✅ Mon assiduité: Dashboard → Onglet "Assiduité"
- 🎓 Mes certificats: Dashboard → Onglet "Certificats"
- 🏆 Mes récompenses: Dashboard → Onglet "Récompenses"
- 🔔 Notifications: Dashboard → Onglet "Notifications"
- 👤 Mon profil: Dashboard → Onglet "Profil"
- 🔒 Confidentialité: Dashboard → Onglet "Confidentialité"
- 🗂️ Catalogue des cours: /curriculum
- ✍️ S'inscrire à un cours: /curriculum → Choisir un cours → Bouton "S'inscrire"
${studentTabsContext}
${commonTaskWorkflows.student}`,
    
    visitor: `
NAVIGATION VISITEUR:
- 📚 Catalogue des formations: /curriculum
- ℹ️ À propos d'AVS.ma: /about
- 📞 Contacter l'école: /contact
- 📅 Prendre rendez-vous: /appointment
- 💬 Témoignages: /testimonials
- 📝 Blog (ressources): /blog
- 🔐 S'inscrire/Se connecter: /auth
- 🎯 Fonctionnalités plateforme: /features
- 👨‍🏫 Nos instructeurs: /instructors
- ❓ FAQ: /faq
- 💼 Carrières: /careers`
  };

  return `${rolePrompts[language][role]}${languageInstructions[language]}

${navigationPaths[role]}

CAPACITÉ DE NAVIGATION:
Quand un utilisateur demande à accéder à une fonctionnalité, guide-le avec:
1. Le chemin exact (ex: "Admin → Étudiants → Communication Center")
2. L'URL si applicable (ex: "/admin puis onglet Étudiants")
3. Des instructions claires étape par étape

EXEMPLES DE NAVIGATION:
- "Comment voir mes cours?" → "Allez sur votre Dashboard étudiant: /student puis onglet 'Mes Cours'"
- "Où créer un professeur?" → "Admin → Professeurs → Nouveau Professeur"
- "Comment envoyer un email aux étudiants?" → "Admin → Étudiants → Communication Center"

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
  const requestStartTime = Date.now();
  const requestId = crypto.randomUUID();
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log(`[${requestId}] 🚀 Chat request started`);
    
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

    const { message, sessionId, visitorId, language = 'fr' } = await req.json();
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
    const userRole = await determineUserRole(supabase, userId);
    console.log(`[${requestId}] 👤 User role: ${userRole}`);
    console.log(`[${requestId}] 🌍 Using language: ${language}`);
    
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
      // Update last activity
      await supabase
        .from('chatbot_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentConversationId);
    }
    
    // Get conversation history (last 10 messages)
    const { data: history } = await supabase
      .from('chatbot_messages')
      .select('role, content')
      .eq('conversation_id', currentConversationId)
      .order('created_at', { ascending: false })
      .limit(10);
    
    const conversationHistory = (history || []).reverse();
    console.log(`[${requestId}] 📚 History loaded: ${conversationHistory.length} messages`);
    
    // Get relevant context from knowledge base
    const context = await getRelevantContext(supabase, sanitizedMessage, userRole);
    console.log(`[${requestId}] 🔍 Context length: ${context.length} chars`);
    
    const systemPrompt = buildSystemPrompt(userRole, context, conversationHistory.length, language as 'fr' | 'ar' | 'en');

    // Save user message
    await supabase.from('chatbot_messages').insert({
      conversation_id: currentConversationId,
      role: 'user',
      content: sanitizedMessage
    });
    
    console.log(`[${requestId}] 🤖 Calling Ollama API...`);
    const ollamaStartTime = Date.now();
    const ollamaResponse = await fetch('https://ai.avs.ma/api/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify({
        model: 'qwen2.5:1.5b',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: sanitizedMessage }
        ],
        stream: true,
        keep_alive: '10m',
        options: {
          num_predict: 160,
          temperature: 0.3,
          top_p: 0.9
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
