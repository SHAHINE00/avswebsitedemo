import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, TrendingUp, Award, ArrowRight, AlertCircle } from 'lucide-react';
import { useProfessorDashboard } from '@/hooks/useProfessorDashboard';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import BulkAnnouncementDialog from './BulkAnnouncementDialog';

const ProfessorDashboard: React.FC = () => {
  const { stats, courses, loading, error, professorRecordExists, refetchAll } = useProfessorDashboard();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h3 className="text-lg font-semibold">
            {!professorRecordExists 
              ? 'Configuration du compte requise' 
              : 'Erreur de chargement'}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">{error}</p>
          {!professorRecordExists ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                L'administrateur doit créer votre profil professeur dans le panneau d'administration.
              </p>
            </div>
          ) : (
            <Button onClick={refetchAll}>Réessayer</Button>
          )}
        </div>
      </Card>
    );
  }

  if (!stats && courses.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-lg font-semibold">Aucun cours assigné</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Vous n'avez pas encore de cours assignés. Veuillez contacter l'administrateur pour qu'il vous assigne des cours.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex justify-end">
        <BulkAnnouncementDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cours assignés</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_courses ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total étudiants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_students ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de présence</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.attendance_rate ?? 0}%</div>
            <Progress value={stats?.attendance_rate ?? 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne générale</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.average_grade ?? 0}/100</div>
          </CardContent>
        </Card>
      </div>

      {/* Courses List */}
      <Card>
        <CardHeader>
          <CardTitle>Mes cours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courses.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Aucun cours assigné pour le moment
              </p>
            ) : (
              courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold">{course.title}</h3>
                    {course.subtitle && (
                      <p className="text-sm text-muted-foreground">{course.subtitle}</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      {course.total_students} étudiants
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigate(`/professor/course/${course.id}`)}
                      variant="default"
                    >
                      Gérer le cours
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessorDashboard;