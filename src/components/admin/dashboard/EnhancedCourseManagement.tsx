
import React, { useState } from 'react';
import { logError } from '@/utils/logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Trash2, 
  Eye, 
  Edit, 
  MoreHorizontal,
  Calendar,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdminActivityLogs } from '@/hooks/useAdminActivityLogs';
import type { Course } from '@/hooks/useCourses';

interface EnhancedCourseManagementProps {
  courses: Course[];
  onRefresh: () => void;
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
}

const EnhancedCourseManagement: React.FC<EnhancedCourseManagementProps> = ({
  courses,
  onRefresh,
  onEdit,
  onDelete
}) => {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [isPerformingBulkAction, setIsPerformingBulkAction] = useState(false);
  const { toast } = useToast();
  const { logActivity } = useAdminActivityLogs();

  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.subtitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter === 'last_week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = new Date(course.created_at) >= weekAgo;
    } else if (dateFilter === 'last_month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDate = new Date(course.created_at) >= monthAgo;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCourses(filteredCourses.map(course => course.id));
    } else {
      setSelectedCourses([]);
    }
  };

  const handleSelectCourse = (courseId: string, checked: boolean) => {
    if (checked) {
      setSelectedCourses([...selectedCourses, courseId]);
    } else {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    }
  };

  const handleBulkStatusChange = async (newStatus: 'published' | 'draft' | 'archived') => {
    if (selectedCourses.length === 0) return;
    
    setIsPerformingBulkAction(true);
    try {
      const { error } = await supabase
        .from('courses')
        .update({ status: newStatus })
        .in('id', selectedCourses);

      if (error) throw error;

      await logActivity('bulk_status_update', 'courses', undefined, {
        course_ids: selectedCourses,
        new_status: newStatus,
        count: selectedCourses.length
      });

      toast({
        title: "Succès",
        description: `${selectedCourses.length} cours mis à jour avec le statut "${newStatus}"`,
      });

      setSelectedCourses([]);
      onRefresh();
    } catch (error) {
      logError('Error updating course status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut des cours",
        variant: "destructive",
      });
    } finally {
      setIsPerformingBulkAction(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCourses.length === 0) return;
    
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedCourses.length} cours ?`)) return;

    setIsPerformingBulkAction(true);
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .in('id', selectedCourses);

      if (error) throw error;

      await logActivity('bulk_delete', 'courses', undefined, {
        course_ids: selectedCourses,
        count: selectedCourses.length
      });

      toast({
        title: "Succès",
        description: `${selectedCourses.length} cours supprimés`,
      });

      setSelectedCourses([]);
      onRefresh();
    } catch (error) {
      logError('Error deleting courses:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les cours",
        variant: "destructive",
      });
    } finally {
      setIsPerformingBulkAction(false);
    }
  };

  const exportCourses = () => {
    const csvContent = [
      ['Titre', 'Sous-titre', 'Statut', 'Modules', 'Durée', 'Diplôme', 'Date de création'].join(','),
      ...filteredCourses.map(course => [
        course.title,
        course.subtitle || '',
        course.status,
        course.modules || '',
        course.duration || '',
        course.diploma || '',
        new Date(course.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'courses_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    logActivity('export_courses', 'courses', undefined, { count: filteredCourses.length });
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Gestion Avancée des Cours</CardTitle>
          <CardDescription>Recherche, filtrage et actions en lot</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par titre ou sous-titre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-4 items-center">
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

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les dates</SelectItem>
                  <SelectItem value="last_week">Cette semaine</SelectItem>
                  <SelectItem value="last_month">Ce mois</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={exportCourses}>
                <Download className="w-4 h-4 mr-2" />
                Exporter CSV
              </Button>
            </div>

            {/* Bulk Actions */}
            {selectedCourses.length > 0 && (
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">
                  {selectedCourses.length} cours sélectionnés
                </span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleBulkStatusChange('published')}
                    disabled={isPerformingBulkAction}
                  >
                    Publier
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleBulkStatusChange('draft')}
                    disabled={isPerformingBulkAction}
                  >
                    Brouillon
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={handleBulkDelete}
                    disabled={isPerformingBulkAction}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Supprimer
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Course List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des Cours ({filteredCourses.length})</CardTitle>
              <CardDescription>Gérez vos cours avec des actions avancées</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedCourses.length === filteredCourses.length && filteredCourses.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">Tout sélectionner</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCourses.map((course) => (
              <div key={course.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  checked={selectedCourses.includes(course.id)}
                  onCheckedChange={(checked) => handleSelectCourse(course.id, checked as boolean)}
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{course.title}</h3>
                    <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                      {course.status === 'published' ? 'Publié' : 
                       course.status === 'draft' ? 'Brouillon' : 'Archivé'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{course.subtitle}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(course.created_at).toLocaleDateString()}
                    </span>
                    <span>{course.modules}</span>
                    <span>{course.duration}</span>
                    {course.view_count !== undefined && (
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {course.view_count} vues
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
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
                    onClick={() => onEdit(course)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => onDelete(course.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun cours trouvé avec les filtres actuels</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedCourseManagement;
