import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Pin } from 'lucide-react';
import { useProfessorAnnouncements } from '@/hooks/useProfessorAnnouncements';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface AnnouncementsTabProps {
  courseId: string;
}

const AnnouncementsTab: React.FC<AnnouncementsTabProps> = ({ courseId }) => {
  const { announcements, loading, fetchAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useProfessorAnnouncements(courseId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'normal',
    isPinned: false
  });

  useEffect(() => {
    fetchAnnouncements();
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createAnnouncement(
      formData.title,
      formData.content,
      formData.priority,
      formData.isPinned
    );
    
    if (success) {
      setDialogOpen(false);
      setFormData({
        title: '',
        content: '',
        priority: 'normal',
        isPinned: false
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      await deleteAnnouncement(id);
    }
  };

  const handleTogglePin = async (announcement: any) => {
    await updateAnnouncement(announcement.id, undefined, undefined, undefined, !announcement.is_pinned);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Annonces du cours</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle annonce
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer une annonce</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Titre</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Titre de l'annonce"
                  required
                />
              </div>
              <div>
                <Label>Contenu</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Message de l'annonce..."
                  rows={6}
                  required
                />
              </div>
              <div>
                <Label>Priorité</Label>
                <Select value={formData.priority} onValueChange={(v) => setFormData({...formData, priority: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">Important</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pinned">Épingler l'annonce</Label>
                <Switch
                  id="pinned"
                  checked={formData.isPinned}
                  onCheckedChange={(checked) => setFormData({...formData, isPinned: checked})}
                />
              </div>
              <Button type="submit" className="w-full">Publier l'annonce</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Chargement...</p>
        ) : announcements.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Aucune annonce publiée</p>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{announcement.title}</h3>
                    {announcement.is_pinned && <Pin className="h-4 w-4 text-primary" />}
                    <Badge variant={getPriorityColor(announcement.priority)}>
                      {announcement.priority === 'high' ? 'Important' : announcement.priority === 'urgent' ? 'Urgent' : 'Normal'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleTogglePin(announcement)}
                    >
                      <Pin className={`h-4 w-4 ${announcement.is_pinned ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(announcement.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground whitespace-pre-wrap">{announcement.content}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(announcement.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnnouncementsTab;
