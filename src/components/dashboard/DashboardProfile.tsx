import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, BookOpen, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserProfileCard from '@/components/user/UserProfileCard';
import { CourseBookmark } from '@/hooks/useCourseInteractions';

interface DashboardProfileProps {
  bookmarks: CourseBookmark[];
}

const DashboardProfile = ({ bookmarks }: DashboardProfileProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <UserProfileCard />
      
      {/* Bookmarked Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Formations favorites
          </CardTitle>
          <CardDescription>
            Vos formations mises en favoris
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bookmarks.length === 0 ? (
            <div className="text-center py-6">
              <Heart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Aucune formation favorite</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/curriculum">Découvrir nos formations</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarks.slice(0, 3).map((bookmark) => {
                const course = bookmark.courses;
                if (!course) return null;
                
                return (
                  <div key={bookmark.id} className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${course.gradient_from || 'from-primary'} ${course.gradient_to || 'to-primary/80'} flex items-center justify-center flex-shrink-0`}>
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm leading-tight mb-1 truncate">
                          {course.title}
                        </h4>
                        {course.subtitle && (
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {course.subtitle}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {course.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{course.duration}</span>
                            </div>
                          )}
                          {course.modules && (
                            <div className="flex items-center gap-1">
                              <Award className="h-3 w-3" />
                              <span>{course.modules}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button asChild variant="ghost" size="sm" className="flex-shrink-0">
                        <Link to={`/curriculum?course=${course.id}`}>
                          Voir
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
              
              {bookmarks.length > 3 && (
                <Button asChild variant="outline" className="w-full mt-2">
                  <Link to="/curriculum?tab=favorites">
                    Voir tous les favoris ({bookmarks.length})
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardProfile;