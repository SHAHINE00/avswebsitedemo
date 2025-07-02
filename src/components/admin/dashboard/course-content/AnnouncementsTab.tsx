import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Bell } from 'lucide-react';
import { CourseAnnouncement } from '@/hooks/useCourseContent';

interface AnnouncementsTabProps {
  announcements: CourseAnnouncement[];
  onCreateAnnouncement: () => void;
}

const AnnouncementsTab = ({ announcements, onCreateAnnouncement }: AnnouncementsTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Annonces du cours</h3>
        <Button
          onClick={onCreateAnnouncement}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouvelle annonce
        </Button>
      </div>

      <div className="grid gap-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{announcement.title}</h4>
                    <Badge variant={
                      announcement.priority === 'urgent' ? 'destructive' :
                      announcement.priority === 'high' ? 'default' : 'secondary'
                    }>
                      {announcement.priority}
                    </Badge>
                    {announcement.is_pinned && (
                      <Badge variant="outline">Épinglé</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {announcement.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(announcement.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {announcements.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune annonce</h3>
              <p className="text-muted-foreground mb-4">
                Créez des annonces pour informer vos étudiants.
              </p>
              <Button onClick={onCreateAnnouncement}>
                <Plus className="w-4 h-4 mr-2" />
                Créer une annonce
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsTab;