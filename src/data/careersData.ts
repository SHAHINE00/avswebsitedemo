import { Brain, Code, Rocket, TrendingUp, Users, Building, Star, ArrowRight, CheckCircle, Eye, MessageSquare, Shield, Gamepad2, Cloud, Cpu, Database, TestTube, Layers, Zap, BarChart3, PieChart, Monitor, Smartphone, Globe, Video, Camera, Megaphone, ShoppingCart, Hash } from 'lucide-react';
import { Career } from '@/components/careers/CareerCard';

export const aiCareers: Career[] = [
  {
    title: "Ingénieur en Intelligence Artificielle",
    salary: "€50k - €80k",
    level: "Avancé", 
    description: "Développez des systèmes d'IA avancés pour des applications industrielles et commerciales.",
    skills: ["Python", "TensorFlow", "Machine Learning", "Deep Learning", "PyTorch", "Algorithmes"],
    growth: "Croissance de 30% par an",
    companies: ["Google", "Microsoft", "Airbus", "Thales", "Safran"],
    experience: "3-7 ans",
    icon: Brain,
    applications: ["Industrie 4.0", "Santé", "Finance", "Automobile"],
    certification: "Certificat International en Intelligence Artificielle et Machine Learning",
    duration: "12 mois",
    modules: "15 modules spécialisés",
    relatedCourses: ["Formation IA & Machine Learning", "Formation Data Science"]
  },
  {
    title: "Data Scientist",
    salary: "€45k - €70k", 
    level: "Intermédiaire",
    description: "Analysez les données pour extraire des insights business stratégiques et créer des modèles prédictifs.",
    skills: ["Python", "R", "SQL", "Statistiques", "Visualisation", "Pandas", "Jupyter"],
    growth: "Croissance de 28% par an",
    companies: ["Amazon", "Netflix", "BNP Paribas", "Criteo", "Dataiku"],
    experience: "2-5 ans",
    icon: TrendingUp,
    applications: ["E-commerce", "Marketing", "Banque", "Retail"],
    certification: "Certificat International en Data Science et Analytics",
    duration: "10 mois",
    modules: "12 modules pratiques",
    relatedCourses: ["Formation Data Science", "Formation Business Intelligence"]
  },
  {
    title: "Ingénieur en Vision par Ordinateur",
    salary: "€48k - €75k",
    level: "Avancé",
    description: "Développez des systèmes de reconnaissance et d'analyse d'images pour diverses applications.",
    skills: ["OpenCV", "Computer Vision", "YOLO", "CNN", "Image Processing", "Python"],
    growth: "Croissance de 32% par an",
    companies: ["Tesla", "Nvidia", "Renault", "Valeo", "Bosch"],
    experience: "3-6 ans",
    icon: Eye,
    applications: ["Automobile", "Sécurité", "Médical", "Robotique"],
    certification: "Certificat International en Computer Vision et IA",
    duration: "8 mois",
    modules: "10 modules techniques",
    relatedCourses: ["Formation Computer Vision", "Formation IA & Machine Learning"]
  },
  {
    title: "Analyste Business Intelligence",
    salary: "€42k - €65k",
    level: "Intermédiaire",
    description: "Transformez les données brutes en insights stratégiques pour la prise de décision business.",
    skills: ["SQL", "Power BI", "Tableau", "Excel", "Analytics", "Data Modeling"],
    growth: "Croissance de 25% par an",
    companies: ["Microsoft", "SAP", "Oracle", "Accenture", "Capgemini"],
    experience: "2-4 ans",
    icon: BarChart3,
    applications: ["Business Analytics", "Reporting", "KPIs", "Dashboards"],
    certification: "Certificat International en Business Intelligence",
    duration: "6 mois",
    modules: "8 modules business",
    relatedCourses: ["Formation Business Intelligence", "Formation Excel Avancé"]
  },
  {
    title: "Consultant en IA Éthique",
    salary: "€55k - €85k",
    level: "Avancé",
    description: "Assurez le développement responsable et éthique des systèmes d'intelligence artificielle.",
    skills: ["Éthique IA", "Gouvernance", "Audit", "Compliance", "Risk Management", "Philosophy"],
    growth: "Croissance de 40% par an",
    companies: ["IBM", "Deloitte", "PwC", "EY", "KPMG"],
    experience: "4-8 ans",
    icon: Shield,
    applications: ["Gouvernance", "Audit", "Compliance", "Conseil"],
    certification: "Certificat International en IA Éthique et Gouvernance",
    duration: "4 mois",
    modules: "6 modules éthiques",
    relatedCourses: ["Formation IA Éthique", "Formation IA & Machine Learning"]
  }
];

export const programmingCareers: Career[] = [
  {
    title: "Développeur Full Stack",
    salary: "€40k - €65k",
    level: "Intermédiaire",
    description: "Maîtrisez le développement front-end et back-end des applications web modernes.",
    skills: ["React", "Node.js", "JavaScript", "Databases", "TypeScript", "APIs"],
    growth: "Croissance de 22% par an",
    companies: ["Facebook", "Airbnb", "Shopify", "Criteo", "BlaBlaCar"],
    experience: "2-5 ans",
    icon: Code,
    applications: ["Web Apps", "E-commerce", "SaaS", "Plateformes"],
    certification: "Certificat International en Développement Web Full Stack",
    duration: "8 mois",
    modules: "12 modules techniques",
    relatedCourses: ["Formation Développement Web", "Formation JavaScript"]
  },
  {
    title: "Développeur Mobile",
    salary: "€42k - €68k", 
    level: "Intermédiaire",
    description: "Créez des applications mobiles innovantes pour iOS et Android avec les dernières technologies.",
    skills: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase", "App Store"],
    growth: "Croissance de 24% par an",
    companies: ["Apple", "Samsung", "Snapchat", "Spotify", "Uber"],
    experience: "2-4 ans",
    icon: Smartphone,
    applications: ["Apps mobiles", "Gaming", "Réseaux sociaux", "E-commerce"],
    certification: "Certificat International en Développement Mobile",
    duration: "6 mois",
    modules: "10 modules pratiques",
    relatedCourses: ["Formation Développement Mobile", "Formation React Native"]
  },
  {
    title: "Architecte Cloud",
    salary: "€55k - €85k",
    level: "Avancé",
    description: "Concevez et gérez des infrastructures cloud scalables et sécurisées.",
    skills: ["AWS", "Azure", "GCP", "Infrastructure as Code", "Serverless", "Monitoring"],
    growth: "Croissance de 35% par an",
    companies: ["Amazon", "Microsoft", "Google", "Netflix", "Airbnb"],
    experience: "4-8 ans",
    icon: Cloud,
    applications: ["Cloud", "Scalabilité", "Performance", "DevOps"],
    certification: "Certificat International en Architecture Cloud",
    duration: "10 mois",
    modules: "14 modules cloud",
    relatedCourses: ["Formation Cloud Computing", "Formation AWS"]
  },
  {
    title: "Analyste de Données Excel",
    salary: "€35k - €55k",
    level: "Débutant",
    description: "Maîtrisez l'analyse de données avancée avec Excel pour optimiser les processus business.",
    skills: ["Excel Avancé", "VBA", "Power Query", "Power Pivot", "Macros", "Dashboards"],
    growth: "Croissance de 18% par an",
    companies: ["Deloitte", "PwC", "L'Oréal", "Danone", "Total"],
    experience: "1-3 ans",
    icon: PieChart,
    applications: ["Analyse financière", "Reporting", "Business Intelligence", "Audit"],
    certification: "Certificat International Excel Expert et VBA",
    duration: "4 mois",
    modules: "8 modules Excel",
    relatedCourses: ["Formation Excel Avancé", "Formation VBA"]
  },
  {
    title: "Administrateur Base de Données",
    salary: "€45k - €70k",
    level: "Intermédiaire",
    description: "Gérez et optimisez les bases de données critiques des entreprises.",
    skills: ["SQL", "MySQL", "PostgreSQL", "Oracle", "MongoDB", "Performance Tuning"],
    growth: "Croissance de 20% par an",
    companies: ["Oracle", "IBM", "SAP", "MongoDB", "Redis"],
    experience: "2-5 ans",
    icon: Database,
    applications: ["Enterprise DB", "Big Data", "Performance", "Sécurité"],
    certification: "Certificat International en Administration de Bases de Données",
    duration: "6 mois",
    modules: "9 modules DB",
    relatedCourses: ["Formation Gestion Bases de Données", "Formation SQL"]
  },
  {
    title: "Développeur IoT",
    salary: "€48k - €72k",
    level: "Avancé",
    description: "Développez des solutions connectées pour l'Internet des Objets industriel et consumer.",
    skills: ["Arduino", "Raspberry Pi", "Sensors", "Protocols", "Embedded Systems", "Edge Computing"],
    growth: "Croissance de 28% par an",
    companies: ["Bosch", "Siemens", "Schneider Electric", "Orange", "Sigfox"],
    experience: "3-6 ans",
    icon: Cpu,
    applications: ["Smart Cities", "Industrie 4.0", "Smart Home", "Agriculture"],
    certification: "Certificat International en Internet des Objets (IoT)",
    duration: "8 mois",
    modules: "11 modules IoT",
    relatedCourses: ["Formation Internet des Objets (IoT)", "Formation Systèmes Embarqués"]
  }
];

