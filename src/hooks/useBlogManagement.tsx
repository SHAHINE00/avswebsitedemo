import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
  blog_categories: {
    name: string;
    slug: string;
  };
  profiles: {
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
      // Placeholder implementation - will work once database migration is executed
      setPosts([]);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les articles - Migration de base de données requise",
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
      // Placeholder implementation - will work once database migration is executed
      setCategories([]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const createPost = async (postData: Partial<BlogPost>) => {
    if (!user) return;
    // Placeholder implementation - will work once database migration is executed
    toast({
      title: "Info",
      description: "Fonctionnalité disponible après migration de base de données",
    });
  };

  const updatePost = async (postId: string, updates: Partial<BlogPost>) => {
    // Placeholder - will work after migration
    toast({ title: "Info", description: "Migration requise", });
  };

  const deletePost = async (postId: string) => {
    // Placeholder - will work after migration
    toast({ title: "Info", description: "Migration requise", });
  };

  const publishPost = async (postId: string) => {
    // Placeholder - will work after migration
    toast({ title: "Info", description: "Migration requise", });
  };

  const getPostBySlug = async (slug: string) => {
    // Placeholder - will work after migration
    return null;
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