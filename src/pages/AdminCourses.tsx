
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil, Plus, Trash2, Search, Eye, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseFormDialog from '@/components/admin/CourseFormDialog';
import AdminUserSetup from '@/components/admin/AdminUserSetup';
import type { Course } from '@/hooks/useCourses';

const AdminCourses = () => {
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    if (user && !authLoading) {
      checkAdminStatus();
      fetchAllCourses();
    }
  }, [user, authLoading]);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, statusFilter]);

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

  const filterCourses = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(course => course.status === statusFilter);
    }

    setFilteredCourses(filtered);
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

  const toggleCourseStatus = async (course: Course) => {
    const newStatus = course.status === 'published' ? 'draft' : 'published';
    
    try {
      const { error } = await supabase
        .from('courses')
        .update({ status: newStatus })
        .eq('id', course.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Cours ${newStatus === 'published' ? 'publié' : 'mis en brouillon'}`,
      });

      fetchAllCourses();
    } catch (error) {
      console.error('Error updating course status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
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
              <h1 className="text-3xl font-bold mb-2">Administration</h1>
              <p className="text-gray-600">Gérez les formations et les utilisateurs</p>
            </div>
          </div>

          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="courses">Gestion des Cours</TabsTrigger>
              <TabsTrigger value="users">Gestion des Utilisateurs</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Rechercher un cours..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="published">Publiés</SelectItem>
                      <SelectItem value="draft">Brouillons</SelectItem>
                      <SelectItem value="archived">Archivés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={openCreateDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau Cours
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="relative">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                          <CardDescription>{course.subtitle}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge 
                            variant={course.status === 'published' ? 'default' : 'secondary'}
                            className="cursor-pointer"
                            onClick={() => toggleCourseStatus(course)}
                          >
                            {course.status === 'published' ? 'Publié' : 
                             course.status === 'draft' ? 'Brouillon' : 'Archivé'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <p><strong>Modules:</strong> {course.modules}</p>
                        <p><strong>Durée:</strong> {course.duration}</p>
                        <p><strong>Diplôme:</strong> {course.diploma}</p>
                        <p><strong>Ordre:</strong> {course.display_order}</p>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        {course.link_to && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={course.link_to} target="_blank" rel="noopener noreferrer">
                              <Eye className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditDialog(course)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteCourse(course.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredCourses.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucun cours trouvé</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="users">
              <AdminUserSetup />
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
