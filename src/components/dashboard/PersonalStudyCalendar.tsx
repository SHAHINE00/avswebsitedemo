import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStudyCalendar } from '@/hooks/useStudyCalendar';
import { useStudents } from '@/hooks/useStudents';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for session
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionCourseId, setSessionCourseId] = useState('');
  const [sessionTime, setSessionTime] = useState('09:00');
  const [sessionDuration, setSessionDuration] = useState(60);

  // Form states for goal
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState(10);
  const [goalType, setGoalType] = useState('weekly_lessons');
  const [goalDeadline, setGoalDeadline] = useState('');

  // Enrollments for course selection
  const [enrollments, setEnrollments] = useState<any[]>([]);
  
  // Use real data from hooks
  const { 
    studySessions, 
    studyGoals, 
    loading, 
    createStudySession, 
    createStudyGoal 
  } = useStudyCalendar();
  
  const { getMyEnrollments } = useStudents();

  // Fetch enrollments on mount
  useEffect(() => {
    const loadEnrollments = async () => {
      const data = await getMyEnrollments();
      setEnrollments(data);
    };
    loadEnrollments();
  }, []);

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

  const handleCreateSession = async () => {
    // Validation
    if (!sessionTitle.trim()) {
      toast({
        title: "Titre requis",
        description: "Veuillez saisir un titre pour la session",
        variant: "destructive"
      });
      return;
    }
    
    if (!sessionCourseId) {
      toast({
        title: "Formation requise",
        description: "Veuillez sélectionner une formation",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedDate) {
      toast({
        title: "Date requise",
        description: "Veuillez sélectionner une date",
        variant: "destructive"
      });
      return;
    }

    if (sessionDuration <= 0 || sessionDuration > 480) {
      toast({
        title: "Durée invalide",
        description: "La durée doit être entre 1 et 480 minutes",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createStudySession({
        title: sessionTitle.trim(),
        course_id: sessionCourseId,
        date: selectedDate,
        startTime: sessionTime,
        duration: sessionDuration,
        type: 'lesson'
      });
      
      // Reset form
      setSessionTitle('');
      setSessionCourseId('');
      setSessionTime('09:00');
      setSessionDuration(60);
      setShowSessionDialog(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateGoal = async () => {
    if (!goalTitle || !goalDeadline) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    
    await createStudyGoal({
      title: goalTitle,
      target: goalTarget,
      goalType: goalType,
      deadline: new Date(goalDeadline)
    });
    
    // Reset form
    setGoalTitle('');
    setGoalTarget(10);
    setGoalType('weekly_lessons');
    setGoalDeadline('');
    setShowGoalDialog(false);
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
                  <Input 
                    id="session-title" 
                    placeholder="Ex: Chapitre 3 - Variables Python"
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="session-course">Formation</Label>
                  <Select value={sessionCourseId} onValueChange={setSessionCourseId}>
                    <SelectTrigger id="session-course">
                      <SelectValue placeholder="Sélectionnez une formation" />
                    </SelectTrigger>
                    <SelectContent>
                      {enrollments.length === 0 ? (
                        <SelectItem value="none" disabled>
                          Aucune formation inscrite
                        </SelectItem>
                      ) : (
                        enrollments.map((enrollment) => (
                          <SelectItem key={enrollment.course_id} value={enrollment.course_id}>
                            {enrollment.courses?.title || 'Formation'}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="session-time">Heure</Label>
                    <Input 
                      id="session-time" 
                      type="time"
                      value={sessionTime}
                      onChange={(e) => setSessionTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="session-duration">Durée (min)</Label>
                    <Input 
                      id="session-duration" 
                      type="number"
                      value={sessionDuration}
                      onChange={(e) => setSessionDuration(parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowSessionDialog(false)} disabled={isSubmitting}>
                  Annuler
                </Button>
                <Button 
                  onClick={handleCreateSession} 
                  disabled={!sessionTitle.trim() || !sessionCourseId || isSubmitting}
                >
                  {isSubmitting ? "Création..." : "Créer la Session"}
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
                  <Input 
                    id="goal-title" 
                    placeholder="Ex: Terminer le module Machine Learning"
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="goal-target">Cible</Label>
                    <Input 
                      id="goal-target" 
                      type="number"
                      value={goalTarget}
                      onChange={(e) => setGoalTarget(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="goal-type">Type</Label>
                    <select 
                      id="goal-type"
                      className="w-full h-10 px-3 border rounded-md"
                      value={goalType}
                      onChange={(e) => setGoalType(e.target.value)}
                    >
                      <option value="weekly_lessons">Leçons hebdomadaires</option>
                      <option value="weekly_hours">Heures hebdomadaires</option>
                      <option value="monthly_lessons">Leçons mensuelles</option>
                      <option value="monthly_hours">Heures mensuelles</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="goal-deadline">Échéance</Label>
                    <Input 
                      id="goal-deadline" 
                      type="date"
                      value={goalDeadline}
                      onChange={(e) => setGoalDeadline(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowGoalDialog(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateGoal} disabled={!goalTitle || !goalDeadline}>
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
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="pointer-events-auto"
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
                <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
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