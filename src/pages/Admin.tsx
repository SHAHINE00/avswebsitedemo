import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import AdminRouteGuard from '@/components/admin/AdminRouteGuard';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTabsEnhanced from '@/components/admin/AdminTabsEnhanced';
import CourseFormDialog from '@/components/admin/CourseFormDialog';
import ErrorBoundary from '@/components/ui/error-boundary';
import SEOHead from '@/components/SEOHead';
import AIChatbot from '@/components/chatbot/AIChatbot';
import { useAdminCourses } from '@/hooks/useAdminCourses';
import { logInfo, logError } from '@/utils/logger';
import type { Course } from '@/hooks/useCourses';

const Admin = () => {
  const { courses, loading, error, refetch, createCourse, updateCourse, deleteCourse } = useAdminCourses();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setIsEditDialogOpen(true);
    logInfo('Admin: Editing course', { courseId: course.id, title: course.title });
  };

  const handleDelete = async (courseId: string) => {
    try {
      await deleteCourse(courseId);
      logInfo('Admin: Course deleted successfully', { courseId });
    } catch (error) {
      logError('Admin: Failed to delete course', error);
    }
  };

  const handleCreate = async (courseData: any) => {
    try {
      await createCourse(courseData);
      setIsCreateDialogOpen(false);
      logInfo('Admin: Course created successfully', { title: courseData.title });
    } catch (error) {
      logError('Admin: Failed to create course', error);
    }
  };

  const handleUpdate = async (courseData: any) => {
    if (!selectedCourse) return;
    
    try {
      await updateCourse(selectedCourse.id, courseData);
      setIsEditDialogOpen(false);
      setSelectedCourse(null);
      logInfo('Admin: Course updated successfully', { courseId: selectedCourse.id });
    } catch (error) {
      logError('Admin: Failed to update course', error);
    }
  };

  return (
    <AdminRouteGuard>
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <SEOHead 
            title="Administration - Nova Academy"
            description="Tableau de bord administrateur pour Nova Academy"
            noIndex={true}
          />
          <Navbar />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 xs:pt-18 sm:pt-20 lg:pt-22 xl:pt-24 pb-8 sm:pb-12">
            <AdminHeader 
              title="Tableau de Bord Administrateur" 
              description="Gérez votre académie depuis cette interface d'administration"
              onCreateCourse={() => setIsCreateDialogOpen(true)}
            />
            
            <div className="mt-8">
              {loading ? (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
                    ))}
                  </div>
                  <div className="h-96 bg-muted animate-pulse rounded-lg" />
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600 mb-4">Erreur: {error}</p>
                  <button 
                    onClick={refetch}
                    className="px-4 py-2 bg-academy-blue text-white rounded hover:bg-academy-purple transition-colors"
                  >
                    Réessayer
                  </button>
                </div>
              ) : (
                <AdminTabsEnhanced
                  courses={courses}
                  onRefresh={refetch}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </div>

          <CourseFormDialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            onSuccess={refetch}
          />

          <CourseFormDialog
            open={isEditDialogOpen}
            onOpenChange={(open) => {
              setIsEditDialogOpen(open);
              if (!open) setSelectedCourse(null);
            }}
            course={selectedCourse}
            onSuccess={refetch}
          />

          <AIChatbot />
        </div>
      </ErrorBoundary>
    </AdminRouteGuard>
  );
};

export default Admin;