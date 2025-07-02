
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAppointmentBooking } from '@/hooks/useAppointmentBooking';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, LogOut } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ErrorBoundary from '@/components/ui/error-boundary';
import { useNotifications } from '@/hooks/useNotifications';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useCourseInteractions } from '@/hooks/useCourseInteractions';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import DashboardCourses from '@/components/dashboard/DashboardCourses';
import DashboardNotifications from '@/components/dashboard/DashboardNotifications';
import DashboardAchievements from '@/components/dashboard/DashboardAchievements';
import DashboardProfile from '@/components/dashboard/DashboardProfile';
import DashboardStats from '@/components/dashboard/DashboardStats';
import GamificationDashboard from '@/components/gamification/GamificationDashboard';

interface Enrollment {
  id: string;
  course_id: string;
  enrolled_at: string;
  status: string;
  progress_percentage: number;
  courses: {
    title: string;
    subtitle: string;
    duration: string;
  };
}

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
  status: string;
  subject: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { getUserAppointments } = useAppointmentBooking();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { achievements } = useUserProfile();
  const { bookmarks } = useCourseInteractions();
  
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) {
      window.location.href = '/auth';
      return;
    }
    
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching dashboard data for user:', user.id);
      
      // Fetch enrollments
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (
            title,
            subtitle,
            duration
          )
        `)
        .eq('user_id', user.id)
        .order('enrolled_at', { ascending: false });

      if (enrollmentError) {
        console.error('Error fetching enrollments:', enrollmentError);
        throw enrollmentError;
      }

      console.log('Enrollments fetched:', enrollmentData);
      setEnrollments(enrollmentData || []);

      // Fetch appointments
      const appointmentData = await getUserAppointments();
      console.log('Appointments fetched:', appointmentData);
      setAppointments(appointmentData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Erreur lors du chargement des données');
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger vos données. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchDashboardData}>Réessayer</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tableau de bord
              </h1>
              <p className="text-gray-600">
                Bienvenue, {user.email}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <DashboardStats enrollments={enrollments} appointments={appointments} />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="courses">Formations</TabsTrigger>
              <TabsTrigger value="gamification">Récompenses</TabsTrigger>
              <TabsTrigger value="notifications" className="relative">
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="achievements">Succès</TabsTrigger>
              <TabsTrigger value="profile">Profil</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <DashboardOverview enrollments={enrollments} appointments={appointments} />
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              <DashboardCourses enrollments={enrollments} />
            </TabsContent>

            {/* Gamification Tab */}
            <TabsContent value="gamification" className="space-y-6">
              <GamificationDashboard />
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <DashboardNotifications notifications={notifications} markAsRead={markAsRead} />
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <DashboardAchievements achievements={achievements} />
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <DashboardProfile bookmarks={bookmarks} />
            </TabsContent>
          </Tabs>
        </div>
        
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
