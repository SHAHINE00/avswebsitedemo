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

// Cache knowledge base in memory (refresh every 5 minutes)
let knowledgeBaseCache: any[] = [];
let lastKnowledgeCacheTime = 0;
const KNOWLEDGE_CACHE_INTERVAL = 300000; // 5 minutes

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
  const lowerMessage = message.toLowerCase();
  
  // Expanded keywords for common off-topic queries
  const offTopicKeywords = [
    'météo', 'weather', 'temps qu\'il fait',
    'sport', 'football', 'match', 'basketball', 'tennis',
    'recette', 'cuisine', 'recipe', 'cooking', 'restaurant',
    'voyage', 'travel', 'vacances', 'holiday', 'tourisme', 'hotel',
    'actualité', 'news', 'politique', 'politics', 'gouvernement',
    'santé', 'health', 'médecin', 'doctor', 'maladie', 'symptôme',
    'shopping', 'acheter', 'buy', 'produit', 'vendre',
    
    // Entertainment (expanded)
    'film', 'série', 'musique', 'jeu', 'game', 'concert',
    'movie', 'movies', 'action', 'comedy', 'thriller', 'drama',
    'netflix', 'youtube', 'streaming', 'cinéma', 'cinema',
    
    // Literature & Books
    'livre', 'book', 'roman', 'poésie', 'poetry', 'auteur', 'writer',
    
    // General Education (not AVS-specific)
    'histoire', 'history', 'géographie', 'geography', 'biologie', 'biology',
    'chimie', 'chemistry', 'physique', 'physics', 'mathématique', 'math',
    'littérature', 'literature', 'philosophie', 'philosophy',
    
    // Technology (non-educational context)
    'iphone', 'samsung', 'android', 'windows', 'gaming', 'fortnite',
    
    // Social & Personal
    'amour', 'love', 'famille', 'family', 'ami', 'friend', 'relation'
  ];
  
  // Check for explicit off-topic indicators
  const hasOffTopicKeyword = offTopicKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  );
  
  // Stricter AVS.ma education context detection
  const hasEducationContext = /\b(avs\.ma|avs|cours AVS|formation AVS|inscription AVS|plateforme AVS|certificat AVS|mon compte|ma progression|mes notes|prof|professeur|étudiant AVS|examen AVS)\b/i.test(message);
  
  // Length-based heuristic: very short queries (1-2 words) with off-topic keywords should be blocked
  const wordCount = lowerMessage.split(/\s+/).length;
  if (hasOffTopicKeyword && wordCount <= 2) {
    return true; // Block short off-topic queries like "action", "movies", "love"
  }
  
  // If it has off-topic keywords and NO education context, it's off-topic
  return hasOffTopicKeyword && !hasEducationContext;
}

async function loadKnowledgeBaseCache(supabaseClient: any): Promise<void> {
  try {
    const { data, error } = await supabaseClient
      .from('knowledge_base')
      .select('content, category')
      .limit(100);

    if (error) {
      console.error('Error loading knowledge base cache:', error);
      return;
    }

    knowledgeBaseCache = data || [];
    lastKnowledgeCacheTime = Date.now();
    console.log(`📚 Knowledge base cached: ${knowledgeBaseCache.length} entries`);
  } catch (error) {
    console.error('Error loading knowledge base:', error);
  }
}

