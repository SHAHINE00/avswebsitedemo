import React, { useEffect, useState } from 'react';
import { useClassSchedule } from '@/hooks/useClassSchedule';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ClassScheduleManagerProps {
  courseId: string;
  professorId: string;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Dimanche' },
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' }
];

const SESSION_TYPES = [
  { value: 'lecture', label: 'Cours magistral' },
  { value: 'lab', label: 'TP' },
  { value: 'tutorial', label: 'TD' },
  { value: 'exam', label: 'Examen' },
  { value: 'workshop', label: 'Atelier' }
];

export const ClassScheduleManager: React.FC<ClassScheduleManagerProps> = ({ courseId, professorId }) => {
  const { schedules, loading, fetchSchedules, createSchedule, deleteSchedule, generateSessions } = useClassSchedule(courseId);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    day_of_week: 1,
    start_time: '09:00',
    end_time: '11:00',
    room_location: '',
    session_type: 'lecture',
    notes: ''
  });

  useEffect(() => {
    fetchSchedules();
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createSchedule({
      course_id: courseId,
      professor_id: professorId,
      day_of_week: formData.day_of_week,
      start_time: formData.start_time,
      end_time: formData.end_time,
      room_location: formData.room_location || null,
      session_type: formData.session_type,
      notes: formData.notes || null,
      is_recurring: true
    });
    if (success) {
      setOpen(false);
      setFormData({
        day_of_week: 1,
        start_time: '09:00',
        end_time: '11:00',
        room_location: '',
        session_type: 'lecture',
        notes: ''
      });
    }
  };

  const handleGenerateSessions = async (scheduleId: string) => {
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    await generateSessions(scheduleId, startDate, endDate);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Emploi du temps</CardTitle>
            <CardDescription>Gérez l'horaire récurrent du cours</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Nouvelle plage horaire</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une plage horaire</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Jour de la semaine</Label>
                  <Select value={formData.day_of_week.toString()} onValueChange={(value) => setFormData({ ...formData, day_of_week: parseInt(value) })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map(day => (
                        <SelectItem key={day.value} value={day.value.toString()}>{day.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Heure de début</Label>
                    <Input type="time" value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} />
                  </div>
                  <div>
                    <Label>Heure de fin</Label>
                    <Input type="time" value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Type de séance</Label>
                  <Select value={formData.session_type} onValueChange={(value) => setFormData({ ...formData, session_type: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SESSION_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Salle</Label>
                  <Input placeholder="Ex: Salle A101" value={formData.room_location} onChange={(e) => setFormData({ ...formData, room_location: e.target.value })} />
                </div>
                <Button type="submit" className="w-full">Créer</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-muted-foreground">Chargement...</p>
        ) : schedules.length === 0 ? (
          <p className="text-center text-muted-foreground">Aucune plage horaire définie</p>
        ) : (
          <div className="space-y-3">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{DAYS_OF_WEEK.find(d => d.value === schedule.day_of_week)?.label}</span>
                    <Clock className="h-4 w-4 text-muted-foreground ml-4" />
                    <span>{schedule.start_time} - {schedule.end_time}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="capitalize">{SESSION_TYPES.find(t => t.value === schedule.session_type)?.label}</span>
                    {schedule.room_location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{schedule.room_location}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleGenerateSessions(schedule.id)}>
                    Générer séances
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteSchedule(schedule.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
