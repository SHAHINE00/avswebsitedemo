import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Share2, Clock, Eye, Calendar, User, ExternalLink } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';
import { useBlogManagement, BlogPost as BlogPostType } from '@/hooks/useBlogManagement';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import BlogComments from '@/components/blog/BlogComments';
import SEOHead from '@/components/SEOHead';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getPostBySlug, fetchPublishedPosts, posts } = useBlogManagement();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [readingTime, setReadingTime] = useState(0);

  // Calculate reading time (average 200 words per minute)
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      setLoading(true);
      const blogPost = await getPostBySlug(slug);
      setPost(blogPost);
      
      if (blogPost) {
        setReadingTime(calculateReadingTime(blogPost.content));
      }
      
      setLoading(false);
    };

    fetchPost();
  }, [slug, getPostBySlug]);

  useEffect(() => {
    fetchPublishedPosts();
  }, [fetchPublishedPosts]);

  useEffect(() => {
    if (post && posts.length > 0) {
      // Get related posts from the same category
      const related = posts
        .filter(p => p.id !== post.id && p.category_id === post.category_id)
        .slice(0, 2);
      setRelatedPosts(related);
    }
  }, [post, posts]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareOnSocial = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || '';
    
    const shareUrls = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    };
    
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
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
      <SEOHead 
        title={post?.title || 'Article de blog'}
        description={post?.excerpt || ''}
        ogImage={post?.featured_image_url || ''}
      />
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
            
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>Par {post.profiles?.full_name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.published_at || post.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{readingTime} min de lecture</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.view_count} vues</span>
              </div>
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Partager cet article:</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => shareOnSocial('linkedin')}
                    className="text-blue-600 hover:bg-blue-50 border-blue-200"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    LinkedIn
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => shareOnSocial('twitter')}
                    className="text-blue-500 hover:bg-blue-50 border-blue-200"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Twitter
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => shareOnSocial('facebook')}
                    className="text-blue-700 hover:bg-blue-50 border-blue-200"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
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
          {relatedPosts.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-2xl font-bold mb-6">Articles recommandés</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {relatedPost.featured_image_url ? (
                      <OptimizedImage
                        src={relatedPost.featured_image_url}
                        alt={relatedPost.title}
                        className="w-full h-32 object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/10"></div>
                    )}
                    <CardContent className="p-4">
                      <div className="mb-2">
                        <Badge variant="outline" className="text-xs">
                          {relatedPost.blog_categories?.name}
                        </Badge>
                      </div>
                      <h4 className="font-bold mb-2 line-clamp-2">{relatedPost.title}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{relatedPost.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {formatDate(relatedPost.created_at)}
                        </span>
                        <Link 
                          to={`/blog/${relatedPost.slug}`} 
                          className="text-primary text-sm hover:underline flex items-center gap-1"
                        >
                          Lire la suite →
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

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