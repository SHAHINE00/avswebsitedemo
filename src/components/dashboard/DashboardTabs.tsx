import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import DashboardOverview from './DashboardOverview';
import DashboardCourses from './DashboardCourses';
import DashboardNotifications from './DashboardNotifications';
import DashboardAchievements from './DashboardAchievements';
import DashboardProfile from './DashboardProfile';
import GamificationDashboard from '@/components/gamification/GamificationDashboard';
import GDPRDashboard from '@/components/gdpr/GDPRDashboard';
import EnhancedProgressDashboard from './EnhancedProgressDashboard';
import PersonalStudyCalendar from './PersonalStudyCalendar';
import SmartNotificationCenter from '@/components/notifications/SmartNotificationCenter';
import DigitalCertificateSystem from '@/components/certificates/DigitalCertificateSystem';
import AdvancedAnalytics from './AdvancedAnalytics';
import SmartStudyRecommendations from './SmartStudyRecommendations';
import { useStudyAnalytics } from '@/hooks/useStudyAnalytics';
import type { Notification } from '@/hooks/useNotifications';
import type { UserAchievement } from '@/hooks/useUserProfile';
import type { CourseBookmark } from '@/hooks/useCourseInteractions';

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

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  enrollments: Enrollment[];
  appointments: Appointment[];
  notifications: Notification[];
  achievements: UserAchievement[];
  bookmarks: CourseBookmark[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  onTabChange,
  enrollments,
  appointments,
  notifications,
  achievements,
  bookmarks,
  unreadCount,
  markAsRead
}) => {
  const { studyStats, loading: analyticsLoading } = useStudyAnalytics();
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-12">
        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
        <TabsTrigger value="progress">Progression</TabsTrigger>
        <TabsTrigger value="calendar">Calendrier</TabsTrigger>
        <TabsTrigger value="courses">Formations</TabsTrigger>
        <TabsTrigger value="certificates">Certificats</TabsTrigger>
        <TabsTrigger value="gamification">Récompenses</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="recommendations">IA</TabsTrigger>
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
        <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <DashboardOverview enrollments={enrollments} appointments={appointments} />
      </TabsContent>

      <TabsContent value="progress" className="space-y-6">
        {analyticsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">Chargement des statistiques...</div>
          </div>
        ) : (
          <EnhancedProgressDashboard 
            enrollments={enrollments}
            studyStats={studyStats}
          />
        )}
      </TabsContent>

      <TabsContent value="calendar" className="space-y-6">
        <PersonalStudyCalendar />
      </TabsContent>

      <TabsContent value="courses" className="space-y-6">
        <DashboardCourses enrollments={enrollments} />
      </TabsContent>

      <TabsContent value="certificates" className="space-y-6">
        <DigitalCertificateSystem />
      </TabsContent>

      <TabsContent value="gamification" className="space-y-6">
        <GamificationDashboard />
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <SmartNotificationCenter />
      </TabsContent>

      <TabsContent value="achievements" className="space-y-6">
        <DashboardAchievements achievements={achievements} />
      </TabsContent>

      <TabsContent value="profile" className="space-y-6">
        <DashboardProfile bookmarks={bookmarks} />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <AdvancedAnalytics />
      </TabsContent>

      <TabsContent value="recommendations" className="space-y-6">
        <SmartStudyRecommendations />
      </TabsContent>

      <TabsContent value="privacy" className="space-y-6">
        <GDPRDashboard />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;