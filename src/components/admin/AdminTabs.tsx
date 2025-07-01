
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardOverview from '@/components/admin/dashboard/DashboardOverview';
import EnhancedCourseManagement from '@/components/admin/dashboard/EnhancedCourseManagement';
import ComprehensiveUserManagement from '@/components/admin/dashboard/ComprehensiveUserManagement';
import AdvancedAnalytics from '@/components/admin/dashboard/AdvancedAnalytics';
import SystemMonitoring from '@/components/admin/dashboard/SystemMonitoring';
import type { Course } from '@/hooks/useCourses';

interface AdminTabsProps {
  courses: Course[];
  onRefresh: () => void;
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
}

const AdminTabs: React.FC<AdminTabsProps> = ({
  courses,
  onRefresh,
  onEdit,
  onDelete
}) => {
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="dashboard">Tableau de Bord</TabsTrigger>
        <TabsTrigger value="courses">Gestion des Cours</TabsTrigger>
        <TabsTrigger value="users">Gestion des Utilisateurs</TabsTrigger>
        <TabsTrigger value="analytics">Analyses Avancées</TabsTrigger>
        <TabsTrigger value="monitoring">Surveillance Système</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="space-y-6">
        <DashboardOverview />
      </TabsContent>

      <TabsContent value="courses" className="space-y-6">
        <EnhancedCourseManagement
          courses={courses}
          onRefresh={onRefresh}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TabsContent>

      <TabsContent value="users">
        <ComprehensiveUserManagement />
      </TabsContent>

      <TabsContent value="analytics">
        <AdvancedAnalytics />
      </TabsContent>

      <TabsContent value="monitoring">
        <SystemMonitoring />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
