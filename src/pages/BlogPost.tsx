import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';
import { useBlogManagement, BlogPost as BlogPostType } from '@/hooks/useBlogManagement';
import { Badge } from '@/components/ui/badge';

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
              <div className="text-lg leading-relaxed text-gray-700 mb-6">
                {post.excerpt}
              </div>
              
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </article>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;