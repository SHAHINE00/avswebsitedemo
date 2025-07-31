import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Code, Shield, Megaphone, TrendingUp, Lightbulb } from 'lucide-react';
import { useBlogManagement } from '@/hooks/useBlogManagement';
import { Link } from 'react-router-dom';

const BlogCategories: React.FC = () => {
  const { categories, posts, loading, fetchPublishedPosts } = useBlogManagement();
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchPublishedPosts();
  }, []);

  useEffect(() => {
    const stats: Record<string, number> = {};
    posts.forEach(post => {
      if (post.category_id) {
        stats[post.category_id] = (stats[post.category_id] || 0) + 1;
      }
    });
    setCategoryStats(stats);
  }, [posts]);

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('intelligence') || name.includes('ia') || name.includes('ai')) return Brain;
    if (name.includes('programmation') || name.includes('développement') || name.includes('code')) return Code;
    if (name.includes('cybersécurité') || name.includes('sécurité')) return Shield;
    if (name.includes('marketing') || name.includes('digital')) return Megaphone;
    if (name.includes('carrières') || name.includes('emploi')) return TrendingUp;
    return Lightbulb;
  };

  const getCategoryColor = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('intelligence') || name.includes('ia') || name.includes('ai')) 
      return 'from-academy-blue to-academy-purple';
    if (name.includes('programmation') || name.includes('développement') || name.includes('code')) 
      return 'from-academy-purple to-academy-lightblue';
    if (name.includes('cybersécurité') || name.includes('sécurité')) 
      return 'from-red-500 to-orange-500';
    if (name.includes('marketing') || name.includes('digital')) 
      return 'from-academy-lightblue to-academy-blue';
    if (name.includes('carrières') || name.includes('emploi')) 
      return 'from-green-500 to-emerald-500';
    return 'from-gray-500 to-gray-600';
  };

  if (loading || categories.length === 0) {
    return (
      <section className="py-16 bg-academy-gray/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Catégories Populaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 h-32 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-academy-gray/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Catégories Populaires</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explorez nos articles par domaines d'expertise
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.name);
            const articleCount = categoryStats[category.id] || 0;
            
            return (
              <Link 
                key={category.id} 
                to={`/blog?category=${category.id}`}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getCategoryColor(category.name)} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    
                    {category.description && (
                      <p className="text-gray-600 mb-4 text-sm">
                        {category.description}
                      </p>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="text-xs">
                        {articleCount} article{articleCount !== 1 ? 's' : ''}
                      </Badge>
                      <span className="text-primary font-medium text-sm group-hover:underline">
                        Explorer →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BlogCategories;