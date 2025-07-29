// SEO data for different pages and courses

export const defaultSEO = {
  title: "AVS - Institut de l'Innovation et de l'Intelligence Artificielle",
  description: "Rejoignez notre programme complet AVS IA Course et maîtrisez les technologies d'intelligence artificielle de pointe avec des instructeurs experts.",
  keywords: "formation ia, intelligence artificielle, machine learning, programmation, cybersécurité, formation en ligne"
};

export const pageSEO = {
  home: {
    title: "AVS - Formation IA et Programmation | Institut d'Innovation",
    description: "Formations complètes en Intelligence Artificielle, Programmation et Cybersécurité. Certifications reconnues, instructeurs experts, projets pratiques.",
    keywords: "formation ia, intelligence artificielle, programmation, cybersécurité, machine learning, formation en ligne, certificat"
  },
  curriculum: {
    title: "Formations et Cours - Intelligence Artificielle | AVS Institut",
    description: "Découvrez notre catalogue complet de formations : IA & Data Science, Programmation & Infrastructure, Marketing Digital. Programmes certifiants.",
    keywords: "catalogue formation, cours ia, formation programmation, data science, marketing digital, cursus complet"
  },
  features: {
    title: "Avantages et Fonctionnalités - Formations AVS",
    description: "Découvrez les avantages uniques de nos formations : projets pratiques, certification reconnue, accompagnement personnalisé, réseau professionnel.",
    keywords: "avantages formation, projets pratiques, certification, accompagnement, réseau professionnel"
  },
  instructors: {
    title: "Instructeurs Experts - Équipe Pédagogique AVS",
    description: "Rencontrez notre équipe d'instructeurs experts en IA, programmation et cybersécurité. Professionnels reconnus dans leur domaine.",
    keywords: "instructeurs experts, équipe pédagogique, experts ia, professeurs programmation"
  },
  testimonials: {
    title: "Témoignages Étudiants - Avis sur les Formations AVS",
    description: "Découvrez les témoignages de nos étudiants qui ont réussi leur carrière grâce à nos formations en IA et programmation.",
    keywords: "témoignages étudiants, avis formation, retour expérience, réussite professionnelle"
  },
  careers: {
    title: "Opportunités de Carrière - Débouchés après Formation AVS",
    description: "Explorez les opportunités de carrière en IA, programmation et cybersécurité. Salaires, perspectives d'évolution, témoignages de réussite.",
    keywords: "carrière ia, opportunités emploi, salaire développeur, métiers intelligence artificielle"
  },
  contact: {
    title: "Contact - AVS Institut Formation IA et Programmation",
    description: "Contactez-nous pour plus d'informations sur nos formations en Intelligence Artificielle et Programmation. Conseils personnalisés.",
    keywords: "contact formation, information cours, conseil orientation, inscription formation"
  },
  blog: {
    title: "Blog - Actualités IA et Programmation | AVS Institut",
    description: "Suivez l'actualité de l'Intelligence Artificielle, du Machine Learning et de la Programmation sur notre blog expert.",
    keywords: "blog ia, actualités intelligence artificielle, tendances tech, articles programmation"
  }
};

export const courseSEO = {
  "formation-ia": {
    title: "Formation Intelligence Artificielle - Certification IA | AVS",
    description: "Formation complète en Intelligence Artificielle : Machine Learning, Deep Learning, Big Data. 18 mois, diplôme certifié, projets pratiques.",
    keywords: "formation ia, machine learning, deep learning, big data, certification intelligence artificielle"
  },
  "formation-programmation": {
    title: "Formation Programmation - Développement Web & Mobile | AVS",
    description: "Formation Programmation complète : Full Stack, DevOps, développement web et mobile. 24 semaines, diplôme certifié, projets concrets.",
    keywords: "formation programmation, développement web, full stack, devops, formation développeur"
  },
  "formation-cybersecurite": {
    title: "Formation Cybersécurité - Ethical Hacking & Sécurité | AVS",
    description: "Formation Cybersécurité : Ethical Hacking, Network Security, sécurité informatique. 12 mois, certification reconnue.",
    keywords: "formation cybersécurité, ethical hacking, sécurité informatique, certification sécurité"
  },
  "ai-ml-engineering": {
    title: "AI & Machine Learning Engineering - Formation Ingénieur IA | AVS",
    description: "Maîtrisez l'ingénierie des systèmes d'IA et ML. Développement de modèles en production, architecture scalable. Certification MIT.",
    keywords: "ingénieur ia, machine learning engineering, modèles production, architecture ia"
  },
  "business-intelligence": {
    title: "Formation Business Intelligence - Analyse de Données | AVS",
    description: "Transformez les données en insights stratégiques. Tableaux de bord, analyse prédictive, certification Google Cloud.",
    keywords: "business intelligence, analyse données, tableaux de bord, analyse prédictive"
  }
};

export const generateCourseSEO = (courseTitle: string, courseSubtitle?: string) => {
  const title = `${courseTitle} - Formation Professionnelle | AVS Institut`;
  const description = courseSubtitle 
    ? `Formation ${courseTitle}: ${courseSubtitle}. Certification reconnue, instructeurs experts, projets pratiques. Inscrivez-vous dès maintenant.`
    : `Formation professionnelle ${courseTitle}. Certification reconnue, accompagnement personnalisé, débouchés garantis.`;
  
  const keywords = `formation ${courseTitle.toLowerCase()}, cours ${courseTitle.toLowerCase()}, certification professionnelle`;

  return { title, description, keywords };
};