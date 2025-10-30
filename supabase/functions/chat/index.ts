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

// Cache knowledge base in memory (refresh every 5 minutes)
let knowledgeBaseCache: any[] = [];
let lastKnowledgeCacheTime = 0;
const KNOWLEDGE_CACHE_INTERVAL = 300000; // 5 minutes

// Cache role-specific data (refresh every 60 seconds)
let roleDataCache = new Map<string, { data: string; timestamp: number }>();
const ROLE_CACHE_INTERVAL = 60000; // 60 seconds

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
  
  const offTopicKeywords = [
    'météo', 'weather', 'temps qu\'il fait',
    'sport', 'football', 'match', 'basketball', 'tennis',
    'recette', 'cuisine', 'recipe', 'cooking', 'restaurant',
    'voyage', 'travel', 'vacances', 'holiday', 'tourisme', 'hotel',
    'actualité', 'news', 'politique', 'politics', 'gouvernement',
    'santé', 'health', 'médecin', 'doctor', 'maladie', 'symptôme',
    'shopping', 'acheter', 'buy', 'produit', 'vendre',
    'film', 'série', 'musique', 'jeu', 'game', 'concert',
    'movie', 'movies', 'action', 'comedy', 'thriller', 'drama',
    'netflix', 'youtube', 'streaming', 'cinéma', 'cinema',
    'livre', 'book', 'roman', 'poésie', 'poetry', 'auteur', 'writer',
    'iphone', 'samsung', 'android', 'windows', 'gaming', 'fortnite',
    'amour', 'love', 'famille', 'family', 'ami', 'friend', 'relation'
  ];
  
  const hasOffTopicKeyword = offTopicKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  );
  
  const hasEducationContext = /\b(avs\.ma|avs|cours AVS|formation AVS|inscription AVS|plateforme AVS|certificat AVS|mon compte|ma progression|mes notes|prof|professeur|étudiant AVS|examen AVS)\b/i.test(message);
  
  const wordCount = lowerMessage.split(/\s+/).length;
  if (hasOffTopicKeyword && wordCount <= 2) {
    return true;
  }
  
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

async function getRoleSpecificData(supabaseClient: any, userId: string | null, userRole: string, language: 'fr' | 'ar' | 'en' = 'fr'): Promise<string> {
  try {
    // Check cache first
    const cacheKey = `${userId || 'visitor'}_${userRole}_${language}`;
    const cached = roleDataCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < ROLE_CACHE_INTERVAL) {
      return cached.data;
    }
    
    const dataContext: string[] = [];
    
    if (userRole === 'visitor' || userRole === 'student') {
      const { data: courses, error } = await supabaseClient
        .from('courses')
        .select('title, subtitle, modules, duration, status')
        .eq('status', 'published')
        .order('display_order')
        .limit(5);
      
      if (!error && courses && courses.length > 0) {
        const labels = {
          fr: { header: 'COURS DISPONIBLES', duration: 'Durée', modules: 'Modules' },
          en: { header: 'AVAILABLE COURSES', duration: 'Duration', modules: 'Modules' },
          ar: { header: 'الدورات المتاحة', duration: 'المدة', modules: 'الوحدات' }
        };
        const l = labels[language];
        
        const coursesList = courses.map((c: any) => {
          const parts = [`• ${c.title}`];
          if (c.subtitle) parts.push(c.subtitle);
          if (c.duration) parts.push(`${l.duration}: ${c.duration}`);
          if (c.modules) parts.push(`${l.modules}: ${c.modules}`);
          return parts.join(' - ');
        }).join('\n');
        dataContext.push(`${l.header} (${courses.length}):\n${coursesList}`);
      }
    }
    
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
        const labels = {
          fr: { header: 'VOS COURS INSCRITS', progress: 'Progrès' },
          en: { header: 'YOUR ENROLLED COURSES', progress: 'Progress' },
          ar: { header: 'دوراتك المسجلة', progress: 'التقدم' }
        };
        const l = labels[language];
        
        const enrollmentsList = enrollments.map((e: any) => 
          `• ${e.courses?.title || 'Cours'} (${l.progress}: ${e.progress_percentage || 0}%)`
        ).join('\n');
        dataContext.push(`${l.header} (${enrollments.length}):\n${enrollmentsList}`);
      }
      
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
        const labels = {
          fr: 'VOS NOTES RÉCENTES',
          en: 'YOUR RECENT GRADES',
          ar: 'درجاتك الأخيرة'
        };
        
        const gradesList = grades.map((g: any) => 
          `• ${g.assignment_name}: ${g.grade}/${g.max_grade} (${g.courses?.title || 'Cours'})`
        ).join('\n');
        dataContext.push(`${labels[language]}:\n${gradesList}`);
      }
    }
    
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
          const labels = {
            fr: { header: 'VOS COURS ENSEIGNÉS', class: 'Classe', students: 'étudiants' },
            en: { header: 'YOUR TEACHING COURSES', class: 'Class', students: 'students' },
            ar: { header: 'دوراتك التدريسية', class: 'الصف', students: 'طلاب' }
          };
          const l = labels[language];
          
          const coursesList = teachingAssignments.map((ta: any) => {
            const parts = [`• ${ta.courses?.title || 'Cours'}`];
            if (ta.course_classes) {
              parts.push(`(${l.class}: ${ta.course_classes.class_name}, ${ta.course_classes.current_students}/${ta.course_classes.max_students} ${l.students})`);
            }
            return parts.join(' ');
          }).join('\n');
          dataContext.push(`${l.header} (${teachingAssignments.length}):\n${coursesList}`);
        }
      }
    }
    
    if (userRole === 'admin') {
      const [coursesCount, studentsCount, professorsCount] = await Promise.all([
        supabaseClient.from('courses').select('*', { count: 'exact', head: true }),
        supabaseClient.from('user_roles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
        supabaseClient.from('professors').select('*', { count: 'exact', head: true })
      ]);
      
      const labels = {
        fr: { header: 'STATISTIQUES PLATEFORME', courses: 'Cours', students: 'Étudiants', professors: 'Professeurs', allCourses: 'TOUS LES COURS' },
        en: { header: 'PLATFORM STATISTICS', courses: 'Courses', students: 'Students', professors: 'Professors', allCourses: 'ALL COURSES' },
        ar: { header: 'إحصائيات المنصة', courses: 'الدورات', students: 'الطلاب', professors: 'الأساتذة', allCourses: 'جميع الدورات' }
      };
      const l = labels[language];
      
      const stats = [
        `• ${l.courses}: ${coursesCount.count || 0}`,
        `• ${l.students}: ${studentsCount.count || 0}`,
        `• ${l.professors}: ${professorsCount.count || 0}`
      ].join('\n');
      dataContext.push(`${l.header}:\n${stats}`);
      
      const { data: allCourses } = await supabaseClient
        .from('courses')
        .select('title, subtitle, status')
        .order('display_order')
        .limit(5);
      
      if (allCourses && allCourses.length > 0) {
        const coursesList = allCourses.map((c: any) => 
          `• ${c.title}${c.subtitle ? ` (${c.subtitle})` : ''} [${c.status}]`
        ).join('\n');
        dataContext.push(`${l.allCourses} (${allCourses.length}):\n${coursesList}`);
      }
    }
    
    const result = dataContext.join('\n\n').substring(0, 1200);
    
    // Cache the result
    roleDataCache.set(cacheKey, { data: result, timestamp: Date.now() });
    
    return result;
  } catch (error) {
    console.error('Error fetching role-specific data:', error);
    return "";
  }
}

function isSimpleQuery(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  const simplePatterns = [
    /^(bonjour|salut|hello|hi|hey|مرحبا)/,
    /^(comment ça va|ça va|how are you)/,
    /^(merci|thanks|thank you|شكرا)/,
    /^(au revoir|bye|goodbye|مع السلامة)/,
    /^(oui|non|yes|no|نعم|لا)$/,
    /^(ok|okay|d'accord)$/
  ];
  
  return simplePatterns.some(pattern => pattern.test(lowerMessage)) || 
         message.split(/\s+/).length <= 3;
}

async function getRelevantContext(supabaseClient: any, userMessage: string): Promise<string> {
  try {
    // Skip knowledge base for simple queries
    if (isSimpleQuery(userMessage)) {
      return "";
    }
    
    if (Date.now() - lastKnowledgeCacheTime > KNOWLEDGE_CACHE_INTERVAL || knowledgeBaseCache.length === 0) {
      await loadKnowledgeBaseCache(supabaseClient);
    }

    const keywords = extractKeywords(userMessage).slice(0, 3);
    if (keywords.length === 0) return "";

    const relevantItems = knowledgeBaseCache
      .filter((item: any) => 
        keywords.some(k => item.content.toLowerCase().includes(k.toLowerCase()))
      )
      .slice(0, 1);

    if (relevantItems.length === 0) return "";

    return relevantItems.map((item: any) => 
      `[${item.category}] ${item.content}`
    ).join('\n\n').substring(0, 300);
  } catch (error) {
    console.error('Error in getRelevantContext:', error);
    return "";
  }
}

async function determineUserRole(supabaseClient: any, userId: string | null): Promise<'admin' | 'professor' | 'student' | 'visitor'> {
  if (!userId) return 'visitor';
  
  try {
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

function getSystemPrompt(role: 'admin' | 'professor' | 'student' | 'visitor', context: string, language: 'fr' | 'ar' | 'en' = 'fr'): string {
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
    fr: `\n\nRÈGLES STRICTES:\n- UNIQUEMENT répondre aux questions sur AVS.ma (plateforme, cours, inscriptions, fonctionnalités)\n- Si la question n'est PAS liée à AVS.ma → Refuser poliment: "Désolé, je ne peux répondre qu'aux questions concernant la plateforme AVS.ma. Comment puis-je vous aider avec AVS.ma ?"\n- Exemples de questions hors-sujet à REFUSER: films, météo, sports, cuisine, voyages, culture générale, histoire générale, littérature générale\n- Ne JAMAIS répondre aux questions de culture générale ou divertissement\n- Réponds en 1-2 phrases maximum (50 mots)\n- FORMATAGE: Utilise des bullet points (•) pour les listes, des lignes vides entre sections, et du gras (**texte**) pour les titres`,
    en: `\n\nSTRICT RULES:\n- ONLY answer questions about AVS.ma (platform, courses, enrollment, features)\n- If question is NOT related to AVS.ma → Politely refuse: "Sorry, I can only answer questions about the AVS.ma platform. How can I help you with AVS.ma?"\n- Examples of off-topic questions to REFUSE: movies, weather, sports, cooking, travel, general knowledge, general history, general literature\n- NEVER answer general knowledge or entertainment questions\n- Answer in 1-2 sentences max (50 words)\n- FORMATTING: Use bullet points (•) for lists, blank lines between sections, and bold (**text**) for headers`,
    ar: `\n\nقواعد صارمة:\n- أجب فقط على الأسئلة حول AVS.ma (المنصة، الدورات، التسجيل، الميزات)\n- إذا كان السؤال غير متعلق بـ AVS.ma → ارفض بأدب: "عذرًا، يمكنني فقط الإجابة على الأسئلة المتعلقة بمنصة AVS.ma. كيف يمكنني مساعدتك مع AVS.ma؟"\n- أمثلة على الأسئلة خارج الموضوع التي يجب رفضها: أفلام، طقس، رياضة، طبخ، سفر، معرفة عامة، تاريخ عام، أدب عام\n- لا ترد أبدًا على أسئلة المعرفة العامة أو الترفيه\n- أجب في 1-2 جمل كحد أقصى (50 كلمة)\n- التنسيق: استخدم النقاط (•) للقوائم، أسطر فارغة بين الأقسام، والنص الغامق (**نص**) للعناوين`
  };

  const contactInfo = {
    fr: `\n\nCONTACT INFORMATION:\n- Téléphone: +212 5 24 31 19 82\n- WhatsApp: +212 6 62 63 29 53\n- Email général: info@avs.ma\n- Admissions: admissions@avs.ma\n- Carrières: careers@avs.ma\n- Partenariats: partnerships@avs.ma\n- Adresse: Avenue Allal El Fassi – Alpha 2000, Marrakech, MAROC\n- Horaires: Lundi-Vendredi 9h-18h\n\nQuand les utilisateurs demandent des contacts ou veulent parler à un humain, fournis ces détails clairement.`,
    en: `\n\nCONTACT INFORMATION:\n- Phone: +212 5 24 31 19 82\n- WhatsApp: +212 6 62 63 29 53\n- General Email: info@avs.ma\n- Admissions: admissions@avs.ma\n- Careers: careers@avs.ma\n- Partnerships: partnerships@avs.ma\n- Address: Avenue Allal El Fassi – Alpha 2000, Marrakech, MOROCCO\n- Hours: Monday-Friday 9am-6pm\n\nWhen users ask for contact information or want to speak to a human, provide these details clearly.`,
    ar: `\n\nمعلومات الاتصال:\n- الهاتف: 82 19 31 24 5 212+\n- واتساب: 53 29 63 62 6 212+\n- البريد الإلكتروني العام: info@avs.ma\n- القبول: admissions@avs.ma\n- الوظائف: careers@avs.ma\n- الشراكات: partnerships@avs.ma\n- العنوان: شارع علال الفاسي – ألفا 2000، مراكش، المغرب\n- ساعات العمل: الاثنين-الجمعة 9ص-6م\n\nعندما يطلب المستخدمون معلومات الاتصال أو يريدون التحدث إلى إنسان، قدم هذه التفاصيل بوضوح.`
  };

  return `${prompts[language][role]}${strictRules[language]}${contactInfo[language]}

${context ? `CONTEXTE:\n${context}\n` : ''}`;
}

serve(async (req) => {
  const requestStartTime = Date.now();
  const requestId = crypto.randomUUID();
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log(`[${requestId}] 🚀 Lovable AI chat request started`);
    
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
        JSON.stringify({ error: 'RATE_LIMIT', message: 'Trop de requêtes. Veuillez réessayer dans quelques instants.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { messages, language = 'fr', conversationId, userRole: clientRole } = await req.json();
    
    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const sanitizedMessage = sanitizeInput(lastUserMessage);
    console.log(`[${requestId}] 📝 Message length: ${sanitizedMessage.length}, User: ${userId || 'anonymous'}, Language: ${language}`);

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
      
      return new Response(JSON.stringify({ message: offTopicResponse, sessionId: conversationId }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Determine user role
    const userRole = clientRole || await determineUserRole(supabase, userId);
    console.log(`[${requestId}] 👤 User role: ${userRole}`);

    // Get context in parallel
    const [roleData, knowledgeContext] = await Promise.all([
      getRoleSpecificData(supabase, userId, userRole, language as 'fr' | 'ar' | 'en'),
      getRelevantContext(supabase, sanitizedMessage)
    ]);

    const contextString = [roleData, knowledgeContext].filter(Boolean).join('\n\n');
    const systemPrompt = getSystemPrompt(userRole, contextString, language as 'fr' | 'ar' | 'en');

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Service configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const t0 = Date.now();

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`AI gateway error: ${response.status} - ${errorText}`);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'RATE_LIMIT', message: 'Trop de requêtes. Veuillez réessayer dans quelques instants.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
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

    const t1 = Date.now();
    console.log(`[${requestId}] ✅ Lovable AI streaming started in ${t1 - t0}ms`);

    // Track analytics in background
    if (conversationId) {
      supabase.from('chatbot_analytics').insert({
        conversation_id: conversationId,
        user_id: userId,
        event_type: 'response_received',
        event_data: {
          provider: 'lovable',
          response_time_ms: t1 - requestStartTime,
          user_role: userRole
        }
      }).then(() => {}).catch(() => {});
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ error: 'Service temporairement indisponible' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
