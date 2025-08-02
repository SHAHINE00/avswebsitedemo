import React from 'react';
import { Calendar, BookOpen, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ContentMarketing: React.FC = () => {
  const blogTopics = [
    {
      title: "L'avenir de l'Intelligence Artificielle en 2024",
      excerpt: "Découvrez les tendances IA qui transformeront les entreprises",
      category: "IA & Innovation",
      readTime: "5 min",
      icon: TrendingUp
    },
    {
      title: "Guide complet: Devenir Développeur IA",
      excerpt: "Toutes les étapes pour construire une carrière en développement IA",
      category: "Carrière",
      readTime: "8 min",
      icon: BookOpen
    },
    {
      title: "Cybersécurité: Les 10 menaces de 2024",
      excerpt: "Comment protéger votre entreprise des nouvelles cyberattaques",
      category: "Cybersécurité",
      readTime: "6 min",
      icon: Users
    }
  ];

  const stats = [
    { label: "Articles publiés", value: "50+", icon: BookOpen },
    { label: "Lecteurs mensuels", value: "10K+", icon: Users },
    { label: "Guides téléchargés", value: "2.5K+", icon: TrendingUp },
    { label: "Webinaires", value: "25+", icon: Calendar }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Centre de Ressources
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez nos guides experts, articles de blog et ressources exclusives pour accélérer votre carrière dans la tech
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-4">
                  <Icon className="w-8 h-8 text-academy-blue mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Featured Content */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {blogTopics.map((topic, index) => {
            const Icon = topic.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-5 h-5 text-academy-blue" />
                    <span className="text-sm text-academy-blue font-medium">{topic.category}</span>
                  </div>
                  <CardTitle className="text-lg">{topic.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{topic.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {topic.readTime} de lecture
                    </span>
                    <Button variant="outline" size="sm">
                      Lire la suite
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-academy-blue to-academy-purple">
            <Link to="/blog">
              Accéder à tous nos articles
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContentMarketing;