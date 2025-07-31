import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';
import { useBlogManagement, BlogPost as BlogPostType } from '@/hooks/useBlogManagement';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BlogComments from '@/components/blog/BlogComments';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getPostBySlug } = useBlogManagement();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      setLoading(true);
      const blogPost = await getPostBySlug(slug);
      setPost(blogPost);
      setLoading(false);
    };

    fetchPost();
  }, [slug, getPostBySlug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de l'article...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
            <Link to="/blog" className="text-primary hover:underline">
              Retour au blog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Link 
            to="/blog" 
            className="inline-flex items-center text-primary hover:underline mb-8"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Retour au blog
          </Link>
          
          <article>
            <div className="mb-8">
              <Badge className="bg-primary/10 text-primary">
                {post.blog_categories?.name}
              </Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
            
            <div className="flex items-center text-gray-600 mb-8">
              <span>Par {post.profiles?.full_name}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(post.published_at || post.created_at)}</span>
              <span className="mx-2">•</span>
              <span>{post.view_count} vues</span>
            </div>
            
            {post.featured_image_url && (
              <OptimizedImage
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            )}
            
            <div className="prose prose-lg max-w-none">
              <div className="text-xl leading-relaxed text-gray-700 mb-8 font-medium border-l-4 border-primary pl-6 bg-primary/5 py-4 rounded-r-lg">
                {post.excerpt}
              </div>
              
              <div 
                className="text-gray-700 leading-relaxed blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Article Tags */}
            <div className="mt-8 pt-8 border-t">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600 mr-2">Tags:</span>
                <Badge variant="outline" className="text-xs">
                  {post.blog_categories?.name}
                </Badge>
                {/* Add more tags if available */}
              </div>
            </div>

            {/* Share Buttons */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Partager cet article:</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-blue-600 hover:bg-blue-50">
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm" className="text-blue-500 hover:bg-blue-50">
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm" className="text-blue-700 hover:bg-blue-50">
                    Facebook
                  </Button>
                </div>
              </div>
            </div>

            {/* Author Box */}
            <div className="mt-8 p-6 bg-academy-gray/20 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-academy-blue to-academy-purple rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {post.profiles?.full_name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-2">À propos de {post.profiles?.full_name}</h4>
                  <p className="text-gray-600 text-sm mb-3">
                    Expert en technologie et rédacteur passionné, partageant son expertise sur les dernières innovations tech.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Voir tous les articles
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Related Articles */}
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-2xl font-bold mb-6">Articles recommandés</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* This would be populated with related articles */}
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-32 bg-gradient-to-br from-academy-blue/20 to-academy-purple/20"></div>
                <CardContent className="p-4">
                  <h4 className="font-bold mb-2">Article recommandé 1</h4>
                  <p className="text-sm text-gray-600 mb-3">Description de l'article recommandé...</p>
                  <Link to="#" className="text-primary text-sm hover:underline">
                    Lire la suite →
                  </Link>
                </CardContent>
              </Card>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-32 bg-gradient-to-br from-academy-lightblue/20 to-academy-blue/20"></div>
                <CardContent className="p-4">
                  <h4 className="font-bold mb-2">Article recommandé 2</h4>
                  <p className="text-sm text-gray-600 mb-3">Description de l'article recommandé...</p>
                  <Link to="#" className="text-primary text-sm hover:underline">
                    Lire la suite →
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-12 pt-8 border-t">
            <BlogComments postId={post.id} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;