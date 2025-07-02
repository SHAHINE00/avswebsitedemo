
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardOverview from '@/components/admin/dashboard/DashboardOverview';
import EnhancedCourseManagement from '@/components/admin/dashboard/EnhancedCourseManagement';
import ComprehensiveUserManagement from '@/components/admin/dashboard/ComprehensiveUserManagement';
import CourseContentManagement from '@/components/admin/dashboard/CourseContentManagement';
import AdvancedAnalytics from '@/components/admin/dashboard/AdvancedAnalytics';
import SystemMonitoring from '@/components/admin/dashboard/SystemMonitoring';
import AppointmentManagement from '@/components/admin/dashboard/AppointmentManagement';
import EnrollmentAnalytics from '@/components/admin/dashboard/EnrollmentAnalytics';
import CoursePerformanceMetrics from '@/components/admin/dashboard/CoursePerformanceMetrics';
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
      <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-1">
        <TabsTrigger value="dashboard" className="text-xs lg:text-sm">Tableau de Bord</TabsTrigger>
        <TabsTrigger value="courses" className="text-xs lg:text-sm">Cours</TabsTrigger>
        <TabsTrigger value="content" className="text-xs lg:text-sm">Contenu</TabsTrigger>
        <TabsTrigger value="users" className="text-xs lg:text-sm">Utilisateurs</TabsTrigger>
        <TabsTrigger value="appointments" className="text-xs lg:text-sm">Rendez-vous</TabsTrigger>
        <TabsTrigger value="enrollments" className="text-xs lg:text-sm">Inscriptions</TabsTrigger>
        <TabsTrigger value="performance" className="text-xs lg:text-sm">Performance</TabsTrigger>
        <TabsTrigger value="analytics" className="text-xs lg:text-sm">Analyses</TabsTrigger>
        <TabsTrigger value="monitoring" className="text-xs lg:text-sm">Système</TabsTrigger>
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

      <TabsContent value="content">
        <CourseContentManagement />
      </TabsContent>

      <TabsContent value="users">
        <ComprehensiveUserManagement />
      </TabsContent>

      <TabsContent value="appointments">
        <AppointmentManagement />
      </TabsContent>

      <TabsContent value="enrollments">
        <EnrollmentAnalytics />
      </TabsContent>

      <TabsContent value="performance">
        <CoursePerformanceMetrics />
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

export default AdminTabsEnhanced;
