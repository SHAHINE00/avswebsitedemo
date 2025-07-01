
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseFormDialog from '@/components/admin/CourseFormDialog';
import DashboardOverview from '@/components/admin/dashboard/DashboardOverview';
import EnhancedCourseManagement from '@/components/admin/dashboard/EnhancedCourseManagement';
import ComprehensiveUserManagement from '@/components/admin/dashboard/ComprehensiveUserManagement';
import type { Course } from '@/hooks/useCourses';

const AdminCourses = () => {
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user && !authLoading) {
      checkAdminStatus();
      fetchAllCourses();
    }
  }, [user, authLoading]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        return;
      }

      setIsAdmin(data?.role === 'admin');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchAllCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('display_order');

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les cours",
          variant: "destructive",
        });
        return;
      }

      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le cours",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Cours supprimé avec succès",
      });

      fetchAllCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h1>
            <p className="text-gray-600">Vous n'avez pas les permissions d'administrateur.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Tableau de Bord Administrateur</h1>
              <p className="text-gray-600">Gérez votre plateforme avec des outils avancés</p>
            </div>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Cours
            </Button>
          </div>

          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dashboard">Tableau de Bord</TabsTrigger>
              <TabsTrigger value="courses">Gestion des Cours</TabsTrigger>
              <TabsTrigger value="users">Gestion des Utilisateurs</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <DashboardOverview />
            </TabsContent>

            <TabsContent value="courses" className="space-y-6">
              <EnhancedCourseManagement
                courses={courses}
                onRefresh={fetchAllCourses}
                onEdit={openEditDialog}
                onDelete={deleteCourse}
              />
            </TabsContent>

            <TabsContent value="users">
              <ComprehensiveUserManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />

      <CourseFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        course={editingCourse}
        onSuccess={handleDialogSuccess}
      />
    </div>
  );
};

export default AdminCourses;
