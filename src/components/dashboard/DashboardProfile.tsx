import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
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
            </div>
          ) : (
            <div className="space-y-2">
              {bookmarks.slice(0, 5).map((bookmark) => (
                <div key={bookmark.id} className="p-3 rounded-lg border">
                  <p className="font-medium">Formation {bookmark.course_id}</p>
                  <p className="text-sm text-muted-foreground">
                    Ajouté le {new Date(bookmark.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardProfile;