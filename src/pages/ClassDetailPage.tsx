import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, TrendingUp, FileText, Settings, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useCourseClasses } from '@/hooks/useCourseClasses';
import { useClassDetails } from '@/hooks/useClassDetails';
import { useClassStats } from '@/hooks/useClassStats';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ClassDetailPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('students');
  
  const { classes, loading: classLoading } = useCourseClasses();
  const { students, sessions, loading: detailsLoading } = useClassDetails(classId);
  const { stats, loading: statsLoading } = useClassStats(classId);

  const classData = classes.find(c => c.id === classId);
  const loading = classLoading || detailsLoading || statsLoading;

  if (classLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Classe introuvable</CardTitle>
            <CardDescription>La classe demandée n'existe pas ou a été supprimée.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'administration
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const capacityPercentage = (stats.totalStudents / classData.max_students) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto p-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'administration
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{classData.class_name}</h1>
              <p className="text-muted-foreground mt-1">{classData.course_name || classData.course?.title}</p>
              <div className="flex gap-2 mt-3">
                {classData.class_code && <Badge variant="outline">{classData.class_code}</Badge>}
                <Badge variant={
                  classData.status === 'active' ? 'default' :
                  classData.status === 'completed' ? 'secondary' : 'destructive'
                }>
                  {classData.status === 'active' ? 'Active' :
                   classData.status === 'completed' ? 'Terminée' : 'Annulée'}
                </Badge>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Professeur</div>
              <div className="font-medium">{classData.professor?.full_name || 'Non assigné'}</div>
              {classData.professor?.email && (
                <div className="text-sm text-muted-foreground">{classData.professor.email}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Étudiants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalStudents} / {classData.max_students}</div>
              <Progress value={capacityPercentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {capacityPercentage.toFixed(0)}% de capacité
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Taux de présence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.attendanceRate}%</div>
              <Progress value={stats.attendanceRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Moyenne générale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.averageGrade}%</div>
              <Progress value={stats.averageGrade} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeSessions}</div>
              <p className="text-sm text-muted-foreground mt-1">
                {stats.upcomingSessions} à venir
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="students">
              <Users className="h-4 w-4 mr-2" />
              Étudiants
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <Calendar className="h-4 w-4 mr-2" />
              Planning
            </TabsTrigger>
            <TabsTrigger value="attendance">
              <TrendingUp className="h-4 w-4 mr-2" />
              Présence
            </TabsTrigger>
            <TabsTrigger value="grades">
              <FileText className="h-4 w-4 mr-2" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="materials">
              <BookOpen className="h-4 w-4 mr-2" />
              Matériel
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Liste des étudiants</CardTitle>
                <CardDescription>
                  {stats.totalStudents} étudiant(s) inscrit(s) dans cette classe
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16" />)}
                  </div>
                ) : students.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Étudiant</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Présence</TableHead>
                        <TableHead className="text-right">Moyenne</TableHead>
                        <TableHead className="text-right">Date d'inscription</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {student.full_name?.charAt(0) || student.email?.charAt(0) || '?'}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{student.full_name || 'Sans nom'}</span>
                            </div>
                          </TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell className="text-right">
                            <span className={
                              student.attendance_rate >= 85 ? 'text-green-600' :
                              student.attendance_rate >= 70 ? 'text-yellow-600' : 'text-red-600'
                            }>
                              {student.attendance_rate.toFixed(0)}%
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {student.average_grade !== null ? `${student.average_grade.toFixed(0)}%` : '-'}
                          </TableCell>
                          <TableCell className="text-right text-sm text-muted-foreground">
                            {new Date(student.enrollment_date).toLocaleDateString('fr-FR')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-muted-foreground py-8">Aucun étudiant inscrit</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Planning des sessions</CardTitle>
                <CardDescription>
                  {sessions.length} session(s) planifiée(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-20" />)}
                  </div>
                ) : sessions.length > 0 ? (
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <div key={session.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">
                              {new Date(session.session_date).toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {session.start_time} - {session.end_time}
                            </div>
                            {session.room_location && (
                              <div className="text-sm text-muted-foreground mt-1">
                                📍 {session.room_location}
                              </div>
                            )}
                          </div>
                          <Badge variant={
                            session.status === 'completed' ? 'default' :
                            session.status === 'scheduled' ? 'secondary' : 'outline'
                          }>
                            {session.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">Aucune session planifiée</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Suivi des présences</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Fonctionnalité à venir</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grades" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Fonctionnalité à venir</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Matériel pédagogique</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Fonctionnalité à venir</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de la classe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Fonctionnalité à venir</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClassDetailPage;