async function getRoleSpecificData(supabaseClient: any, userId: string | null, userRole: string): Promise<string> {
  try {
    const dataContext: string[] = [];
    
    // Fetch courses data based on role
    if (userRole === 'visitor' || userRole === 'student') {
      // Get all published courses
      const { data: courses, error } = await supabaseClient
        .from('courses')
        .select('title, subtitle, modules, duration, status')
        .eq('status', 'published')
        .order('display_order')
        .limit(10);
      
      if (!error && courses && courses.length > 0) {
        const coursesList = courses.map((c: any) => 
          `- ${c.title}${c.subtitle ? ` (${c.subtitle})` : ''}${c.duration ? ` - Durée: ${c.duration}` : ''}${c.modules ? ` - Modules: ${c.modules}` : ''}`
        ).join('\n');
        dataContext.push(`COURS DISPONIBLES (${courses.length}):\n${coursesList}`);
      }
    }
    
    // If student, get their enrollments
    if (userRole === 'student' && userId) {
      const { data: enrollments } = await supabaseClient
        .from('course_enrollments')
        .select(`
          progress_percentage,
          status,
          enrolled_at,
          courses:course_id (title, subtitle)
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .limit(5);
      
      if (enrollments && enrollments.length > 0) {
        const enrollmentsList = enrollments.map((e: any) => 
          `- ${e.courses?.title || 'Cours'} (Progrès: ${e.progress_percentage || 0}%)`
        ).join('\n');
        dataContext.push(`VOS COURS INSCRITS (${enrollments.length}):\n${enrollmentsList}`);
      }
      
      // Get recent grades
      const { data: grades } = await supabaseClient
        .from('grades')
        .select(`
          grade,
          max_grade,
          assignment_name,
          graded_at,
          courses:course_id (title)
        `)
        .eq('student_id', userId)
        .order('graded_at', { ascending: false })
        .limit(3);
      
      if (grades && grades.length > 0) {
        const gradesList = grades.map((g: any) => 
          `- ${g.assignment_name}: ${g.grade}/${g.max_grade} (${g.courses?.title || 'Cours'})`
        ).join('\n');
        dataContext.push(`VOS NOTES RÉCENTES:\n${gradesList}`);
      }
    }
    
    // If professor, get their courses
    if (userRole === 'professor' && userId) {
      const { data: profId } = await supabaseClient.rpc('get_professor_id', { _user_id: userId });
      
      if (profId) {
        const { data: teachingAssignments } = await supabaseClient
          .from('teaching_assignments')
          .select(`
            courses:course_id (title, subtitle),
            course_classes (class_name, current_students, max_students)
          `)
          .eq('professor_id', profId)
          .limit(5);
        
        if (teachingAssignments && teachingAssignments.length > 0) {
          const coursesList = teachingAssignments.map((ta: any) => 
            `- ${ta.courses?.title || 'Cours'}${ta.course_classes ? ` (Classe: ${ta.course_classes.class_name}, ${ta.course_classes.current_students}/${ta.course_classes.max_students} étudiants)` : ''}`
          ).join('\n');
          dataContext.push(`VOS COURS ENSEIGNÉS (${teachingAssignments.length}):\n${coursesList}`);
        }
      }
    }
    
    // If admin, get platform statistics
    if (userRole === 'admin') {
      const [coursesCount, studentsCount, professorsCount] = await Promise.all([
        supabaseClient.from('courses').select('id', { count: 'exact', head: true }),
        supabaseClient.from('user_roles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
        supabaseClient.from('professors').select('id', { count: 'exact', head: true })
      ]);
      
      const stats = [
        `- Cours: ${coursesCount.count || 0}`,
        `- Étudiants: ${studentsCount.count || 0}`,
        `- Professeurs: ${professorsCount.count || 0}`
      ].join('\n');
      dataContext.push(`STATISTIQUES PLATEFORME:\n${stats}`);
      
      // Get all courses for admin
      const { data: allCourses } = await supabaseClient
        .from('courses')
        .select('title, subtitle, status')
        .order('display_order')
        .limit(10);
      
      if (allCourses && allCourses.length > 0) {
        const coursesList = allCourses.map((c: any) => 
          `- ${c.title}${c.subtitle ? ` (${c.subtitle})` : ''} [${c.status}]`
        ).join('\n');
        dataContext.push(`TOUS LES COURS (${allCourses.length}):\n${coursesList}`);
      }
    }
    
    return dataContext.join('\n\n').substring(0, 1500);
  } catch (error) {
    console.error('Error fetching role-specific data:', error);
    return "";
  }
}

async function getRelevantContext(supabaseClient: any, userMessage: string, userRole: string): Promise<string> {
  try {
    // Refresh cache if needed
    if (Date.now() - lastKnowledgeCacheTime > KNOWLEDGE_CACHE_INTERVAL || knowledgeBaseCache.length === 0) {
      await loadKnowledgeBaseCache(supabaseClient);
    }

    const keywords = extractKeywords(userMessage).slice(0, 5);
    if (keywords.length === 0) return "";

    // Search in cached data
    const relevantItems = knowledgeBaseCache
      .filter((item: any) => 
        keywords.some(k => item.content.toLowerCase().includes(k.toLowerCase()))
      )
      .slice(0, 1);

    if (relevantItems.length === 0) return "";

    return relevantItems.map((item: any) => 
      `[${item.category}] ${item.content}`
    ).join('\n\n').substring(0, 400);
  } catch (error) {
    console.error('Error in getRelevantContext:', error);
    return "";
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
      admin: "Je suis AVS AI Assistant, votre guide virtuel officiel pour avs.ma. Ma mission est de vous aider à gérer la plateforme : utilisateurs, professeurs, cours, analytics, CRM, et toutes les fonctionnalités du site. Je connais tout le contenu du site et peux vous guider dans la navigation. Si je ne connais pas la réponse, je vous indiquerai poliment où trouver de l'aide sur avs.ma.",
      professor: "Je suis AVS AI Assistant, votre guide virtuel officiel pour avs.ma. Ma mission est de vous aider avec la création de cours, la gestion des étudiants, les présences, les notes, les annonces, les supports pédagogiques et toutes les fonctionnalités disponibles. Je connais tout le contenu du site et peux vous guider. Si je ne connais pas la réponse, je vous indiquerai poliment où trouver de l'aide sur avs.ma.",
      student: "Je suis AVS AI Assistant, votre guide virtuel officiel pour avs.ma. Ma mission est de vous aider avec vos inscriptions, votre progression, vos cours, vos notes, les notifications et toutes les fonctionnalités du site. Je connais tout le contenu du site et peux vous guider dans la navigation. Si je ne connais pas la réponse, je vous indiquerai poliment où trouver de l'aide sur avs.ma.",
      visitor: "Je suis AVS AI Assistant, votre guide virtuel officiel pour avs.ma. Ma mission est de vous aider à découvrir les formations disponibles, le processus d'inscription, et toutes les informations sur le site. Je connais tout le contenu du site et peux vous guider. Si je ne connais pas la réponse, je vous indiquerai poliment où trouver de l'aide sur avs.ma."
    },
    en: {
      admin: "I am AVS AI Assistant, your official virtual guide for avs.ma. My mission is to help you manage the platform: users, professors, courses, analytics, CRM, and all website features. I know all website content and can guide you through navigation. If I don't know an answer, I'll politely suggest where to find help on avs.ma.",
      professor: "I am AVS AI Assistant, your official virtual guide for avs.ma. My mission is to help you with course creation, student management, attendance, grades, announcements, materials, and all available features. I know all website content and can guide you. If I don't know an answer, I'll politely suggest where to find help on avs.ma.",
      student: "I am AVS AI Assistant, your official virtual guide for avs.ma. My mission is to help you with enrollment, progress tracking, courses, grades, notifications, and all website features. I know all website content and can guide you through navigation. If I don't know an answer, I'll politely suggest where to find help on avs.ma.",
      visitor: "I am AVS AI Assistant, your official virtual guide for avs.ma. My mission is to help you discover available programs, the enrollment process, and all information on the website. I know all website content and can guide you. If I don't know an answer, I'll politely suggest where to find help on avs.ma."
    },
    ar: {
      admin: "أنا AVS AI Assistant، مرشدك الافتراضي الرسمي لموقع avs.ma. مهمتي مساعدتك في إدارة المنصة: المستخدمين، الأساتذة، الدورات، التحليلات، نظام CRM، وجميع ميزات الموقع. أعرف كل محتوى الموقع ويمكنني إرشادك. إذا لم أعرف الإجابة، سأوجهك بأدب إلى مكان العثور على المساعدة على avs.ma.",
      professor: "أنا AVS AI Assistant، مرشدك الافتراضي الرسمي لموقع avs.ma. مهمتي مساعدتك في إنشاء الدورات، إدارة الطلاب، الحضور، الدرجات، الإعلانات، المواد التعليمية وجميع الميزات المتاحة. أعرف كل محتوى الموقع ويمكنني إرشادك. إذا لم أعرف الإجابة، سأوجهك بأدب إلى مكان العثور على المساعدة على avs.ma.",
      student: "أنا AVS AI Assistant، مرشدك الافتراضي الرسمي لموقع avs.ma. مهمتي مساعدتك في التسجيل، تتبع التقدم، الدورات، الدرجات، الإشعارات وجميع ميزات الموقع. أعرف كل محتوى الموقع ويمكنني إرشادك. إذا لم أعرف الإجابة، سأوجهك بأدب إلى مكان العثور على المساعدة على avs.ma.",
      visitor: "أنا AVS AI Assistant، مرشدك الافتراضي الرسمي لموقع avs.ma. مهمتي مساعدتك في اكتشاف البرامج المتاحة، عملية التسجيل، وجميع المعلومات على الموقع. أعرف كل محتوى الموقع ويمكنني إرشادك. إذا لم أعرف الإجابة، سأوجهك بأدب إلى مكان العثور على المساعدة على avs.ma."
    }
  };

  const strictRules = {
    fr: `\n\nRÈGLES STRICTES:\n- UNIQUEMENT répondre aux questions sur AVS.ma (plateforme, cours, inscriptions, fonctionnalités)\n- Si la question n'est PAS liée à AVS.ma → Refuser poliment: "Désolé, je ne peux répondre qu'aux questions concernant la plateforme AVS.ma. Comment puis-je vous aider avec AVS.ma ?"\n- Exemples de questions hors-sujet à REFUSER: films, météo, sports, cuisine, voyages, culture générale, histoire générale, littérature générale\n- Ne JAMAIS répondre aux questions de culture générale ou divertissement\n- Réponds en 1-2 phrases maximum (50 mots)`,
    en: `\n\nSTRICT RULES:\n- ONLY answer questions about AVS.ma (platform, courses, enrollment, features)\n- If question is NOT related to AVS.ma → Politely refuse: "Sorry, I can only answer questions about the AVS.ma platform. How can I help you with AVS.ma?"\n- Examples of off-topic questions to REFUSE: movies, weather, sports, cooking, travel, general knowledge, general history, general literature\n- NEVER answer general knowledge or entertainment questions\n- Answer in 1-2 sentences max (50 words)`,
    ar: `\n\nقواعد صارمة:\n- أجب فقط على الأسئلة حول AVS.ma (المنصة، الدورات، التسجيل، الميزات)\n- إذا كان السؤال غير متعلق بـ AVS.ma → ارفض بأدب: "عذرًا، يمكنني فقط الإجابة على الأسئلة المتعلقة بمنصة AVS.ma. كيف يمكنني مساعدتك مع AVS.ma؟"\n- أمثلة على الأسئلة خارج الموضوع التي يجب رفضها: أفلام، طقس، رياضة، طبخ، سفر، معرفة عامة، تاريخ عام، أدب عام\n- لا ترد أبدًا على أسئلة المعرفة العامة أو الترفيه\n- أجب في 1-2 جمل كحد أقصى (50 كلمة)`
  };

  const rules = {
    fr: "Réponds en 1-2 phrases simples et directes. Concentre-toi sur la question actuelle (ignore l'historique sauf mention). Pas d'explications inutiles. Maximum 50 mots. Résous le problème rapidement. Questions avs.ma uniquement (fonctionnalités, navigation, support).",
    en: "Answer in 1-2 simple, direct sentences. Focus on current question (ignore history unless mentioned). No unnecessary explanations. Max 50 words. Solve the issue quickly. Only avs.ma questions (features, navigation, support).",
    ar: "أجب في 1-2 جمل بسيطة ومباشرة. ركز على السؤال الحالي (تجاهل التاريخ ما لم يُذكر). لا توضيحات غير ضرورية. 50 كلمة كحد أقصى. حل المشكلة بسرعة. أسئلة avs.ma فقط (الميزات، التنقل، الدعم)."
  };

  return `${prompts[language][role]}${strictRules[language]}

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

    // Background prewarm if idle >5m
    if (Date.now() - lastWarmAt > 5 * 60 * 1000) {
      lastWarmAt = Date.now();
      console.log(`[${requestId}] 🔥 Prewarming model in background`);
      (async () => {
        try {
          await fetch('https://ai.avs.ma/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'qwen2.5:1.5b',
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

    const { message, sessionId, visitorId, language = 'fr', model, history = [], userRole: clientRole } = await req.json();
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
    
    // Use history from frontend (already in memory) - limit to last 1 message for speed
    const conversationHistory = history.slice(-1).map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }));
    console.log(`[${requestId}] 📚 History from frontend: ${conversationHistory.length} messages`);

    // Use role from frontend if provided, otherwise determine it
    let userRole: 'admin' | 'professor' | 'student' | 'visitor';
    if (clientRole && ['admin', 'professor', 'student', 'visitor'].includes(clientRole)) {
      userRole = clientRole;
      console.log(`[${requestId}] 👤 User role from frontend: ${userRole}`);
    } else {
      userRole = await determineUserRole(supabase, userId);
      console.log(`[${requestId}] 👤 User role from DB: ${userRole}`);
    }
    
    // Fetch role-specific data (courses, enrollments, grades, etc.)
    const roleData = await getRoleSpecificData(supabase, userId, userRole);
    console.log(`[${requestId}] 📊 Role-specific data length: ${roleData.length} chars`);
    
    // Get knowledge base context
    const context = await getRelevantContext(supabase, sanitizedMessage, userRole);
    console.log(`[${requestId}] 🔍 Knowledge context length: ${context.length} chars`);
    
    // Combine both contexts
    const fullContext = [roleData, context].filter(Boolean).join('\n\n');
    
    const systemPrompt = buildSystemPrompt(userRole, fullContext, conversationHistory.length, language as 'fr' | 'ar' | 'en');
    console.log(`[${requestId}] 📝 System prompt length: ${systemPrompt.length} chars`);

    const persistUserPromise = supabase.from('chatbot_messages').insert({
      conversation_id: currentConversationId,
      role: 'user',
      content: sanitizedMessage
    });
    
    console.log(`[${requestId}] 🤖 Calling Ollama API...`);
    const numPredict = 25; // Aggressive speed optimization: 1-2 sentences max
    console.log(`[${requestId}] 🔧 num_predict: ${numPredict}`);
    const selectedModel = model || 'qwen2.5:1.5b'; // CPU-optimized model
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
          temperature: 0.1, // Very deterministic for maximum speed
          top_p: 0.85, // Slightly lower = faster sampling
          top_k: 20, // Reduced for faster sampling
          mirostat: 2, // Faster convergence
          repeat_penalty: 1.1, // Prevent loops
          num_ctx: 1024, // Aggressive context reduction for speed
          f16_kv: true, // Use FP16 for key/value cache (faster)
          num_thread: 4 // CPU-safe for typical VPS (2-4 cores)
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
            
            // Alert admin if response is too slow (>8s total or >6s for first token)
            const isSlowResponse = totalTime > 8000 || (firstTokenTime && firstTokenTime > 6000);
            
            if (isSlowResponse) {
              console.warn(`[${requestId}] ⚠️ SLOW RESPONSE DETECTED: ${totalTime}ms total, ${firstTokenTime}ms first token`);
              
              // Create admin notification for slow performance
              await supabase.from('chatbot_analytics').insert({
                conversation_id: currentConversationId,
                event_type: 'performance_alert',
                event_data: {
                  alert_type: 'slow_response',
                  response_time_ms: totalTime,
                  first_token_ms: firstTokenTime,
                  threshold_exceeded: totalTime > 8000 ? 'total_time' : 'first_token',
                  message: `Chatbot response took ${totalTime}ms. Consider increasing server resources.`,
                  user_role: userRole
                }
              }).then(({ error }) => {
                if (error) console.error(`[${requestId}] Failed to create performance alert:`, error);
              });
            }
            
            const { error: analyticsError } = await supabase.from('chatbot_analytics').insert({
              conversation_id: currentConversationId,
              event_type: 'response_completed',
              event_data: {
                response_time_ms: totalTime,
                first_token_ms: firstTokenTime,
                response_length: fullResponse.length,
                user_role: userRole,
                is_slow: isSlowResponse
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
