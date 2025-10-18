import React, { useEffect, useState } from 'react';
import { useParams, Navigate, useSearchParams } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import StudentListTab from '@/components/professor/course/StudentListTab';
import AttendanceTab from '@/components/professor/course/AttendanceTab';
import GradesTab from '@/components/professor/course/GradesTab';
import AnnouncementsTab from '@/components/professor/course/AnnouncementsTab';
import MaterialsTab from '@/components/professor/course/MaterialsTab';
import ProfessorAnalytics from '@/components/professor/analytics/ProfessorAnalytics';
import { ClassScheduleManager } from '@/components/professor/ClassScheduleManager';
import { TodaysSessions } from '@/components/professor/TodaysSessions';
import { AbsenceApprovalList } from '@/components/professor/AbsenceApprovalList';

const ProfessorCourse: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [courseLoading, setCourseLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('students');
  const sessionId = searchParams.get('session');

  useEffect(() => {
    if (sessionId) {
      setActiveTab('attendance');
    }
  }, [sessionId]);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setCourseLoading(false);
    }
  };

  if (loading || courseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Chargement...</div>
      </div>
    );
  }

  if (!user || !courseId) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <SEOHead
        title={`${course?.title || 'Cours'} | Professeur`}
        description="Gérez votre cours"
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au tableau de bord
            </Button>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">{course?.title}</CardTitle>
                {course?.subtitle && (
                  <p className="text-muted-foreground">{course.subtitle}</p>
                )}
              </CardHeader>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="schedule">Emploi du temps</TabsTrigger>
              <TabsTrigger value="students">Étudiants</TabsTrigger>
              <TabsTrigger value="attendance">Présences</TabsTrigger>
              <TabsTrigger value="grades">Notes</TabsTrigger>
              <TabsTrigger value="announcements">Annonces</TabsTrigger>
              <TabsTrigger value="materials">Documents</TabsTrigger>
              <TabsTrigger value="analytics">Statistiques</TabsTrigger>
            </TabsList>

            <TabsContent value="schedule">
              <ClassScheduleManager courseId={courseId} professorId={user?.id || ''} />
              <div className="mt-6">
                <TodaysSessions courseId={courseId} />
              </div>
              <div className="mt-6">
                <AbsenceApprovalList />
              </div>
            </TabsContent>

            <TabsContent value="students">
              <StudentListTab courseId={courseId} />
            </TabsContent>

            <TabsContent value="attendance">
              <AttendanceTab courseId={courseId} sessionId={sessionId || undefined} />
            </TabsContent>

            <TabsContent value="grades">
              <GradesTab courseId={courseId} />
            </TabsContent>

            <TabsContent value="announcements">
              <AnnouncementsTab courseId={courseId} />
            </TabsContent>

            <TabsContent value="materials">
              <MaterialsTab courseId={courseId} />
            </TabsContent>

            <TabsContent value="analytics">
              <ProfessorAnalytics courseId={courseId} />
            </TabsContent>
          </Tabs>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProfessorCourse;
