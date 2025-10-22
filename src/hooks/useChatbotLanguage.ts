import { useState, useEffect } from 'react';

export type SupportedLanguage = 'fr' | 'ar' | 'en';

interface LanguageStrings {
  welcome: string;
  placeholder: string;
  send: string;
  newChat: string;
  quickReplies: {
    courses: string;
    fees: string;
    enroll: string;
    contact: string;
    phone: string;
    whatsapp: string;
    email: string;
  };
}

const translations: Record<SupportedLanguage, LanguageStrings> = {
  fr: {
    welcome: "👋 Bonjour! Comment puis-je vous aider aujourd'hui?",
    placeholder: "Posez votre question...",
    send: "Envoyer",
    newChat: "Nouvelle conversation",
    quickReplies: {
      courses: "📚 Formations disponibles",
      fees: "💰 Frais de scolarité",
      enroll: "📝 Comment s'inscrire",
      contact: "📞 Nous contacter",
      phone: "📞 Appeler",
      whatsapp: "💬 WhatsApp",
      email: "📧 Email"
    }
  },
  ar: {
    welcome: "👋 مرحباً! كيف يمكنني مساعدتك اليوم؟",
    placeholder: "اكتب سؤالك...",
    send: "إرسال",
    newChat: "محادثة جديدة",
    quickReplies: {
      courses: "📚 الدورات المتاحة",
      fees: "💰 الرسوم الدراسية",
      enroll: "📝 كيفية التسجيل",
      contact: "📞 اتصل بنا",
      phone: "📞 اتصال",
      whatsapp: "💬 واتساب",
      email: "📧 البريد الإلكتروني"
    }
  },
  en: {
    welcome: "👋 Hello! How can I help you today?",
    placeholder: "Ask your question...",
    send: "Send",
    newChat: "New conversation",
    quickReplies: {
      courses: "📚 Available courses",
      fees: "💰 Tuition fees",
      enroll: "📝 How to enroll",
      contact: "📞 Contact us",
      phone: "📞 Call",
      whatsapp: "💬 WhatsApp",
      email: "📧 Email"
    }
  }
};

export const useChatbotLanguage = () => {
  const [language, setLanguage] = useState<SupportedLanguage>('fr');

  useEffect(() => {
    // Detect user language from browser or localStorage
    const savedLang = localStorage.getItem('chatbot_language') as SupportedLanguage;
    if (savedLang && ['fr', 'ar', 'en'].includes(savedLang)) {
      setLanguage(savedLang);
      return;
    }

    // Detect from browser
    const browserLang = navigator.language.split('-')[0];
    if (['fr', 'ar', 'en'].includes(browserLang)) {
      setLanguage(browserLang as SupportedLanguage);
    }
  }, []);

  const changeLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
    localStorage.setItem('chatbot_language', lang);
  };

  const t = translations[language];

  return {
    language,
    changeLanguage,
    t,
    supportedLanguages: ['fr', 'ar', 'en'] as SupportedLanguage[]
  };
};
