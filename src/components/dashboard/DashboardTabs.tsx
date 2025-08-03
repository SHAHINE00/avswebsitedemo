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
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-7">
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
        <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <DashboardOverview enrollments={enrollments} appointments={appointments} />
      </TabsContent>

      <TabsContent value="courses" className="space-y-6">
        <DashboardCourses enrollments={enrollments} />
      </TabsContent>

      <TabsContent value="gamification" className="space-y-6">
        <GamificationDashboard />
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <DashboardNotifications notifications={notifications} markAsRead={markAsRead} />
      </TabsContent>

      <TabsContent value="achievements" className="space-y-6">
        <DashboardAchievements achievements={achievements} />
      </TabsContent>

      <TabsContent value="profile" className="space-y-6">
        <DashboardProfile bookmarks={bookmarks} />
      </TabsContent>

      <TabsContent value="privacy" className="space-y-6">
        <GDPRDashboard />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;