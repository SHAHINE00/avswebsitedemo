import { useState, useEffect } from 'react';

export type SupportedLanguage = 'fr' | 'ar' | 'en';

interface LanguageStrings {
  welcome: string;
  welcomeStudent: string;
  welcomeProfessor: string;
  welcomeAdmin: string;
  placeholder: string;
  send: string;
  newChat: string;
  uploadingFile: string;
  quickReplies: {
    courses: string;
    fees: string;
    enroll: string;
    contact: string;
    phone: string;
    whatsapp: string;
    email: string;
    studentSchedule: string;
    studentGrades: string;
    studentResources: string;
    studentContact: string;
    studentAgent: string;
    profClasses: string;
    profEvaluation: string;
    profStats: string;
    profResources: string;
    profSupport: string;
    adminUsers: string;
    adminDashboard: string;
    adminSettings: string;
    adminReports: string;
    adminAssistance: string;
  };
  quickActionButtons: {
    catalogue: string;
    about: string;
    appointment: string;
    contact: string;
    dashboard: string;
    myProgress: string;
    myCertificates: string;
    myAttendance: string;
    profDashboard: string;
    myCourses: string;
    announcements: string;
    grades: string;
    attendance: string;
    overview: string;
    crmStudents: string;
    communication: string;
    manageCourses: string;
    analytics: string;
  };
}

