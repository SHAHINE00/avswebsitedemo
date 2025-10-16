
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardOverview from '@/components/admin/dashboard/DashboardOverview';
import CourseManagementSection from '@/components/admin/dashboard/CourseManagementSection';
import UserManagementSection from '@/components/admin/dashboard/UserManagementSection';
import AnalyticsSection from '@/components/admin/dashboard/AnalyticsSection';
import SystemMonitoring from '@/components/admin/dashboard/SystemMonitoring';
import SubscriberManagement from '@/components/admin/dashboard/SubscriberManagement';
import SectionVisibilityManagement from '@/components/admin/dashboard/SectionVisibilityManagement';
import SecurityVerification from '@/components/admin/dashboard/SecurityVerification';
import AppointmentManagement from '@/components/admin/dashboard/AppointmentManagement';
import StudentCRMDashboardEnhanced from '@/components/admin/dashboard/student-crm/StudentCRMDashboardEnhanced';
import { SecurityTestSuite } from './SecurityTestSuite';
import type { Course } from '@/hooks/useCourses';

interface AdminTabsEnhancedProps {
  courses: Course[];
  onRefresh: () => void;
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
}

const AdminTabsEnhanced: React.FC<AdminTabsEnhancedProps> = ({
  courses,
  onRefresh,
  onEdit,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState<string>(() => {
    const saved = sessionStorage.getItem('admin_active_tab');
    return saved || 'dashboard';
  });

  useEffect(() => {
    sessionStorage.setItem('admin_active_tab', activeTab);
  }, [activeTab]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="flex w-full justify-start overflow-x-auto gap-1 sm:gap-2 mb-4 sm:mb-6 p-1 bg-muted rounded-lg scrollbar-hide">
        <TabsTrigger value="dashboard" className="flex-shrink-0 px-2 sm:px-4 py-2 text-xs sm:text-sm">Vue d'ensemble</TabsTrigger>
        <TabsTrigger value="students" className="flex-shrink-0 px-2 sm:px-4 py-2 text-xs sm:text-sm">Étudiants</TabsTrigger>
        <TabsTrigger value="courses" className="flex-shrink-0 px-2 sm:px-4 py-2 text-xs sm:text-sm">Cours</TabsTrigger>
        <TabsTrigger value="users" className="flex-shrink-0 px-2 sm:px-4 py-2 text-xs sm:text-sm">Utilisateurs</TabsTrigger>
        <TabsTrigger value="subscribers" className="flex-shrink-0 px-2 sm:px-4 py-2 text-xs sm:text-sm">Abonnements</TabsTrigger>
        <TabsTrigger value="appointments" className="flex-shrink-0 px-2 sm:px-4 py-2 text-xs sm:text-sm">Rendez-vous</TabsTrigger>
        <TabsTrigger value="sections" className="flex-shrink-0 px-2 sm:px-4 py-2 text-xs sm:text-sm">Visibilité</TabsTrigger>
        <TabsTrigger value="security" className="flex-shrink-0 px-2 sm:px-4 py-2 text-xs sm:text-sm">Sécurité</TabsTrigger>
        <TabsTrigger value="analytics" className="flex-shrink-0 px-2 sm:px-4 py-2 text-xs sm:text-sm">Analytics</TabsTrigger>
        <TabsTrigger value="system" className="flex-shrink-0 px-2 sm:px-4 py-2 text-xs sm:text-sm">Système</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="space-y-6">
        <DashboardOverview />
      </TabsContent>

      <TabsContent value="students">
        <StudentCRMDashboardEnhanced />
      </TabsContent>

      <TabsContent value="courses">
        <CourseManagementSection
          courses={courses}
          onRefresh={onRefresh}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TabsContent>

      <TabsContent value="users">
        <UserManagementSection />
      </TabsContent>

      <TabsContent value="subscribers">
        <SubscriberManagement />
      </TabsContent>

      <TabsContent value="appointments">
        <AppointmentManagement />
      </TabsContent>

      <TabsContent value="sections">
        <SectionVisibilityManagement />
      </TabsContent>

      <TabsContent value="security">
        <div className="space-y-6">
          <SecurityTestSuite />
          <SecurityVerification />
        </div>
      </TabsContent>

      <TabsContent value="analytics">
        <AnalyticsSection />
      </TabsContent>

      <TabsContent value="system">
        <SystemMonitoring />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabsEnhanced;
