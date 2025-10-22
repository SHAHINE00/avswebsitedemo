
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSafeState, useSafeEffect } from '@/utils/safeHooks';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAppointmentBooking } from '@/hooks/useAppointmentBooking';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ErrorBoundary from '@/components/ui/error-boundary';
import { useNotifications } from '@/hooks/useNotifications';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useCourseInteractions } from '@/hooks/useCourseInteractions';
import { useRealTimeData } from '@/hooks/useRealTimeData';
import { logInfo, logError } from '@/utils/logger';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import SEOHead from '@/components/SEOHead';
import { utilityPagesSEO } from '@/utils/seoData';

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
  const { user, signOut, isAdmin, adminLoading } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const { getUserAppointments } = useAppointmentBooking();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { achievements } = useUserProfile();
  const { bookmarks } = useCourseInteractions();
  const { setupRealTimeSubscriptions } = useRealTimeData();
  
  const [enrollments, setEnrollments] = useSafeState<Enrollment[]>([]);
  const [appointments, setAppointments] = useSafeState<Appointment[]>([]);
  const [loading, setLoading] = useSafeState(true);
  const [error, setError] = useSafeState<string | null>(null);
  const [userProfile, setUserProfile] = useSafeState<{ full_name: string | null; email: string | null } | null>(null);
  const activeTab = searchParams.get('tab') || 'overview';

  useSafeEffect(() => {
    if (!user) {
      window.history.pushState({}, '', '/auth');
      window.dispatchEvent(new PopStateEvent('popstate'));
      return;
    }
    
    fetchDashboardData();
    
    // Set up real-time subscriptions
    const channel = setupRealTimeSubscriptions();
    
    // Listen for real-time enrollment updates
    const handleEnrollmentUpdate = () => {
      fetchDashboardData();
    };
    
    window.addEventListener('enrollmentUpdate', handleEnrollmentUpdate);
    
    return () => {
      window.removeEventListener('enrollmentUpdate', handleEnrollmentUpdate);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user, setupRealTimeSubscriptions]);

  // Redirect admin users to admin dashboard (unless viewing profile intentionally)
  useSafeEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isProfileView = urlParams.get('profile') === 'true';
    
    if (user && !loading && isAdmin && !adminLoading && !isProfileView) {
      logInfo('Redirecting admin user to admin dashboard');
      window.history.pushState({}, '', '/admin');
      window.dispatchEvent(new PopStateEvent('popstate'));
      return;
    }
  }, [user, loading, isAdmin, adminLoading]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      logInfo('Fetching dashboard data for user:', user.id);
      
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
        logError('Error fetching enrollments:', enrollmentError);
        throw enrollmentError;
      }

      logInfo('Enrollments fetched:', enrollmentData);
      setEnrollments(enrollmentData || []);

      // Fetch appointments
      const appointmentData = await getUserAppointments();
      logInfo('Appointments fetched:', appointmentData);
      setAppointments(appointmentData);

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .single();

      if (!profileError && profileData) {
        setUserProfile(profileData);
      }

    } catch (error) {
      logError('Error fetching dashboard data:', error);
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
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (error) {
      logError('Error signing out:', error);
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive",
      });
    }
  };

  const handleSettingsClick = () => {
    setSearchParams({ tab: 'profile' });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 xs:pt-18 sm:pt-20 lg:pt-22 xl:pt-24">
        <SEOHead {...utilityPagesSEO.dashboard} />
        <Navbar />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" />
            {adminLoading && (
              <p className="ml-4 text-gray-600">Vérification des privilèges administrateur...</p>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 xs:pt-18 sm:pt-20 lg:pt-22 xl:pt-24">
        <SEOHead {...utilityPagesSEO.dashboard} />
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

  // Check if admin is viewing profile intentionally
  const urlParams = new URLSearchParams(window.location.search);
  const isProfileView = urlParams.get('profile') === 'true';

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 pt-16 xs:pt-18 sm:pt-20 lg:pt-22 xl:pt-24">
        <SEOHead {...utilityPagesSEO.dashboard} />
        <Navbar />
        
        <div className="container mx-auto px-6 py-8">
          {/* Admin Profile View Banner */}
          {isAdmin && isProfileView && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-blue-800 font-medium">Mode Profil Utilisateur</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    window.history.pushState({}, '', '/admin');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className="text-blue-600 border-blue-300 hover:bg-blue-100"
                >
                  Retour à l'Administration
                </Button>
              </div>
            </div>
          )}
          
          <DashboardHeader
            userName={userProfile?.full_name || user.email || 'Utilisateur'}
            onSettingsClick={handleSettingsClick}
            onSignOut={handleSignOut}
          />

          <DashboardStats enrollments={enrollments} appointments={appointments} />

          <DashboardTabs
            activeTab={activeTab}
            onTabChange={(tab) => setSearchParams({ tab })}
            enrollments={enrollments}
            appointments={appointments}
            notifications={notifications}
            achievements={achievements}
            bookmarks={bookmarks}
            unreadCount={unreadCount}
            markAsRead={markAsRead}
          />
        </div>
        
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