const translations: Record<SupportedLanguage, LanguageStrings> = {
  fr: {
    welcome: "👋 Bonjour! Comment puis-je vous aider aujourd'hui?",
    welcomeStudent: "👋 Bonjour Étudiant ! Je peux vous aider avec vos cours, notes, emploi du temps et toute question concernant votre parcours académique.",
    welcomeProfessor: "👋 Bonjour Professeur ! Je peux vous assister avec la gestion de vos cours, vos étudiants et les ressources pédagogiques.",
    welcomeAdmin: "👋 Bonjour Administrateur ! Je suis là pour vous guider dans la gestion de la plateforme, les utilisateurs et les paramètres système.",
    placeholder: "Posez votre question...",
    send: "Envoyer",
    newChat: "Nouvelle conversation",
    uploadingFile: "Envoi du fichier...",
    quickReplies: {
      courses: "📚 Formations disponibles",
      fees: "💰 Frais de scolarité",
      enroll: "📝 Comment s'inscrire",
      contact: "📞 Nous contacter",
      phone: "📞 Appeler",
      whatsapp: "💬 WhatsApp",
      email: "📧 Email",
      studentSchedule: "📅 Mon emploi du temps",
      studentGrades: "📊 Consulter mes notes",
      studentResources: "📚 Ressources de cours",
      studentContact: "💬 Contacter un professeur",
      studentAgent: "👤 Parler à un agent",
      profClasses: "👥 Gérer mes classes",
      profEvaluation: "📝 Créer une évaluation",
      profStats: "📊 Statistiques des étudiants",
      profResources: "📚 Ressources pédagogiques",
      profSupport: "💬 Support technique",
      adminUsers: "👥 Gérer les utilisateurs",
      adminDashboard: "📊 Tableau de bord",
      adminSettings: "⚙️ Paramètres système",
      adminReports: "📈 Rapports d'activité",
      adminAssistance: "💬 Assistance"
    },
    quickActionButtons: {
      catalogue: '📚 Catalogue',
      about: 'ℹ️ À Propos',
      appointment: '📅 Prendre RDV',
      contact: '📞 Contact',
      dashboard: '📊 Mon Dashboard',
      myProgress: '📈 Ma Progression',
      myCertificates: '🎓 Mes Certificats',
      myAttendance: '✅ Mon Assiduité',
      profDashboard: '📊 Dashboard',
      myCourses: '📚 Mes Cours',
      announcements: '📢 Annonces',
      grades: '✏️ Notes',
      attendance: '✅ Présences',
      overview: '📊 Vue d\'ensemble',
      crmStudents: '👥 CRM Étudiants',
      communication: '✉️ Communication',
      manageCourses: '📚 Gérer Cours',
      analytics: '📈 Analytics'
    }
  },
  ar: {
    welcome: "👋 مرحباً! كيف يمكنني مساعدتك اليوم؟",
    welcomeStudent: "👋 مرحباً طالب! يمكنني مساعدتك في دروسك، درجاتك، جدولك الزمني وأي أسئلة تتعلق بمسارك الأكاديمي.",
    welcomeProfessor: "👋 مرحباً أستاذ! يمكنني مساعدتك في إدارة فصولك، طلابك والموارد التعليمية.",
    welcomeAdmin: "👋 مرحباً مسؤول! أنا هنا لإرشادك في إدارة المنصة، المستخدمين وإعدادات النظام.",
    placeholder: "اكتب سؤالك...",
    send: "إرسال",
    newChat: "محادثة جديدة",
    uploadingFile: "جاري تحميل الملف...",
    quickReplies: {
      courses: "📚 الدورات المتاحة",
      fees: "💰 الرسوم الدراسية",
      enroll: "📝 كيفية التسجيل",
      contact: "📞 اتصل بنا",
      phone: "📞 اتصال",
      whatsapp: "💬 واتساب",
      email: "📧 البريد الإلكتروني",
      studentSchedule: "📅 جدولي الزمني",
      studentGrades: "📊 الاطلاع على درجاتي",
      studentResources: "📚 موارد الدورة",
      studentContact: "💬 الاتصال بأستاذ",
      studentAgent: "👤 التحدث إلى وكيل",
      profClasses: "👥 إدارة فصولي",
      profEvaluation: "📝 إنشاء تقييم",
      profStats: "📊 إحصائيات الطلاب",
      profResources: "📚 الموارد التعليمية",
      profSupport: "💬 الدعم الفني",
      adminUsers: "👥 إدارة المستخدمين",
      adminDashboard: "📊 لوحة التحكم",
      adminSettings: "⚙️ إعدادات النظام",
      adminReports: "📈 تقارير النشاط",
      adminAssistance: "💬 المساعدة"
    },
    quickActionButtons: {
      catalogue: '📚 الكتالوج',
      about: 'ℹ️ معلومات عنا',
      appointment: '📅 حجز موعد',
      contact: '📞 اتصل بنا',
      dashboard: '📊 لوحتي',
      myProgress: '📈 تقدمي',
      myCertificates: '🎓 شهاداتي',
      myAttendance: '✅ حضوري',
      profDashboard: '📊 لوحة التحكم',
      myCourses: '📚 دوراتي',
      announcements: '📢 الإعلانات',
      grades: '✏️ الدرجات',
      attendance: '✅ الحضور',
      overview: '📊 نظرة عامة',
      crmStudents: '👥 إدارة الطلاب',
      communication: '✉️ التواصل',
      manageCourses: '📚 إدارة الدورات',
      analytics: '📈 التحليلات'
    }
  },
  en: {
    welcome: "👋 Hello! How can I help you today?",
    welcomeStudent: "👋 Hello Student! I can help you with your courses, grades, schedule and any questions about your academic journey.",
    welcomeProfessor: "👋 Hello Professor! I can assist you with managing your classes, students and educational resources.",
    welcomeAdmin: "👋 Hello Administrator! I'm here to guide you in managing the platform, users and system settings.",
    placeholder: "Ask your question...",
    send: "Send",
    newChat: "New conversation",
    uploadingFile: "Uploading file...",
    quickReplies: {
      courses: "📚 Available courses",
      fees: "💰 Tuition fees",
      enroll: "📝 How to enroll",
      contact: "📞 Contact us",
      phone: "📞 Call",
      whatsapp: "💬 WhatsApp",
      email: "📧 Email",
      studentSchedule: "📅 My schedule",
      studentGrades: "📊 View my grades",
      studentResources: "📚 Course resources",
      studentContact: "💬 Contact a professor",
      studentAgent: "👤 Talk to an agent",
      profClasses: "👥 Manage my classes",
      profEvaluation: "📝 Create an evaluation",
      profStats: "📊 Student statistics",
      profResources: "📚 Educational resources",
      profSupport: "💬 Technical support",
      adminUsers: "👥 Manage users",
      adminDashboard: "📊 Dashboard",
      adminSettings: "⚙️ System settings",
      adminReports: "📈 Activity reports",
      adminAssistance: "💬 Assistance"
    },
    quickActionButtons: {
      catalogue: '📚 Catalogue',
      about: 'ℹ️ About Us',
      appointment: '📅 Book Appointment',
      contact: '📞 Contact',
      dashboard: '📊 My Dashboard',
      myProgress: '📈 My Progress',
      myCertificates: '🎓 My Certificates',
      myAttendance: '✅ My Attendance',
      profDashboard: '📊 Dashboard',
      myCourses: '📚 My Courses',
      announcements: '📢 Announcements',
      grades: '✏️ Grades',
      attendance: '✅ Attendance',
      overview: '📊 Overview',
      crmStudents: '👥 Student CRM',
      communication: '✉️ Communication',
      manageCourses: '📚 Manage Courses',
      analytics: '📈 Analytics'
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
