import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logError } from '@/utils/logger';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featured_image_url: string | null;
  author_id: string;
  category_id: string;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  created_at: string;
  updated_at: string;
  view_count: number;
  blog_categories?: {
    name: string;
    slug: string;
  };
  profiles?: {
    full_name: string;
  };
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface BlogComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  profiles: {
    full_name: string;
  };
}

export const useBlogManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (status?: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories (
            name,
            slug
          ),
          profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        logError('Error fetching posts:', error);
        throw error;
      }
      setPosts((data as unknown as BlogPost[]) || []);
    } catch (error) {
      logError('Error fetching posts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les articles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPublishedPosts = async () => {
    await fetchPosts('published');
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      logError('Error fetching categories:', error);
    }
  };

  const createPost = async (postData: Partial<BlogPost>) => {
    if (!user) return;
    
    try {
      const insertData = {
        title: postData.title!,
        content: postData.content!,
        excerpt: postData.excerpt!,
        slug: postData.slug!,
        category_id: postData.category_id!,
        author_id: user.id,
        featured_image_url: postData.featured_image_url || null,
        status: postData.status || 'draft',
        published_at: postData.status === 'published' ? new Date().toISOString() : null
      };

      const { data, error } = await supabase
        .from('blog_posts')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      
      await fetchPosts();
      toast({
        title: "Succès",
        description: "Article créé avec succès",
      });
    } catch (error) {
      logError('Error creating post:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'article",
        variant: "destructive",
      });
    }
  };

  const updatePost = async (postId: string, updates: Partial<BlogPost>) => {
    try {
      const updateData: Partial<BlogPost> = {
        title: updates.title,
        content: updates.content,
        excerpt: updates.excerpt,
        slug: updates.slug,
        category_id: updates.category_id,
        featured_image_url: updates.featured_image_url,
        status: updates.status,
        published_at: updates.status === 'published' && !updates.published_at 
          ? new Date().toISOString() 
          : updates.published_at
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof BlogPost] === undefined) {
          delete updateData[key as keyof BlogPost];
        }
      });

      const { error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', postId);

      if (error) throw error;
      
      await fetchPosts();
      toast({
        title: "Succès",
        description: "Article mis à jour avec succès",
      });
    } catch (error) {
      logError('Error updating post:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'article",
        variant: "destructive",
      });
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      
      await fetchPosts();
      toast({
        title: "Succès",
        description: "Article supprimé avec succès",
      });
    } catch (error) {
      logError('Error deleting post:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'article",
        variant: "destructive",
      });
    }
  };

  const publishPost = async (postId: string) => {
    await updatePost(postId, { 
      status: 'published', 
      published_at: new Date().toISOString() 
    });
  };

  const getPostBySlug = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories (
            name,
            slug
          ),
          profiles (
            full_name
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        logError('Error fetching post by slug:', error);
        return null;
      }
      return data as unknown as BlogPost;
    } catch (error) {
      logError('Error fetching post by slug:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    posts,
    categories,
    loading,
    fetchPosts,
    fetchPublishedPosts,
    fetchCategories,
    createPost,
    updatePost,
    deletePost,
    publishPost,
    getPostBySlug,
  };
};