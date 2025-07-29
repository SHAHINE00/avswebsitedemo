import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import AdminRouteGuard from '@/components/admin/AdminRouteGuard';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTabsEnhanced from '@/components/admin/AdminTabsEnhanced';
import CourseFormDialog from '@/components/admin/CourseFormDialog';
import ErrorBoundary from '@/components/ui/error-boundary';
import SEOHead from '@/components/SEOHead';
import { useAdminCourses } from '@/hooks/useAdminCourses';
import { logInfo, logError } from '@/utils/logger';
import type { Course } from '@/hooks/useCourses';

const AdminCourses = () => {
  const { courses, loading, error, refetch, createCourse, updateCourse, deleteCourse } = useAdminCourses();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const handleEdit = (course: Course) => {
    logInfo('Editing course', { courseId: course.id, title: course.title });
    setEditingCourse(course);
    setDialogOpen(true);
  };

  const handleDelete = async (courseId: string) => {
    try {
      logInfo('Deleting course', { courseId });
      await deleteCourse(courseId);
    } catch (error) {
      logError('Failed to delete course', { courseId, error });
    }
  };

  const handleSuccess = () => {
    refetch();
    setDialogOpen(false);
    setEditingCourse(null);
  };

  const handleCreateCourse = () => {
    setEditingCourse(null);
    setDialogOpen(true);
  };

  return (
    <AdminRouteGuard>
      <SEOHead 
        title="Administration des Cours - AVS Institut"
        description="Interface d'administration pour gérer les cours, utilisateurs et analytics de la plateforme AVS"
        noIndex={true}
      />
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          
          <div className="pt-20">
            <AdminHeader 
              title="Administration des Cours" 
              description="Gérez les cours, utilisateurs et analytics de votre plateforme"
              onCreateCourse={handleCreateCourse}
            />
            
            <div className="container mx-auto px-6 py-8">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-academy-blue mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des cours...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
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
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            course={editingCourse}
            onSuccess={handleSuccess}
          />
        </div>
      </ErrorBoundary>
    </AdminRouteGuard>
  );
};

export default AdminCourses;