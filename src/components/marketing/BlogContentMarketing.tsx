import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishDate: string;
  readTime: string;
  featured?: boolean;
  tags: string[];
}

const marketingBlogPosts: BlogPost[] = [
  {
    id: 'avenir-ia-2024',
    title: "L'Intelligence Artificielle en 2024: Tendances et Opportunités",
    excerpt: "Découvrez les principales tendances IA qui transformeront le marché du travail et les compétences les plus recherchées.",
    category: "IA & Innovation",
    author: "Dr. Abdelaziz Berrada",
    publishDate: "2024-12-01",
    readTime: "8 min",
    featured: true,
    tags: ["IA", "Carrière", "Tendances", "2024"]
  },
  {
    id: 'guide-developpeur-ia',
    title: "Comment Devenir Développeur IA: Guide Complet 2024",
    excerpt: "Roadmap détaillée pour construire une carrière en développement IA, des bases aux compétences avancées.",
    category: "Carrière",
    author: "Hassan El Idrissi",
    publishDate: "2024-11-28",
    readTime: "12 min",
    featured: true,
    tags: ["Développement", "IA", "Carrière", "Formation"]
  },
  {
    id: 'cybersecurite-menaces-2024',
    title: "Cybersécurité: Les 10 Principales Menaces de 2024",
    excerpt: "Analyse des nouvelles cybermenaces et stratégies de protection pour les entreprises modernes.",
    category: "Cybersécurité",
    author: "Fatima Zahra Alami",
    publishDate: "2024-11-25",
    readTime: "10 min",
    tags: ["Cybersécurité", "Menaces", "Protection", "Enterprise"]
  },
  {
    id: 'salaires-tech-maroc',
    title: "Salaires Tech au Maroc: Étude de Marché 2024",
    excerpt: "Découvrez les rémunérations moyennes dans la tech au Maroc et les compétences les mieux payées.",
    category: "Marché de l'Emploi",
    author: "Youssef Benjelloun",
    publishDate: "2024-11-20",
    readTime: "6 min",
    tags: ["Salaires", "Maroc", "Tech", "Emploi"]
  },
  {
    id: 'machine-learning-pratique',
    title: "Machine Learning: De la Théorie à la Pratique",
    excerpt: "Guide pratique pour implémenter vos premiers modèles de machine learning avec des exemples concrets.",
    category: "Technique",
    author: "Omar Lamrini",
    publishDate: "2024-11-18",
    readTime: "15 min",
    tags: ["Machine Learning", "Pratique", "Modèles", "Python"]
  },
  {
    id: 'reconversion-tech',
    title: "Réussir sa Reconversion dans la Tech après 30 ans",
    excerpt: "Conseils et stratégies pour une reconversion réussie dans le domaine technologique.",
    category: "Reconversion",
    author: "Aicha Bennani",
    publishDate: "2024-11-15",
    readTime: "9 min",
    tags: ["Reconversion", "Carrière", "Tech", "Formation"]
  }
];

const BlogContentMarketing: React.FC = () => {
  const featuredPosts = marketingBlogPosts.filter(post => post.featured);
  const regularPosts = marketingBlogPosts.filter(post => !post.featured);

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Blog Expert - Actualités Tech
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Restez à jour avec les dernières tendances en IA, programmation et cybersécurité
          </p>
        </div>

        {/* Featured Posts */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {featuredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-shadow border-academy-blue/20">
              <div className="bg-gradient-to-r from-academy-blue to-academy-purple p-1">
                <div className="bg-white rounded-t-lg p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-academy-blue/10 text-academy-blue text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                    <span className="text-yellow-600 text-xs font-medium">✨ Article vedette</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.publishDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <Button className="w-full group" variant="outline">
                    Lire l'article
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Regular Posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {regularPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                    {post.category}
                  </span>
                </div>
                <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Lire la suite
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-academy-blue to-academy-purple rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Ne manquez aucun article</h3>
          <p className="mb-6 opacity-90">
            Abonnez-vous à notre newsletter pour recevoir nos derniers articles et guides exclusifs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Button asChild variant="secondary" size="lg" className="flex-1">
              <Link to="/blog">
                Voir tous les articles
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1 border-white text-white hover:bg-white hover:text-academy-blue">
              <Link to="/contact">
                S'abonner à la newsletter
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogContentMarketing;