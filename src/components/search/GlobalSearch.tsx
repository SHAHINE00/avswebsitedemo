import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCourses } from '@/hooks/useCourses';
import { useCardFeedback } from '@/hooks/useTouchFeedback';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  title: string;
  type: 'course' | 'instructor' | 'category';
  description?: string;
  tags?: string[];
  url: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch = ({ isOpen, onClose }: GlobalSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { courses } = useCourses();
  const cardFeedback = useCardFeedback();

  // Popular searches
  const popularSearches = [
    'Intelligence Artificielle',
    'Cybersécurité',
    'Programmation',
    'Marketing Digital',
    'Design UX/UI'
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveSearch = (searchQuery: string) => {
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const searchCourses = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const filtered = courses
      .filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(course => ({
        id: course.id,
        title: course.title,
        type: 'course' as const,
        description: course.subtitle,
        tags: [course.feature1, course.feature2].filter(Boolean).slice(0, 3),
        url: `/curriculum#${course.id}`
      }))
      .slice(0, 6);

    setResults(filtered);
    setIsLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      searchCourses(query);
    }, 200);

    return () => clearTimeout(timer);
  }, [query, courses]);

  const handleResultClick = (result: SearchResult) => {
    saveSearch(query);
    window.location.href = result.url;
    onClose();
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-fade-in">
      <div className="container mx-auto px-4 pt-4 pb-8 max-w-2xl">
        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher des formations, instructeurs..."
            className="pl-10 pr-10 h-12 text-lg"
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search Results */}
        {query && (
          <Card className="mb-4 animate-scale-in">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4">
                  <div className="animate-pulse space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-12 bg-muted rounded" />
                    ))}
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="max-h-96 overflow-y-auto">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      {...cardFeedback.cardProps}
                      onClick={() => handleResultClick(result)}
                      className={cn(
                        "p-4 border-b last:border-b-0 hover:bg-accent/50 transition-colors",
                        cardFeedback.cardProps.className
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                          <Search className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm mb-1 truncate">
                            {result.title}
                          </h3>
                          {result.description && (
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {result.description}
                            </p>
                          )}
                          {result.tags && result.tags.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              {result.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucun résultat trouvé</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent Searches */}
        {!query && recentSearches.length > 0 && (
          <Card className="mb-4 animate-scale-in">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recherches récentes
                </h3>
                <Button variant="ghost" size="sm" onClick={clearRecentSearches} className="text-xs">
                  Effacer
                </Button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="w-full text-left p-2 rounded hover:bg-accent/50 transition-colors text-sm"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Popular Searches */}
        {!query && (
          <Card className="animate-scale-in">
            <CardContent className="p-4">
              <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Recherches populaires
              </h3>
              <div className="flex gap-2 flex-wrap">
                {popularSearches.map((search, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleRecentSearchClick(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;