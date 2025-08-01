import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBlogManagement, BlogPost } from '@/hooks/useBlogManagement';
import { ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import OptimizedImage from '@/components/OptimizedImage';

const DynamicBlog = () => {
  const { posts, categories, loading, fetchPublishedPosts } = useBlogManagement();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchPublishedPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category_id === selectedCategory);
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, selectedCategory]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un article..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Featured Post */}
          {filteredPosts.length > 0 && (
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {filteredPosts[0].featured_image_url && (
                  <OptimizedImage
                    src={filteredPosts[0].featured_image_url}
                    alt={filteredPosts[0].title}
                    className="w-full h-64 md:h-full object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
                <div className="p-6 flex flex-col justify-center">
                  <Badge className="w-fit mb-3 bg-primary/10 text-primary">
                    Article en vedette
                  </Badge>
                  <h2 className="text-2xl font-bold mb-3 hover:text-primary transition-colors">
                    <Link to={`/blog/${filteredPosts[0].slug}`}>
                      {filteredPosts[0].title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {filteredPosts[0].excerpt}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-500">
                      <span>{formatDate(filteredPosts[0].created_at)}</span>
                      <span className="mx-2">•</span>
                      <span>Par {filteredPosts[0].profiles?.full_name || 'Auteur'}</span>
                    </div>
                    <Link 
                      to={`/blog/${filteredPosts[0].slug}`}
                      className="text-primary font-medium flex items-center hover:underline"
                    >
                      Lire plus <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Blog Posts Grid */}
          {filteredPosts.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.slice(1).map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {post.featured_image_url && (
                    <OptimizedImage
                      src={post.featured_image_url}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3 hover:text-primary transition-colors">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-gray-500">
                        <span>{formatDate(post.created_at)}</span>
                        <span className="mx-2">•</span>
                        <span>Par {post.profiles?.full_name || 'Auteur'}</span>
                      </div>
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="text-primary font-medium flex items-center hover:underline"
                      >
                        Lire plus <ArrowRight className="ml-1 w-4 h-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Posts Message */}
          {filteredPosts.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun article trouvé.</p>
            </div>
          )}

          {/* Load More Button */}
          {filteredPosts.length > 7 && (
            <div className="text-center">
              <Button variant="outline" size="lg" className="px-8">
                Charger plus d'articles
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Quick Newsletter Signup */}
          <Card className="p-6 bg-gradient-to-br from-academy-blue/5 to-academy-purple/5">
            <h4 className="text-lg font-bold mb-3">Newsletter Tech</h4>
            <p className="text-sm text-gray-600 mb-4">
              Recevez nos meilleurs articles chaque semaine.
            </p>
            <div className="space-y-3">
              <Input 
                placeholder="votre@email.com" 
                className="text-sm"
              />
              <Button className="w-full bg-academy-blue hover:bg-academy-purple text-white">
                S'abonner
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DynamicBlog;