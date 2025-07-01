import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Code, Rocket, TrendingUp, Users, Building, Star, ArrowRight, CheckCircle, Eye, MessageSquare, Shield, Gamepad2, Cloud, Cpu, Database, TestTube, Layers, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const aiCareers = [
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

const programmingCareers = [
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

const entrepreneurshipOpportunities = [
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

const successStats = [
  { value: "85%", label: "Taux de placement", description: "de nos diplômés trouvent un emploi" },
  { value: "€52k", label: "Salaire moyen", description: "salaire de départ moyen" },
  { value: "25%", label: "Croissance annuelle", description: "du secteur tech en France" },
  { value: "300+", label: "Entreprises partenaires", description: "qui recrutent nos diplômés" }
];

const Careers = () => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Débutant": return "bg-green-100 text-green-800";
      case "Intermédiaire": return "bg-yellow-100 text-yellow-800";
      case "Avancé": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 pb-16 bg-gradient-to-br from-academy-purple via-academy-blue to-academy-lightblue text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-2xl">
                <TrendingUp className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Opportunités de Carrière en IA et Programmation
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
              Découvrez des carrières passionnantes dans les secteurs technologiques les plus dynamiques. 
              Transformez votre passion en expertise professionnelle.
            </p>
            
            {/* Hero Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {successStats.map((stat, index) => (
                <div key={index} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-lg font-semibold mb-1">{stat.label}</div>
                  <div className="text-sm opacity-80">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            
            {/* AI Careers Section */}
            <section className="mb-20">
              <div className="text-center mb-12">
                <div className="flex justify-center mb-4">
                  <div className="bg-academy-blue/10 p-3 rounded-xl">
                    <Brain className="w-8 h-8 text-academy-blue" />
                  </div>
                </div>
                <h2 className="text-4xl font-bold mb-4 gradient-text">Carrières en Intelligence Artificielle</h2>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                  L'IA révolutionne tous les secteurs. Rejoignez cette transformation technologique majeure.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {aiCareers.map((career, index) => {
                  const IconComponent = career.icon;
                  return (
                    <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-academy-blue/20 hover:border-academy-blue/40">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <div className="bg-academy-blue/10 p-2 rounded-lg">
                              <IconComponent className="w-6 h-6 text-academy-blue" />
                            </div>
                            <div>
                              <CardTitle className="text-xl text-academy-blue group-hover:text-academy-purple transition-colors">
                                {career.title}
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(career.level)}`}>
                                  {career.level}
                                </span>
                                <span className="text-sm text-gray-600">{career.experience}</span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-academy-blue/10 text-academy-blue px-3 py-1 rounded-full text-sm font-semibold">
                            {career.salary}
                          </div>
                        </div>
                        <CardDescription className="text-gray-700">
                          {career.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Compétences clés:</h4>
                            <div className="flex flex-wrap gap-2">
                              {career.skills.map((skill, skillIndex) => (
                                <span key={skillIndex} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Applications:</h4>
                            <div className="flex flex-wrap gap-2">
                              {career.applications.map((app, appIndex) => (
                                <span key={appIndex} className="bg-academy-blue/10 text-academy-blue px-2 py-1 rounded-md text-sm">
                                  {app}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center text-green-600">
                              <TrendingUp className="w-4 h-4 mr-1" />
                              <span className="text-sm font-medium">{career.growth}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Building className="w-4 h-4 mr-1" />
                              <span className="text-sm">{career.companies.length} entreprises</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Programming Careers Section */}
            <section className="mb-20">
              <div className="text-center mb-12">
                <div className="flex justify-center mb-4">
                  <div className="bg-academy-purple/10 p-3 rounded-xl">
                    <Code className="w-8 h-8 text-academy-purple" />
                  </div>
                </div>
                <h2 className="text-4xl font-bold mb-4 gradient-text">Carrières en Programmation</h2>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                  Le développement logiciel est au cœur de la transformation digitale mondiale.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {programmingCareers.map((career, index) => {
                  const IconComponent = career.icon;
                  return (
                    <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-academy-purple/20 hover:border-academy-purple/40">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <div className="bg-academy-purple/10 p-2 rounded-lg">
                              <IconComponent className="w-6 h-6 text-academy-purple" />
                            </div>
                            <div>
                              <CardTitle className="text-xl text-academy-purple group-hover:text-academy-blue transition-colors">
                                {career.title}
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(career.level)}`}>
                                  {career.level}
                                </span>
                                <span className="text-sm text-gray-600">{career.experience}</span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-academy-purple/10 text-academy-purple px-3 py-1 rounded-full text-sm font-semibold">
                            {career.salary}
                          </div>
                        </div>
                        <CardDescription className="text-gray-700">
                          {career.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Compétences clés:</h4>
                            <div className="flex flex-wrap gap-2">
                              {career.skills.map((skill, skillIndex) => (
                                <span key={skillIndex} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Applications:</h4>
                            <div className="flex flex-wrap gap-2">
                              {career.applications.map((app, appIndex) => (
                                <span key={appIndex} className="bg-academy-purple/10 text-academy-purple px-2 py-1 rounded-md text-sm">
                                  {app}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center text-green-600">
                              <TrendingUp className="w-4 h-4 mr-1" />
                              <span className="text-sm font-medium">{career.growth}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Building className="w-4 h-4 mr-1" />
                              <span className="text-sm">{career.companies.length} entreprises</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Entrepreneurship Section */}
            <section className="mb-20">
              <div className="bg-gradient-to-r from-academy-purple via-academy-blue to-academy-lightblue rounded-3xl p-12 text-white text-center mb-12">
                <div className="flex justify-center mb-6">
                  <div className="bg-white/20 p-4 rounded-2xl">
                    <Rocket className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h2 className="text-4xl font-bold mb-6">Créez Votre Startup Tech</h2>
                <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
                  L'entrepreneuriat technologique offre des opportunités illimitées. 
                  Transformez vos idées en solutions innovantes.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                  {entrepreneurshipOpportunities.map((opportunity, index) => (
                    <div key={index} className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                      <h3 className="text-xl font-bold mb-3">{opportunity.title}</h3>
                      <p className="text-white/90 mb-4">{opportunity.description}</p>
                      <div className="text-academy-lightblue font-semibold mb-4">{opportunity.market}</div>
                      <div className="space-y-2">
                        {opportunity.examples.map((example, exampleIndex) => (
                          <div key={exampleIndex} className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 mr-2 text-green-300" />
                            <span>{example}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Success Stories Section */}
            <section className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 gradient-text">Témoignages de Réussite</h2>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                  Découvrez comment nos diplômés ont transformé leur carrière
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-academy-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-academy-blue" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Sarah M.</h3>
                    <p className="text-academy-blue font-semibold mb-2">Data Scientist chez Amazon</p>
                    <p className="text-gray-700 text-sm mb-4">"Formation complète qui m'a permis de décrocher mon poste de rêve en 6 mois"</p>
                    <div className="text-2xl font-bold text-green-600">€65k</div>
                    <div className="text-sm text-gray-600">Salaire de départ</div>
                  </CardContent>
                </Card>
                
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-academy-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-academy-purple" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Marc L.</h3>
                    <p className="text-academy-purple font-semibold mb-2">CTO de sa startup</p>
                    <p className="text-gray-700 text-sm mb-4">"J'ai lancé ma startup tech grâce aux compétences acquises. Levée de fonds réussie!"</p>
                    <div className="text-2xl font-bold text-green-600">€2M</div>
                    <div className="text-sm text-gray-600">Levée de fonds</div>
                  </CardContent>
                </Card>
                
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-academy-lightblue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-academy-lightblue" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Julie R.</h3>
                    <p className="text-academy-lightblue font-semibold mb-2">Développeur Full Stack chez Google</p>
                    <p className="text-gray-700 text-sm mb-4">"Transition réussie depuis le marketing. Les formateurs sont exceptionnels!"</p>
                    <div className="text-2xl font-bold text-green-600">€78k</div>
                    <div className="text-sm text-gray-600">Salaire actuel</div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Call to Action */}
            <section className="text-center bg-academy-gray rounded-3xl p-12">
              <h2 className="text-4xl font-bold mb-6">Prêt à Transformer Votre Carrière ?</h2>
              <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                Rejoignez des milliers d'étudiants qui ont déjà fait le premier pas vers une carrière tech passionnante.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild size="lg" className="bg-academy-blue hover:bg-academy-purple text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <Link to="/register">
                    Commencer ma formation
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-academy-blue text-academy-blue hover:bg-academy-blue hover:text-white px-8 py-4 text-lg rounded-xl">
                  <Link to="/curriculum">
                    Découvrir les programmes
                  </Link>
                </Button>
              </div>
              
              <div className="mt-8 flex justify-center items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                  <span>Pas d'engagement</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                  <span>Garantie emploi</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                  <span>Support 24/7</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Careers;
