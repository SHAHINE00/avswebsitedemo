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
  },

  // AI & Data Science Courses
  "ai-decision-making": {
    id: "ai-decision-making",
    slug: "ai-decision-making",
    heroTitle: "Formation en IA pour la Prise de Décision",
    heroSubtitle: "Exploitez l'intelligence artificielle pour optimiser vos processus décisionnels stratégiques",
    presentationSections: [
      {
        title: "Programme Professionnel",
        icon: "BookOpen",
        color: "bg-blue-100",
        content: "Formation spécialisée en IA décisionnelle couvrant les algorithmes de recommandation, systèmes experts et aide à la décision automatisée."
      },
      {
        title: "Objectifs de Formation",
        icon: "Target",
        color: "bg-green-100",
        content: "Former des experts capables d'implémenter des systèmes d'IA pour améliorer la prise de décision en entreprise."
      },
      {
        title: "Compétences Acquises",
        icon: "Award",
        color: "bg-purple-100",
        content: "Systèmes experts, arbres de décision, algorithmes de recommandation, analyse prédictive, optimisation."
      },
      {
        title: "Public Cible",
        icon: "Users",
        color: "bg-orange-100",
        content: "Managers, consultants, analystes et décideurs souhaitant intégrer l'IA dans leurs processus décisionnels."
      }
    ],
    keyAreas: [
      {
        title: "Systèmes Experts",
        description: "Conception de systèmes d'aide à la décision intelligents",
        icon: "Brain",
        gradient: "from-blue-500 to-purple-600"
      },
      {
        title: "Algorithmes de Recommandation",
        description: "Développement de moteurs de recommandation",
        icon: "Target",
        gradient: "from-purple-500 to-pink-600"
      },
      {
        title: "Analyse Prédictive",
        description: "Modèles prédictifs pour la prise de décision",
        icon: "TrendingUp",
        gradient: "from-green-500 to-blue-600"
      },
      {
        title: "Optimisation Décisionnelle",
        description: "Algorithmes d'optimisation et recherche opérationnelle",
        icon: "Settings",
        gradient: "from-orange-500 to-red-600"
      }
    ],
    firstYearModules: [
      { code: "AID101", title: "Fondamentaux IA Décisionnelle", duration: "35h", description: "Introduction aux systèmes d'aide à la décision" },
      { code: "SE201", title: "Systèmes Experts", duration: "40h", description: "Conception et développement de systèmes experts" },
      { code: "REC301", title: "Algorithmes Recommandation", duration: "45h", description: "Moteurs de recommandation et filtrage collaboratif" },
      { code: "OPT401", title: "Optimisation Décisionnelle", duration: "35h", description: "Algorithmes d'optimisation pour la décision" },
      { code: "PRED501", title: "Analyse Prédictive", duration: "40h", description: "Modèles prédictifs et forecasting" },
      { code: "PROJ601", title: "Projet Pratique", duration: "50h", description: "Projet complet de système d'aide à la décision" }
    ],
    programGoals: [
      {
        id: "expertise",
        title: "Expertise Technique",
        description: "Maîtrise des technologies d'IA décisionnelle",
        icon: "Award",
        color: "bg-gradient-to-r from-blue-500 to-purple-600",
        details: ["Systèmes experts", "Machine learning", "Optimisation", "Modélisation prédictive"]
      },
      {
        id: "innovation",
        title: "Innovation Stratégique",
        description: "Capacité à innover dans les processus décisionnels",
        icon: "Lightbulb",
        color: "bg-gradient-to-r from-purple-500 to-pink-600",
        details: ["Nouveaux modèles", "Solutions créatives", "Automatisation", "Intelligence augmentée"]
      },
      {
        id: "business",
        title: "Impact Business",
        description: "Optimisation des décisions stratégiques",
        icon: "TrendingUp",
        color: "bg-gradient-to-r from-green-500 to-blue-600",
        details: ["ROI amélioration", "Réduction des risques", "Efficacité opérationnelle", "Avantage concurrentiel"]
      },
      {
        id: "leadership",
        title: "Leadership Digital",
        description: "Direction de la transformation décisionnelle",
        icon: "Users2",
        color: "bg-gradient-to-r from-orange-500 to-red-600",
        details: ["Conduite du changement", "Formation équipes", "Gestion projets IA", "Culture data-driven"]
      }
    ],
    objectives: {
      mainTitle: "Objectifs Généraux",
      description: "Former des experts capables d'implémenter l'IA pour améliorer la qualité et la rapidité des décisions stratégiques.",
      leftColumn: {
        title: "Expertise Décisionnelle",
        skills: [
          "Systèmes experts et règles métier",
          "Algorithmes de recommandation",
          "Modèles prédictifs",
          "Optimisation mathématique",
          "Analyse multicritère",
          "Intelligence augmentée"
        ],
        description: "Compétences complètes pour concevoir et déployer des systèmes d'IA décisionnelle en entreprise."
      },
      rightColumn: {
        sections: [
          {
            title: "Méthodes Avancées",
            description: "Maîtrise des dernières techniques d'IA pour l'aide à la décision et l'optimisation."
          },
          {
            title: "Applications Réelles",
            description: "Projets pratiques sur des cas d'usage concrets en entreprise."
          },
          {
            title: "Impact Mesurable",
            description: "Capacité à démontrer le ROI des solutions d'IA décisionnelle implémentées."
          }
        ]
      }
    },
    teachingStrategies: [
      {
        title: "Cas d'Usage Business",
        icon: "Briefcase",
        color: "from-blue-500 to-purple-600",
        content: "Apprentissage basé sur des problématiques décisionnelles réelles d'entreprise",
        features: ["Études de cas", "Simulations", "Jeux de rôle", "Projets clients"]
      },
      {
        title: "Outils Professionnels",
        icon: "Settings",
        color: "from-purple-500 to-pink-600",
        content: "Formation sur les plateformes et outils d'IA décisionnelle du marché",
        features: ["IBM Watson", "Microsoft Cognitive", "Python/R", "Plateformes cloud"]
      },
      {
        title: "Méthodologie Agile",
        icon: "Zap",
        color: "from-green-500 to-blue-600",
        content: "Développement itératif de solutions d'IA avec approche agile",
        features: ["Sprints de développement", "Prototypage rapide", "Tests utilisateurs", "Amélioration continue"]
      },
      {
        title: "Accompagnement Expert",
        icon: "Users",
        color: "from-orange-500 to-red-600",
        content: "Mentorat par des experts en IA décisionnelle et consultants senior",
        features: ["Coaching individuel", "Revues de projets", "Retours d'expérience", "Réseau professionnel"]
      }
    ],
    tableOfContents: [
      { section: "01", title: "Présentation du Programme", anchor: "presentation", icon: "FileText" },
      { section: "02", title: "Domaines Clés", anchor: "key-areas", icon: "Target" },
      { section: "03", title: "Curriculum Formation", anchor: "curriculum-year1", icon: "BookOpen" },
      { section: "04", title: "Objectifs du Programme", anchor: "objectives", icon: "Goal" },
      { section: "05", title: "Objectifs Généraux", anchor: "general-objectives", icon: "Target" },
      { section: "06", title: "Stratégies Pédagogiques", anchor: "teaching-strategies", icon: "Users" },
      { section: "07", title: "Synthèse du Programme", anchor: "synthesis", icon: "CheckCircle" },
      { section: "08", title: "Appel à l'Action", anchor: "cta", icon: "ArrowRight" }
    ],
    synthesis: [
      {
        title: "Excellence Décisionnelle",
        icon: "Target",
        gradient: "from-blue-500 to-purple-600",
        details: [
          "Méthodologies éprouvées",
          "Outils de pointe",
          "Expertise reconnue",
          "Résultats mesurables"
        ]
      },
      {
        title: "Innovation IA",
        icon: "Lightbulb",
        gradient: "from-purple-500 to-pink-600",
        details: [
          "Technologies émergentes",
          "Recherche appliquée",
          "Solutions disruptives",
          "Veille technologique"
        ]
      },
      {
        title: "Impact Professionnel",
        icon: "Briefcase",
        gradient: "from-green-500 to-blue-600",
        details: [
          "Opportunités carrière",
          "Réseau d'experts",
          "Certification reconnue",
          "Accompagnement placement"
        ]
      }
    ]
  },

  "computer-vision-opencv": {
    id: "computer-vision-opencv",
    slug: "computer-vision-opencv",
    heroTitle: "Formation Computer Vision avec OpenCV",
    heroSubtitle: "Maîtrisez la vision par ordinateur avec OpenCV et les techniques d'analyse d'images avancées",
    presentationSections: [
      {
        title: "Programme Professionnel",
        icon: "BookOpen",
        color: "bg-blue-100",
        content: "Formation complète en Computer Vision utilisant OpenCV pour le traitement d'images, la détection d'objets et la reconnaissance de formes."
      },
      {
        title: "Objectifs de Formation",
        icon: "Target",
        color: "bg-green-100",
        content: "Former des spécialistes en vision par ordinateur capables de développer des applications d'analyse d'images innovantes."
      },
      {
        title: "Compétences Acquises",
        icon: "Award",
        color: "bg-purple-100",
        content: "OpenCV, traitement d'images, détection d'objets, reconnaissance faciale, segmentation, deep learning pour vision."
      },
      {
        title: "Public Cible",
        icon: "Users",
        color: "bg-orange-100",
        content: "Développeurs, ingénieurs, data scientists intéressés par les applications de vision par ordinateur."
      }
    ],
    keyAreas: [
      {
        title: "Traitement d'Images",
        description: "Filtrage, amélioration et transformation d'images",
        icon: "Image",
        gradient: "from-blue-500 to-cyan-600"
      },
      {
        title: "Détection d'Objets",
        description: "Identification et localisation d'objets dans les images",
        icon: "Search",
        gradient: "from-purple-500 to-violet-600"
      },
      {
        title: "Reconnaissance Faciale",
        description: "Détection et reconnaissance de visages",
        icon: "User",
        gradient: "from-green-500 to-emerald-600"
      },
      {
        title: "Deep Learning Vision",
        description: "Réseaux de neurones convolutionnels pour vision",
        icon: "Brain",
        gradient: "from-orange-500 to-amber-600"
      }
    ],
    firstYearModules: [
      { code: "CV101", title: "Introduction Computer Vision", duration: "35h", description: "Fondamentaux de la vision par ordinateur" },
      { code: "OCV201", title: "Maîtrise OpenCV", duration: "45h", description: "API OpenCV et traitement d'images" },
      { code: "DET301", title: "Détection d'Objets", duration: "40h", description: "Algorithmes de détection et classification" },
      { code: "FACE401", title: "Reconnaissance Faciale", duration: "35h", description: "Systèmes de reconnaissance faciale" },
      { code: "DL501", title: "Deep Learning Vision", duration: "50h", description: "CNN et architectures avancées" },
      { code: "PROJ601", title: "Projet Applications", duration: "45h", description: "Développement d'applications complètes" }
    ],
    programGoals: [
      {
        id: "technical",
        title: "Maîtrise Technique",
        description: "Expertise complète en Computer Vision",
        icon: "Code",
        color: "bg-gradient-to-r from-blue-500 to-cyan-600",
        details: ["OpenCV expert", "Algorithmes avancés", "Optimisation performance", "Déploiement production"]
      },
      {
        id: "innovation",
        title: "Innovation Visuelle",
        description: "Développement de solutions innovantes",
        icon: "Eye",
        color: "bg-gradient-to-r from-purple-500 to-violet-600",
        details: ["Applications créatives", "Nouveaux algorithmes", "Recherche appliquée", "Brevets potentiels"]
      },
      {
        id: "industry",
        title: "Applications Industrielles",
        description: "Solutions pour l'industrie 4.0",
        icon: "Factory",
        color: "bg-gradient-to-r from-green-500 to-emerald-600",
        details: ["Contrôle qualité", "Robotique vision", "Surveillance automatique", "Industrie automotive"]
      },
      {
        id: "career",
        title: "Développement Carrière",
        description: "Expertise recherchée sur le marché",
        icon: "TrendingUp",
        color: "bg-gradient-to-r from-orange-500 to-amber-600",
        details: ["Postes spécialisés", "Salaires attractifs", "Secteurs d'avenir", "Évolution rapide"]
      }
    ],
    objectives: {
      mainTitle: "Objectifs Généraux",
      description: "Former des experts en Computer Vision capables de concevoir et déployer des solutions d'analyse d'images performantes.",
      leftColumn: {
        title: "Expertise Technique",
        skills: [
          "Bibliothèque OpenCV complète",
          "Algorithmes de traitement d'images",
          "Détection et reconnaissance d'objets",
          "Deep Learning pour vision",
          "Optimisation et performance",
          "Déploiement applications réelles"
        ],
        description: "Maîtrise complète de la chaîne Computer Vision, du preprocessing au déploiement production."
      },
      rightColumn: {
        sections: [
          {
            title: "Projets Pratiques",
            description: "Développement d'applications concrètes avec datasets réels et contraintes industrielles."
          },
          {
            title: "Technologies Actuelles",
            description: "Formation sur les dernières avancées en Computer Vision et Deep Learning."
          },
          {
            title: "Performance Optimale",
            description: "Techniques d'optimisation pour applications temps réel et ressources limitées."
          }
        ]
      }
    },
    teachingStrategies: [
      {
        title: "Hands-on Learning",
        icon: "Monitor",
        color: "from-blue-500 to-cyan-600",
        content: "Apprentissage pratique avec développement d'applications réelles",
        features: ["Coding intensif", "Projets guidés", "Code reviews", "Best practices"]
      },
      {
        title: "Datasets Réels",
        icon: "Database",
        color: "from-purple-500 to-violet-600",
        content: "Travail sur des jeux de données industriels et cas d'usage authentiques",
        features: ["ImageNet", "COCO dataset", "Données industrielles", "Challenges Kaggle"]
      },
      {
        title: "Performance Focus",
        icon: "Zap",
        color: "from-green-500 to-emerald-600",
        content: "Optimisation et déploiement pour applications temps réel",
        features: ["Profiling code", "GPU acceleration", "Mobile deployment", "Edge computing"]
      },
      {
        title: "Mentorat Expert",
        icon: "Users",
        color: "from-orange-500 to-amber-600",
        content: "Accompagnement par des experts Computer Vision reconnus",
        features: ["1-on-1 mentoring", "Code review expert", "Conseils carrière", "Réseau professionnel"]
      }
    ],
    tableOfContents: [
      { section: "01", title: "Présentation du Programme", anchor: "presentation", icon: "FileText" },
      { section: "02", title: "Domaines Clés", anchor: "key-areas", icon: "Target" },
      { section: "03", title: "Curriculum Formation", anchor: "curriculum-year1", icon: "BookOpen" },
      { section: "04", title: "Objectifs du Programme", anchor: "objectives", icon: "Goal" },
      { section: "05", title: "Objectifs Généraux", anchor: "general-objectives", icon: "Target" },
      { section: "06", title: "Stratégies Pédagogiques", anchor: "teaching-strategies", icon: "Users" },
      { section: "07", title: "Synthèse du Programme", anchor: "synthesis", icon: "CheckCircle" },
      { section: "08", title: "Appel à l'Action", anchor: "cta", icon: "ArrowRight" }
    ],
    synthesis: [
      {
        title: "Excellence Technique",
        icon: "Award",
        gradient: "from-blue-500 to-cyan-600",
        details: [
          "Certification OpenCV",
          "Projets portfolio",
          "Code optimisé",
          "Standards industriels"
        ]
      },
      {
        title: "Innovation Continue",
        icon: "Lightbulb",
        gradient: "from-purple-500 to-violet-600",
        details: [
          "Veille technologique",
          "Recherche appliquée",
          "Nouvelles méthodes",
          "Contributions open source"
        ]
      },
      {
        title: "Opportunités Carrière",
        icon: "Briefcase",
        gradient: "from-green-500 to-emerald-600",
        details: [
          "Marché en croissance",
          "Postes spécialisés",
          "Rémunération attractive",
          "Évolution internationale"
        ]
      }
    ]
  },

  "ethical-ai-governance": {
    id: "ethical-ai-governance",
    slug: "ethical-ai-governance",
    heroTitle: "Formation IA Éthique et Gouvernance",
    heroSubtitle: "Développez une approche responsable de l'IA avec les meilleures pratiques de gouvernance et d'éthique",
    presentationSections: [
      {
        title: "Programme Professionnel",
        icon: "BookOpen",
        color: "bg-blue-100",
        content: "Formation spécialisée en éthique de l'IA couvrant la gouvernance, la responsabilité algorithmique et le développement d'IA de confiance."
      },
      {
        title: "Objectifs de Formation",
        icon: "Target",
        color: "bg-green-100",
        content: "Former des experts capables d'implémenter une gouvernance éthique de l'IA et d'assurer la conformité réglementaire."
      },
      {
        title: "Compétences Acquises",
        icon: "Award",
        color: "bg-purple-100",
        content: "Éthique IA, gouvernance algorithmique, audit d'algorithmes, biais et fairness, réglementation RGPD/AI Act."
      },
      {
        title: "Public Cible",
        icon: "Users",
        color: "bg-orange-100",
        content: "DPO, responsables IA, auditeurs, juristes, dirigeants impliqués dans la stratégie IA de leur organisation."
      }
    ],
    keyAreas: [
      {
        title: "Éthique Algorithmique",
        description: "Principes éthiques et développement responsable",
        icon: "Shield",
        gradient: "from-blue-500 to-indigo-600"
      },
      {
        title: "Gouvernance IA",
        description: "Structures et processus de gouvernance",
        icon: "Settings",
        gradient: "from-purple-500 to-pink-600"
      },
      {
        title: "Audit et Conformité",
        description: "Audit d'algorithmes et conformité réglementaire",
        icon: "CheckCircle",
        gradient: "from-green-500 to-teal-600"
      },
      {
        title: "Gestion des Risques",
        description: "Identification et mitigation des risques IA",
        icon: "AlertTriangle",
        gradient: "from-orange-500 to-red-600"
      }
    ],
    firstYearModules: [
      { code: "ETH101", title: "Fondamentaux Éthique IA", duration: "30h", description: "Principes éthiques de l'intelligence artificielle" },
      { code: "GOV201", title: "Gouvernance IA", duration: "35h", description: "Structures et processus de gouvernance" },
      { code: "AUD301", title: "Audit Algorithmique", duration: "40h", description: "Méthodologies d'audit des algorithmes" },
      { code: "REG401", title: "Réglementation IA", duration: "35h", description: "RGPD, AI Act et conformité légale" },
      { code: "BIAS501", title: "Biais et Fairness", duration: "40h", description: "Détection et correction des biais" },
      { code: "RISK601", title: "Gestion Risques IA", duration: "30h", description: "Risk management et mitigation" }
    ],
    programGoals: [
      {
        id: "ethics",
        title: "Leadership Éthique",
        description: "Expertise en éthique de l'IA",
        icon: "Heart",
        color: "bg-gradient-to-r from-blue-500 to-indigo-600",
        details: ["Principes éthiques", "Développement responsable", "Impact sociétal", "Valeurs humanistes"]
      },
      {
        id: "governance",
        title: "Gouvernance Experte",
        description: "Maîtrise de la gouvernance IA",
        icon: "Shield",
        color: "bg-gradient-to-r from-purple-500 to-pink-600",
        details: ["Cadres de gouvernance", "Processus qualité", "Contrôles internes", "Documentation"]
      },
      {
        id: "compliance",
        title: "Conformité Réglementaire",
        description: "Expertise juridique et compliance",
        icon: "Scale",
        color: "bg-gradient-to-r from-green-500 to-teal-600",
        details: ["RGPD", "AI Act européen", "Normes ISO", "Certifications"]
      },
      {
        id: "risk",
        title: "Gestion des Risques",
        description: "Maîtrise du risk management IA",
        icon: "AlertTriangle",
        color: "bg-gradient-to-r from-orange-500 to-red-600",
        details: ["Identification risques", "Plans de mitigation", "Monitoring continu", "Reporting"]
      }
    ],
    objectives: {
      mainTitle: "Objectifs Généraux",
      description: "Former des experts en éthique et gouvernance IA capables d'implémenter une approche responsable de l'intelligence artificielle.",
      leftColumn: {
        title: "Expertise Éthique",
        skills: [
          "Principes éthiques de l'IA",
          "Cadres de gouvernance",
          "Audit algorithmique",
          "Conformité réglementaire",
          "Gestion des biais",
          "Risk management IA"
        ],
        description: "Compétences complètes pour assurer une utilisation éthique et responsable de l'IA en organisation."
      },
      rightColumn: {
        sections: [
          {
            title: "Approche Pratique",
            description: "Méthodologies concrètes pour implémenter l'éthique IA dans les processus d'entreprise."
          },
          {
            title: "Conformité Légale",
            description: "Maîtrise des réglementations actuelles et futures sur l'intelligence artificielle."
          },
          {
            title: "Impact Organisationnel",
            description: "Capacité à transformer la culture d'entreprise vers une IA responsable."
          }
        ]
      }
    },
    teachingStrategies: [
      {
        title: "Cas d'Étude Éthiques",
        icon: "BookOpen",
        color: "from-blue-500 to-indigo-600",
        content: "Analyse de cas réels de dilemmes éthiques et de gouvernance IA",
        features: ["Études de cas", "Débats éthiques", "Simulations", "Retours d'expérience"]
      },
      {
        title: "Frameworks Pratiques",
        icon: "Settings",
        color: "from-purple-500 to-pink-600",
        content: "Application de frameworks de gouvernance et d'audit reconnus",
        features: ["ISO/IEC standards", "NIST AI framework", "IEEE standards", "EU guidelines"]
      },
      {
        title: "Veille Réglementaire",
        icon: "Scale",
        color: "from-green-500 to-teal-600",
        content: "Suivi des évolutions réglementaires et des bonnes pratiques",
        features: ["AI Act européen", "RGPD", "Normes sectorielles", "Jurisprudence"]
      },
      {
        title: "Réseau d'Experts",
        icon: "Users",
        color: "from-orange-500 to-red-600",
        content: "Accès à un réseau de professionnels de l'éthique et de la gouvernance IA",
        features: ["Experts juridiques", "DPO expérimentés", "Consultants éthique", "Communauté pratique"]
      }
    ],
    tableOfContents: [
      { section: "01", title: "Présentation du Programme", anchor: "presentation", icon: "FileText" },
      { section: "02", title: "Domaines Clés", anchor: "key-areas", icon: "Target" },
      { section: "03", title: "Curriculum Formation", anchor: "curriculum-year1", icon: "BookOpen" },
      { section: "04", title: "Objectifs du Programme", anchor: "objectives", icon: "Goal" },
      { section: "05", title: "Objectifs Généraux", anchor: "general-objectives", icon: "Target" },
      { section: "06", title: "Stratégies Pédagogiques", anchor: "teaching-strategies", icon: "Users" },
      { section: "07", title: "Synthèse du Programme", anchor: "synthesis", icon: "CheckCircle" },
      { section: "08", title: "Appel à l'Action", anchor: "cta", icon: "ArrowRight" }
    ],
    synthesis: [
      {
        title: "Leadership Éthique",
        icon: "Heart",
        gradient: "from-blue-500 to-indigo-600",
        details: [
          "Vision éthique",
          "Influence positive",
          "Transformation culturelle",
          "Impact sociétal"
        ]
      },
      {
        title: "Expertise Réglementaire",
        icon: "Scale",
        gradient: "from-purple-500 to-pink-600",
        details: [
          "Conformité assurée",
          "Veille juridique",
          "Risk mitigation",
          "Certification reconnue"
        ]
      },
      {
        title: "Avantage Concurrentiel",
        icon: "TrendingUp",
        gradient: "from-green-500 to-teal-600",
        details: [
          "IA de confiance",
          "Différenciation marché",
          "Réputation renforcée",
          "Innovation responsable"
        ]
      }
    ]
  },

  "python-ai-programming": {
    id: "python-ai-programming",
    slug: "python-ai-programming",
    heroTitle: "Formation Python pour IA et Programmation",
    heroSubtitle: "Maîtrisez Python pour l'IA avec les bibliothèques essentielles et les techniques avancées",
    presentationSections: [
      {
        title: "Programme Professionnel",
        icon: "BookOpen",
        color: "bg-blue-100",
        content: "Formation complète en Python pour l'IA couvrant les bibliothèques essentielles, les frameworks ML/DL et les bonnes pratiques."
      },
      {
        title: "Objectifs de Formation",
        icon: "Target",
        color: "bg-green-100",
        content: "Former des développeurs Python experts en IA capables de créer des applications intelligentes performantes."
      },
      {
        title: "Compétences Acquises",
        icon: "Award",
        color: "bg-purple-100",
        content: "Python avancé, NumPy, Pandas, Scikit-learn, TensorFlow, PyTorch, APIs, déploiement, optimisation."
      },
      {
        title: "Public Cible",
        icon: "Users",
        color: "bg-orange-100",
        content: "Développeurs, data scientists, ingénieurs souhaitant se spécialiser en programmation Python pour l'IA."
      }
    ],
    keyAreas: [
      {
        title: "Python Avancé",
        description: "Maîtrise complète du langage Python",
        icon: "Code",
        gradient: "from-yellow-500 to-orange-600"
      },
      {
        title: "Bibliothèques IA",
        description: "NumPy, Pandas, Scikit-learn, TensorFlow, PyTorch",
        icon: "Package",
        gradient: "from-blue-500 to-cyan-600"
      },
      {
        title: "Machine Learning",
        description: "Implémentation d'algorithmes ML en Python",
        icon: "Brain",
        gradient: "from-purple-500 to-violet-600"
      },
      {
        title: "Déploiement Production",
        description: "APIs, microservices et déploiement cloud",
        icon: "Server",
        gradient: "from-green-500 to-emerald-600"
      }
    ],
    firstYearModules: [
      { code: "PY101", title: "Python Fondamental", duration: "40h", description: "Syntaxe et concepts fondamentaux Python" },
      { code: "PY201", title: "Python Avancé", duration: "45h", description: "OOP, décorateurs, générateurs, async" },
      { code: "DATA301", title: "NumPy et Pandas", duration: "35h", description: "Manipulation de données avec NumPy/Pandas" },
      { code: "ML401", title: "Scikit-learn", duration: "40h", description: "Machine Learning avec Scikit-learn" },
      { code: "DL501", title: "TensorFlow/PyTorch", duration: "50h", description: "Deep Learning frameworks" },
      { code: "DEPLOY601", title: "Déploiement IA", duration: "35h", description: "APIs Flask/FastAPI et déploiement" }
    ],
    secondYearModules: [
      { code: "OPT701", title: "Optimisation Performance", duration: "35h", description: "Profiling et optimisation Python" },
      { code: "API801", title: "APIs Avancées", duration: "30h", description: "Microservices et architectures distribuées" },
      { code: "MLO901", title: "MLOps Python", duration: "40h", description: "Pipeline ML avec Python" },
      { code: "PROJ1001", title: "Projet Full-Stack IA", duration: "55h", description: "Application IA complète" }
    ],
    programGoals: [
      {
        id: "mastery",
        title: "Maîtrise Python",
        description: "Expertise complète du langage Python",
        icon: "Code",
        color: "bg-gradient-to-r from-yellow-500 to-orange-600",
        details: ["Syntaxe avancée", "Patterns design", "Performance optimization", "Best practices"]
      },
      {
        id: "ai-libraries",
        title: "Écosystème IA",
        description: "Maîtrise des bibliothèques IA essentielles",
        icon: "Package",
        color: "bg-gradient-to-r from-blue-500 to-cyan-600",
        details: ["NumPy/Pandas expert", "ML frameworks", "Visualisation", "Data processing"]
      },
      {
        id: "production",
        title: "Déploiement Production",
        description: "Capacité à déployer des solutions IA",
        icon: "Server",
        color: "bg-gradient-to-r from-purple-500 to-violet-600",
        details: ["APIs robustes", "Cloud deployment", "Monitoring", "Scalabilité"]
      },
      {
        id: "career",
        title: "Évolution Carrière",
        description: "Compétences recherchées sur le marché",
        icon: "TrendingUp",
        color: "bg-gradient-to-r from-green-500 to-emerald-600",
        details: ["Profils recherchés", "Salaires attractifs", "Évolution rapide", "Opportunités internationales"]
      }
    ],
    objectives: {
      mainTitle: "Objectifs Généraux",
      description: "Former des développeurs Python experts capables de créer des applications d'IA robustes et performantes.",
      leftColumn: {
        title: "Expertise Technique",
        skills: [
          "Python avancé et patterns",
          "Écosystème data science",
          "Frameworks ML/DL",
          "APIs et microservices",
          "Optimisation performance",
          "Déploiement cloud"
        ],
        description: "Maîtrise complète de Python pour l'IA, de la conception au déploiement en production."
      },
      rightColumn: {
        sections: [
          {
            title: "Projets Concrets",
            description: "Développement d'applications IA complètes avec Python et déploiement réel."
          },
          {
            title: "Bonnes Pratiques",
            description: "Code quality, testing, documentation et méthodologies de développement."
          },
          {
            title: "Performance",
            description: "Techniques d'optimisation et de mise à l'échelle des applications Python."
          }
        ]
      }
    },
    teachingStrategies: [
      {
        title: "Coding Intensif",
        icon: "Monitor",
        color: "from-yellow-500 to-orange-600",
        content: "Apprentissage par la pratique avec développement continu de projets",
        features: ["Live coding", "Pair programming", "Code reviews", "Projets guidés"]
      },
      {
        title: "Projets Réels",
        icon: "Briefcase",
        color: "from-blue-500 to-cyan-600",
        content: "Développement d'applications IA complètes et déployables",
        features: ["Applications web", "APIs REST", "Modèles ML/DL", "Déploiement cloud"]
      },
      {
        title: "Best Practices",
        icon: "CheckCircle",
        color: "from-purple-500 to-violet-600",
        content: "Intégration des bonnes pratiques de développement Python",
        features: ["Clean code", "Testing (pytest)", "Documentation", "Git workflow"]
      },
      {
        title: "Mentorat Technique",
        icon: "Users",
        color: "from-green-500 to-emerald-600",
        content: "Accompagnement par des développeurs Python seniors",
        features: ["Code mentoring", "Architecture review", "Career guidance", "Technical support"]
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
        title: "Expertise Python",
        icon: "Code",
        gradient: "from-yellow-500 to-orange-600",
        details: [
          "Maîtrise complète",
          "Patterns avancés",
          "Performance optimale",
          "Code professionnel"
        ]
      },
      {
        title: "Écosystème IA",
        icon: "Package",
        gradient: "from-blue-500 to-cyan-600",
        details: [
          "Bibliothèques maîtrisées",
          "Frameworks ML/DL",
          "Outils production",
          "Veille technologique"
        ]
      },
      {
        title: "Opportunités Marché",
        icon: "TrendingUp",
        gradient: "from-green-500 to-emerald-600",
        details: [
          "Demande élevée",
          "Salaires attractifs",
          "Projets innovants",
          "Évolution internationale"
        ]
      }
    ]
  },

  "data-science-business": {
    id: "data-science-business",
    slug: "data-science-business",
    heroTitle: "Formation Data Science pour le Business",
    heroSubtitle: "Transformez les données en insights business stratégiques pour piloter la croissance",
    presentationSections: [
      {
        title: "Programme Professionnel",
        icon: "BookOpen",
        color: "bg-blue-100",
        content: "Formation Data Science orientée business couvrant l'analyse de données, la modélisation prédictive et la prise de décision data-driven."
      },
      {
        title: "Objectifs de Formation",
        icon: "Target",
        color: "bg-green-100",
        content: "Former des data scientists business capables de traduire les données en stratégies et recommandations concrètes."
      },
      {
        title: "Compétences Acquises",
        icon: "Award",
        color: "bg-purple-100",
        content: "Analytics business, modélisation prédictive, segmentation clients, ROI analysis, storytelling data."
      },
      {
        title: "Public Cible",
        icon: "Users",
        color: "bg-orange-100",
        content: "Analystes business, consultants, managers, entrepreneurs souhaitant exploiter les données pour leurs décisions."
      }
    ],
    keyAreas: [
      {
        title: "Analytics Business",
        description: "Analyse de données orientée business et KPIs",
        icon: "BarChart3",
        gradient: "from-blue-500 to-indigo-600"
      },
      {
        title: "Modélisation Prédictive",
        description: "Forecasting et prédictions business",
        icon: "TrendingUp",
        gradient: "from-purple-500 to-pink-600"
      },
      {
        title: "Segmentation Client",
        description: "Analyse comportementale et segmentation",
        icon: "Users",
        gradient: "from-green-500 to-teal-600"
      },
      {
        title: "ROI et Performance",
        description: "Mesure d'impact et optimisation ROI",
        icon: "DollarSign",
        gradient: "from-orange-500 to-amber-600"
      }
    ],
    firstYearModules: [
      { code: "DSB101", title: "Fondamentaux Data Science Business", duration: "35h", description: "Introduction à la data science appliquée au business" },
      { code: "ANA201", title: "Analytics Business", duration: "40h", description: "Analyse de données et KPIs business" },
      { code: "PRED301", title: "Modélisation Prédictive", duration: "45h", description: "Forecasting et modèles prédictifs" },
      { code: "SEG401", title: "Segmentation Client", duration: "35h", description: "Analyse comportementale et clustering" },
      { code: "VIS501", title: "Visualisation Business", duration: "30h", description: "Dashboards et reporting exécutif" },
      { code: "ROI601", title: "ROI et Performance", duration: "35h", description: "Mesure d'impact et optimisation" }
    ],
    secondYearModules: [
      { code: "ADV701", title: "Analytics Avancées", duration: "40h", description: "Techniques avancées d'analyse business" },
      { code: "STRAT801", title: "Stratégie Data-Driven", duration: "35h", description: "Intégration data dans la stratégie" },
      { code: "LEAD901", title: "Leadership Data", duration: "30h", description: "Management d'équipes data" },
      { code: "PROJ1001", title: "Projet Business Case", duration: "50h", description: "Cas d'usage business complet" }
    ],
    programGoals: [
      {
        id: "business-insight",
        title: "Business Intelligence",
        description: "Transformation des données en insights business",
        icon: "Lightbulb",
        color: "bg-gradient-to-r from-blue-500 to-indigo-600",
        details: ["Analytics avancées", "KPIs stratégiques", "Dashboards exécutifs", "Reporting automatisé"]
      },
      {
        id: "predictive",
        title: "Analyse Prédictive",
        description: "Capacité de prédiction et forecasting",
        icon: "TrendingUp",
        color: "bg-gradient-to-r from-purple-500 to-pink-600",
        details: ["Modèles prédictifs", "Forecasting", "Scénarios business", "Risk assessment"]
      },
      {
        id: "strategy",
        title: "Stratégie Data-Driven",
        description: "Intégration de la data dans la stratégie",
        icon: "Target",
        color: "bg-gradient-to-r from-green-500 to-teal-600",
        details: ["Décisions basées data", "Stratégie digitale", "Transformation data", "Competitive advantage"]
      },
      {
        id: "roi",
        title: "Impact Business",
        description: "Mesure et optimisation du ROI",
        icon: "DollarSign",
        color: "bg-gradient-to-r from-orange-500 to-amber-600",
        details: ["ROI measurement", "Performance optimization", "Business value", "Cost reduction"]
      }
    ],
    objectives: {
      mainTitle: "Objectifs Généraux",
      description: "Former des data scientists business capables de créer de la valeur économique à partir des données.",
      leftColumn: {
        title: "Expertise Business",
        skills: [
          "Analytics business et KPIs",
          "Modélisation prédictive",
          "Segmentation client avancée",
          "ROI et performance measurement",
          "Storytelling avec les données",
          "Stratégie data-driven"
        ],
        description: "Compétences pour transformer les données en avantage concurrentiel et croissance business."
      },
      rightColumn: {
        sections: [
          {
            title: "Business Focus",
            description: "Approche orientée résultats business avec impact mesurable sur la performance."
          },
          {
            title: "Outils Professionnels",
            description: "Maîtrise des outils analytics utilisés en entreprise (Tableau, Power BI, Python/R)."
          },
          {
            title: "Leadership Data",
            description: "Capacité à conduire la transformation data de l'organisation."
          }
        ]
      }
    },
    teachingStrategies: [
      {
        title: "Cas Business Réels",
        icon: "Briefcase",
        color: "from-blue-500 to-indigo-600",
        content: "Apprentissage basé sur des cas d'usage business authentiques",
        features: ["Études de cas", "Projets clients", "Problématiques réelles", "Contraintes business"]
      },
      {
        title: "ROI Measurement",
        icon: "DollarSign",
        color: "from-purple-500 to-pink-600",
        content: "Focus sur la mesure d'impact et la création de valeur",
        features: ["Business metrics", "KPIs tracking", "ROI calculation", "Value demonstration"]
      },
      {
        title: "Storytelling Data",
        icon: "MessageSquare",
        color: "from-green-500 to-teal-600",
        content: "Communication efficace des insights aux décideurs",
        features: ["Data visualization", "Executive reporting", "Presentation skills", "Persuasion techniques"]
      },
      {
        title: "Mentorat Business",
        icon: "Users",
        color: "from-orange-500 to-amber-600",
        content: "Accompagnement par des experts data science business",
        features: ["Business mentoring", "Strategy guidance", "Network access", "Career development"]
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
        title: "Excellence Business",
        icon: "Award",
        gradient: "from-blue-500 to-indigo-600",
        details: [
          "Expertise reconnue",
          "Résultats mesurables",
          "Impact business",
          "Certification professionnelle"
        ]
      },
      {
        title: "Avantage Concurrentiel",
        icon: "Target",
        gradient: "from-purple-500 to-pink-600",
        details: [
          "Décisions data-driven",
          "Innovation business",
          "Optimisation performance",
          "Croissance durable"
        ]
      },
      {
        title: "Évolution Carrière",
        icon: "TrendingUp",
        gradient: "from-green-500 to-teal-600",
        details: [
          "Postes stratégiques",
          "Rémunération attractive",
          "Leadership data",
          "Reconnaissance marché"
        ]
      }
    ]
  },

  "data-science-scikit-learn": {
    id: "data-science-scikit-learn",
    slug: "data-science-scikit-learn",
    heroTitle: "Formation Data Science avec Scikit-learn",
    heroSubtitle: "Maîtrisez le machine learning avec Scikit-learn et développez des modèles prédictifs performants",
    presentationSections: [
      {
        title: "Programme Professionnel",
        icon: "BookOpen",
        color: "bg-blue-100",
        content: "Formation spécialisée en Data Science utilisant Scikit-learn pour le machine learning, de l'exploration de données au déploiement de modèles."
      },
      {
        title: "Objectifs de Formation",
        icon: "Target",
        color: "bg-green-100",
        content: "Former des data scientists experts en Scikit-learn capables de créer des solutions ML robustes et performantes."
      },
      {
        title: "Compétences Acquises",
        icon: "Award",
        color: "bg-purple-100",
        content: "Scikit-learn expert, preprocessing, feature engineering, modélisation ML, validation, hyperparameter tuning."
      },
      {
        title: "Public Cible",
        icon: "Users",
        color: "bg-orange-100",
        content: "Data scientists, analystes, développeurs Python souhaitant se spécialiser en machine learning avec Scikit-learn."
      }
    ],
    keyAreas: [
      {
        title: "Preprocessing Données",
        description: "Nettoyage et préparation des données",
        icon: "Filter",
        gradient: "from-blue-500 to-cyan-600"
      },
      {
        title: "Feature Engineering",
        description: "Création et sélection de variables",
        icon: "Settings",
        gradient: "from-purple-500 to-violet-600"
      },
      {
        title: "Modélisation ML",
        description: "Algorithmes supervisés et non-supervisés",
        icon: "Brain",
        gradient: "from-green-500 to-emerald-600"
      },
      {
        title: "Model Validation",
        description: "Évaluation et optimisation des modèles",
        icon: "CheckCircle",
        gradient: "from-orange-500 to-amber-600"
      }
    ],
    firstYearModules: [
      { code: "SKL101", title: "Introduction Scikit-learn", duration: "30h", description: "Découverte de l'écosystème Scikit-learn" },
      { code: "PREP201", title: "Preprocessing Avancé", duration: "40h", description: "Techniques de préparation des données" },
      { code: "FE301", title: "Feature Engineering", duration: "35h", description: "Création et sélection de variables" },
      { code: "ML401", title: "ML Supervisé", duration: "45h", description: "Classification et régression" },
      { code: "UML501", title: "ML Non-Supervisé", duration: "35h", description: "Clustering et réduction dimensionnalité" },
      { code: "VAL601", title: "Validation Modèles", duration: "40h", description: "Cross-validation et métriques" }
    ],
    secondYearModules: [
      { code: "ENS701", title: "Ensemble Methods", duration: "35h", description: "Random Forest, Gradient Boosting" },
      { code: "TUNE801", title: "Hyperparameter Tuning", duration: "30h", description: "Optimisation des hyperparamètres" },
      { code: "PIPE901", title: "Pipelines ML", duration: "35h", description: "Création de pipelines robustes" },
      { code: "DEPLOY1001", title: "Déploiement Modèles", duration: "45h", description: "Production et monitoring" }
    ],
    programGoals: [
      {
        id: "sklearn-mastery",
        title: "Maîtrise Scikit-learn",
        description: "Expertise complète de la bibliothèque",
        icon: "Code",
        color: "bg-gradient-to-r from-blue-500 to-cyan-600",
        details: ["API complète", "Best practices", "Performance optimization", "Advanced features"]
      },
      {
        id: "ml-expertise",
        title: "Expertise ML",
        description: "Compétences avancées en machine learning",
        icon: "Brain",
        color: "bg-gradient-to-r from-purple-500 to-violet-600",
        details: ["Algorithmes avancés", "Feature engineering", "Model selection", "Ensemble methods"]
      },
      {
        id: "production",
        title: "Production Ready",
        description: "Déploiement de modèles en production",
        icon: "Server",
        color: "bg-gradient-to-r from-green-500 to-emerald-600",
        details: ["Pipelines robustes", "Model versioning", "Monitoring", "Scalabilité"]
      },
      {
        id: "innovation",
        title: "Innovation Data",
        description: "Capacité d'innovation en data science",
        icon: "Lightbulb",
        color: "bg-gradient-to-r from-orange-500 to-amber-600",
        details: ["Nouvelles approches", "Recherche appliquée", "Solutions créatives", "Veille technologique"]
      }
    ],
    objectives: {
      mainTitle: "Objectifs Généraux",
      description: "Former des experts Scikit-learn capables de créer des solutions ML complètes et performantes.",
      leftColumn: {
        title: "Expertise Technique",
        skills: [
          "API Scikit-learn complète",
          "Preprocessing et feature engineering",
          "Algorithmes ML supervisés/non-supervisés",
          "Validation et évaluation de modèles",
          "Pipelines et automatisation",
          "Déploiement et monitoring"
        ],
        description: "Maîtrise complète de Scikit-learn pour créer des solutions ML robustes et scalables."
      },
      rightColumn: {
        sections: [
          {
            title: "Pratique Intensive",
            description: "Développement continu de projets ML avec Scikit-learn sur des datasets réels."
          },
          {
            title: "Best Practices",
            description: "Intégration des bonnes pratiques de développement ML et de la recherche."
          },
          {
            title: "Performance",
            description: "Optimisation des modèles pour la performance et l'efficacité computationnelle."
          }
        ]
      }
    },
    teachingStrategies: [
      {
        title: "Hands-on Projects",
        icon: "Monitor",
        color: "from-blue-500 to-cyan-600",
        content: "Apprentissage pratique avec projets ML complets",
        features: ["Notebooks interactifs", "Datasets réels", "Projets guidés", "Code reviews"]
      },
      {
        title: "ML Pipeline Focus",
        icon: "GitBranch",
        color: "from-purple-500 to-violet-600",
        content: "Construction de pipelines ML robustes et reproductibles",
        features: ["Pipeline design", "Automation", "Version control", "Testing"]
      },
      {
        title: "Performance Optimization",
        icon: "Zap",
        color: "from-green-500 to-emerald-600",
        content: "Optimisation des performances et de la scalabilité",
        features: ["Profiling", "Memory optimization", "Parallel processing", "GPU acceleration"]
      },
      {
        title: "Expert Mentoring",
        icon: "Users",
        color: "from-orange-500 to-amber-600",
        content: "Accompagnement par des data scientists seniors",
        features: ["1-on-1 mentoring", "Architecture review", "Career guidance", "Industry insights"]
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
        title: "Expertise Scikit-learn",
        icon: "Code",
        gradient: "from-blue-500 to-cyan-600",
        details: [
          "Maîtrise complète API",
          "Best practices",
          "Performance optimale",
          "Production ready"
        ]
      },
      {
        title: "Compétences ML",
        icon: "Brain",
        gradient: "from-purple-500 to-violet-600",
        details: [
          "Algorithmes avancés",
          "Feature engineering",
          "Model optimization",
          "Ensemble methods"
        ]
      },
      {
        title: "Opportunités Marché",
        icon: "TrendingUp",
        gradient: "from-green-500 to-emerald-600",
        details: [
          "Forte demande",
          "Postes spécialisés",
          "Évolution rapide",
          "Innovation continue"
        ]
      }
    ]
  },

  "ai-applications-industries": {
    id: "ai-applications-industries",
    slug: "ai-applications-industries",
    heroTitle: "Formation IA Applications Industrielles",
    heroSubtitle: "Découvrez comment l'IA transforme les industries et développez des solutions sectorielles innovantes",
    presentationSections: [
      {
        title: "Programme Professionnel",
        icon: "BookOpen",
        color: "bg-blue-100",
        content: "Formation spécialisée sur les applications de l'IA dans différents secteurs industriels, de la santé à la finance en passant par l'industrie 4.0."
      },
      {
        title: "Objectifs de Formation",
        icon: "Target",
        color: "bg-green-100",
        content: "Former des experts capables d'adapter l'IA aux contraintes et besoins spécifiques de chaque secteur industriel."
      },
      {
        title: "Compétences Acquises",
        icon: "Award",
        color: "bg-purple-100",
        content: "IA médicale, fintech, industrie 4.0, retail intelligence, smart cities, agriculture de précision, énergie."
      },
      {
        title: "Public Cible",
        icon: "Users",
        color: "bg-orange-100",
        content: "Consultants, ingénieurs, managers souhaitant spécialiser l'IA dans leur secteur d'activité."
      }
    ],
    keyAreas: [
      {
        title: "IA Médicale",
        description: "Applications de l'IA dans la santé et médecine",
        icon: "Heart",
        gradient: "from-red-500 to-pink-600"
      },
      {
        title: "Fintech & Banking",
        description: "Intelligence artificielle en finance",
        icon: "DollarSign",
        gradient: "from-green-500 to-emerald-600"
      },
      {
        title: "Industrie 4.0",
        description: "IA pour la production et maintenance",
        icon: "Factory",
        gradient: "from-blue-500 to-indigo-600"
      },
      {
        title: "Retail Intelligence",
        description: "IA pour le commerce et e-commerce",
        icon: "ShoppingCart",
        gradient: "from-purple-500 to-violet-600"
      }
    ],
    firstYearModules: [
      { code: "AII101", title: "IA Secteurs Overview", duration: "30h", description: "Panorama des applications IA par secteur" },
      { code: "MED201", title: "IA Médicale", duration: "40h", description: "Applications IA en santé et médecine" },
      { code: "FIN301", title: "IA Finance", duration: "35h", description: "Fintech et applications financières" },
      { code: "IND401", title: "Industrie 4.0", duration: "40h", description: "IA pour l'industrie et production" },
      { code: "RET501", title: "Retail Intelligence", duration: "35h", description: "IA pour le commerce et marketing" },
      { code: "SMART601", title: "Smart Cities", duration: "30h", description: "IA pour les villes intelligentes" }
    ],
    secondYearModules: [
      { code: "AGR701", title: "Agriculture Précision", duration: "35h", description: "IA pour l'agriculture moderne" },
      { code: "ENE801", title: "IA Énergie", duration: "30h", description: "Applications énergétiques" },
      { code: "TRANS901", title: "Transport Autonome", duration: "40h", description: "IA pour la mobilité" },
      { code: "PROJ1001", title: "Projet Sectoriel", duration: "50h", description: "Projet IA dans un secteur choisi" }
    ],
    programGoals: [
      {
        id: "sectorial",
        title: "Expertise Sectorielle",
        description: "Spécialisation IA par secteur d'activité",
        icon: "Target",
        color: "bg-gradient-to-r from-blue-500 to-indigo-600",
        details: ["Connaissance métier", "Contraintes sectorielles", "Réglementations", "Use cases spécifiques"]
      },
      {
        id: "innovation",
        title: "Innovation Appliquée",
        description: "Développement de solutions innovantes",
        icon: "Lightbulb",
        color: "bg-gradient-to-r from-purple-500 to-violet-600",
        details: ["Solutions disruptives", "Nouveaux modèles", "Avantage concurrentiel", "Transformation digitale"]
      },
      {
        id: "implementation",
        title: "Mise en Œuvre",
        description: "Capacité d'implémentation réelle",
        icon: "Cog",
        color: "bg-gradient-to-r from-green-500 to-emerald-600",
        details: ["Proof of concept", "Pilotes", "Déploiement", "Change management"]
      },
      {
        id: "consulting",
        title: "Expertise Conseil",
        description: "Capacité de conseil et accompagnement",
        icon: "Users2",
        color: "bg-gradient-to-r from-orange-500 to-amber-600",
        details: ["Diagnostic IA", "Stratégie", "Roadmap", "Formation équipes"]
      }
    ],
    objectives: {
      mainTitle: "Objectifs Généraux",
      description: "Former des experts en applications sectorielles de l'IA capables d'adapter les technologies aux besoins industriels.",
      leftColumn: {
        title: "Expertise Industrielle",
        skills: [
          "Applications IA médicales",
          "Fintech et banking IA",
          "Industrie 4.0 et IoT",
          "Retail et e-commerce intelligence",
          "Smart cities et mobilité",
          "Agriculture et énergie de précision"
        ],
        description: "Compétences pour adapter l'IA aux contraintes et opportunités de chaque secteur industriel."
      },
      rightColumn: {
        sections: [
          {
            title: "Approche Métier",
            description: "Compréhension profonde des enjeux et contraintes de chaque secteur d'activité."
          },
          {
            title: "Solutions Concrètes",
            description: "Développement de solutions IA directement applicables en contexte industriel."
          },
          {
            title: "Impact Mesurable",
            description: "Capacité à démontrer la valeur et le ROI des applications IA sectorielles."
          }
        ]
      }
    },
    teachingStrategies: [
      {
        title: "Études Sectorielles",
        icon: "Building",
        color: "from-blue-500 to-indigo-600",
        content: "Analyse approfondie des enjeux IA par secteur industriel",
        features: ["Cas d'usage réels", "Contraintes métier", "Success stories", "Échecs analysés"]
      },
      {
        title: "Projets Industriels",
        icon: "Factory",
        color: "from-purple-500 to-violet-600",
        content: "Développement de solutions IA pour des problématiques industrielles",
        features: ["Partenariats entreprises", "Données réelles", "Contraintes production", "Validation terrain"]
      },
      {
        title: "Expert Network",
        icon: "Network",
        color: "from-green-500 to-emerald-600",
        content: "Accès à un réseau d'experts sectoriels et IA",
        features: ["Intervenants experts", "Mentors industrie", "Retours d'expérience", "Networking"]
      },
      {
        title: "Innovation Lab",
        icon: "Lightbulb",
        color: "from-orange-500 to-amber-600",
        content: "Laboratoire d'innovation pour tester de nouvelles applications",
        features: ["Prototypage rapide", "Test & learn", "Innovation continue", "Brevets potentiels"]
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
        title: "Expertise Reconnue",
        icon: "Award",
        gradient: "from-blue-500 to-indigo-600",
        details: [
          "Spécialisation sectorielle",
          "Connaissance métier",
          "Certification reconnue",
          "Expertise recherchée"
        ]
      },
      {
        title: "Innovation Impact",
        icon: "Lightbulb",
        gradient: "from-purple-500 to-violet-600",
        details: [
          "Solutions disruptives",
          "Transformation digitale",
          "Avantage concurrentiel",
          "Nouveaux marchés"
        ]
      },
      {
        title: "Opportunités Carrière",
        icon: "TrendingUp",
        gradient: "from-green-500 to-emerald-600",
        details: [
          "Consulting spécialisé",
          "Postes direction IA",
          "Entrepreneuriat",
          "Innovation leadership"
        ]
      }
    ]
  },

  "excel-data-analysis": {
    id: "excel-data-analysis",
    slug: "excel-data-analysis",
    heroTitle: "Formation Analyse de Données avec Excel",
    heroSubtitle: "Maîtrisez l'analyse de données avancée avec Excel et transformez vos compétences analytiques",
    presentationSections: [
      {
        title: "Programme Professionnel",
        icon: "BookOpen",
        color: "bg-blue-100",
        content: "Formation complète en analyse de données Excel couvrant les fonctions avancées, Power Query, Power Pivot et la visualisation."
      },
      {
        title: "Objectifs de Formation",
        icon: "Target",
        color: "bg-green-100",
        content: "Former des experts Excel capables de réaliser des analyses de données complexes et de créer des tableaux de bord interactifs."
      },
      {
        title: "Compétences Acquises",
        icon: "Award",
        color: "bg-purple-100",
        content: "Excel avancé, Power Query, Power Pivot, VBA, tableaux croisés dynamiques, dashboards, macros."
      },
      {
        title: "Public Cible",
        icon: "Users",
        color: "bg-orange-100",
        content: "Analystes, contrôleurs, consultants, managers utilisant Excel pour l'analyse de données professionnelle."
      }
    ],
    keyAreas: [
      {
        title: "Fonctions Avancées",
        description: "Maîtrise des formules et fonctions complexes",
        icon: "Calculator",
        gradient: "from-green-500 to-emerald-600"
      },
      {
        title: "Power Query",
        description: "ETL et transformation de données",
        icon: "Database",
        gradient: "from-blue-500 to-cyan-600"
      },
      {
        title: "Power Pivot",
        description: "Modélisation de données et DAX",
        icon: "BarChart3",
        gradient: "from-purple-500 to-violet-600"
      },
      {
        title: "Dashboards Interactifs",
        description: "Création de tableaux de bord dynamiques",
        icon: "PieChart",
        gradient: "from-orange-500 to-amber-600"
      }
    ],
    firstYearModules: [
      { code: "EXL101", title: "Excel Fondamentaux", duration: "25h", description: "Bases solides d'Excel pour l'analyse" },
      { code: "ADV201", title: "Fonctions Avancées", duration: "35h", description: "Formules complexes et fonctions spécialisées" },
      { code: "TCD301", title: "Tableaux Croisés Dynamiques", duration: "30h", description: "Analyse multidimensionnelle des données" },
      { code: "PQ401", title: "Power Query", duration: "40h", description: "ETL et transformation de données" },
      { code: "PP501", title: "Power Pivot", duration: "35h", description: "Modélisation et langage DAX" },
      { code: "DASH601", title: "Dashboards Excel", duration: "30h", description: "Tableaux de bord interactifs" }
    ],
    secondYearModules: [
      { code: "VBA701", title: "VBA Programmation", duration: "40h", description: "Automatisation avec VBA" },
      { code: "ADV801", title: "Techniques Avancées", duration: "35h", description: "Techniques expertes d'analyse" },
      { code: "INT901", title: "Intégration Données", duration: "30h", description: "Connexions sources externes" },
      { code: "PROJ1001", title: "Projet Analyse Complète", duration: "40h", description: "Projet d'analyse de bout en bout" }
    ],
    programGoals: [
      {
        id: "excel-mastery",
        title: "Maîtrise Excel",
        description: "Expertise complète d'Excel pour l'analyse",
        icon: "Calculator",
        color: "bg-gradient-to-r from-green-500 to-emerald-600",
        details: ["Formules expertes", "Power tools", "Automatisation", "Best practices"]
      },
      {
        id: "data-analysis",
        title: "Analyse de Données",
        description: "Compétences analytiques avancées",
        icon: "BarChart3",
        color: "bg-gradient-to-r from-blue-500 to-cyan-600",
        details: ["Analyse statistique", "Modélisation", "Prédictions", "Insights business"]
      },
      {
        id: "visualization",
        title: "Visualisation Expert",
        description: "Création de visualisations impactantes",
        icon: "PieChart",
        color: "bg-gradient-to-r from-purple-500 to-violet-600",
        details: ["Dashboards interactifs", "Graphiques avancés", "Storytelling", "Design UX"]
      },
      {
        id: "productivity",
        title: "Productivité Maximale",
        description: "Efficacité et automatisation",
        icon: "Zap",
        color: "bg-gradient-to-r from-orange-500 to-amber-600",
        details: ["Automatisation VBA", "Templates réutilisables", "Processus optimisés", "Gain de temps"]
      }
    ],
    objectives: {
      mainTitle: "Objectifs Généraux",
      description: "Former des experts Excel capables de réaliser des analyses de données professionnelles et de créer des solutions analytiques.",
      leftColumn: {
        title: "Expertise Technique",
        skills: [
          "Excel avancé et Power Tools",
          "Formules et fonctions complexes",
          "Power Query et Power Pivot",
          "VBA et automatisation",
          "Dashboards et visualisation",
          "Intégration données externes"
        ],
        description: "Maîtrise complète d'Excel pour l'analyse de données, de l'importation à la visualisation."
      },
      rightColumn: {
        sections: [
          {
            title: "Applications Pratiques",
            description: "Projets basés sur des problématiques business réelles avec données authentiques."
          },
          {
            title: "Efficacité Professionnelle",
            description: "Techniques d'optimisation et d'automatisation pour gagner en productivité."
          },
          {
            title: "Standards Entreprise",
            description: "Bonnes pratiques et méthodologies utilisées en environnement professionnel."
          }
        ]
      }
    },
    teachingStrategies: [
      {
        title: "Pratique Intensive",
        icon: "Monitor",
        color: "from-green-500 to-emerald-600",
        content: "Apprentissage hands-on avec exercices pratiques continus",
        features: ["Cas pratiques", "Exercices guidés", "Projets réels", "Templates professionnels"]
      },
      {
        title: "Progression Structurée",
        icon: "TrendingUp",
        color: "from-blue-500 to-cyan-600",
        content: "Montée en compétences progressive du basique à l'expert",
        features: ["Niveaux adaptés", "Prérequis clairs", "Validation étapes", "Certification finale"]
      },
      {
        title: "Business Focus",
        icon: "Briefcase",
        color: "from-purple-500 to-violet-600",
        content: "Applications orientées business avec cas d'usage professionnels",
        features: ["Problématiques réelles", "Secteurs variés", "ROI mesurable", "Impact business"]
      },
      {
        title: "Support Continu",
        icon: "Users",
        color: "from-orange-500 to-amber-600",
        content: "Accompagnement personnalisé et support technique",
        features: ["Tuteurs experts", "Q&A sessions", "Forum communauté", "Ressources continues"]
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
        title: "Excellence Excel",
        icon: "Award",
        gradient: "from-green-500 to-emerald-600",
        details: [
          "Maîtrise reconnue",
          "Certification officielle",
          "Compétences expertes",
          "Standards professionnels"
        ]
      },
      {
        title: "Productivité Accrue",
        icon: "Zap",
        gradient: "from-blue-500 to-cyan-600",
        details: [
          "Automatisation maîtrisée",
          "Processus optimisés",
          "Gain temps significatif",
          "Efficacité maximale"
        ]
      },
      {
        title: "Valeur Ajoutée",
        icon: "TrendingUp",
        gradient: "from-purple-500 to-violet-600",
        details: [
          "Compétences recherchées",
          "Évolution de poste",
          "Reconnaissance professionnelle",
          "Opportunities nouvelles"
        ]
      }
    ]
  },

  // Programming & Infrastructure Courses - Adding 7 more courses
  "financial-data-analysis": {
    id: "financial-data-analysis",
    slug: "financial-data-analysis",
    heroTitle: "Formation Analyse de Données Financières",
    heroSubtitle: "Maîtrisez l'analyse quantitative financière et développez des modèles de risque avancés",
    presentationSections: [
      {
        title: "Programme Professionnel",
        icon: "BookOpen",
        color: "bg-blue-100",
        content: "Formation spécialisée en analyse de données financières couvrant la modélisation quantitative, l'analyse de risque et les algorithmes de trading."
      },
      {
        title: "Objectifs de Formation",
        icon: "Target",
        color: "bg-green-100",
        content: "Former des analystes quantitatifs capables de développer des modèles financiers sophistiqués et des stratégies d'investissement."
      },
      {
        title: "Compétences Acquises",
        icon: "Award",
        color: "bg-purple-100",
        content: "Analyse quantitative, modèles de risque, algorithmic trading, Python/R finance, blockchain, fintech."
      },
      {
        title: "Public Cible",
        icon: "Users",
        color: "bg-orange-100",
        content: "Analystes financiers, risk managers, traders, consultants finance souhaitant maîtriser l'analyse quantitative."
      }
    ],
    keyAreas: [
      {
        title: "Modélisation Quantitative",
        description: "Modèles mathématiques pour la finance",
        icon: "Calculator",
        gradient: "from-blue-500 to-indigo-600"
      },
      {
        title: "Analyse de Risque",
        description: "VaR, stress testing et gestion des risques",
        icon: "AlertTriangle",
        gradient: "from-red-500 to-pink-600"
      },
      {
        title: "Algorithmic Trading",
        description: "Stratégies de trading automatisées",
        icon: "TrendingUp",
        gradient: "from-green-500 to-emerald-600"
      },
      {
        title: "Fintech & Blockchain",
        description: "Technologies financières émergentes",
        icon: "Coins",
        gradient: "from-purple-500 to-violet-600"
      }
    ],
    firstYearModules: [
      { code: "FIN101", title: "Fondamentaux Finance Quantitative", duration: "35h", description: "Bases de la finance quantitative" },
      { code: "STAT201", title: "Statistiques Financières", duration: "40h", description: "Méthodes statistiques appliquées à la finance" },
      { code: "RISK301", title: "Modèles de Risque", duration: "45h", description: "VaR, CVaR et modélisation des risques" },
      { code: "ALGO401", title: "Algorithmic Trading", duration: "40h", description: "Stratégies de trading automatisées" },
      { code: "PY501", title: "Python Finance", duration: "35h", description: "Programmation Python pour la finance" },
      { code: "PORT601", title: "Gestion de Portefeuille", duration: "35h", description: "Optimisation et théorie moderne du portefeuille" }
    ],
    secondYearModules: [
      { code: "DERIV701", title: "Produits Dérivés", duration: "40h", description: "Pricing et gestion des dérivés" },
      { code: "BLOCK801", title: "Blockchain Finance", duration: "30h", description: "Applications blockchain en finance" },
      { code: "ML901", title: "Machine Learning Finance", duration: "45h", description: "IA appliquée aux marchés financiers" },
      { code: "PROJ1001", title: "Projet Quant", duration: "50h", description: "Projet de recherche quantitative" }
    ],
    programGoals: [
      {
        id: "quantitative",
        title: "Expertise Quantitative",
        description: "Maîtrise des méthodes quantitatives avancées",
        icon: "Calculator",
        color: "bg-gradient-to-r from-blue-500 to-indigo-600",
        details: ["Modélisation mathématique", "Statistiques avancées", "Optimisation", "Simulation Monte Carlo"]
      },
      {
        id: "risk",
        title: "Gestion des Risques",
        description: "Expertise en risk management",
        icon: "Shield",
        color: "bg-gradient-to-r from-red-500 to-pink-600",
        details: ["VaR modeling", "Stress testing", "Credit risk", "Operational risk"]
      },
      {
        id: "technology",
        title: "Innovation Fintech",
        description: "Maîtrise des nouvelles technologies",
        icon: "Smartphone",
        color: "bg-gradient-to-r from-green-500 to-emerald-600",
        details: ["Algorithmic trading", "Blockchain", "Robo-advisors", "RegTech"]
      },
      {
        id: "career",
        title: "Carrière Quantitative",
        description: "Accès aux métiers quantitatifs",
        icon: "TrendingUp",
        color: "bg-gradient-to-r from-purple-500 to-violet-600",
        details: ["Quant analyst", "Risk manager", "Trader quantitatif", "Financial engineer"]
      }
    ],
    objectives: {
      mainTitle: "Objectifs Généraux",
      description: "Former des experts en analyse quantitative financière capables de développer des modèles sophistiqués et de gérer les risques financiers.",
      leftColumn: {
        title: "Expertise Technique",
        skills: [
          "Modélisation quantitative avancée",
          "Analyse de risque et VaR",
          "Algorithmic trading et stratégies",
          "Python/R pour la finance",
          "Machine learning financier",
          "Blockchain et fintech"
        ],
        description: "Compétences complètes pour exceller dans l'analyse quantitative et la finance moderne."
      },
      rightColumn: {
        sections: [
          {
            title: "Applications Réelles",
            description: "Projets basés sur des données de marché réelles et des problématiques d'entreprise."
          },
          {
            title: "Technologies Actuelles",
            description: "Formation sur les derniers outils et technologies utilisés en finance quantitative."
          },
          {
            title: "Perspectives Carrière",
            description: "Préparation aux métiers quantitatifs les plus recherchés du marché."
          }
        ]
      }
    },
    teachingStrategies: [
      {
        title: "Cas de Marché Réels",
        icon: "BarChart3",
        color: "from-blue-500 to-indigo-600",
        content: "Analyse de données de marché réelles et cas d'étude financiers",
        features: ["Données Bloomberg", "Cas historiques", "Crises financières", "Market patterns"]
      },
      {
        title: "Outils Professionnels",
        icon: "Code",
        color: "from-red-500 to-pink-600",
        content: "Formation sur les plateformes et outils utilisés par l'industrie",
        features: ["Python/R/MATLAB", "Bloomberg Terminal", "Reuters", "Trading platforms"]
      },
      {
        title: "Simulation Trading",
        icon: "TrendingUp",
        color: "from-green-500 to-emerald-600",
        content: "Environnements de simulation pour tester les stratégies",
        features: ["Paper trading", "Backtesting", "Strategy validation", "Risk simulation"]
      },
      {
        title: "Expert Network",
        icon: "Users",
        color: "from-purple-500 to-violet-600",
        content: "Accès à un réseau de professionnels de la finance quantitative",
        features: ["Quants seniors", "Risk managers", "Traders institutionnels", "Fintech experts"]
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
        title: "Excellence Quantitative",
        icon: "Award",
        gradient: "from-blue-500 to-indigo-600",
        details: [
          "Expertise reconnue",
          "Modèles sophistiqués",
          "Méthodes avancées",
          "Certification CQF"
        ]
      },
      {
        title: "Innovation Fintech",
        icon: "Lightbulb",
        gradient: "from-red-500 to-pink-600",
        details: [
          "Technologies émergentes",
          "Algorithmic trading",
          "Blockchain finance",
          "IA financière"
        ]
      },
      {
        title: "Carrière Prestigieuse",
        icon: "TrendingUp",
        gradient: "from-green-500 to-emerald-600",
        details: [
          "Postes recherchés",
          "Rémunération élevée",
          "Banques d'affaires",
          "Hedge funds"
        ]
      }
    ]
  },

  "google-data-studio": {
    id: "google-data-studio",
    slug: "google-data-studio",
    heroTitle: "Formation Google Data Studio Analytics",
    heroSubtitle: "Créez des tableaux de bord interactifs et des rapports analytics avec Google Data Studio",
    presentationSections: [
      {
        title: "Programme Professionnel",
        icon: "BookOpen",
        color: "bg-blue-100",
        content: "Formation complète en Google Data Studio pour créer des dashboards interactifs et des rapports analytics professionnels."
      },
      {
        title: "Objectifs de Formation",
        icon: "Target",
        color: "bg-green-100",
        content: "Former des experts en visualisation de données capables de créer des tableaux de bord impactants avec Google Data Studio."
      },
      {
        title: "Compétences Acquises",
        icon: "Award",
        color: "bg-purple-100",
        content: "Google Data Studio, Google Analytics, visualisation de données, dashboards interactifs, reporting automatisé."
      },
      {
        title: "Public Cible",
        icon: "Users",
        color: "bg-orange-100",
        content: "Analystes marketing, data analysts, responsables digital, consultants souhaitant maîtriser la visualisation de données."
      }
    ],
    keyAreas: [
      {
        title: "Interface Data Studio",
        description: "Maîtrise complète de l'environnement",
        icon: "Monitor",
        gradient: "from-blue-500 to-cyan-600"
      },
      {
        title: "Sources de Données",
        description: "Connexion et intégration multi-sources",
        icon: "Database",
        gradient: "from-green-500 to-emerald-600"
      },
      {
        title: "Visualisations Avancées",
        description: "Graphiques interactifs et dashboards",
        icon: "BarChart3",
        gradient: "from-purple-500 to-violet-600"
      },
      {
        title: "Partage et Collaboration",
        description: "Collaboration et diffusion des rapports",
        icon: "Share",
        gradient: "from-orange-500 to-amber-600"
      }
    ],
    firstYearModules: [
      { code: "GDS101", title: "Introduction Data Studio", duration: "25h", description: "Découverte de l'interface et concepts de base" },
      { code: "CONN201", title: "Connexions de Données", duration: "30h", description: "Intégration des sources de données" },
      { code: "VIS301", title: "Visualisations Basiques", duration: "35h", description: "Création de graphiques et tableaux" },
      { code: "ADV401", title: "Visualisations Avancées", duration: "40h", description: "Graphiques complexes et interactivité" },
      { code: "DASH501", title: "Dashboards Professionnels", duration: "35h", description: "Conception de tableaux de bord" },
      { code: "AUTO601", title: "Automatisation Rapports", duration: "30h", description: "Rapports automatisés et planifiés" }
    ],
    programGoals: [
      {
        id: "mastery",
        title: "Maîtrise Data Studio",
        description: "Expertise complète de Google Data Studio",
        icon: "Monitor",
        color: "bg-gradient-to-r from-blue-500 to-cyan-600",
        details: ["Interface expert", "Fonctions avancées", "Best practices", "Optimisation performance"]
      },
      {
        id: "visualization",
        title: "Visualisation Expert",
        description: "Capacité de créer des visualisations impactantes",
        icon: "BarChart3",
        color: "bg-gradient-to-r from-green-500 to-emerald-600",
        details: ["Design UX/UI", "Interactivité", "Storytelling data", "Accessibilité"]
      },
      {
        id: "integration",
        title: "Intégration Multi-Sources",
        description: "Connexion et fusion de données diverses",
        icon: "Database",
        color: "bg-gradient-to-r from-purple-500 to-violet-600",
        details: ["Google Analytics", "Google Ads", "Sheets", "BigQuery", "APIs externes"]
      },
      {
        id: "business",
        title: "Impact Business",
        description: "Création de valeur business avec les données",
        icon: "TrendingUp",
        color: "bg-gradient-to-r from-orange-500 to-amber-600",
        details: ["KPIs stratégiques", "Insights actionnables", "ROI measurement", "Decision support"]
      }
    ],
    objectives: {
      mainTitle: "Objectifs Généraux",
      description: "Former des experts Google Data Studio capables de créer des solutions de reporting et d'analytics professionnelles.",
      leftColumn: {
        title: "Expertise Technique",
        skills: [
          "Interface Google Data Studio complète",
          "Connexions sources de données",
          "Visualisations interactives avancées",
          "Dashboards professionnels",
          "Automatisation et collaboration",
          "Optimisation des performances"
        ],
        description: "Maîtrise complète de Google Data Studio pour créer des solutions analytics professionnelles."
      },
      rightColumn: {
        sections: [
          {
            title: "Projets Concrets",
            description: "Création de dashboards réels pour différents secteurs d'activité et use cases."
          },
          {
            title: "Bonnes Pratiques",
            description: "Application des standards UX/UI et des méthodologies de data visualization."
          },
          {
            title: "Performance",
            description: "Optimisation des rapports pour la rapidité et l'efficacité utilisateur."
          }
        ]
      }
    },
    teachingStrategies: [
      {
        title: "Projets Pratiques",
        icon: "Monitor",
        color: "from-blue-500 to-cyan-600",
        content: "Création de dashboards réels avec données authentiques",
        features: ["Projets guidés", "Cas d'usage variés", "Templates professionnels", "Portfolio personnel"]
      },
      {
        title: "Design Thinking",
        icon: "Palette",
        color: "from-green-500 to-emerald-600",
        content: "Approche design centrée utilisateur pour les dashboards",
        features: ["UX/UI principles", "User personas", "Wireframing", "User testing"]
      },
      {
        title: "Google Ecosystem",
        icon: "Globe",
        color: "from-purple-500 to-violet-600",
        content: "Intégration complète avec l'écosystème Google",
        features: ["Google Analytics", "Google Ads", "Google Sheets", "BigQuery", "Google Cloud"]
      },
      {
        title: "Business Applications",
        icon: "Briefcase",
        color: "from-orange-500 to-amber-600",
        content: "Applications business avec ROI mesurable",
        features: ["Marketing dashboards", "Sales analytics", "Performance KPIs", "Executive reporting"]
      }
    ],
    tableOfContents: [
      { section: "01", title: "Présentation du Programme", anchor: "presentation", icon: "FileText" },
      { section: "02", title: "Domaines Clés", anchor: "key-areas", icon: "Target" },
      { section: "03", title: "Curriculum Formation", anchor: "curriculum-year1", icon: "BookOpen" },
      { section: "04", title: "Objectifs du Programme", anchor: "objectives", icon: "Goal" },
      { section: "05", title: "Objectifs Généraux", anchor: "general-objectives", icon: "Target" },
      { section: "06", title: "Stratégies Pédagogiques", anchor: "teaching-strategies", icon: "Users" },
      { section: "07", title: "Synthèse du Programme", anchor: "synthesis", icon: "CheckCircle" },
      { section: "08", title: "Appel à l'Action", anchor: "cta", icon: "ArrowRight" }
    ],
    synthesis: [
      {
        title: "Expertise Reconnue",
        icon: "Award",
        gradient: "from-blue-500 to-cyan-600",
        details: [
          "Certification Google",
          "Compétences validées",
          "Portfolio professionnel",
          "Standards industrie"
        ]
      },
      {
        title: "Impact Visuel",
        icon: "Eye",
        gradient: "from-green-500 to-emerald-600",
        details: [
          "Dashboards attractifs",
          "Storytelling efficace",
          "UX optimisée",
          "Engagement utilisateur"
        ]
      },
      {
        title: "Opportunités Marché",
        icon: "TrendingUp",
        gradient: "from-purple-500 to-violet-600",
        details: [
          "Demande croissante",
          "Compétences recherchées",
          "Évolution digitale",
          "Consulting spécialisé"
        ]
      }
    ]
  },

  // Programming & Infrastructure Courses (Remaining 7)
  "database-design-management": {
    id: "database-design-management",
    slug: "database-design-management",
    heroTitle: "Formation Design et Gestion de Bases de Données",
    heroSubtitle: "Maîtrisez la conception, l'optimisation et l'administration des bases de données modernes",
    presentationSections: [
      { title: "Programme Professionnel", icon: "BookOpen", color: "bg-blue-100", content: "Formation complète en conception et gestion de bases de données couvrant SQL avancé, NoSQL, optimisation et administration." },
      { title: "Objectifs de Formation", icon: "Target", color: "bg-green-100", content: "Former des administrateurs et architectes de bases de données capables de concevoir des systèmes performants et évolutifs." },
      { title: "Compétences Acquises", icon: "Award", color: "bg-purple-100", content: "SQL expert, NoSQL, architecture bases de données, optimisation performance, sécurité, backup et recovery." },
      { title: "Public Cible", icon: "Users", color: "bg-orange-100", content: "Développeurs, administrateurs système, architectes données souhaitant se spécialiser en bases de données." }
    ],
    keyAreas: [
      { title: "Conception BDD", description: "Modélisation et architecture des données", icon: "Database", gradient: "from-blue-500 to-indigo-600" },
      { title: "SQL Avancé", description: "Requêtes complexes et optimisation", icon: "Code", gradient: "from-green-500 to-emerald-600" },
      { title: "NoSQL", description: "Bases de données non-relationnelles", icon: "Network", gradient: "from-purple-500 to-violet-600" },
      { title: "Administration", description: "Maintenance et sécurité des BDD", icon: "Shield", gradient: "from-orange-500 to-amber-600" }
    ],
    firstYearModules: [
      { code: "BDD101", title: "Fondamentaux Bases de Données", duration: "35h" },
      { code: "SQL201", title: "SQL Avancé", duration: "40h" },
      { code: "MOD301", title: "Modélisation Données", duration: "35h" },
      { code: "NOSQL401", title: "Bases NoSQL", duration: "40h" },
      { code: "OPT501", title: "Optimisation Performance", duration: "35h" },
      { code: "ADM601", title: "Administration BDD", duration: "40h" }
    ],
    programGoals: [
      { id: "design", title: "Expertise Conception", description: "Maîtrise de l'architecture données", icon: "Database", color: "bg-gradient-to-r from-blue-500 to-indigo-600", details: ["Modélisation", "Architecture", "Normalisation", "Performances"] },
      { id: "sql", title: "SQL Expert", description: "Maîtrise complète de SQL", icon: "Code", color: "bg-gradient-to-r from-green-500 to-emerald-600", details: ["Requêtes complexes", "Optimisation", "Procédures", "Triggers"] },
      { id: "nosql", title: "NoSQL Mastery", description: "Expertise bases non-relationnelles", icon: "Network", color: "bg-gradient-to-r from-purple-500 to-violet-600", details: ["MongoDB", "Cassandra", "Redis", "Neo4j"] },
      { id: "admin", title: "Administration", description: "Gestion complète des BDD", icon: "Shield", color: "bg-gradient-to-r from-orange-500 to-amber-600", details: ["Sécurité", "Backup", "Monitoring", "Tuning"] }
    ],
    objectives: {
      mainTitle: "Objectifs Généraux",
      description: "Former des experts en bases de données capables de concevoir, implémenter et administrer des systèmes de données performants.",
      leftColumn: { title: "Expertise Technique", skills: ["Conception architecture BDD", "SQL avancé et optimisation", "Bases NoSQL modernes", "Administration et sécurité", "Performance tuning", "Backup et recovery"], description: "Compétences complètes pour gérer le cycle de vie complet des bases de données." },
      rightColumn: { sections: [{ title: "Projets Réels", description: "Conception et implémentation de bases de données pour des applications réelles." }, { title: "Technologies Actuelles", description: "Formation sur les dernières technologies et tendances en bases de données." }, { title: "Best Practices", description: "Application des bonnes pratiques industrielles et standards de sécurité." }] }
    },
    teachingStrategies: [
      { title: "Projets Concrets", icon: "Database", color: "from-blue-500 to-indigo-600", content: "Conception et implémentation de bases de données réelles", features: ["Cas d'usage variés", "Architectures complexes", "Contraintes réelles", "Performance testing"] },
      { title: "Technologies Actuelles", icon: "Code", color: "from-green-500 to-emerald-600", content: "Formation sur les dernières technologies BDD", features: ["PostgreSQL", "MongoDB", "Redis", "Cloud databases"] },
      { title: "Optimisation Focus", icon: "Zap", color: "from-purple-500 to-violet-600", content: "Accent sur la performance et l'optimisation", features: ["Query optimization", "Index tuning", "Performance monitoring", "Scalability"] },
      { title: "Expert Mentoring", icon: "Users", color: "from-orange-500 to-amber-600", content: "Accompagnement par des DBA seniors", features: ["Architecture review", "Best practices", "Career guidance", "Industry insights"] }
    ],
    tableOfContents: [
      { section: "01", title: "Présentation du Programme", anchor: "presentation", icon: "FileText" },
      { section: "02", title: "Domaines Clés", anchor: "key-areas", icon: "Target" },
      { section: "03", title: "Curriculum Formation", anchor: "curriculum-year1", icon: "BookOpen" },
      { section: "04", title: "Objectifs du Programme", anchor: "objectives", icon: "Goal" },
      { section: "05", title: "Objectifs Généraux", anchor: "general-objectives", icon: "Target" },
      { section: "06", title: "Stratégies Pédagogiques", anchor: "teaching-strategies", icon: "Users" },
      { section: "07", title: "Synthèse du Programme", anchor: "synthesis", icon: "CheckCircle" },
      { section: "08", title: "Appel à l'Action", anchor: "cta", icon: "ArrowRight" }
    ],
    synthesis: [
      { title: "Expertise Reconnue", icon: "Award", gradient: "from-blue-500 to-indigo-600", details: ["Certification DBA", "Compétences validées", "Standards industrie", "Portfolio projets"] },
      { title: "Technologies Maîtrisées", icon: "Database", gradient: "from-green-500 to-emerald-600", details: ["SQL/NoSQL", "Cloud databases", "Big Data", "Performance optimization"] },
      { title: "Opportunités Carrière", icon: "TrendingUp", gradient: "from-purple-500 to-violet-600", details: ["Forte demande", "Salaires attractifs", "Évolution technique", "Postes stratégiques"] }
    ]
  },

  // Marketing & Creative Courses (4 courses)
  "ai-powered-digital-marketing": {
    id: "ai-powered-digital-marketing",
    slug: "ai-powered-digital-marketing",
    heroTitle: "Formation Marketing Digital avec IA",
    heroSubtitle: "Révolutionnez vos stratégies marketing avec l'intelligence artificielle et l'automatisation",
    presentationSections: [
      { title: "Programme Professionnel", icon: "BookOpen", color: "bg-blue-100", content: "Formation spécialisée en marketing digital avec IA couvrant l'automatisation, la personnalisation et l'optimisation des campagnes." },
      { title: "Objectifs de Formation", icon: "Target", color: "bg-green-100", content: "Former des marketeurs capables d'exploiter l'IA pour créer des campagnes performantes et personnalisées." },
      { title: "Compétences Acquises", icon: "Award", color: "bg-purple-100", content: "Marketing automation, personnalisation IA, chatbots, SEO IA, analytics prédictifs, programmatic advertising." },
      { title: "Public Cible", icon: "Users", color: "bg-orange-100", content: "Marketeurs, responsables digital, consultants marketing souhaitant intégrer l'IA dans leurs stratégies." }
    ],
    keyAreas: [
      { title: "Marketing Automation", description: "Automatisation intelligente des campagnes", icon: "Zap", gradient: "from-blue-500 to-cyan-600" },
      { title: "Personnalisation IA", description: "Expériences client personnalisées", icon: "Users", gradient: "from-purple-500 to-pink-600" },
      { title: "Analytics Prédictifs", description: "Prédiction comportements clients", icon: "TrendingUp", gradient: "from-green-500 to-emerald-600" },
      { title: "Chatbots & IA", description: "Assistants conversationnels intelligents", icon: "MessageCircle", gradient: "from-orange-500 to-amber-600" }
    ],
    firstYearModules: [
      { code: "AIM101", title: "IA Marketing Fondamentaux", duration: "30h" },
      { code: "AUTO201", title: "Marketing Automation", duration: "35h" },
      { code: "PERS301", title: "Personnalisation IA", duration: "40h" },
      { code: "CHAT401", title: "Chatbots Marketing", duration: "35h" },
      { code: "PRED501", title: "Analytics Prédictifs", duration: "40h" },
      { code: "PROG601", title: "Programmatic Advertising", duration: "35h" }
    ],
    programGoals: [
      { id: "automation", title: "Automatisation Expert", description: "Maîtrise des outils d'automatisation IA", icon: "Zap", color: "bg-gradient-to-r from-blue-500 to-cyan-600", details: ["Marketing automation", "Email marketing IA", "Social media automation", "Lead nurturing"] },
      { id: "personalization", title: "Personnalisation", description: "Création d'expériences personnalisées", icon: "Users", color: "bg-gradient-to-r from-purple-500 to-pink-600", details: ["Segmentation avancée", "Recommandations", "Dynamic content", "Customer journey"] },
      { id: "analytics", title: "Analytics IA", description: "Analyse prédictive des performances", icon: "BarChart3", color: "bg-gradient-to-r from-green-500 to-emerald-600", details: ["Predictive analytics", "Attribution modeling", "ROI optimization", "Performance forecasting"] },
      { id: "innovation", title: "Innovation Marketing", description: "Adoption des dernières innovations IA", icon: "Lightbulb", color: "bg-gradient-to-r from-orange-500 to-amber-600", details: ["Emerging technologies", "AI tools mastery", "Innovation strategy", "Competitive advantage"] }
    ],
    objectives: {
      mainTitle: "Objectifs Généraux",
      description: "Former des marketeurs capables d'exploiter l'IA pour créer des stratégies marketing innovantes et performantes.",
      leftColumn: { title: "Expertise IA Marketing", skills: ["Marketing automation avancé", "Personnalisation intelligente", "Analytics prédictifs", "Chatbots conversationnels", "SEO et content IA", "Programmatic advertising"], description: "Compétences complètes pour révolutionner le marketing avec l'intelligence artificielle." },
      rightColumn: { sections: [{ title: "ROI Measurable", description: "Focus sur l'amélioration mesurable des performances marketing grâce à l'IA." }, { title: "Tools Mastery", description: "Maîtrise des principaux outils et plateformes d'IA marketing." }, { title: "Future Ready", description: "Préparation aux évolutions futures du marketing digital avec IA." }] }
    },
    teachingStrategies: [
      { title: "Campagnes Réelles", icon: "Target", color: "from-blue-500 to-cyan-600", content: "Création et optimisation de campagnes marketing réelles", features: ["A/B testing IA", "Campaign optimization", "Real data analysis", "Performance tracking"] },
      { title: "Outils Professionnels", icon: "Settings", color: "from-purple-500 to-pink-600", content: "Formation sur les plateformes d'IA marketing leaders", features: ["HubSpot AI", "Salesforce Einstein", "Google AI", "Facebook AI"] },
      { title: "ROI Focus", icon: "DollarSign", color: "from-green-500 to-emerald-600", content: "Optimisation continue du retour sur investissement", features: ["Performance metrics", "Cost optimization", "Revenue attribution", "Profitability analysis"] },
      { title: "Innovation Lab", icon: "Lightbulb", color: "from-orange-500 to-amber-600", content: "Laboratoire d'innovation pour tester les nouvelles technologies", features: ["Emerging AI tools", "Beta testing", "Innovation projects", "Trend analysis"] }
    ],
    tableOfContents: [
      { section: "01", title: "Présentation du Programme", anchor: "presentation", icon: "FileText" },
      { section: "02", title: "Domaines Clés", anchor: "key-areas", icon: "Target" },
      { section: "03", title: "Curriculum Formation", anchor: "curriculum-year1", icon: "BookOpen" },
      { section: "04", title: "Objectifs du Programme", anchor: "objectives", icon: "Goal" },
      { section: "05", title: "Objectifs Généraux", anchor: "general-objectives", icon: "Target" },
      { section: "06", title: "Stratégies Pédagogiques", anchor: "teaching-strategies", icon: "Users" },
      { section: "07", title: "Synthèse du Programme", anchor: "synthesis", icon: "CheckCircle" },
      { section: "08", title: "Appel à l'Action", anchor: "cta", icon: "ArrowRight" }
    ],
    synthesis: [
      { title: "Innovation Marketing", icon: "Lightbulb", gradient: "from-blue-500 to-cyan-600", details: ["Technologies de pointe", "Avantage concurrentiel", "Résultats mesurables", "ROI optimisé"] },
      { title: "Expertise IA", icon: "Brain", gradient: "from-purple-500 to-pink-600", details: ["Outils maîtrisés", "Automatisation experte", "Personnalisation avancée", "Analytics prédictifs"] },
      { title: "Opportunités Marché", icon: "TrendingUp", gradient: "from-green-500 to-emerald-600", details: ["Demande croissante", "Postes stratégiques", "Salaires attractifs", "Évolution rapide"] }
    ]
  },

  // Programming & Infrastructure Courses (Remaining 6)
  "advanced-python-programming": {
    id: "advanced-python-programming",
    slug: "advanced-python-programming",
    heroTitle: "Formation Python Avancé Programmation",
    heroSubtitle: "Maîtrisez les concepts avancés de Python et développez des applications robustes et performantes",
    presentationSections: [
      { title: "Programme Professionnel", icon: "BookOpen", color: "bg-blue-100", content: "Formation avancée en Python couvrant la programmation orientée objet, les design patterns, l'optimisation et les frameworks modernes." },
      { title: "Objectifs de Formation", icon: "Target", color: "bg-green-100", content: "Former des développeurs Python experts capables de créer des applications complexes et maintenir du code de qualité professionnelle." },
      { title: "Compétences Acquises", icon: "Award", color: "bg-purple-100", content: "Python expert, OOP avancée, design patterns, async programming, testing, frameworks Django/Flask, optimisation performance." },
      { title: "Public Cible", icon: "Users", color: "bg-orange-100", content: "Développeurs Python intermédiaires souhaitant approfondir leurs compétences et adopter les meilleures pratiques." }
    ],
    keyAreas: [
      { title: "OOP Avancée", description: "Programmation orientée objet experte", icon: "Code", gradient: "from-yellow-500 to-orange-600" },
      { title: "Design Patterns", description: "Patterns de conception et architecture", icon: "Puzzle", gradient: "from-blue-500 to-indigo-600" },
      { title: "Async Programming", description: "Programmation asynchrone et concurrence", icon: "Zap", gradient: "from-purple-500 to-violet-600" },
      { title: "Performance", description: "Optimisation et profiling", icon: "Gauge", gradient: "from-green-500 to-emerald-600" }
    ],
    firstYearModules: [
      { code: "PYA101", title: "OOP Avancée Python", duration: "40h" },
      { code: "PAT201", title: "Design Patterns", duration: "35h" },
      { code: "ASY301", title: "Async Programming", duration: "40h" },
      { code: "TEST401", title: "Testing Avancé", duration: "35h" },
      { code: "PERF501", title: "Optimisation Performance", duration: "40h" },
      { code: "FRAM601", title: "Frameworks Python", duration: "45h" }
    ],
    secondYearModules: [
      { code: "ARCH701", title: "Architecture Applications", duration: "40h" },
      { code: "API801", title: "APIs Avancées", duration: "35h" },
      { code: "SEC901", title: "Sécurité Python", duration: "30h" },
      { code: "PROJ1001", title: "Projet Architecture", duration: "50h" }
    ],
    programGoals: [
      { id: "mastery", title: "Maîtrise Expert", description: "Expertise avancée en Python", icon: "Award", color: "bg-gradient-to-r from-yellow-500 to-orange-600", details: ["Python expert", "Best practices", "Code quality", "Architecture skills"] },
      { id: "patterns", title: "Design Patterns", description: "Maîtrise des patterns de conception", icon: "Puzzle", color: "bg-gradient-to-r from-blue-500 to-indigo-600", details: ["Gang of Four", "Python patterns", "Architecture patterns", "Anti-patterns"] },
      { id: "performance", title: "Performance", description: "Optimisation et scalabilité", icon: "Gauge", color: "bg-gradient-to-r from-purple-500 to-violet-600", details: ["Profiling", "Memory optimization", "Async programming", "Multiprocessing"] },
      { id: "frameworks", title: "Frameworks", description: "Maîtrise des frameworks modernes", icon: "Package", color: "bg-gradient-to-r from-green-500 to-emerald-600", details: ["Django expert", "Flask advanced", "FastAPI", "Web frameworks"] }
    ],
    objectives: {
      mainTitle: "Objectifs Généraux",
      description: "Former des développeurs Python experts capables de concevoir et maintenir des applications complexes de niveau professionnel.",
      leftColumn: { title: "Expertise Avancée", skills: ["Programmation orientée objet experte", "Design patterns et architecture", "Programmation asynchrone", "Testing et qualité code", "Optimisation performance", "Frameworks modernes"], description: "Compétences avancées pour développer des applications Python robustes et maintenir du code de qualité enterprise." },
      rightColumn: { sections: [{ title: "Code Quality", description: "Focus sur la qualité, la maintenabilité et les bonnes pratiques de développement." }, { title: "Architecture", description: "Conception d'architectures scalables et maintenables pour applications complexes." }, { title: "Performance", description: "Techniques d'optimisation et de monitoring des performances." }] }
    },
    teachingStrategies: [
      { title: "Code Reviews", icon: "Code", color: "from-yellow-500 to-orange-600", content: "Reviews de code intensives et pair programming", features: ["Peer reviews", "Code quality", "Best practices", "Refactoring"] },
      { title: "Architecture Focus", icon: "Puzzle", color: "from-blue-500 to-indigo-600", content: "Conception d'architectures scalables et maintenir", features: ["Design patterns", "SOLID principles", "Clean architecture", "Microservices"] },
      { title: "Performance Lab", icon: "Gauge", color: "from-purple-500 to-violet-600", content: "Laboratoire d'optimisation et profiling", features: ["Performance profiling", "Memory optimization", "Async programming", "Load testing"] },
      { title: "Industry Projects", icon: "Briefcase", color: "from-green-500 to-emerald-600", content: "Projets réels avec contraintes industrielles", features: ["Enterprise code", "Production deployment", "CI/CD", "Monitoring"] }
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
      { title: "Excellence Python", icon: "Award", gradient: "from-yellow-500 to-orange-600", details: ["Expertise reconnue", "Code de qualité", "Architecture solide", "Performance optimale"] },
      { title: "Compétences Avancées", icon: "Code", gradient: "from-blue-500 to-indigo-600", details: ["Design patterns", "Async programming", "Testing expert", "Frameworks maîtrisés"] },
      { title: "Opportunités Elite", icon: "TrendingUp", gradient: "from-green-500 to-emerald-600", details: ["Postes seniors", "Tech lead", "Architecture", "Salaires élevés"] }
    ]
  },

  "web-development": {
    id: "web-development",
    slug: "web-development",
    heroTitle: "Formation Développement Web (HTML, CSS, JS)",
    heroSubtitle: "Maîtrisez le développement web moderne avec HTML5, CSS3, JavaScript et les frameworks actuels",
    presentationSections: [
      { title: "Programme Professionnel", icon: "BookOpen", color: "bg-blue-100", content: "Formation complète en développement web couvrant HTML5, CSS3, JavaScript moderne, frameworks et outils de développement." },
      { title: "Objectifs de Formation", icon: "Target", color: "bg-green-100", content: "Former des développeurs web full-stack capables de créer des applications web modernes et responsives." },
      { title: "Compétences Acquises", icon: "Award", color: "bg-purple-100", content: "HTML5, CSS3, JavaScript ES6+, React, Vue.js, Node.js, APIs REST, responsive design, performance web." },
      { title: "Public Cible", icon: "Users", color: "bg-orange-100", content: "Débutants en développement, reconversion professionnelle, développeurs souhaitant actualiser leurs compétences web." }
    ],
    keyAreas: [
      { title: "Frontend Moderne", description: "HTML5, CSS3, JavaScript ES6+", icon: "Monitor", gradient: "from-blue-500 to-cyan-600" },
      { title: "Frameworks JS", description: "React, Vue.js, Angular", icon: "Package", gradient: "from-green-500 to-emerald-600" },
      { title: "Backend Node.js", description: "Serveur JavaScript et APIs", icon: "Server", gradient: "from-purple-500 to-violet-600" },
      { title: "Responsive Design", description: "Design adaptatif et mobile-first", icon: "Smartphone", gradient: "from-orange-500 to-amber-600" }
    ],
    firstYearModules: [
      { code: "WEB101", title: "HTML5 & CSS3", duration: "40h" },
      { code: "JS201", title: "JavaScript Moderne", duration: "50h" },
      { code: "RESP301", title: "Responsive Design", duration: "35h" },
      { code: "REACT401", title: "React.js", duration: "45h" },
      { code: "NODE501", title: "Node.js & APIs", duration: "40h" },
      { code: "PROJ601", title: "Projet Full-Stack", duration: "45h" }
    ],
    secondYearModules: [
      { code: "VUE701", title: "Vue.js Avancé", duration: "40h" },
      { code: "PERF801", title: "Performance Web", duration: "35h" },
      { code: "PWA901", title: "Progressive Web Apps", duration: "35h" },
      { code: "DEPLOY1001", title: "Déploiement & DevOps", duration: "40h" }
    ],
    programGoals: [
      { id: "frontend", title: "Frontend Expert", description: "Maîtrise du développement frontend", icon: "Monitor", color: "bg-gradient-to-r from-blue-500 to-cyan-600", details: ["HTML5/CSS3", "JavaScript ES6+", "Frameworks modernes", "UI/UX"] },
      { id: "fullstack", title: "Full-Stack", description: "Développement complet frontend/backend", icon: "Layers", color: "bg-gradient-to-r from-green-500 to-emerald-600", details: ["Frontend/Backend", "APIs REST", "Bases de données", "Déploiement"] },
      { id: "modern", title: "Technologies Modernes", description: "Maîtrise des outils actuels", icon: "Sparkles", color: "bg-gradient-to-r from-purple-500 to-violet-600", details: ["Frameworks récents", "Outils build", "Testing", "CI/CD"] },
      { id: "responsive", title: "Responsive Design", description: "Design adaptatif et mobile", icon: "Smartphone", color: "bg-gradient-to-r from-orange-500 to-amber-600", details: ["Mobile-first", "Cross-browser", "Performance", "Accessibility"] }
    ],
    objectives: {
      mainTitle: "Objectifs Généraux",
      description: "Former des développeurs web full-stack capables de créer des applications web modernes, performantes et responsives.",
      leftColumn: { title: "Expertise Web", skills: ["HTML5 et CSS3 avancés", "JavaScript moderne (ES6+)", "Frameworks React/Vue.js", "Backend Node.js", "APIs REST et GraphQL", "Responsive design"], description: "Compétences complètes pour développer des applications web de qualité professionnelle." },
      rightColumn: { sections: [{ title: "Projets Pratiques", description: "Développement d'applications web complètes avec technologies modernes." }, { title: "Industry Standards", description: "Application des standards et bonnes pratiques de l'industrie web." }, { title: "Performance Focus", description: "Optimisation des performances et expérience utilisateur." }] }
    },
    teachingStrategies: [
      { title: "Coding Bootcamp", icon: "Code", color: "from-blue-500 to-cyan-600", content: "Apprentissage intensif par la pratique", features: ["Live coding", "Projets guidés", "Code reviews", "Pair programming"] },
      { title: "Portfolio Building", icon: "Briefcase", color: "from-green-500 to-emerald-600", content: "Construction d'un portfolio professionnel", features: ["Projets réels", "GitHub portfolio", "Deployment", "Showcase projects"] },
      { title: "Industry Tools", icon: "Settings", color: "from-purple-500 to-violet-600", content: "Formation sur les outils professionnels", features: ["VS Code", "Git/GitHub", "Build tools", "Testing frameworks"] },
      { title: "Job Ready", icon: "Briefcase", color: "from-orange-500 to-amber-600", content: "Préparation à l'emploi développeur", features: ["Interview prep", "Technical tests", "Portfolio review", "Career guidance"] }
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
      { title: "Compétences Modernes", icon: "Sparkles", gradient: "from-blue-500 to-cyan-600", details: ["Technologies actuelles", "Frameworks populaires", "Outils professionnels", "Standards industrie"] },
      { title: "Portfolio Professionnel", icon: "Briefcase", gradient: "from-green-500 to-emerald-600", details: ["Projets déployés", "Code quality", "GitHub actif", "Références clients"] },
      { title: "Marché Porteur", icon: "TrendingUp", gradient: "from-purple-500 to-violet-600", details: ["Forte demande", "Opportunités multiples", "Télétravail possible", "Évolution rapide"] }
    ]
  },

  "mobile-app-development": {
    id: "mobile-app-development",
    slug: "mobile-app-development",
    heroTitle: "Formation Développement d'Applications Mobiles",
    heroSubtitle: "Créez des applications mobiles natives et cross-platform avec React Native et Flutter",
    presentationSections: [
      { title: "Programme Professionnel", icon: "BookOpen", color: "bg-blue-100", content: "Formation complète en développement mobile couvrant iOS, Android, React Native, Flutter et les bonnes pratiques mobiles." },
      { title: "Objectifs de Formation", icon: "Target", color: "bg-green-100", content: "Former des développeurs mobiles capables de créer des applications natives et cross-platform performantes." },
      { title: "Compétences Acquises", icon: "Award", color: "bg-purple-100", content: "React Native, Flutter, Swift/Kotlin, UI/UX mobile, APIs, stores deployment, performance mobile." },
      { title: "Public Cible", icon: "Users", color: "bg-orange-100", content: "Développeurs web, développeurs souhaitant se spécialiser mobile, entrepreneurs avec projets d'apps." }
    ],
    keyAreas: [
      { title: "React Native", description: "Développement cross-platform avec React", icon: "Smartphone", gradient: "from-blue-500 to-cyan-600" },
      { title: "Flutter", description: "Framework Google pour mobile", icon: "Zap", gradient: "from-purple-500 to-violet-600" },
      { title: "Native Development", description: "iOS Swift et Android Kotlin", icon: "Code", gradient: "from-green-500 to-emerald-600" },
      { title: "App Store Deployment", description: "Publication et distribution apps", icon: "Upload", gradient: "from-orange-500 to-amber-600" }
    ],
    firstYearModules: [
      { code: "MOB101", title: "Fondamentaux Mobile", duration: "30h" },
      { code: "RN201", title: "React Native", duration: "45h" },
      { code: "FLU301", title: "Flutter Development", duration: "45h" },
      { code: "UI401", title: "UI/UX Mobile", duration: "35h" },
      { code: "API501", title: "APIs & Backend", duration: "40h" },
      { code: "DEPLOY601", title: "Store Deployment", duration: "30h" }
    ],
    secondYearModules: [
      { code: "NAT701", title: "Développement Natif", duration: "45h" },
      { code: "PERF801", title: "Performance Mobile", duration: "35h" },
      { code: "ADV901", title: "Features Avancées", duration: "40h" },
      { code: "PROJ1001", title: "Projet App Complète", duration: "50h" }
    ],
    programGoals: [
      { id: "crossplatform", title: "Cross-Platform", description: "Maîtrise React Native et Flutter", icon: "Smartphone", color: "bg-gradient-to-r from-blue-500 to-cyan-600", details: ["React Native expert", "Flutter proficiency", "Code sharing", "Performance optimization"] },
      { id: "native", title: "Native Development", description: "Développement iOS et Android natif", icon: "Code", color: "bg-gradient-to-r from-purple-500 to-violet-600", details: ["Swift/iOS", "Kotlin/Android", "Platform APIs", "Native performance"] },
      { id: "ux", title: "Mobile UX", description: "Expérience utilisateur mobile experte", icon: "Heart", color: "bg-gradient-to-r from-green-500 to-emerald-600", details: ["Mobile design patterns", "Gesture handling", "Accessibility", "User testing"] },
      { id: "deployment", title: "Store Success", description: "Publication et succès sur stores", icon: "Upload", color: "bg-gradient-to-r from-orange-500 to-amber-600", details: ["App Store", "Google Play", "Store optimization", "Monetization"] }
    ],
    objectives: {
      mainTitle: "Objectifs Généraux",
      description: "Former des développeurs mobiles experts capables de créer des applications performantes pour iOS et Android.",
      leftColumn: { title: "Expertise Mobile", skills: ["React Native et Flutter", "Développement natif iOS/Android", "UI/UX mobile", "Intégration APIs", "Performance optimization", "Store deployment"], description: "Compétences complètes pour développer et publier des applications mobiles de qualité professionnelle." },
      rightColumn: { sections: [{ title: "Projets Réels", description: "Développement d'applications complètes avec publication sur les stores." }, { title: "Best Practices", description: "Application des meilleures pratiques de développement mobile." }, { title: "Market Ready", description: "Préparation pour le marché du développement mobile." }] }
    },
    teachingStrategies: [
      { title: "App Development", icon: "Smartphone", color: "from-blue-500 to-cyan-600", content: "Développement d'applications complètes", features: ["Real apps", "Store publication", "User feedback", "Iterative development"] },
      { title: "Multi-Platform", icon: "Layers", color: "from-purple-500 to-violet-600", content: "Formation sur plusieurs frameworks", features: ["React Native", "Flutter", "Native iOS/Android", "Comparison analysis"] },
      { title: "UX Focus", icon: "Heart", color: "from-green-500 to-emerald-600", content: "Accent sur l'expérience utilisateur mobile", features: ["Mobile UX patterns", "User testing", "Accessibility", "Performance"] },
      { title: "Industry Mentoring", icon: "Users", color: "from-orange-500 to-amber-600", content: "Mentorat par des développeurs mobiles experts", features: ["Senior developers", "Code reviews", "Architecture guidance", "Career advice"] }
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
      { title: "Expertise Multi-Platform", icon: "Smartphone", gradient: "from-blue-500 to-cyan-600", details: ["React Native", "Flutter", "iOS natif", "Android natif"] },
      { title: "Portfolio Apps", icon: "Package", gradient: "from-purple-500 to-violet-600", details: ["Apps publiées", "Store presence", "User reviews", "Download metrics"] },
      { title: "Marché Dynamique", icon: "TrendingUp", gradient: "from-green-500 to-emerald-600", details: ["Croissance mobile", "Opportunités startup", "Freelance possible", "Innovation constante"] }
    ]
  },

  "cloud-computing": {
    id: "cloud-computing",
    slug: "cloud-computing",
    heroTitle: "Formation Cloud Computing (AWS, Azure)",
    heroSubtitle: "Maîtrisez les plateformes cloud et l'architecture de systèmes distribués modernes",
    presentationSections: [
      { title: "Programme Professionnel", icon: "BookOpen", color: "bg-blue-100", content: "Formation complète en cloud computing couvrant AWS, Microsoft Azure, architecture cloud et DevOps moderne." },
      { title: "Objectifs de Formation", icon: "Target", color: "bg-green-100", content: "Former des architectes cloud capables de concevoir et gérer des infrastructures cloud scalables et sécurisées." },
      { title: "Compétences Acquises", icon: "Award", color: "bg-purple-100", content: "AWS/Azure, architecture cloud, containers Docker/Kubernetes, CI/CD, sécurité cloud, monitoring." },
      { title: "Public Cible", icon: "Users", color: "bg-orange-100", content: "Administrateurs système, développeurs, ingénieurs DevOps, architectes souhaitant maîtriser le cloud." }
    ],
    keyAreas: [
      { title: "AWS Platform", description: "Amazon Web Services complet", icon: "Cloud", gradient: "from-orange-500 to-amber-600" },
      { title: "Microsoft Azure", description: "Plateforme cloud Microsoft", icon: "Server", gradient: "from-blue-500 to-indigo-600" },
      { title: "DevOps & CI/CD", description: "Automatisation et déploiement", icon: "GitBranch", gradient: "from-green-500 to-emerald-600" },
      { title: "Container Orchestration", description: "Docker et Kubernetes", icon: "Package", gradient: "from-purple-500 to-violet-600" }
    ],
    firstYearModules: [
      { code: "CLD101", title: "Cloud Fundamentals", duration: "35h" },
      { code: "AWS201", title: "AWS Core Services", duration: "45h" },
      { code: "AZU301", title: "Microsoft Azure", duration: "45h" },
      { code: "DOC401", title: "Docker & Containers", duration: "35h" },
      { code: "KUB501", title: "Kubernetes", duration: "40h" },
      { code: "SEC601", title: "Cloud Security", duration: "35h" }
    ],
    secondYearModules: [
      { code: "ARCH701", title: "Cloud Architecture", duration: "45h" },
      { code: "DEVOPS801", title: "DevOps Avancé", duration: "40h" },
      { code: "MON901", title: "Monitoring & Logs", duration: "35h" },
      { code: "PROJ1001", title: "Projet Infrastructure", duration: "50h" }
    ],
    programGoals: [
      { id: "platforms", title: "Multi-Cloud", description: "Expertise AWS et Azure", icon: "Cloud", color: "bg-gradient-to-r from-orange-500 to-amber-600", details: ["AWS certified", "Azure certified", "Multi-cloud strategies", "Cost optimization"] },
      { id: "architecture", title: "Architecture Cloud", description: "Conception systèmes distribués", icon: "Network", color: "bg-gradient-to-r from-blue-500 to-indigo-600", details: ["Scalable architectures", "Microservices", "Serverless", "High availability"] },
      { id: "devops", title: "DevOps Expert", description: "Automatisation et CI/CD", icon: "GitBranch", color: "bg-gradient-to-r from-green-500 to-emerald-600", details: ["CI/CD pipelines", "Infrastructure as Code", "Automation", "Release management"] },
      { id: "containers", title: "Container Mastery", description: "Docker et Kubernetes expert", icon: "Package", color: "bg-gradient-to-r from-purple-500 to-violet-600", details: ["Docker expert", "Kubernetes certified", "Container orchestration", "Service mesh"] }
    ],
    objectives: {
      mainTitle: "Objectifs Généraux",
      description: "Former des experts cloud capables de concevoir, implémenter et gérer des infrastructures cloud modernes.",
      leftColumn: { title: "Expertise Cloud", skills: ["Plateformes AWS et Azure", "Architecture cloud et microservices", "DevOps et CI/CD", "Containers et Kubernetes", "Sécurité et monitoring", "Cost optimization"], description: "Compétences complètes pour exceller dans l'écosystème cloud moderne." },
      rightColumn: { sections: [{ title: "Hands-on Labs", description: "Laboratoires pratiques sur infrastructures cloud réelles." }, { title: "Certifications", description: "Préparation aux certifications AWS et Azure officielles." }, { title: "Production Ready", description: "Compétences pour gérer des environnements de production." }] }
    },
    teachingStrategies: [
      { title: "Labs Pratiques", icon: "Server", color: "from-orange-500 to-amber-600", content: "Laboratoires hands-on sur AWS et Azure", features: ["Real cloud accounts", "Practical exercises", "Infrastructure setup", "Troubleshooting"] },
      { title: "Certification Prep", icon: "Award", color: "from-blue-500 to-indigo-600", content: "Préparation certifications officielles", features: ["AWS Solutions Architect", "Azure Administrator", "Mock exams", "Study groups"] },
      { title: "Project-Based", icon: "Briefcase", color: "from-green-500 to-emerald-600", content: "Projets d'infrastructure réels", features: ["End-to-end projects", "Production scenarios", "Best practices", "Performance optimization"] },
      { title: "Industry Experts", icon: "Users", color: "from-purple-500 to-violet-600", content: "Formateurs certifiés cloud", features: ["AWS/Azure certified", "Industry experience", "Real-world insights", "Career guidance"] }
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
      { title: "Certifications Cloud", icon: "Award", gradient: "from-orange-500 to-amber-600", details: ["AWS certified", "Azure certified", "Expertise reconnue", "Standards industrie"] },
      { title: "Architecture Moderne", icon: "Network", gradient: "from-blue-500 to-indigo-600", details: ["Microservices", "Serverless", "Container orchestration", "Scalabilité"] },
      { title: "Marché Porteur", icon: "TrendingUp", gradient: "from-green-500 to-emerald-600", details: ["Forte demande", "Salaires élevés", "Télétravail", "Innovation continue"] }
    ]
  },

  "internet-of-things": {
    id: "internet-of-things",
    slug: "internet-of-things",
    heroTitle: "Formation Internet des Objets (IoT)",
    heroSubtitle: "Développez des solutions IoT innovantes et connectez le monde physique au digital",
    presentationSections: [
      { title: "Programme Professionnel", icon: "BookOpen", color: "bg-blue-100", content: "Formation complète en IoT couvrant les capteurs, microcontrôleurs, protocoles de communication et plateformes cloud IoT." },
      { title: "Objectifs de Formation", icon: "Target", color: "bg-green-100", content: "Former des spécialistes IoT capables de concevoir et déployer des systèmes d'objets connectés innovants." },
      { title: "Compétences Acquises", icon: "Award", color: "bg-purple-100", content: "Arduino/Raspberry Pi, capteurs, protocoles IoT, cloud platforms, sécurité IoT, edge computing." },
      { title: "Public Cible", icon: "Users", color: "bg-orange-100", content: "Ingénieurs, développeurs, techniciens souhaitant se spécialiser dans l'Internet des Objets." }
    ],
    keyAreas: [
      { title: "Hardware IoT", description: "Microcontrôleurs et capteurs", icon: "Cpu", gradient: "from-blue-500 to-cyan-600" },
      { title: "Protocoles Communication", description: "WiFi, Bluetooth, LoRaWAN, 5G", icon: "Wifi", gradient: "from-green-500 to-emerald-600" },
      { title: "Cloud IoT", description: "Plateformes AWS IoT, Azure IoT", icon: "Cloud", gradient: "from-purple-500 to-violet-600" },
      { title: "Edge Computing", description: "Traitement local et intelligence", icon: "Zap", gradient: "from-orange-500 to-amber-600" }
    ],
    firstYearModules: [
      { code: "IOT101", title: "Fondamentaux IoT", duration: "30h" },
      { code: "HARD201", title: "Hardware & Capteurs", duration: "40h" },
      { code: "COMM301", title: "Protocoles Communication", duration: "35h" },
      { code: "PROG401", title: "Programmation IoT", duration: "40h" },
      { code: "CLOUD501", title: "Plateformes Cloud IoT", duration: "35h" },
      { code: "SEC601", title: "Sécurité IoT", duration: "30h" }
    ],
    secondYearModules: [
      { code: "EDGE701", title: "Edge Computing", duration: "35h" },
      { code: "AI801", title: "IA pour IoT", duration: "40h" },
      { code: "IND901", title: "IoT Industriel", duration: "35h" },
      { code: "PROJ1001", title: "Projet IoT Complet", duration: "50h" }
    ],
    programGoals: [
      { id: "hardware", title: "Hardware Mastery", description: "Expertise microcontrôleurs et capteurs", icon: "Cpu", color: "bg-gradient-to-r from-blue-500 to-cyan-600", details: ["Arduino/Raspberry Pi", "Sensors integration", "Circuit design", "Prototyping"] },
      { id: "connectivity", title: "Connectivity Expert", description: "Maîtrise protocoles communication", icon: "Wifi", color: "bg-gradient-to-r from-green-500 to-emerald-600", details: ["WiFi/Bluetooth", "LoRaWAN/Sigfox", "5G/NB-IoT", "Mesh networks"] },
      { id: "cloud", title: "Cloud IoT", description: "Plateformes cloud pour IoT", icon: "Cloud", color: "bg-gradient-to-r from-purple-500 to-violet-600", details: ["AWS IoT Core", "Azure IoT Hub", "Google Cloud IoT", "Data processing"] },
      { id: "security", title: "IoT Security", description: "Sécurisation des objets connectés", icon: "Shield", color: "bg-gradient-to-r from-orange-500 to-amber-600", details: ["Device security", "Data encryption", "Network security", "Privacy"] }
    ],
    objectives: {
      mainTitle: "Objectifs Généraux",
      description: "Former des spécialistes IoT capables de concevoir des solutions d'objets connectés sécurisées et évolutives.",
      leftColumn: { title: "Expertise IoT", skills: ["Hardware et microcontrôleurs", "Protocoles de communication", "Plateformes cloud IoT", "Sécurité et privacy", "Edge computing et IA", "Applications industrielles"], description: "Compétences complètes pour développer des solutions IoT de bout en bout." },
      rightColumn: { sections: [{ title: "Projets Concrets", description: "Développement de prototypes IoT fonctionnels avec déploiement réel." }, { title: "Industry 4.0", description: "Applications dans l'industrie 4.0 et la transformation digitale." }, { title: "Innovation", description: "Développement de solutions IoT innovantes pour différents secteurs." }] }
    },
    teachingStrategies: [
      { title: "Hardware Labs", icon: "Cpu", color: "from-blue-500 to-cyan-600", content: "Laboratoires pratiques avec vrais composants", features: ["Arduino/Raspberry Pi", "Sensors & actuators", "Circuit building", "Prototyping"] },
      { title: "Real Deployments", icon: "Satellite", color: "from-green-500 to-emerald-600", content: "Déploiements IoT réels et monitoring", features: ["Live deployments", "Data collection", "Remote monitoring", "Performance analysis"] },
      { title: "Industry Projects", icon: "Factory", color: "from-purple-500 to-violet-600", content: "Projets avec partenaires industriels", features: ["Industry 4.0", "Smart cities", "Agriculture", "Healthcare IoT"] },
      { title: "Innovation Focus", icon: "Lightbulb", color: "from-orange-500 to-amber-600", content: "Développement de solutions innovantes", features: ["Creative thinking", "Problem solving", "Market research", "Patent potential"] }
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
      { title: "Innovation IoT", icon: "Lightbulb", gradient: "from-blue-500 to-cyan-600", details: ["Solutions créatives", "Prototypes fonctionnels", "Market potential", "Technology leadership"] },
      { title: "Expertise Technique", icon: "Cpu", gradient: "from-green-500 to-emerald-600", details: ["Hardware mastery", "Cloud integration", "Security expertise", "Protocol knowledge"] },
      { title: "Marché Émergent", icon: "TrendingUp", gradient: "from-purple-500 to-violet-600", details: ["Croissance rapide", "Secteurs multiples", "Startup opportunities", "Innovation continue"] }
    ]
  },

  "blockchain-cryptocurrency": {
    id: "blockchain-cryptocurrency",
    slug: "blockchain-cryptocurrency",
    heroTitle: "Formation Blockchain et Cryptomonnaies",
    heroSubtitle: "Maîtrisez la technologie blockchain et développez des applications décentralisées",
    presentationSections: [
      { title: "Programme Professionnel", icon: "BookOpen", color: "bg-blue-100", content: "Formation complète en blockchain couvrant Bitcoin, Ethereum, smart contracts, DeFi et développement d'applications décentralisées." },
      { title: "Objectifs de Formation", icon: "Target", color: "bg-green-100", content: "Former des développeurs blockchain capables de créer des solutions décentralisées et de comprendre l'écosystème crypto." },
      { title: "Compétences Acquises", icon: "Award", color: "bg-purple-100", content: "Solidity, smart contracts, Web3, DeFi, NFTs, consensus algorithms, cryptographie, trading crypto." },
      { title: "Public Cible", icon: "Users", color: "bg-orange-100", content: "Développeurs, investisseurs, entrepreneurs, professionnels finance intéressés par la blockchain." }
    ],
    keyAreas: [
      { title: "Smart Contracts", description: "Développement avec Solidity", icon: "FileCode", gradient: "from-blue-500 to-indigo-600" },
      { title: "DeFi Protocols", description: "Finance décentralisée", icon: "Coins", gradient: "from-green-500 to-emerald-600" },
      { title: "Web3 Development", description: "Applications décentralisées", icon: "Globe", gradient: "from-purple-500 to-violet-600" },
      { title: "Crypto Trading", description: "Analyse et stratégies trading", icon: "TrendingUp", gradient: "from-orange-500 to-amber-600" }
    ],
    firstYearModules: [
      { code: "BCH101", title: "Blockchain Fundamentals", duration: "35h" },
      { code: "SOL201", title: "Solidity & Smart Contracts", duration: "45h" },
      { code: "ETH301", title: "Ethereum Ecosystem", duration: "40h" },
      { code: "WEB3401", title: "Web3 Development", duration: "40h" },
      { code: "DEFI501", title: "DeFi Protocols", duration: "35h" },
      { code: "CRYPTO601", title: "Cryptographie", duration: "30h" }
    ],
    secondYearModules: [
      { code: "NFT701", title: "NFTs & Marketplace", duration: "35h" },
      { code: "TRADE801", title: "Crypto Trading", duration: "40h" },
      { code: "DAO901", title: "DAOs & Governance", duration: "30h" },
      { code: "PROJ1001", title: "Projet DApp", duration: "50h" }
    ],
    programGoals: [
      { id: "development", title: "Development Expert", description: "Maîtrise développement blockchain", icon: "Code", color: "bg-gradient-to-r from-blue-500 to-indigo-600", details: ["Solidity expert", "Smart contracts", "Web3 integration", "Gas optimization"] },
      { id: "defi", title: "DeFi Specialist", description: "Expertise finance décentralisée", icon: "Coins", color: "bg-gradient-to-r from-green-500 to-emerald-600", details: ["Liquidity pools", "Yield farming", "DEX protocols", "Risk assessment"] },
      { id: "trading", title: "Crypto Trading", description: "Stratégies trading crypto", icon: "TrendingUp", color: "bg-gradient-to-r from-purple-500 to-violet-600", details: ["Technical analysis", "Risk management", "Portfolio strategy", "Market psychology"] },
      { id: "innovation", title: "Blockchain Innovation", description: "Innovation et entrepreneuriat", icon: "Lightbulb", color: "bg-gradient-to-r from-orange-500 to-amber-600", details: ["New protocols", "Startup creation", "Token economics", "Ecosystem building"] }
    ],
    objectives: {
      mainTitle: "Objectifs Généraux",
      description: "Former des experts blockchain capables de développer des solutions décentralisées et de naviguer dans l'écosystème crypto.",
      leftColumn: { title: "Expertise Blockchain", skills: ["Développement smart contracts", "Protocoles DeFi", "Applications Web3", "Cryptographie avancée", "Trading et investissement", "Analyse de projets crypto"], description: "Compétences complètes pour exceller dans l'écosystème blockchain et crypto." },
      rightColumn: { sections: [{ title: "Projets Réels", description: "Développement de DApps déployées sur mainnet avec utilisateurs réels." }, { title: "Market Analysis", description: "Analyse des marchés crypto et identification d'opportunités." }, { title: "Innovation Lab", description: "Laboratoire d'innovation pour tester de nouveaux concepts blockchain." }] }
    },
    teachingStrategies: [
      { title: "DApp Development", icon: "Code", color: "from-blue-500 to-indigo-600", content: "Développement d'applications décentralisées", features: ["Smart contracts", "Frontend Web3", "Mainnet deployment", "User testing"] },
      { title: "Live Trading", icon: "TrendingUp", color: "from-green-500 to-emerald-600", content: "Trading en conditions réelles avec simulation", features: ["Paper trading", "Strategy backtesting", "Risk management", "Portfolio tracking"] },
      { title: "Ecosystem Immersion", icon: "Globe", color: "from-purple-500 to-violet-600", content: "Immersion complète dans l'écosystème crypto", features: ["DeFi protocols", "NFT marketplaces", "DAO participation", "Community building"] },
      { title: "Expert Network", icon: "Users", color: "from-orange-500 to-amber-600", content: "Réseau d'experts blockchain et crypto", features: ["Industry veterans", "Protocol founders", "VC insights", "Startup mentoring"] }
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
      { title: "Innovation Disruptive", icon: "Lightbulb", gradient: "from-blue-500 to-indigo-600", details: ["Technologies révolutionnaires", "Nouveaux modèles économiques", "Décentralisation", "Innovation continue"] },
      { title: "Expertise Technique", icon: "Code", gradient: "from-green-500 to-emerald-600", details: ["Smart contracts", "DeFi mastery", "Web3 development", "Cryptographie"] },
      { title: "Opportunités Uniques", icon: "TrendingUp", gradient: "from-purple-500 to-violet-600", details: ["Marché émergent", "Startup potential", "Investment opportunities", "Global ecosystem"] }
    ]
  },

  // Marketing & Creative Courses (Remaining 3)
  "ecommerce-marketing": {
    id: "ecommerce-marketing",
    slug: "ecommerce-marketing",
    heroTitle: "Formation Marketing E-commerce",
    heroSubtitle: "Maîtrisez les stratégies marketing pour booster vos ventes en ligne et développer votre business",
    presentationSections: [
      { title: "Programme Professionnel", icon: "BookOpen", color: "bg-blue-100", content: "Formation complète en marketing e-commerce couvrant SEO, publicité payante, conversion optimization et growth hacking." },
      { title: "Objectifs de Formation", icon: "Target", color: "bg-green-100", content: "Former des spécialistes marketing e-commerce capables d'augmenter significativement les ventes en ligne." },
      { title: "Compétences Acquises", icon: "Award", color: "bg-purple-100", content: "SEO e-commerce, Google Ads, Facebook Ads, email marketing, CRO, analytics, marketplace optimization." },
      { title: "Public Cible", icon: "Users", color: "bg-orange-100", content: "E-commerçants, marketeurs digital, entrepreneurs, responsables marketing souhaitant booster leurs ventes online." }
    ],
    keyAreas: [
      { title: "SEO E-commerce", description: "Référencement naturel pour boutiques", icon: "Search", gradient: "from-green-500 to-emerald-600" },
      { title: "Publicité Payante", description: "Google Ads, Facebook Ads, Amazon", icon: "Target", gradient: "from-blue-500 to-cyan-600" },
      { title: "Conversion Optimization", description: "CRO et augmentation des ventes", icon: "TrendingUp", gradient: "from-purple-500 to-violet-600" },
      { title: "Email Marketing", description: "Automation et fidélisation", icon: "Mail", gradient: "from-orange-500 to-amber-600" }
    ],
    firstYearModules: [
      { code: "ECM101", title: "E-commerce Fundamentals", duration: "30h" },
      { code: "SEO201", title: "SEO E-commerce", duration: "40h" },
      { code: "ADS301", title: "Publicité Payante", duration: "45h" },
      { code: "CRO401", title: "Conversion Optimization", duration: "35h" },
      { code: "EMAIL501", title: "Email Marketing", duration: "30h" },
      { code: "MARK601", title: "Marketplace Marketing", duration: "35h" }
    ],
    programGoals: [
      { id: "seo", title: "SEO E-commerce", description: "Référencement boutiques en ligne", icon: "Search", color: "bg-gradient-to-r from-green-500 to-emerald-600", details: ["SEO technique", "Content marketing", "Link building", "Local SEO"] },
      { id: "ads", title: "Publicité Performante", description: "Campagnes payantes rentables", icon: "Target", color: "bg-gradient-to-r from-blue-500 to-cyan-600", details: ["Google Ads", "Facebook Ads", "Amazon PPC", "ROI optimization"] },
      { id: "conversion", title: "Conversion Expert", description: "Optimisation taux de conversion", icon: "TrendingUp", color: "bg-gradient-to-r from-purple-500 to-violet-600", details: ["A/B testing", "UX optimization", "Funnel analysis", "Psychology pricing"] },
      { id: "growth", title: "Growth Hacking", description: "Croissance accélérée", icon: "Rocket", color: "bg-gradient-to-r from-orange-500 to-amber-600", details: ["Viral marketing", "Referral programs", "Retention strategies", "Scaling methods"] }
    ],
    objectives: {
      mainTitle: "Objectifs Généraux",
      description: "Former des experts marketing e-commerce capables de générer une croissance mesurable des ventes en ligne.",
      leftColumn: { title: "Expertise E-commerce", skills: ["SEO e-commerce avancé", "Publicité payante ROI+", "Conversion rate optimization", "Email marketing automation", "Analytics et tracking", "Growth hacking strategies"], description: "Compétences pour maximiser les performances marketing et les ventes e-commerce." },
      rightColumn: { sections: [{ title: "ROI Focus", description: "Accent sur le retour sur investissement et la rentabilité des actions marketing." }, { title: "Data-Driven", description: "Approche basée sur les données et l'analyse des performances." }, { title: "Scaling Strategies", description: "Méthodes pour passer à l'échelle et développer rapidement." }] }
    },
    teachingStrategies: [
      { title: "Boutiques Réelles", icon: "ShoppingCart", color: "from-green-500 to-emerald-600", content: "Optimisation de vraies boutiques e-commerce", features: ["Live optimization", "Real sales data", "A/B testing", "Performance tracking"] },
      { title: "Budget Ads Réel", icon: "DollarSign", color: "from-blue-500 to-cyan-600", content: "Gestion de budgets publicitaires réels", features: ["Google Ads live", "Facebook Ads", "Budget optimization", "ROAS tracking"] },
      { title: "Case Studies", icon: "BarChart3", color: "from-purple-500 to-violet-600", content: "Analyse de success stories e-commerce", features: ["Success stories", "Failure analysis", "Strategy deconstruction", "Lessons learned"] },
      { title: "Tools Mastery", icon: "Settings", color: "from-orange-500 to-amber-600", content: "Maîtrise des outils marketing leaders", features: ["Google Analytics", "Shopify Plus", "Klaviyo", "Hotjar"] }
    ],
    tableOfContents: [
      { section: "01", title: "Présentation du Programme", anchor: "presentation", icon: "FileText" },
      { section: "02", title: "Domaines Clés", anchor: "key-areas", icon: "Target" },
      { section: "03", title: "Curriculum Formation", anchor: "curriculum-year1", icon: "BookOpen" },
      { section: "04", title: "Objectifs du Programme", anchor: "objectives", icon: "Goal" },
      { section: "05", title: "Objectifs Généraux", anchor: "general-objectives", icon: "Target" },
      { section: "06", title: "Stratégies Pédagogiques", anchor: "teaching-strategies", icon: "Users" },
      { section: "07", title: "Synthèse du Programme", anchor: "synthesis", icon: "CheckCircle" },
      { section: "08", title: "Appel à l'Action", anchor: "cta", icon: "ArrowRight" }
    ],
    synthesis: [
      { title: "ROI Garanti", icon: "DollarSign", gradient: "from-green-500 to-emerald-600", details: ["Méthodes prouvées", "Résultats mesurables", "ROI positif", "Growth strategies"] },
      { title: "Expertise Reconnue", icon: "Award", gradient: "from-blue-500 to-cyan-600", details: ["Certifications Google", "Facebook Blueprint", "Expertise validée", "Success stories"] },
      { title: "Marché Porteur", icon: "TrendingUp", gradient: "from-purple-500 to-violet-600", details: ["E-commerce en croissance", "Opportunités multiples", "Freelance possible", "Revenus élevés"] }
    ]
  },

  "video-production-ai-editing": {
    id: "video-production-ai-editing",
    slug: "video-production-ai-editing",
    heroTitle: "Formation Production Vidéo et Montage IA",
    heroSubtitle: "Créez des contenus vidéo professionnels avec les outils IA et les techniques de montage avancées",
    presentationSections: [
      { title: "Programme Professionnel", icon: "BookOpen", color: "bg-blue-100", content: "Formation complète en production vidéo moderne intégrant l'IA pour le montage, les effets et l'optimisation du workflow." },
      { title: "Objectifs de Formation", icon: "Target", color: "bg-green-100", content: "Former des créateurs vidéo capables d'utiliser l'IA pour produire du contenu de qualité professionnelle rapidement." },
      { title: "Compétences Acquises", icon: "Award", color: "bg-purple-100", content: "Montage IA, motion graphics, color grading, audio design, streaming, outils Adobe, stabilisation IA." },
      { title: "Public Cible", icon: "Users", color: "bg-orange-100", content: "Créateurs de contenu, monteurs vidéo, YouTubers, agences marketing, entrepreneurs du digital." }
    ],
    keyAreas: [
      { title: "Montage IA", description: "Outils de montage assistés par IA", icon: "Scissors", gradient: "from-blue-500 to-indigo-600" },
      { title: "Motion Graphics", description: "Animations et effets visuels", icon: "Sparkles", gradient: "from-purple-500 to-pink-600" },
      { title: "Color Grading", description: "Étalonnage et correction couleur", icon: "Palette", gradient: "from-green-500 to-emerald-600" },
      { title: "Streaming & Live", description: "Production en direct et streaming", icon: "Radio", gradient: "from-orange-500 to-amber-600" }
    ],
    firstYearModules: [
      { code: "VID101", title: "Production Vidéo Basics", duration: "35h" },
      { code: "AI201", title: "Montage IA", duration: "40h" },
      { code: "MOT301", title: "Motion Graphics", duration: "40h" },
      { code: "COL401", title: "Color Grading", duration: "35h" },
      { code: "AUD501", title: "Audio Design", duration: "30h" },
      { code: "LIVE601", title: "Streaming & Live", duration: "35h" }
    ],
    programGoals: [
      { id: "ai-editing", title: "Montage IA", description: "Maîtrise des outils de montage IA", icon: "Scissors", color: "bg-gradient-to-r from-blue-500 to-indigo-600", details: ["Auto-editing", "Scene detection", "Face tracking", "Audio sync"] },
      { id: "visual-effects", title: "Effets Visuels", description: "Création d'effets et animations", icon: "Sparkles", color: "bg-gradient-to-r from-purple-500 to-pink-600", details: ["Motion graphics", "VFX compositing", "3D integration", "Particle effects"] },
      { id: "professional", title: "Qualité Pro", description: "Standards professionnels", icon: "Award", color: "bg-gradient-to-r from-green-500 to-emerald-600", details: ["Broadcast quality", "Color science", "Audio mastering", "Delivery formats"] },
      { id: "workflow", title: "Workflow Optimisé", description: "Production efficace avec IA", icon: "Zap", color: "bg-gradient-to-r from-orange-500 to-amber-600", details: ["Automated workflows", "Batch processing", "Template systems", "Asset management"] }
    ],
    objectives: {
      mainTitle: "Objectifs Généraux",
      description: "Former des professionnels de la vidéo capables d'exploiter l'IA pour créer du contenu de qualité avec efficacité.",
      leftColumn: { title: "Expertise Vidéo IA", skills: ["Montage assisté par IA", "Motion graphics avancés", "Color grading professionnel", "Audio design et mixage", "Streaming et live production", "Workflow automation"], description: "Compétences pour créer du contenu vidéo professionnel en exploitant la puissance de l'IA." },
      rightColumn: { sections: [{ title: "Production Moderne", description: "Maîtrise des derniers outils et techniques de production vidéo." }, { title: "Efficiency Focus", description: "Optimisation du temps de production grâce aux outils IA." }, { title: "Creative Excellence", description: "Développement de la créativité et de la vision artistique." }] }
    },
    teachingStrategies: [
      { title: "Projets Créatifs", icon: "Film", color: "from-blue-500 to-indigo-600", content: "Production de vidéos complètes avec brief client", features: ["Client briefs", "Creative process", "Production pipeline", "Delivery standards"] },
      { title: "IA Tools Mastery", icon: "Sparkles", color: "from-purple-500 to-pink-600", content: "Formation sur les derniers outils IA vidéo", features: ["Runway ML", "Descript", "Adobe Sensei", "Topaz Video AI"] },
      { title: "Industry Standards", icon: "Award", color: "from-green-500 to-emerald-600", content: "Formation aux standards professionnels", features: ["Broadcast specs", "Color workflows", "Audio standards", "Delivery formats"] },
      { title: "Portfolio Building", icon: "Briefcase", color: "from-orange-500 to-amber-600", content: "Construction d'un portfolio professionnel", features: ["Demo reel", "Case studies", "Client testimonials", "Showreel creation"] }
    ],
    tableOfContents: [
      { section: "01", title: "Présentation du Programme", anchor: "presentation", icon: "FileText" },
      { section: "02", title: "Domaines Clés", anchor: "key-areas", icon: "Target" },
      { section: "03", title: "Curriculum Formation", anchor: "curriculum-year1", icon: "BookOpen" },
      { section: "04", title: "Objectifs du Programme", anchor: "objectives", icon: "Goal" },
      { section: "05", title: "Objectifs Généraux", anchor: "general-objectives", icon: "Target" },
      { section: "06", title: "Stratégies Pédagogiques", anchor: "teaching-strategies", icon: "Users" },
      { section: "07", title: "Synthèse du Programme", anchor: "synthesis", icon: "CheckCircle" },
      { section: "08", title: "Appel à l'Action", anchor: "cta", icon: "ArrowRight" }
    ],
    synthesis: [
      { title: "Innovation Créative", icon: "Lightbulb", gradient: "from-blue-500 to-indigo-600", details: ["Outils IA maîtrisés", "Workflow optimisé", "Créativité augmentée", "Production accélérée"] },
      { title: "Qualité Professionnelle", icon: "Award", gradient: "from-purple-500 to-pink-600", details: ["Standards broadcast", "Portfolio solide", "Clients satisfaits", "Reconnaissance industrie"] },
      { title: "Marché Dynamique", icon: "TrendingUp", gradient: "from-green-500 to-emerald-600", details: ["Demande croissante", "Opportunités créatives", "Freelance lucratif", "Innovation continue"] }
    ]
  },

  "social-media-content-creation": {
    id: "social-media-content-creation",
    slug: "social-media-content-creation",
    heroTitle: "Formation Création de Contenu Réseaux Sociaux",
    heroSubtitle: "Créez du contenu viral et engageant pour tous les réseaux sociaux avec les stratégies les plus efficaces",
    presentationSections: [
      { title: "Programme Professionnel", icon: "BookOpen", color: "bg-blue-100", content: "Formation complète en création de contenu social media couvrant la stratégie, la production et l'optimisation pour tous les réseaux." },
      { title: "Objectifs de Formation", icon: "Target", color: "bg-green-100", content: "Former des créateurs de contenu capables de développer une audience et générer de l'engagement sur tous les réseaux sociaux." },
      { title: "Compétences Acquises", icon: "Award", color: "bg-purple-100", content: "Stratégie content, création visuelle, vidéo mobile, copywriting, analytics, influencer marketing, personal branding." },
      { title: "Public Cible", icon: "Users", color: "bg-orange-100", content: "Community managers, créateurs de contenu, entrepreneurs, influenceurs, responsables marketing digital." }
    ],
    keyAreas: [
      { title: "Stratégie Contenu", description: "Planification et stratégie éditoriale", icon: "Calendar", gradient: "from-blue-500 to-cyan-600" },
      { title: "Création Visuelle", description: "Design et vidéo pour réseaux sociaux", icon: "Image", gradient: "from-purple-500 to-pink-600" },
      { title: "Copywriting Social", description: "Rédaction persuasive et engageante", icon: "PenTool", gradient: "from-green-500 to-emerald-600" },
      { title: "Engagement & Growth", description: "Croissance d'audience et engagement", icon: "Users", gradient: "from-orange-500 to-amber-600" }
    ],
    firstYearModules: [
      { code: "SMC101", title: "Social Media Strategy", duration: "30h" },
      { code: "VIS201", title: "Création Visuelle", duration: "40h" },
      { code: "VID301", title: "Vidéo Mobile", duration: "35h" },
      { code: "COPY401", title: "Copywriting Social", duration: "30h" },
      { code: "ENG501", title: "Engagement & Growth", duration: "35h" },
      { code: "ANAL601", title: "Analytics & Insights", duration: "25h" }
    ],
    programGoals: [
      { id: "strategy", title: "Stratégie Expert", description: "Maîtrise de la stratégie social media", icon: "Target", color: "bg-gradient-to-r from-blue-500 to-cyan-600", details: ["Content planning", "Platform optimization", "Audience analysis", "Trend identification"] },
      { id: "creation", title: "Création Pro", description: "Production de contenu professionnel", icon: "Palette", color: "bg-gradient-to-r from-purple-500 to-pink-600", details: ["Visual design", "Video editing", "Photo editing", "Template creation"] },
      { id: "engagement", title: "Engagement Master", description: "Maximisation de l'engagement", icon: "Heart", color: "bg-gradient-to-r from-green-500 to-emerald-600", details: ["Community building", "Viral content", "User interaction", "Brand loyalty"] },
      { id: "growth", title: "Growth Hacking", description: "Croissance d'audience rapide", icon: "TrendingUp", color: "bg-gradient-to-r from-orange-500 to-amber-600", details: ["Follower growth", "Reach expansion", "Cross-platform", "Influencer partnerships"] }
    ],
    objectives: {
      mainTitle: "Objectifs Généraux",
      description: "Former des experts en création de contenu social media capables de développer des communautés engagées et des stratégies virales.",
      leftColumn: { title: "Expertise Social Media", skills: ["Stratégie de contenu multi-plateforme", "Création visuelle et vidéo", "Copywriting persuasif", "Analytics et optimisation", "Community management", "Personal branding"], description: "Compétences pour créer du contenu engageant et développer une présence social media forte." },
      rightColumn: { sections: [{ title: "Multi-Platform", description: "Maîtrise de tous les réseaux sociaux majeurs et leurs spécificités." }, { title: "Viral Strategies", description: "Techniques pour créer du contenu viral et maximiser la portée." }, { title: "Business Impact", description: "Conversion de l'audience en résultats business mesurables." }] }
    },
    teachingStrategies: [
      { title: "Comptes Réels", icon: "Smartphone", color: "from-blue-500 to-cyan-600", content: "Gestion de vrais comptes social media", features: ["Live account management", "Real audience", "Performance tracking", "Optimization cycles"] },
      { title: "Trend Analysis", icon: "TrendingUp", color: "from-purple-500 to-pink-600", content: "Analyse des tendances et création adaptée", features: ["Trend identification", "Viral content analysis", "Platform algorithms", "Timing optimization"] },
      { title: "Creative Challenges", icon: "Lightbulb", color: "from-green-500 to-emerald-600", content: "Défis créatifs et concours de contenu", features: ["Creative contests", "Peer feedback", "Innovation challenges", "Portfolio building"] },
      { title: "Influencer Network", icon: "Users", color: "from-orange-500 to-amber-600", content: "Réseau d'influenceurs et créateurs", features: ["Influencer insights", "Collaboration opportunities", "Network building", "Industry connections"] }
    ],
    tableOfContents: [
      { section: "01", title: "Présentation du Programme", anchor: "presentation", icon: "FileText" },
      { section: "02", title: "Domaines Clés", anchor: "key-areas", icon: "Target" },
      { section: "03", title: "Curriculum Formation", anchor: "curriculum-year1", icon: "BookOpen" },
      { section: "04", title: "Objectifs du Programme", anchor: "objectives", icon: "Goal" },
      { section: "05", title: "Objectifs Généraux", anchor: "general-objectives", icon: "Target" },
      { section: "06", title: "Stratégies Pédagogiques", anchor: "teaching-strategies", icon: "Users" },
      { section: "07", title: "Synthèse du Programme", anchor: "synthesis", icon: "CheckCircle" },
      { section: "08", title: "Appel à l'Action", anchor: "cta", icon: "ArrowRight" }
    ],
    synthesis: [
      { title: "Créativité Virale", icon: "Sparkles", gradient: "from-blue-500 to-cyan-600", details: ["Contenu viral", "Engagement élevé", "Audience fidèle", "Impact mesurable"] },
      { title: "Expertise Reconnue", icon: "Award", gradient: "from-purple-500 to-pink-600", details: ["Portfolio impressionnant", "Résultats prouvés", "Certifications", "Réputation établie"] },
      { title: "Opportunités Infinies", icon: "TrendingUp", gradient: "from-green-500 to-emerald-600", details: ["Marché en expansion", "Freelance lucratif", "Personal branding", "Entrepreneuriat digital"] }
    ]
  }
};