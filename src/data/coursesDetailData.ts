export interface CourseModule {
  code: string;
  title: string;
  duration: string;
  description?: string;
}

export interface CourseKeyArea {
  title: string;
  description: string;
  icon: string;
  gradient: string;
}

export interface CourseProgramGoal {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  details: string[];
}

export interface CourseDetailData {
  id: string;
  slug: string;
  heroTitle: string;
  heroSubtitle: string;
  presentationSections: {
    title: string;
    icon: string;
    color: string;
    content: string;
  }[];
  keyAreas: CourseKeyArea[];
  firstYearModules: CourseModule[];
  secondYearModules?: CourseModule[];
  programGoals: CourseProgramGoal[];
  objectives: {
    mainTitle: string;
    description: string;
    leftColumn: {
      title: string;
      skills: string[];
      description: string;
    };
    rightColumn: {
      sections: {
        title: string;
        description: string;
      }[];
    };
  };
  teachingStrategies: {
    title: string;
    icon: string;
    color: string;
    content: string;
    features: string[];
  }[];
  tableOfContents: {
    section: string;
    title: string;
    anchor: string;
    icon: string;
  }[];
  synthesis: {
    title: string;
    icon: string;
    gradient: string;
    details: string[];
  }[];
}

export const coursesDetailData: Record<string, CourseDetailData> = {
  "ai-ml-engineering": {
    id: "4a10a6df-f98b-4136-9e1c-e551cff11a31",
    slug: "ai-ml-engineering",
    heroTitle: "Formation Complète en AI & Machine Learning Engineering",
    heroSubtitle: "Devenez expert en intelligence artificielle et ingénierie machine learning avec notre programme d'excellence",
    presentationSections: [
      {
        title: "Programme Professionnel",
        icon: "BookOpen",
        color: "bg-blue-100",
        content: "Formation complète en AI & ML Engineering couvrant les dernières technologies et méthodologies d'intelligence artificielle et d'apprentissage automatique."
      },
      {
        title: "Objectifs de Formation",
        icon: "Target",
        color: "bg-green-100",
        content: "Former des ingénieurs AI/ML capables de concevoir, développer et déployer des solutions d'intelligence artificielle en entreprise."
      },
      {
        title: "Compétences Acquises",
        icon: "Award",
        color: "bg-purple-100",
        content: "Machine Learning, Deep Learning, Computer Vision, NLP, MLOps, déploiement cloud, optimisation des modèles."
      },
      {
        title: "Public Cible",
        icon: "Users",
        color: "bg-orange-100",
        content: "Ingénieurs, développeurs, data scientists souhaitant se spécialiser dans l'intelligence artificielle et le machine learning."
      }
    ],
    keyAreas: [
      {
        title: "Machine Learning Avancé",
        description: "Algorithmes supervisés, non-supervisés et par renforcement",
        icon: "Brain",
        gradient: "from-blue-500 to-purple-600"
      },
      {
        title: "Deep Learning",
        description: "Réseaux de neurones, CNN, RNN, Transformers",
        icon: "Network",
        gradient: "from-purple-500 to-pink-600"
      },
      {
        title: "Computer Vision",
        description: "Traitement d'images, détection d'objets, reconnaissance faciale",
        icon: "Eye",
        gradient: "from-green-500 to-blue-600"
      },
      {
        title: "Natural Language Processing",
        description: "Analyse de texte, chatbots, traduction automatique",
        icon: "MessageCircle",
        gradient: "from-orange-500 to-red-600"
      }
    ],
    firstYearModules: [
      { code: "AI101", title: "Fondamentaux de l'IA", duration: "40h", description: "Introduction aux concepts de l'intelligence artificielle" },
      { code: "ML201", title: "Machine Learning Supervisé", duration: "45h", description: "Algorithmes de classification et régression" },
      { code: "ML202", title: "Machine Learning Non-Supervisé", duration: "35h", description: "Clustering, réduction de dimensionnalité" },
      { code: "DL301", title: "Deep Learning Fondamental", duration: "50h", description: "Réseaux de neurones et backpropagation" },
      { code: "CV401", title: "Computer Vision", duration: "40h", description: "Traitement d'images et vision par ordinateur" },
      { code: "NLP501", title: "Natural Language Processing", duration: "45h", description: "Traitement automatique du langage naturel" }
    ],
    secondYearModules: [
      { code: "MLO601", title: "MLOps et Production", duration: "40h", description: "Déploiement et maintenance des modèles ML" },
      { code: "RL701", title: "Reinforcement Learning", duration: "35h", description: "Apprentissage par renforcement" },
      { code: "AD801", title: "AI Avancée", duration: "45h", description: "Techniques avancées et recherche en IA" },
      { code: "PRJ901", title: "Projet Final", duration: "60h", description: "Projet complet de bout en bout" }
    ],
    programGoals: [
      {
        id: "expertise",
        title: "Expertise Technique",
        description: "Maîtrise complète des technologies AI/ML",
        icon: "Award",
        color: "bg-gradient-to-r from-blue-500 to-purple-600",
        details: ["Machine Learning avancé", "Deep Learning", "MLOps", "Optimisation des modèles"]
      },
      {
        id: "innovation",
        title: "Innovation Technologique",
        description: "Capacité à innover et créer des solutions IA",
        icon: "Lightbulb",
        color: "bg-gradient-to-r from-purple-500 to-pink-600",
        details: ["Recherche appliquée", "Nouveaux algorithmes", "Solutions créatives"]
      },
      {
        id: "leadership",
        title: "Leadership Technique",
        description: "Direction d'équipes et projets IA",
        icon: "Users2",
        color: "bg-gradient-to-r from-green-500 to-blue-600",
        details: ["Gestion d'équipe", "Architecture système", "Mentoring"]
      },
      {
        id: "business",
        title: "Impact Business",
        description: "Application de l'IA aux enjeux business",
        icon: "TrendingUp",
        color: "bg-gradient-to-r from-orange-500 to-red-600",
        details: ["ROI des projets IA", "Stratégie d'entreprise", "Innovation produit"]
      }
    ],
    objectives: {
      mainTitle: "Objectifs Généraux",
      description: "Ce programme vise à former des experts en AI & Machine Learning Engineering capables de concevoir et déployer des solutions d'intelligence artificielle innovantes.",
      leftColumn: {
        title: "Expertise Complète",
        skills: [
          "Algorithmes de Machine Learning",
          "Réseaux de neurones profonds",
          "Computer Vision",
          "Natural Language Processing",
          "MLOps et déploiement",
          "Optimisation des performances"
        ],
        description: "Une formation complète couvrant tous les aspects de l'ingénierie AI/ML, de la recherche au déploiement en production."
      },
      rightColumn: {
        sections: [
          {
            title: "Théorie + Pratique",
            description: "Équilibre parfait entre concepts théoriques solides et applications pratiques sur des projets réels."
          },
          {
            title: "Environnement Pro",
            description: "Formation dans un environnement professionnel avec outils et méthodologies utilisés en entreprise."
          },
          {
            title: "Innovation & Veille",
            description: "Développement de l'esprit d'innovation et capacité de veille technologique continue."
          }
        ]
      }
    },
    teachingStrategies: [
      {
        title: "Approches Pédagogiques",
        icon: "GraduationCap",
        color: "from-blue-500 to-purple-600",
        content: "Méthodes d'enseignement innovantes adaptées aux technologies émergentes",
        features: ["Apprentissage par projet", "Classes inversées", "Peer learning", "Mentoring individuel"]
      },
      {
        title: "Système d'Évaluation",
        icon: "ClipboardCheck",
        color: "from-green-500 to-blue-600",
        content: "Évaluation continue et projets pratiques pour valider les compétences",
        features: ["Projets en équipe", "Évaluations pratiques", "Présentations", "Portfolio professionnel"]
      },
      {
        title: "Outils et Technologies",
        icon: "Wrench",
        color: "from-purple-500 to-pink-600",
        content: "Utilisation des derniers outils et frameworks de l'industrie",
        features: ["Python/TensorFlow/PyTorch", "Cloud platforms", "MLOps tools", "Jupyter notebooks"]
      },
      {
        title: "Accompagnement Personnalisé",
        icon: "Users",
        color: "from-orange-500 to-red-600",
        content: "Suivi individualisé pour maximiser la réussite de chaque apprenant",
        features: ["Mentoring one-to-one", "Support technique", "Orientation carrière", "Réseau alumni"]
      }
    ],
    tableOfContents: [
      { section: "01", title: "Présentation du Programme", anchor: "presentation", icon: "FileText" },
      { section: "02", title: "Domaines Clés", anchor: "key-areas", icon: "Target" },
      { section: "03", title: "Curriculum 1ère Année", anchor: "curriculum-year1", icon: "BookOpen" },
      { section: "04", title: "Curriculum 2ème Année", anchor: "curriculum-year2", icon: "GraduationCap" },
      { section: "05", title: "Objectifs du Programme", anchor: "objectives", icon: "Goal" },
      { section: "06", title: "Objectifs Généraux", anchor: "general-objectives", icon: "Target" },
      { section: "07", title: "Stratégies Pédagogiques", anchor: "teaching-strategies", icon: "Users" },
      { section: "08", title: "Synthèse du Programme", anchor: "synthesis", icon: "CheckCircle" }
    ],
    synthesis: [
      {
        title: "Excellence Académique",
        icon: "Award",
        gradient: "from-blue-500 to-purple-600",
        details: [
          "Formation certifiante reconnue",
          "Encadrement par des experts",
          "Méthodologie éprouvée",
          "Suivi personnalisé"
        ]
      },
      {
        title: "Innovation Technologique",
        icon: "Lightbulb",
        gradient: "from-purple-500 to-pink-600",
        details: [
          "Technologies de pointe",
          "Projets innovants",
          "Recherche appliquée",
          "Veille technologique"
        ]
      },
      {
        title: "Insertion Professionnelle",
        icon: "Briefcase",
        gradient: "from-green-500 to-blue-600",
        details: [
          "Partenariats entreprises",
          "Stages en entreprise",
          "Réseau professionnel",
          "Accompagnement carrière"
        ]
      }
    ]
  },

  "business-intelligence": {
    id: "783d7aa7-0b72-4364-b491-e0874067747a",
    slug: "business-intelligence",
    heroTitle: "Formation Complète en Business Intelligence",
    heroSubtitle: "Transformez les données en insights stratégiques pour piloter la performance business",
    presentationSections: [
      {
        title: "Programme Professionnel",
        icon: "BookOpen",
        color: "bg-blue-100",
        content: "Formation complète en Business Intelligence couvrant l'analyse de données, la création de tableaux de bord et la prise de décision data-driven."
      },
      {
        title: "Objectifs de Formation",
        icon: "Target",
        color: "bg-green-100",
        content: "Former des experts BI capables de transformer les données brutes en informations stratégiques pour l'aide à la décision."
      },
      {
        title: "Compétences Acquises",
        icon: "Award",
        color: "bg-purple-100",
        content: "SQL avancé, Power BI, Tableau, ETL, Data Warehouse, analyse prédictive, visualisation de données."
      },
      {
        title: "Public Cible",
        icon: "Users",
        color: "bg-orange-100",
        content: "Analystes, contrôleurs de gestion, managers, consultants souhaitant maîtriser les outils de Business Intelligence."
      }
    ],
    keyAreas: [
      {
        title: "Data Warehousing",
        description: "Architecture et conception d'entrepôts de données",
        icon: "Database",
        gradient: "from-blue-500 to-indigo-600"
      },
      {
        title: "Visualisation de Données",
        description: "Création de tableaux de bord interactifs",
        icon: "BarChart3",
        gradient: "from-green-500 to-teal-600"
      },
      {
        title: "Analyse Prédictive",
        description: "Modélisation et prévisions business",
        icon: "TrendingUp",
        gradient: "from-purple-500 to-violet-600"
      },
      {
        title: "ETL & Intégration",
        description: "Extraction, transformation et chargement de données",
        icon: "ArrowRightLeft",
        gradient: "from-orange-500 to-amber-600"
      }
    ],
    firstYearModules: [
      { code: "BI101", title: "Fondamentaux BI", duration: "35h", description: "Introduction à la Business Intelligence" },
      { code: "SQL201", title: "SQL Avancé", duration: "40h", description: "Requêtes complexes et optimisation" },
      { code: "DW301", title: "Data Warehousing", duration: "45h", description: "Conception d'entrepôts de données" },
      { code: "ETL401", title: "Processus ETL", duration: "35h", description: "Extraction, transformation, chargement" },
      { code: "VIS501", title: "Visualisation Données", duration: "40h", description: "Power BI et Tableau" },
      { code: "OLAP601", title: "Analyse OLAP", duration: "30h", description: "Cubes et analyses multidimensionnelles" }
    ],
    secondYearModules: [
      { code: "PRED701", title: "Analyse Prédictive", duration: "40h", description: "Modèles prédictifs pour le business" },
      { code: "DASH801", title: "Dashboards Avancés", duration: "35h", description: "Tableaux de bord interactifs" },
      { code: "GOV901", title: "Gouvernance Données", duration: "30h", description: "Qualité et gouvernance des données" },
      { code: "PROJ1001", title: "Projet BI Complet", duration: "50h", description: "Projet de bout en bout" }
    ],
    programGoals: [
      {
        id: "analysis",
        title: "Expertise Analytique",
        description: "Maîtrise complète de l'analyse de données",
        icon: "BarChart3",
        color: "bg-gradient-to-r from-blue-500 to-indigo-600",
        details: ["SQL avancé", "Analyse statistique", "Modélisation", "Prédictions"]
      },
      {
        id: "visualization",
        title: "Visualisation Expert",
        description: "Création de tableaux de bord impactants",
        icon: "PieChart",
        color: "bg-gradient-to-r from-green-500 to-teal-600",
        details: ["Power BI", "Tableau", "Design UX/UI", "Storytelling data"]
      },
      {
        id: "strategy",
        title: "Vision Stratégique",
        description: "Transformation des données en stratégie",
        icon: "Target",
        color: "bg-gradient-to-r from-purple-500 to-violet-600",
        details: ["KPIs stratégiques", "ROI analysis", "Decision support", "Business insight"]
      },
      {
        id: "leadership",
        title: "Leadership Data",
        description: "Direction d'initiatives data-driven",
        icon: "Users2",
        color: "bg-gradient-to-r from-orange-500 to-amber-600",
        details: ["Conduite de projets", "Formation équipes", "Change management", "Data culture"]
      }
    ],
    objectives: {
      mainTitle: "Objectifs Généraux",
      description: "Former des experts en Business Intelligence capables de transformer les données en avantage concurrentiel.",
      leftColumn: {
        title: "Expertise Technique",
        skills: [
          "SQL et bases de données",
          "Outils BI (Power BI, Tableau)",
          "Data Warehousing",
          "Processus ETL",
          "Analyse statistique",
          "Visualisation de données"
        ],
        description: "Maîtrise complète de la chaîne de valeur BI, des données brutes aux insights business."
      },
      rightColumn: {
        sections: [
          {
            title: "Approche Pratique",
            description: "Apprentissage basé sur des cas d'usage réels et des projets d'entreprise."
          },
          {
            title: "Outils Professionnels",
            description: "Formation sur les outils les plus utilisés en entreprise."
          },
          {
            title: "Certification",
            description: "Préparation aux certifications Power BI et Tableau."
          }
        ]
      }
    },
    teachingStrategies: [
      {
        title: "Cas d'Usage Réels",
        icon: "FileBarChart",
        color: "from-blue-500 to-indigo-600",
        content: "Apprentissage basé sur des projets et cas d'entreprise authentiques",
        features: ["Données réelles", "Problématiques business", "Contraintes opérationnelles", "Retour d'expérience"]
      },
      {
        title: "Certification Professionnelle",
        icon: "Award",
        color: "from-green-500 to-teal-600",
        content: "Préparation aux certifications reconnues du marché",
        features: ["Power BI certification", "Tableau certification", "SQL certification", "Portfolio projet"]
      },
      {
        title: "Outils Enterprise",
        icon: "Settings",
        color: "from-purple-500 to-violet-600",
        content: "Formation sur les plateformes et outils utilisés en entreprise",
        features: ["Power BI Premium", "Tableau Server", "SQL Server", "Azure Analytics"]
      },
      {
        title: "Accompagnement Carrière",
        icon: "Compass",
        color: "from-orange-500 to-amber-600",
        content: "Support pour l'évolution professionnelle et l'insertion",
        features: ["Coaching carrière", "Préparation entretiens", "Réseau entreprises", "Suivi post-formation"]
      }
    ],
    tableOfContents: [
      { section: "01", title: "Présentation Programme", anchor: "presentation", icon: "FileText" },
      { section: "02", title: "Domaines d'Expertise", anchor: "key-areas", icon: "Target" },
      { section: "03", title: "Curriculum Fondamental", anchor: "curriculum-year1", icon: "BookOpen" },
      { section: "04", title: "Spécialisation Avancée", anchor: "curriculum-year2", icon: "GraduationCap" },
      { section: "05", title: "Objectifs Formation", anchor: "objectives", icon: "Goal" },
      { section: "06", title: "Compétences Acquises", anchor: "general-objectives", icon: "CheckCircle" },
      { section: "07", title: "Méthodes Pédagogiques", anchor: "teaching-strategies", icon: "Users" },
      { section: "08", title: "Synthèse Programme", anchor: "synthesis", icon: "Award" }
    ],
    synthesis: [
      {
        title: "Expertise Reconnue",
        icon: "Award",
        gradient: "from-blue-500 to-indigo-600",
        details: [
          "Certification professionnelle",
          "Formateurs experts métier",
          "Outils industry-standard",
          "Reconnaissance employeurs"
        ]
      },
      {
        title: "Approche Pratique",
        icon: "Wrench",
        gradient: "from-green-500 to-teal-600",
        details: [
          "Projets réels d'entreprise",
          "Données authentiques",
          "Cas d'usage métier",
          "Retour d'expérience"
        ]
      },
      {
        title: "Opportunités Carrière",
        icon: "TrendingUp",
        gradient: "from-purple-500 to-violet-600",
        details: [
          "Marché en forte croissance",
          "Salaires attractifs",
          "Évolution rapide",
          "Secteurs variés"
        ]
      }
    ]
  },

  "ai-for-business": {
    id: "04929948-3bae-4ddb-861a-6259699daa63",
    slug: "ai-for-business",
    heroTitle: "Formation AI for Business",
    heroSubtitle: "Transformez votre entreprise avec l'intelligence artificielle",
    presentationSections: [
      {
        title: "Programme Business",
        icon: "BookOpen",
        color: "bg-blue-100",
        content: "Formation dédiée aux dirigeants et managers pour intégrer l'IA dans leur stratégie d'entreprise."
      },
      {
        title: "Objectifs Stratégiques", 
        icon: "Target",
        color: "bg-green-100",
        content: "Développer une vision stratégique de l'IA et identifier les opportunités business."
      },
      {
        title: "Compétences Business",
        icon: "Award", 
        color: "bg-purple-100",
        content: "ROI de l'IA, gestion de projets IA, transformation digitale, innovation."
      },
      {
        title: "Public Dirigeants",
        icon: "Users",
        color: "bg-orange-100", 
        content: "Dirigeants, managers, consultants, entrepreneurs souhaitant intégrer l'IA."
      }
    ],
    keyAreas: [
      {
        title: "Stratégie IA",
        description: "Développement de stratégies IA alignées business",
        icon: "Target",
        gradient: "from-blue-500 to-purple-600"
      },
      {
        title: "ROI & Performance",
        description: "Mesure de l'impact et du retour sur investissement",
        icon: "TrendingUp", 
        gradient: "from-green-500 to-blue-600"
      }
    ],
    firstYearModules: [
      { code: "AIB101", title: "IA pour le Business", duration: "20h" },
      { code: "STR201", title: "Stratégie IA", duration: "25h" },
      { code: "ROI301", title: "ROI de l'IA", duration: "15h" }
    ],
    programGoals: [
      {
        id: "strategy",
        title: "Vision Stratégique",
        description: "Développer une stratégie IA cohérente",
        icon: "Target",
        color: "bg-gradient-to-r from-blue-500 to-purple-600",
        details: ["Analyse des opportunités", "Roadmap IA", "Transformation digitale"]
      }
    ],
    objectives: {
      mainTitle: "Objectifs Business",
      description: "Former les dirigeants à l'intégration stratégique de l'IA",
      leftColumn: {
        title: "Leadership IA",
        skills: ["Vision stratégique", "ROI de l'IA", "Gestion de projets IA"],
        description: "Développez votre leadership dans l'ère de l'IA"
      },
      rightColumn: {
        sections: [
          { title: "Approche Business", description: "Focus sur les enjeux business et la rentabilité" }
        ]
      }
    },
    teachingStrategies: [
      {
        title: "Cas d'Entreprise",
        icon: "Briefcase",
        color: "from-blue-500 to-purple-600", 
        content: "Études de cas réels d'implémentation IA en entreprise",
        features: ["Success stories", "Échecs analysés", "ROI calculé"]
      }
    ],
    tableOfContents: [
      { section: "01", title: "Vision Stratégique", anchor: "strategy", icon: "Target" }
    ],
    synthesis: [
      {
        title: "Leadership IA",
        icon: "Award",
        gradient: "from-blue-500 to-purple-600",
        details: ["Vision claire", "Stratégie alignée", "ROI démontré"]
      }
    ]
  }
};