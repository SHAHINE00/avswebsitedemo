import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSafeState, useSafeEffect } from '@/utils/safeHooks';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  
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
  
  const activeTab = searchParams.get('tab') || 'overview';

  // Use React Query for enrollments
  const { data: enrollments = [], isLoading: enrollmentsLoading, error: enrollmentsError } = useQuery({
    queryKey: ['enrollments', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      logInfo('Fetching student enrollments for user:', user.id);
      const { data, error } = await supabase
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

      if (error) {
        logError('Error fetching enrollments:', error);
        throw error;
      }

      logInfo('Enrollments fetched:', data);
      return data || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while refetching
  });

  // Use React Query for appointments
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['appointments', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      logInfo('Fetching appointments for user:', user.id);
      const data = await getUserAppointments();
      logInfo('Appointments fetched:', data);
      return data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const loading = enrollmentsLoading || appointmentsLoading;
  const error = enrollmentsError ? 'Erreur lors du chargement des données' : null;

  useSafeEffect(() => {
    if (!user) {
      window.history.pushState({}, '', '/auth');
      window.dispatchEvent(new PopStateEvent('popstate'));
      return;
    }
    
    // Set up real-time subscriptions
    const channel = setupRealTimeSubscriptions();
    
    // Listen for real-time enrollment updates and invalidate queries
    const handleEnrollmentUpdate = () => {
      logInfo('Real-time enrollment update received, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['enrollments', user.id] });
    };
    
    const handleAppointmentUpdate = () => {
      logInfo('Real-time appointment update received, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['appointments', user.id] });
    };
    
    window.addEventListener('enrollmentUpdate', handleEnrollmentUpdate);
    window.addEventListener('appointmentUpdate', handleAppointmentUpdate);
    
    return () => {
      window.removeEventListener('enrollmentUpdate', handleEnrollmentUpdate);
      window.removeEventListener('appointmentUpdate', handleAppointmentUpdate);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user, setupRealTimeSubscriptions, queryClient]);

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
      <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 lg:pt-24">
        <SEOHead {...utilityPagesSEO.dashboard} />
        <Navbar />
        <div className="container mx-auto px-6 py-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                <div className="h-4 w-64 bg-muted animate-pulse rounded" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
            <div className="h-96 bg-muted animate-pulse rounded-lg" />
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
            <Button onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['enrollments', user?.id] });
              queryClient.invalidateQueries({ queryKey: ['appointments', user?.id] });
            }}>Réessayer</Button>
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

export default Student;
