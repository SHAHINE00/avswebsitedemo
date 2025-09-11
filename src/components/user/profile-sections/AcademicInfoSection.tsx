import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Trophy, 
  Clock,
  Target,
  Briefcase,
  School
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface EnrollmentData {
  id: string;
  course_title: string;
  enrolled_at: string;
  progress_percentage: number;
  status: string;
  completion_date: string | null;
}

interface AcademicProfile {
  student_id: string;
  academic_level: string;
  previous_education: string;
  career_goals: string;
  enrollment_date: string;
  expected_completion: string;
}

const AcademicInfoSection = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentData[]>([]);
  const [academicProfile, setAcademicProfile] = useState<AcademicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAcademicData();
  }, [user]);

  const fetchAcademicData = async () => {
    if (!user) return;

    try {
      // Fetch enrollments with course details
      const { data: enrollmentsData } = await supabase
        .from('course_enrollments')
        .select(`
          id,
          enrolled_at,
          progress_percentage,
          status,
          completion_date,
          courses (
            title
          )
        `)
        .eq('user_id', user.id)
        .order('enrolled_at', { ascending: false });

      if (enrollmentsData) {
        const formattedEnrollments = enrollmentsData.map(enrollment => ({
          id: enrollment.id,
          course_title: (enrollment.courses as any)?.title || 'Formation inconnue',
          enrolled_at: enrollment.enrolled_at,
          progress_percentage: enrollment.progress_percentage || 0,
          status: enrollment.status,
          completion_date: enrollment.completion_date
        }));
        setEnrollments(formattedEnrollments);
      }

      // Fetch academic profile (you might need to create this table)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setAcademicProfile({
          student_id: `STU${user.id.substring(0, 8).toUpperCase()}`,
          academic_level: profileData.academic_level || 'Non renseigné',
          previous_education: profileData.previous_education || 'Non renseigné',
          career_goals: profileData.career_goals || 'Non renseigné',
          enrollment_date: profileData.created_at,
          expected_completion: profileData.expected_completion || 'Non défini'
        });
      }
    } catch (error) {
      console.error('Error fetching academic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Complétée</Badge>;
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800">En pause</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const calculateOverallProgress = () => {
    if (enrollments.length === 0) return 0;
    const totalProgress = enrollments.reduce((sum, enrollment) => sum + enrollment.progress_percentage, 0);
    return Math.round(totalProgress / enrollments.length);
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Academic Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-full">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">ID Étudiant</div>
                <div className="font-semibold">{academicProfile?.student_id}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-full">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Inscrit depuis</div>
                <div className="font-semibold">
                  {academicProfile?.enrollment_date 
                    ? new Date(academicProfile.enrollment_date).toLocaleDateString()
                    : 'N/A'
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-full">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Progression globale</div>
                <div className="font-semibold">{calculateOverallProgress()}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Academic Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5" />
            Profil académique
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Niveau d'études</Label>
                <div className="p-2 bg-accent/20 rounded mt-1">
                  {academicProfile?.academic_level}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Formation précédente</Label>
                <div className="p-2 bg-accent/20 rounded mt-1">
                  {academicProfile?.previous_education}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Objectifs de carrière</Label>
                <div className="p-2 bg-accent/20 rounded mt-1">
                  {academicProfile?.career_goals}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Fin prévue</Label>
                <div className="p-2 bg-accent/20 rounded mt-1">
                  {academicProfile?.expected_completion}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Enrollments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Formations en cours ({enrollments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {enrollments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune formation inscrite</p>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment) => (
                <div key={enrollment.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold">{enrollment.course_title}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Inscrit le {new Date(enrollment.enrolled_at).toLocaleDateString()}
                        </div>
                        {enrollment.completion_date && (
                          <div className="flex items-center gap-1">
                            <Trophy className="h-4 w-4" />
                            Complétée le {new Date(enrollment.completion_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(enrollment.status)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Progression</span>
                      <span className="font-medium">{enrollment.progress_percentage}%</span>
                    </div>
                    <Progress value={enrollment.progress_percentage} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Helper component for labels
const Label = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);

export default AcademicInfoSection;