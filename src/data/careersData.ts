
import { Brain, Code, Rocket, TrendingUp, Users, Building, Star, ArrowRight, CheckCircle, Eye, MessageSquare, Shield, Gamepad2, Cloud, Cpu, Database, TestTube, Layers, Zap } from 'lucide-react';
import { Career } from '@/components/careers/CareerCard';

export const aiCareers: Career[] = [
  {
    title: "Ingénieur en Intelligence Artificielle",
    salary: "€50k - €80k",
    level: "Intermédiaire",
    description: "Développez des systèmes d'IA avancés pour des applications industrielles.",
    skills: ["Python", "TensorFlow", "Machine Learning", "Deep Learning", "PyTorch", "Algorithmes"],
    growth: "Croissance de 30% par an",
    companies: ["Google", "Microsoft", "Airbus"],
    experience: "2-5 ans",
    icon: Brain,
    applications: ["Industrie 4.0", "Santé", "Finance"]
  },
  {
    title: "Data Scientist",
    salary: "€45k - €70k", 
    level: "Débutant",
    description: "Analysez les données pour extraire des insights business stratégiques.",
    skills: ["Python", "R", "SQL", "Statistiques", "Visualisation", "Pandas", "Jupyter"],
    growth: "Croissance de 28% par an",
    companies: ["Amazon", "Netflix", "BNP Paribas"],
    experience: "1-3 ans",
    icon: TrendingUp,
    applications: ["E-commerce", "Marketing", "Banque"]
  },
  {
    title: "Ingénieur Machine Learning",
    salary: "€55k - €85k",
    level: "Avancé",
    description: "Créez des modèles prédictifs pour optimiser les processus métier.",
    skills: ["Python", "Scikit-learn", "PyTorch", "MLOps", "Kubernetes", "Docker"],
    growth: "Croissance de 35% par an", 
    companies: ["Tesla", "Uber", "Spotify"],
    experience: "3-7 ans",
    icon: Cpu,
    applications: ["Transport", "Streaming", "Logistique"]
  },
  {
    title: "Architecte Solutions IA",
    salary: "€65k - €95k",
    level: "Avancé",
    description: "Concevez l'architecture technique des projets d'IA d'entreprise.",
    skills: ["Cloud Computing", "Architecture", "Leadership", "Strategy", "Microservices"],
    growth: "Croissance de 25% par an",
    companies: ["IBM", "Accenture", "Capgemini"],
    experience: "5-10 ans",
    icon: Layers,
    applications: ["Entreprise", "Conseil", "Transformation"]
  },
  {
    title: "Ingénieur en Vision par Ordinateur",
    salary: "€48k - €75k",
    level: "Intermédiaire",
    description: "Développez des systèmes de reconnaissance et d'analyse d'images.",
    skills: ["OpenCV", "Computer Vision", "YOLO", "CNN", "Image Processing", "Python"],
    growth: "Croissance de 32% par an",
    companies: ["Tesla", "Nvidia", "Renault"],
    experience: "2-5 ans",
    icon: Eye,
    applications: ["Automobile", "Sécurité", "Médical"]
  },
  {
    title: "Spécialiste en Traitement du Langage Naturel",
    salary: "€46k - €72k",
    level: "Intermédiaire",
    description: "Créez des systèmes de compréhension et génération de langage naturel.",
    skills: ["NLP", "BERT", "GPT", "Transformers", "NLTK", "SpaCy", "Linguistique"],
    growth: "Croissance de 40% par an",
    companies: ["OpenAI", "Google", "Amazon"],
    experience: "2-4 ans",
    icon: MessageSquare,
    applications: ["Chatbots", "Traduction", "Analyse de sentiment"]
  },
  {
    title: "Ingénieur en IA Conversationnelle",
    salary: "€44k - €68k",
    level: "Débutant",
    description: "Développez des chatbots et assistants virtuels intelligents.",
    skills: ["Chatbot Frameworks", "Dialogflow", "Rasa", "NLP", "APIs", "JavaScript"],
    growth: "Croissance de 35% par an",
    companies: ["Microsoft", "IBM", "Salesforce"],
    experience: "1-3 ans",
    icon: MessageSquare,
    applications: ["Service client", "E-commerce", "Assistance"]
  },
  {
    title: "Spécialiste en IA pour la Santé",
    salary: "€50k - €85k",
    level: "Avancé",
    description: "Développez des solutions IA pour le diagnostic et la recherche médicale.",
    skills: ["Imagerie Médicale", "Bioinformatique", "Deep Learning", "DICOM", "Python", "Réglementation"],
    growth: "Croissance de 45% par an",
    companies: ["Philips", "Siemens", "Roche"],
    experience: "3-6 ans",
    icon: Zap,
    applications: ["Diagnostic", "Recherche", "Thérapie"]
  }
];

