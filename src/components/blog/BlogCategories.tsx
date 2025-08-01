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

  return null;
};

export default BlogCategories;