import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Megaphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useProfessorAnnouncements } from '@/hooks/useProfessorAnnouncements';

interface Course {
  id: string;
  title: string;
}

const BulkAnnouncementDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('normal');
  const [isPinned, setIsPinned] = useState(false);
  const { createBulkAnnouncement } = useProfessorAnnouncements('');

  useEffect(() => {
    if (open) {
      fetchProfessorCourses();
    }
  }, [open]);

  const fetchProfessorCourses = async () => {
    try {
      const { data: professorData } = await supabase
        .from('professors')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (professorData) {
        const { data: assignments } = await supabase
          .from('teaching_assignments')
          .select('course_id, courses(id, title)')
          .eq('professor_id', professorData.id);

        if (assignments) {
          const coursesList = assignments
            .map(a => a.courses)
            .filter(c => c !== null) as Course[];
          setCourses(coursesList);
        }
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedCourses.length === 0) {
      return;
    }

    const success = await createBulkAnnouncement(
      selectedCourses,
      title,
      content,
      priority,
      isPinned
    );

    if (success) {
      setOpen(false);
      setSelectedCourses([]);
      setTitle('');
      setContent('');
      setPriority('normal');
      setIsPinned(false);
    }
  };

  const toggleCourse = (courseId: string) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Megaphone className="h-4 w-4 mr-2" />
          Annonce groupée
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une annonce pour plusieurs cours</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Sélectionner les cours</Label>
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
              {courses.map(course => (
                <div key={course.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={course.id}
                    checked={selectedCourses.includes(course.id)}
                    onCheckedChange={() => toggleCourse(course.id)}
                  />
                  <label
                    htmlFor={course.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {course.title}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {selectedCourses.length} cours sélectionné(s)
            </p>
          </div>

          <div>
            <Label>Titre de l'annonce</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de l'annonce"
              required
            />
          </div>

          <div>
            <Label>Contenu</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Contenu de l'annonce..."
              rows={5}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Priorité</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normale</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pinned"
                  checked={isPinned}
                  onCheckedChange={(checked) => setIsPinned(checked as boolean)}
                />
                <label
                  htmlFor="pinned"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Épingler l'annonce
                </label>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={selectedCourses.length === 0}>
            Créer {selectedCourses.length > 0 && `(${selectedCourses.length} cours)`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BulkAnnouncementDialog;
