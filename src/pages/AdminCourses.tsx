
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCourses } from '@/hooks/useAdminCourses';
import AdminAccessControl from '@/components/admin/AdminAccessControl';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTabs from '@/components/admin/AdminTabs';
import CourseFormDialog from '@/components/admin/CourseFormDialog';
import type { Course } from '@/hooks/useCourses';

const AdminCourses = () => {
  const { user, loading: authLoading } = useAuth();
  const { courses, loading, isAdmin, fetchAllCourses, deleteCourse } = useAdminCourses();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingCourse(null);
    setDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    fetchAllCourses();
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <AdminAccessControl isAdmin={isAdmin} loading={false}>
      <AdminHeader onCreateCourse={openCreateDialog} />
      
      <AdminTabs
        courses={courses}
        onRefresh={fetchAllCourses}
        onEdit={openEditDialog}
        onDelete={deleteCourse}
      />

      <CourseFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        course={editingCourse}
        onSuccess={handleDialogSuccess}
      />
    </AdminAccessControl>
  );
};

export default AdminCourses;
