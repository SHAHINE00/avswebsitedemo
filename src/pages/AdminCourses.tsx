
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminAccessControl from '@/components/admin/AdminAccessControl';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTabsEnhanced from '@/components/admin/AdminTabsEnhanced';
import CourseFormDialog from '@/components/admin/CourseFormDialog';
import ErrorBoundary from '@/components/ui/error-boundary';
import { useAdminCourses } from '@/hooks/useAdminCourses';
import type { Course } from '@/hooks/useCourses';

const AdminCourses = () => {
  const { courses, loading, error, refetch, createCourse, updateCourse, deleteCourse } = useAdminCourses();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const handleEdit = (course: Course) => {
    console.log('Editing course:', course);
    setEditingCourse(course);
    setDialogOpen(true);
  };

  const handleDelete = async (courseId: string) => {
    console.log('Deleting course:', courseId);
    await deleteCourse(courseId);
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (editingCourse) {
        console.log('Updating course:', editingCourse.id, formData);
        await updateCourse(editingCourse.id, formData);
      } else {
        console.log('Creating new course:', formData);
        await createCourse(formData);
      }
      setDialogOpen(false);
      setEditingCourse(null);
    } catch (error) {
      console.error('Error submitting course:', error);
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setEditingCourse(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-academy-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de l'interface d'administration...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center text-red-600">
            <p>Erreur lors du chargement: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-academy-blue text-white rounded hover:bg-academy-purple"
            >
              Réessayer
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AdminAccessControl>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          
          <div className="pt-20">
            <AdminHeader 
              title="Administration des Cours" 
              description="Gérez les cours, utilisateurs et analytics de votre plateforme"
            />
            
            <div className="container mx-auto px-6 py-8">
              <AdminTabsEnhanced
                courses={courses}
                onRefresh={refetch}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>

          <CourseFormDialog
            open={dialogOpen}
            onClose={handleCancel}
            onSubmit={handleSubmit}
            editingCourse={editingCourse}
          />
        </div>
      </AdminAccessControl>
    </ErrorBoundary>
  );
};

export default AdminCourses;
