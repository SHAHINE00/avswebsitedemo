import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronDown, ChevronRight, Archive } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlogManagement } from '@/hooks/useBlogManagement';

interface MonthlyArchive {
  year: number;
  month: number;
  monthName: string;
  postCount: number;
  posts: Array<{
    id: string;
    title: string;
    slug: string;
    createdAt: string;
    categoryName?: string;
  }>;
}

const BlogArchive: React.FC = () => {
  const { posts, loading, fetchPublishedPosts } = useBlogManagement();
  const [archive, setArchive] = useState<MonthlyArchive[]>([]);
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPublishedPosts();
  }, []);

  useEffect(() => {
    if (posts.length === 0) return;

    const archiveMap = new Map<string, MonthlyArchive>();

    posts.forEach(post => {
      const date = new Date(post.created_at);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthKey = `${year}-${month}`;

      if (!archiveMap.has(monthKey)) {
        archiveMap.set(monthKey, {
          year,
          month,
          monthName: new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(date),
          postCount: 0,
          posts: []
        });
      }

      const monthData = archiveMap.get(monthKey)!;
      monthData.postCount++;
      monthData.posts.push({
        id: post.id,
        title: post.title,
        slug: post.slug,
        createdAt: post.created_at,
        categoryName: post.blog_categories?.name
      });
    });

    // Sort by year and month (most recent first)
    const sortedArchive = Array.from(archiveMap.values()).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

    // Sort posts within each month
    sortedArchive.forEach(monthData => {
      monthData.posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });

    setArchive(sortedArchive);
  }, [posts]);

  const toggleMonth = (monthKey: string) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(monthKey)) {
      newExpanded.delete(monthKey);
    } else {
      newExpanded.add(monthKey);
    }
    setExpandedMonths(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="w-5 h-5" />
            Archives du Blog
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 h-12 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Archive className="w-5 h-5" />
          Archives du Blog
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {archive.map(monthData => {
            const monthKey = `${monthData.year}-${monthData.month}`;
            const isExpanded = expandedMonths.has(monthKey);

            return (
              <div key={monthKey} className="border rounded-lg">
                <Button
                  variant="ghost"
                  onClick={() => toggleMonth(monthKey)}
                  className="w-full justify-between p-4 h-auto hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-academy-blue" />
                    <div className="text-left">
                      <div className="font-medium">
                        {monthData.monthName} {monthData.year}
                      </div>
                      <div className="text-sm text-gray-500">
                        {monthData.postCount} article{monthData.postCount > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>

                {isExpanded && (
                  <div className="px-4 pb-4">
                    <div className="border-t pt-3 space-y-3">
                      {monthData.posts.map(post => (
                        <Link
                          key={post.id}
                          to={`/blog/${post.slug}`}
                          className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm line-clamp-2 hover:text-academy-blue transition-colors">
                                {post.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">
                                  {formatDate(post.createdAt)}
                                </span>
                                {post.categoryName && (
                                  <>
                                    <span className="text-xs text-gray-400">•</span>
                                    <Badge variant="outline" className="text-xs">
                                      {post.categoryName}
                                    </Badge>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {archive.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Archive className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucun article dans les archives</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogArchive;