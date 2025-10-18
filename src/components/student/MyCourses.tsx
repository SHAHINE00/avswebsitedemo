import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudents } from '@/hooks/useStudents';

const MyCourses: React.FC = () => {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getMyEnrollments } = useStudents();
  const navigate = useNavigate();

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    setLoading(true);
    const data = await getMyEnrollments();
    setEnrollments(data);
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">En cours</Badge>;
      case 'completed':
        return <Badge variant="secondary">Terminé</Badge>;
      case 'paused':
        return <Badge variant="outline">En pause</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return <div>Chargement de vos cours...</div>;
  }

  if (enrollments.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Vous n'êtes inscrit à aucun cours pour le moment.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Explorez notre catalogue pour commencer votre apprentissage !
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {enrollments.map((enrollment) => {
        const course = enrollment.courses;
        if (!course) return null;

        return (
          <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${course.gradient_from || 'from-primary'} ${course.gradient_to || 'to-secondary'}`}>
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                {getStatusBadge(enrollment.status)}
              </div>
              <CardTitle className="mt-4">{course.title}</CardTitle>
              <CardDescription>{course.subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progression</span>
                  <span className="font-medium">{enrollment.progress_percentage || 0}%</span>
                </div>
                <Progress value={enrollment.progress_percentage || 0} />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    Inscrit le {new Date(enrollment.enrolled_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                {enrollment.last_accessed_at && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span>
                      Dernière activité: {new Date(enrollment.last_accessed_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => navigate(`/learn/${course.id}`)}
              >
                Continuer le cours
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default MyCourses;
