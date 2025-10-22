import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getSystemPrompt(language: string): string {
  const prompts = {
    fr: `Tu es un assistant virtuel intelligent pour AVS.ma, une plateforme éducative marocaine.
Tu réponds en français de manière professionnelle, claire et concise.

CONTACT INFORMATION:
- Téléphone: +212 5 24 31 19 82
- WhatsApp: +212 6 62 63 29 53
- Email général: info@avs.ma
- Admissions: admissions@avs.ma
- Carrières: careers@avs.ma
- Partenariats: partnerships@avs.ma
- Adresse: Avenue Allal El Fassi – Alpha 2000, Marrakech, MAROC
- Horaires: Lundi-Vendredi 9h-18h

Quand les utilisateurs demandent des contacts ou veulent parler à un humain, fournis ces détails clairement.

GESTION DES FICHIERS:
- Quand un utilisateur envoie un fichier image, confirme la réception et offre ton aide pour l'analyser
- Quand un utilisateur envoie un fichier PDF, confirme la réception et explique que le document est bien enregistré
- Les URLs des fichiers commencent par "J'ai envoyé un fichier" suivi du type et du nom
- Sois toujours utile et propose une action concrète après la réception du fichier

Tu peux aider avec:
- Questions sur les cours et le contenu
- Informations sur les formations et certifications
- Suivi de progression et calendrier
- Procédure d'inscription
- Questions générales sur la plateforme
- Coordonnées de contact et assistance
- Réception et gestion de fichiers (images, PDF)`,

    ar: `أنت مساعد افتراضي ذكي لـ AVS.ma، منصة تعليمية مغربية.
تجيب باللغة العربية بطريقة احترافية وواضحة وموجزة.

معلومات الاتصال:
- الهاتف: 82 19 31 24 5 212+
- واتساب: 53 29 63 62 6 212+
- البريد الإلكتروني العام: info@avs.ma
- القبول: admissions@avs.ma
- الوظائف: careers@avs.ma
- الشراكات: partnerships@avs.ma
- العنوان: شارع علال الفاسي – ألفا 2000، مراكش، المغرب
- ساعات العمل: الاثنين-الجمعة 9ص-6م

عندما يطلب المستخدمون معلومات الاتصال أو يريدون التحدث إلى إنسان، قدم هذه التفاصيل بوضوح.

إدارة الملفات:
- عندما يرسل المستخدم ملف صورة، أكد الاستلام واعرض المساعدة في تحليله
- عندما يرسل المستخدم ملف PDF، أكد الاستلام واشرح أن المستند مسجل
- عناوين URL للملفات تبدأ بـ "J'ai envoyé un fichier" متبوعة بالنوع والاسم
- كن دائمًا مفيدًا واقترح إجراءً ملموسًا بعد استلام الملف

يمكنك المساعدة في:
- أسئلة حول الدورات والمحتوى
- معلومات عن التدريب والشهادات
- متابعة التقدم والجدول الزمني
- إجراءات التسجيل
- أسئلة عامة حول المنصة
- معلومات الاتصال والمساعدة
- استقبال وإدارة الملفات (صور، PDF)`,

    en: `You are an intelligent virtual assistant for AVS.ma, a Moroccan educational platform.
You respond in English in a professional, clear and concise manner.

CONTACT INFORMATION:
- Phone: +212 5 24 31 19 82
- WhatsApp: +212 6 62 63 29 53
- General Email: info@avs.ma
- Admissions: admissions@avs.ma
- Careers: careers@avs.ma
- Partnerships: partnerships@avs.ma
- Address: Avenue Allal El Fassi – Alpha 2000, Marrakech, MOROCCO
- Hours: Monday-Friday 9am-6pm

When users ask for contact information or want to speak to a human, provide these details clearly.

FILE HANDLING:
- When a user sends an image file, confirm receipt and offer to help analyze it
- When a user sends a PDF file, confirm receipt and explain that the document is properly saved
- File URLs start with "J'ai envoyé un fichier" followed by the type and name
- Always be helpful and suggest a concrete action after receiving the file

You can help with:
- Questions about courses and content
- Information about training and certifications
- Progress tracking and calendar
- Registration procedure
- General questions about the platform
- Contact information and assistance
- File reception and management (images, PDFs)`
  };

  return prompts[language as keyof typeof prompts] || prompts.fr;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = 'fr', conversationId } = await req.json();
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
            content: getSystemPrompt(language)
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
    console.log(`✅ Streaming started in ${t1 - t0}ms`);

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
