
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardOverview from '@/components/admin/dashboard/DashboardOverview';
import CourseManagementSection from '@/components/admin/dashboard/CourseManagementSection';
import UserManagementSection from '@/components/admin/dashboard/UserManagementSection';
import AnalyticsSection from '@/components/admin/dashboard/AnalyticsSection';
import SystemMonitoring from '@/components/admin/dashboard/SystemMonitoring';
import SubscriberManagement from '@/components/admin/dashboard/SubscriberManagement';
import SectionVisibilityManagement from '@/components/admin/dashboard/SectionVisibilityManagement';
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
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="flex w-full justify-start overflow-x-auto gap-2 mb-6 p-1 bg-muted rounded-lg">
        <TabsTrigger value="dashboard" className="flex-shrink-0 px-4 py-2">Vue d'ensemble</TabsTrigger>
        <TabsTrigger value="courses" className="flex-shrink-0 px-4 py-2">Gestion des Cours</TabsTrigger>
        <TabsTrigger value="users" className="flex-shrink-0 px-4 py-2">Utilisateurs</TabsTrigger>
        <TabsTrigger value="subscribers" className="flex-shrink-0 px-4 py-2">Abonnements</TabsTrigger>
        <TabsTrigger value="sections" className="flex-shrink-0 px-4 py-2">Visibilité</TabsTrigger>
        <TabsTrigger value="analytics" className="flex-shrink-0 px-4 py-2">Analytics & Rapports</TabsTrigger>
        <TabsTrigger value="system" className="flex-shrink-0 px-4 py-2">Système</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="space-y-6">
        <DashboardOverview />
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

      <TabsContent value="sections">
        <SectionVisibilityManagement />
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