export const digitalMarketingCareers: Career[] = [
  {
    title: "Spécialiste Marketing Digital IA",
    salary: "€38k - €60k",
    level: "Intermédiaire",
    description: "Utilisez l'IA pour optimiser les campagnes marketing et personnaliser l'expérience client.",
    skills: ["Marketing Automation", "AI Tools", "Analytics", "CRM", "Personalization", "A/B Testing"],
    growth: "Croissance de 25% par an",
    companies: ["Google", "Meta", "HubSpot", "Salesforce", "Adobe"],
    experience: "2-4 ans",
    icon: Megaphone,
    applications: ["Publicité IA", "Automation", "Personnalisation", "Analytics"],
    certification: "Certificat International en Marketing Digital alimenté par l'IA",
    duration: "6 mois",
    modules: "10 modules marketing",
    relatedCourses: ["Formation Marketing Digital avec IA", "Formation Growth Hacking"]
  },
  {
    title: "Manager E-commerce",
    salary: "€42k - €65k",
    level: "Intermédiaire",
    description: "Gérez et optimisez les plateformes e-commerce pour maximiser les ventes en ligne.",
    skills: ["E-commerce Platforms", "SEO", "PPC", "Conversion Optimization", "Analytics", "Customer Journey"],
    growth: "Croissance de 30% par an",
    companies: ["Amazon", "Shopify", "PrestaShop", "Magento", "WooCommerce"],
    experience: "2-5 ans",
    icon: ShoppingCart,
    applications: ["E-commerce", "Marketplace", "Dropshipping", "Retail"],
    certification: "Certificat International en Management E-commerce",
    duration: "5 mois",
    modules: "8 modules e-commerce",
    relatedCourses: ["Formation E-commerce et Marketing", "Formation Shopify"]
  },
  {
    title: "Créateur de Contenu Vidéo",
    salary: "€35k - €55k",
    level: "Débutant",
    description: "Produisez du contenu vidéo engageant avec les outils d'édition IA les plus avancés.",
    skills: ["Video Editing", "AI Tools", "Storytelling", "Adobe Suite", "Animation", "Motion Graphics"],
    growth: "Croissance de 35% par an",
    companies: ["YouTube", "Netflix", "TikTok", "Adobe", "Canva"],
    experience: "1-3 ans",
    icon: Video,
    applications: ["Création de contenu", "Marketing vidéo", "Formation", "Divertissement"],
    certification: "Certificat International en Production Vidéo et IA",
    duration: "4 mois",
    modules: "7 modules créatifs",
    relatedCourses: ["Formation Production Vidéo avec IA", "Formation Montage Vidéo"]
  },
  {
    title: "Social Media Manager",
    salary: "€32k - $50k",
    level: "Débutant",
    description: "Gérez la présence digitale des marques sur les réseaux sociaux avec des stratégies innovantes.",
    skills: ["Social Media Strategy", "Content Creation", "Community Management", "Analytics", "Advertising", "Influencer Marketing"],
    growth: "Croissance de 22% par an",
    companies: ["Meta", "Twitter", "LinkedIn", "TikTok", "Snapchat"],
    experience: "1-3 ans",
    icon: Hash,
    applications: ["Réseaux sociaux", "Influence", "Branding", "Engagement"],
    certification: "Certificat International en Social Media Management",
    duration: "3 mois",
    modules: "6 modules sociaux",
    relatedCourses: ["Formation Social Media Marketing", "Formation Community Management"]
  }
];

export const entrepreneurshipOpportunities = [
  {
    title: "Startup IA Personnalisée",
    description: "Solutions d'IA sur mesure pour PME",
    market: "€2.5B marché européen",
    examples: ["Chatbots intelligents", "Analyse prédictive", "Automatisation RH"]
  },
  {
    title: "Applications Mobile Innovantes", 
    description: "Apps résolvant des problèmes du quotidien",
    market: "€180B marché mondial",
    examples: ["FinTech", "HealthTech", "EdTech"]
  },
  {
    title: "Plateformes SaaS",
    description: "Outils cloud pour entreprises",
    market: "€130B marché SaaS",
    examples: ["Gestion projet", "CRM intelligent", "Analytics"]
  }
];

export const successStats = [
  { value: "92%", label: "Taux de placement", description: "de nos diplômés trouvent un emploi" },
  { value: "€58k", label: "Salaire moyen", description: "salaire de départ moyen" },
  { value: "28%", label: "Croissance annuelle", description: "du secteur tech en France" },
  { value: "450+", label: "Entreprises partenaires", description: "qui recrutent nos diplômés" }
];
