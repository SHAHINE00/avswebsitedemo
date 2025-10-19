import React from 'react';
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

const Student: React.FC = () => {
  const { user, signOut, isAdmin, adminLoading } = useAuth();
  const { toast } = useToast();
  
  // Use defensive loading for all hooks
  let getUserAppointments, notifications, unreadCount, markAsRead, achievements, bookmarks, setupRealTimeSubscriptions;
  
  try {
    const appointmentHook = useAppointmentBooking();
    getUserAppointments = appointmentHook.getUserAppointments;
  } catch (error) {
    console.warn('useAppointmentBooking failed:', error);
    getUserAppointments = async () => [];
  }
  
  try {
    const notifHook = useNotifications();
    notifications = notifHook.notifications;
    unreadCount = notifHook.unreadCount;
    markAsRead = notifHook.markAsRead;
  } catch (error) {
    console.warn('useNotifications failed:', error);
    notifications = [];
    unreadCount = 0;
    markAsRead = () => Promise.resolve();
  }
  
  try {
    const profileHook = useUserProfile();
    achievements = profileHook.achievements;
  } catch (error) {
    console.warn('useUserProfile failed:', error);
    achievements = [];
  }
  
  try {
    const courseHook = useCourseInteractions();
    bookmarks = courseHook.bookmarks;
  } catch (error) {
    console.warn('useCourseInteractions failed:', error);
    bookmarks = [];
  }
  
  try {
    const realtimeHook = useRealTimeData();
    setupRealTimeSubscriptions = realtimeHook.setupRealTimeSubscriptions;
  } catch (error) {
    console.warn('useRealTimeData failed:', error);
    setupRealTimeSubscriptions = () => null;
  }
  
  const [enrollments, setEnrollments] = useSafeState<Enrollment[]>([]);
  const [appointments, setAppointments] = useSafeState<Appointment[]>([]);
  const [loading, setLoading] = useSafeState(true);
  const [error, setError] = useSafeState<string | null>(null);
  const [activeTab, setActiveTab] = useSafeState('overview');

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

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      logInfo('Fetching student dashboard data for user:', user.id);
      
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

    } catch (error) {
      logError('Error fetching student dashboard data:', error);
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
    setActiveTab('profile');
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
      <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 lg:pt-24">
        <SEOHead {...utilityPagesSEO.dashboard} />
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
      <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 lg:pt-24">
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

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 lg:pt-24">
        <SEOHead {...utilityPagesSEO.dashboard} />
        <Navbar />
        
        <div className="container mx-auto px-6 py-8">
          <DashboardHeader
            userEmail={user.email || ''}
            onSettingsClick={handleSettingsClick}
            onSignOut={handleSignOut}
          />

          <DashboardStats enrollments={enrollments} appointments={appointments} />

          <DashboardTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
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

export default Student;
