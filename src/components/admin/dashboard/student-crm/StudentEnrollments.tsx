import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen } from 'lucide-react';
import { useAdminEnrollments } from '@/hooks/useAdminEnrollments';

interface StudentEnrollmentsProps {
  userId: string;
  detailed?: boolean;
}

const StudentEnrollments: React.FC<StudentEnrollmentsProps> = ({ userId, detailed = false }) => {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getUserEnrollments } = useAdminEnrollments();

  useEffect(() => {
    fetchEnrollments();
  }, [userId]);

  const fetchEnrollments = async () => {
    setLoading(true);
    const data = await getUserEnrollments(userId);
    setEnrollments(data);
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: 'default',
      completed: 'secondary',
      cancelled: 'destructive'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Cours Inscrits
        </CardTitle>
        <CardDescription>
          {enrollments.length} cours au total
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Chargement...</p>
        ) : enrollments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Aucune inscription</p>
        ) : (
          <div className="space-y-3">
            {enrollments.map((enrollment) => (
              <div key={enrollment.enrollment_id} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{enrollment.course_title}</p>
                  {getStatusBadge(enrollment.status)}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Progression</span>
                    <span>{enrollment.progress_percentage}%</span>
                  </div>
                  <Progress value={enrollment.progress_percentage} className="h-2" />
                </div>
                {detailed && (
                  <div className="text-xs text-muted-foreground space-y-1 pt-2">
                    <p>Inscrit le: {new Date(enrollment.enrolled_at).toLocaleDateString('fr-FR')}</p>
                    {enrollment.last_accessed_at && (
                      <p>Dernier accès: {new Date(enrollment.last_accessed_at).toLocaleDateString('fr-FR')}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentEnrollments;
