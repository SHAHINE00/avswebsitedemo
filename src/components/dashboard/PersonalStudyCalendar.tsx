import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  BookOpen, 
  Clock, 
  Target,
  Bell,
  Repeat
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';

interface StudySession {
  id: string;
  title: string;
  course: string;
  date: Date;
  startTime: string;
  duration: number;
  type: 'lesson' | 'quiz' | 'review' | 'project';
  completed: boolean;
  reminder: boolean;
}

interface StudyGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: 'hours' | 'lessons' | 'courses';
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
}

const PersonalStudyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [showGoalDialog, setShowGoalDialog] = useState(false);

  // Mock data - replace with real data from hooks
  const [studySessions, setStudySessions] = useState<StudySession[]>([
    {
      id: '1',
      title: 'Introduction à l\'IA',
      course: 'Intelligence Artificielle',
      date: new Date(),
      startTime: '09:00',
      duration: 60,
      type: 'lesson',
      completed: false,
      reminder: true
    },
    {
      id: '2',
      title: 'Quiz Python Basics',
      course: 'Programmation Python',
      date: new Date(Date.now() + 86400000),
      startTime: '14:00',
      duration: 30,
      type: 'quiz',
      completed: false,
      reminder: true
    }
  ]);

  const [studyGoals, setStudyGoals] = useState<StudyGoal[]>([
    {
      id: '1',
      title: 'Terminer le cours IA',
      target: 20,
      current: 15,
      unit: 'lessons',
      deadline: new Date(Date.now() + 7 * 86400000),
      priority: 'high'
    },
    {
      id: '2',
      title: 'Étudier 10h cette semaine',
      target: 10,
      current: 6,
      unit: 'hours',
      deadline: new Date(Date.now() + 3 * 86400000),
      priority: 'medium'
    }
  ]);

  const selectedDateSessions = studySessions.filter(
    session => session.date.toDateString() === selectedDate?.toDateString()
  );

  const getTypeColor = (type: StudySession['type']) => {
    switch (type) {
      case 'lesson': return 'bg-blue-500';
      case 'quiz': return 'bg-yellow-500';
      case 'review': return 'bg-green-500';
      case 'project': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: StudySession['type']) => {
    switch (type) {
      case 'lesson': return <BookOpen className="h-4 w-4" />;
      case 'quiz': return <Target className="h-4 w-4" />;
      case 'review': return <Repeat className="h-4 w-4" />;
      case 'project': return <Calendar className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: StudyGoal['priority']) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Calendrier d'Étude</h2>
          <p className="text-muted-foreground">
            Planifiez et suivez vos sessions d'apprentissage
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Planifier une Session d'Étude</DialogTitle>
                <DialogDescription>
                  Créez une nouvelle session d'apprentissage
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="session-title">Titre</Label>
                  <Input id="session-title" placeholder="Ex: Chapitre 3 - Variables Python" />
                </div>
                <div>
                  <Label htmlFor="session-course">Formation</Label>
                  <Input id="session-course" placeholder="Ex: Programmation Python" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="session-time">Heure</Label>
                    <Input id="session-time" type="time" defaultValue="09:00" />
                  </div>
                  <div>
                    <Label htmlFor="session-duration">Durée (min)</Label>
                    <Input id="session-duration" type="number" defaultValue="60" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setShowSessionDialog(false)}>
                  Créer la Session
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Target className="h-4 w-4 mr-2" />
                Nouvel Objectif
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un Objectif d'Étude</DialogTitle>
                <DialogDescription>
                  Définissez un objectif d'apprentissage avec une échéance
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="goal-title">Titre de l'objectif</Label>
                  <Input id="goal-title" placeholder="Ex: Terminer le module Machine Learning" />
                </div>
                <div>
                  <Label htmlFor="goal-description">Description</Label>
                  <Textarea id="goal-description" placeholder="Détails de votre objectif..." />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="goal-target">Cible</Label>
                    <Input id="goal-target" type="number" defaultValue="10" />
                  </div>
                  <div>
                    <Label htmlFor="goal-unit">Unité</Label>
                    <select className="w-full h-10 px-3 border rounded-md">
                      <option value="lessons">Leçons</option>
                      <option value="hours">Heures</option>
                      <option value="courses">Formations</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="goal-deadline">Échéance</Label>
                    <Input id="goal-deadline" type="date" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setShowGoalDialog(false)}>
                  Créer l'Objectif
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendrier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Daily Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate?.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </CardTitle>
            <CardDescription>
              {selectedDateSessions.length} session(s) prévue(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDateSessions.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Aucune session prévue</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateSessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getTypeColor(session.type)}`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{session.title}</p>
                        <p className="text-xs text-muted-foreground">{session.course}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {session.startTime}
                          </span>
                          <span>{session.duration}min</span>
                          {session.reminder && (
                            <Bell className="h-3 w-3" />
                          )}
                        </div>
                      </div>
                      {getTypeIcon(session.type)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Study Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Objectifs d'Étude
          </CardTitle>
          <CardDescription>
            Vos objectifs d'apprentissage et leur progression
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {studyGoals.map((goal) => (
              <div key={goal.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{goal.title}</h4>
                  <Badge variant={getPriorityColor(goal.priority)}>
                    {goal.priority}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Progression</span>
                    <span>{goal.current}/{goal.target} {goal.unit}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Échéance: {goal.deadline.toLocaleDateString()}</span>
                    <span>{Math.round((goal.current / goal.target) * 100)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalStudyCalendar;