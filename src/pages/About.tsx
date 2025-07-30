import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import VisibleSection from '@/components/ui/VisibleSection';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Award, Globe, Heart, Lightbulb } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Target className="w-8 h-8 text-academy-blue" />,
      title: "Excellence pédagogique",
      description: "Nous nous engageons à fournir une formation de la plus haute qualité avec des méthodes d'apprentissage innovantes."
    },
    {
      icon: <Users className="w-8 h-8 text-academy-blue" />,
      title: "Accompagnement personnalisé",
      description: "Chaque apprenant bénéficie d'un suivi individualisé adapté à ses objectifs et son rythme d'apprentissage."
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-academy-blue" />,
      title: "Innovation constante",
      description: "Nous intégrons les dernières technologies et tendances pour préparer nos étudiants aux défis de demain."
    },
    {
      icon: <Heart className="w-8 h-8 text-academy-blue" />,
      title: "Passion pour l'enseignement",
      description: "Notre équipe partage une passion commune pour transmettre le savoir et accompagner la réussite."
    }
  ];

  const stats = [
    { number: "500+", label: "Étudiants formés" },
    { number: "95%", label: "Taux de satisfaction" },
    { number: "15+", label: "Formateurs experts" },
    { number: "10+", label: "Années d'expérience" }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead 
        title="À propos - AVS Innovation Institute"
        description="Découvrez l'histoire, la mission et les valeurs d'AVS Innovation Institute. Leader en formation technologique avec plus de 500 étudiants formés."
        keywords="about, histoire, mission, valeurs, formation technologique, AVS Innovation"
      />
      
      <VisibleSection sectionKey="global_navbar">
        <Navbar />
      </VisibleSection>
      
      {/* Hero Section */}
      <VisibleSection sectionKey="about_hero">
        <div className="pt-24 pb-16 bg-gradient-to-br from-academy-blue/5 to-academy-purple/5">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                À propos d'AVS Innovation Institute
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Pionniers de l'innovation pédagogique en partenariat avec des universités et entreprises de renommée internationale, 
                nous formons les talents de demain aux technologies qui transforment le monde.
              </p>
            </div>
          </div>
        </div>
      </VisibleSection>

      <main className="flex-grow">
        {/* Mission Section */}
        <VisibleSection sectionKey="about_mission">
          <section className="py-16">
            <div className="container mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-gray-900">Notre Mission</h2>
                  <p className="text-lg text-gray-700 mb-6">
                    AVS Innovation Institute a pour mission de démocratiser l'accès aux formations 
                    technologiques de pointe. Nous croyons que chaque individu mérite d'avoir les 
                    compétences nécessaires pour prospérer dans l'économie numérique.
                  </p>
                  <p className="text-lg text-gray-700">
                    Depuis notre création, nous nous efforçons de créer un environnement 
                    d'apprentissage stimulant où la théorie rencontre la pratique, et où 
                    l'innovation guide chaque étape du parcours pédagogique.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-academy-blue/10 to-academy-purple/10 p-8 rounded-lg">
                  <Globe className="w-16 h-16 text-academy-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-4">Vision 2030</h3>
                  <p className="text-gray-700">
                    Notre ambition est de devenir une référence mondiale en matière de formation technologique.
                    Nous visons à former 10 000 professionnels hautement qualifiés d'ici 2030.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </VisibleSection>

        {/* Values Section */}
        <VisibleSection sectionKey="about_values">
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Nos Valeurs</h2>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                  Ces valeurs fondamentales guident notre approche pédagogique et 
                  notre engagement envers nos étudiants.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4">
                        {value.icon}
                      </div>
                      <h3 className="text-lg font-semibold mb-3">{value.title}</h3>
                      <p className="text-gray-600">{value.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </VisibleSection>

        {/* Stats Section */}
        <VisibleSection sectionKey="about_stats">
          <section className="py-16">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Nos Réalisations</h2>
                <p className="text-lg text-gray-700">
                  Des chiffres qui témoignent de notre engagement et de notre impact.
                </p>
              </div>
              <div className="grid md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl font-bold text-academy-blue mb-2">{stat.number}</div>
                    <div className="text-gray-700 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </VisibleSection>

        {/* History Section */}
        <VisibleSection sectionKey="about_history">
          <section className="py-16 bg-gradient-to-br from-academy-blue/5 to-academy-purple/5">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Notre Histoire</h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-academy-blue rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">2014 - Création</h3>
                      <p className="text-gray-700">
                        Fondation d'AVS Innovation Institute avec pour objectif de créer 
                        un nouveau modèle de formation technologique adapté aux besoins du marché.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-academy-blue rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">2017 - Expansion</h3>
                      <p className="text-gray-700">
                        Lancement de nos premiers programmes en intelligence artificielle 
                        et développement web, avec plus de 100 étudiants la première année.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-academy-blue rounded-full flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">2020 - Digitalisation</h3>
                      <p className="text-gray-700">
                        Adaptation rapide à l'apprentissage en ligne avec le développement 
                        de notre plateforme d'apprentissage interactive et immersive.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-academy-blue rounded-full flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">2024 - Innovation</h3>
                      <p className="text-gray-700">
                        Intégration de l'IA dans nos méthodes pédagogiques et lancement 
                        de nouveaux programmes en cybersécurité et analyse de données.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </VisibleSection>

        {/* CTA Section */}
        <VisibleSection sectionKey="about_cta">
          <section className="py-16">
            <div className="container mx-auto px-6">
              <div className="bg-gradient-to-r from-academy-blue to-academy-purple rounded-lg p-8 md:p-12 text-white text-center">
                <h2 className="text-3xl font-bold mb-4">Rejoignez l'Innovation</h2>
                <p className="text-xl mb-8 opacity-90">
                  Prêt à transformer votre carrière avec nos formations d'excellence ?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/curriculum" 
                    className="bg-white text-academy-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Découvrir nos formations
                  </a>
                  <a 
                    href="/contact" 
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-academy-blue transition-colors"
                  >
                    Nous contacter
                  </a>
                </div>
              </div>
            </div>
          </section>
        </VisibleSection>
      </main>
      
      <VisibleSection sectionKey="global_footer">
        <Footer />
      </VisibleSection>
    </div>
  );
};

export default About;