export const programmingCareers: Career[] = [
  {
    title: "Développeur Full Stack",
    salary: "€40k - €65k",
    level: "Intermédiaire",
    description: "Maîtrisez le développement front-end et back-end des applications web.",
    skills: ["React", "Node.js", "JavaScript", "Databases", "TypeScript", "APIs"],
    growth: "Croissance de 22% par an",
    companies: ["Facebook", "Airbnb", "Shopify"],
    experience: "2-5 ans",
    icon: Code,
    applications: ["Web Apps", "E-commerce", "SaaS"]
  },
  {
    title: "Développeur Mobile",
    salary: "€42k - €68k", 
    level: "Intermédiaire",
    description: "Créez des applications mobiles innovantes pour iOS et Android.",
    skills: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase", "App Store"],
    growth: "Croissance de 24% par an",
    companies: ["Apple", "Samsung", "Snapchat"],
    experience: "2-4 ans",
    icon: Gamepad2,
    applications: ["Apps mobiles", "Gaming", "Réseaux sociaux"]
  },
  {
    title: "Ingénieur DevOps",
    salary: "€48k - €75k",
    level: "Avancé",
    description: "Automatisez les déploiements et optimisez l'infrastructure cloud.",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform", "Jenkins"],
    growth: "Croissance de 27% par an",
    companies: ["Amazon", "Netflix", "Docker"],
    experience: "3-6 ans",
    icon: Cloud,
    applications: ["Cloud", "Automation", "Scalabilité"]
  },
  {
    title: "Développeur Web Frontend",
    salary: "€38k - €60k",
    level: "Débutant",
    description: "Créez des interfaces utilisateur modernes et intuitives.",
    skills: ["React", "Vue.js", "TypeScript", "Design Systems", "CSS", "HTML"],
    growth: "Croissance de 20% par an",
    companies: ["Google", "Adobe", "Figma"],
    experience: "1-3 ans",
    icon: Code,
    applications: ["Sites web", "Dashboards", "Interfaces"]
  },
  {
    title: "Développeur Backend",
    salary: "€42k - €65k",
    level: "Intermédiaire",
    description: "Développez les APIs et l'architecture serveur des applications.",
    skills: ["Node.js", "Python", "Java", "APIs REST", "Microservices", "Bases de données"],
    growth: "Croissance de 25% par an",
    companies: ["Spotify", "Stripe", "Twilio"],
    experience: "2-5 ans",
    icon: Database,
    applications: ["APIs", "Microservices", "Intégrations"]
  },
  {
    title: "Ingénieur en Cybersécurité",
    salary: "€50k - €80k",
    level: "Avancé",
    description: "Protégez les systèmes contre les cybermenaces et vulnérabilités.",
    skills: ["Pentesting", "Cryptographie", "Sécurité réseau", "OSINT", "Compliance", "Forensics"],
    growth: "Croissance de 35% par an",
    companies: ["Thales", "Orange Cyberdefense", "Assurance Cyber"],
    experience: "3-7 ans",
    icon: Shield,
    applications: ["Sécurité", "Compliance", "Audit"]
  },
  {
    title: "Développeur de Jeux Vidéo",
    salary: "€40k - €70k",
    level: "Intermédiaire",
    description: "Créez des expériences ludiques immersives et engageantes.",
    skills: ["Unity", "Unreal Engine", "C#", "Game Design", "3D Modeling", "Animation"],
    growth: "Croissance de 15% par an",
    companies: ["Ubisoft", "Gameloft", "Voodoo"],
    experience: "2-5 ans",
    icon: Gamepad2,
    applications: ["Gaming", "VR/AR", "Simulation"]
  },
  {
    title: "Ingénieur Cloud",
    salary: "€48k - €78k",
    level: "Avancé",
    description: "Concevez et gérez des infrastructures cloud scalables.",
    skills: ["AWS", "Azure", "GCP", "Infrastructure as Code", "Serverless", "Monitoring"],
    growth: "Croissance de 30% par an",
    companies: ["Amazon", "Microsoft", "Google"],
    experience: "3-6 ans",
    icon: Cloud,
    applications: ["Cloud", "Scalabilité", "Performance"]
  },
  {
    title: "Développeur Blockchain",
    salary: "€55k - €90k",
    level: "Avancé",
    description: "Développez des applications décentralisées et smart contracts.",
    skills: ["Solidity", "Web3", "Smart Contracts", "DeFi", "Ethereum", "Cryptographie"],
    growth: "Croissance de 50% par an",
    companies: ["Consensys", "Chainalysis", "Ledger"],
    experience: "2-5 ans",
    icon: Zap,
    applications: ["DeFi", "NFTs", "Crypto"]
  },
  {
    title: "Ingénieur QA/Test",
    salary: "€38k - €58k",
    level: "Débutant",
    description: "Assurez la qualité logicielle par des tests automatisés.",
    skills: ["Tests automatisés", "Selenium", "Cypress", "Jest", "CI/CD", "Bug tracking"],
    growth: "Croissance de 18% par an",
    companies: ["Criteo", "BlaBlaCar", "Deezer"],
    experience: "1-4 ans",
    icon: TestTube,
    applications: ["Qualité", "Automation", "Performance"]
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
  { value: "85%", label: "Taux de placement", description: "de nos diplômés trouvent un emploi" },
  { value: "€52k", label: "Salaire moyen", description: "salaire de départ moyen" },
  { value: "25%", label: "Croissance annuelle", description: "du secteur tech en France" },
  { value: "300+", label: "Entreprises partenaires", description: "qui recrutent nos diplômés" }
];
