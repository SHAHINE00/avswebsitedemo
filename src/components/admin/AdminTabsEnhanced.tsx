
import React, { useState, useEffect, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardSkeleton } from '@/components/ui/dashboard-skeleton';
import ErrorBoundary from '@/components/ui/error-boundary';
import DashboardOverview from '@/components/admin/dashboard/DashboardOverview';
import CourseManagementSection from '@/components/admin/dashboard/CourseManagementSection';
import UserManagementSection from '@/components/admin/dashboard/UserManagementSection';
import SubscriberManagement from '@/components/admin/dashboard/SubscriberManagement';
import SectionVisibilityManagement from '@/components/admin/dashboard/SectionVisibilityManagement';
import SecurityVerification from '@/components/admin/dashboard/SecurityVerification';
import AppointmentManagement from '@/components/admin/dashboard/AppointmentManagement';
import { SecurityTestSuite } from './SecurityTestSuite';
import ProfessorManagement from './ProfessorManagement';
import { CourseClassManagement } from './CourseClassManagement';
import { DocumentActivityTracker } from '@/components/admin/dashboard/DocumentActivityTracker';
import { ContactSubmissions } from '@/components/admin/dashboard/ContactSubmissions';
import type { Course } from '@/hooks/useCourses';
import { lazyWithRetry } from '@/utils/lazyWithRetry';

// Lazy load heavy components with retry logic
const StudentCRMDashboardEnhanced = lazyWithRetry(() => import('@/components/admin/dashboard/student-crm/StudentCRMDashboardEnhanced'));
const AnalyticsSection = lazyWithRetry(() => import('@/components/admin/dashboard/AnalyticsSection'));
const SystemMonitoring = lazyWithRetry(() => import('@/components/admin/dashboard/SystemMonitoring'));

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
  const heavyTabs = new Set(['students', 'analytics', 'system']);
  
  const [activeTab, setActiveTab] = useState<string>(() => {
    const saved = sessionStorage.getItem('admin_active_tab');
    // Prevent heavy tabs from loading by default
    return (saved && !heavyTabs.has(saved)) ? saved : 'dashboard';
  });

  // Safety migration for previously saved heavy tabs
  useEffect(() => {
    const saved = sessionStorage.getItem('admin_active_tab');
    if (saved && heavyTabs.has(saved)) {
      sessionStorage.setItem('admin_active_tab', 'dashboard');
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('admin_active_tab', activeTab);
  }, [activeTab]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="flex w-full justify-start overflow-x-auto gap-1 sm:gap-2 mb-4 sm:mb-6 p-1 bg-muted rounded-lg scrollbar-hide">
        <TabsTrigger value="dashboard" className="flex-shrink-0 px-2 sm:px-4 py-2 text-xs sm:text-sm">Vue d'ensemble</TabsTrigger>
        <TabsTrigger value="students" className="flex-shrink-0 px-2 sm:px-4 py-2 text-xs sm:text-sm">Étudiants</TabsTrigger>
        <TabsTrigger value="professors" className="flex-shrink-0 px-2 sm:px-4 py-2 text-xs sm:text-sm">Professeurs</TabsTrigger>
        <TabsTrigger value="courses" className="flex-shrink-0 px-2 sm:px-4 py-2 text-xs sm:text-sm">Cours</TabsTrigger>
        <TabsTrigger value="classes" className="flex-shrink-0 px-2 sm:px-4 py-2 text-xs sm:text-sm">Classes</TabsTrigger>
        <TabsTrigger value="users" className="flex-shrink-0 px-2 sm:px-4 py-2 text-xs sm:text-sm">Utilisateurs</TabsTrigger>
        <TabsTrigger value="documents" className="flex-shrink-0 px-2 sm:px-4 py-2 text-xs sm:text-sm">Documents</TabsTrigger>
        <TabsTrigger value="subscribers" className="flex-shrink-0 px-2 sm:px-4 py-2 text-xs sm:text-sm">Abonnements</TabsTrigger>
        <TabsTrigger value="contact" className="flex-shrink-0 px-2 sm:px-4 py-2 text-xs sm:text-sm">Contact</TabsTrigger>
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
        <ErrorBoundary>
          <Suspense fallback={<DashboardSkeleton />}>
            <StudentCRMDashboardEnhanced />
          </Suspense>
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="professors">
        <ProfessorManagement />
      </TabsContent>

      <TabsContent value="courses">
        <CourseManagementSection
          courses={courses}
          onRefresh={onRefresh}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TabsContent>

      <TabsContent value="classes">
        <CourseClassManagement />
      </TabsContent>

      <TabsContent value="users">
        <UserManagementSection />
      </TabsContent>

      <TabsContent value="documents">
        <DocumentActivityTracker />
      </TabsContent>

      <TabsContent value="subscribers">
        <SubscriberManagement />
      </TabsContent>

      <TabsContent value="contact">
        <ContactSubmissions />
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
        <ErrorBoundary>
          <Suspense fallback={<DashboardSkeleton />}>
            <AnalyticsSection />
          </Suspense>
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="system">
        <ErrorBoundary>
          <Suspense fallback={<DashboardSkeleton />}>
            <SystemMonitoring />
          </Suspense>
        </ErrorBoundary>
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabsEnhanced;
