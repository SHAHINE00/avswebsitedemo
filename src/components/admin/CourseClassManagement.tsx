import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCourseClasses, CourseClass } from '@/hooks/useCourseClasses';
import { useCourses } from '@/hooks/useCourses';
import { CourseClassManagementDialog } from './CourseClassManagementDialog';
import { AssignStudentsToClassDialog } from './AssignStudentsToClassDialog';
import { Plus, Edit, Users, Trash2, BookOpen, Calendar, GraduationCap } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const CourseClassManagement: React.FC = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const { courses } = useCourses();
  const { classes, loading, deleteClass } = useCourseClasses(selectedCourseId === 'all' ? undefined : selectedCourseId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<CourseClass | null>(null);
  const [selectedClass, setSelectedClass] = useState<CourseClass | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<string | null>(null);

  const handleEdit = (classItem: CourseClass) => {
    setEditingClass(classItem);
    setDialogOpen(true);
  };

  const handleAssignStudents = (classItem: CourseClass) => {
    setSelectedClass(classItem);
    setAssignDialogOpen(true);
  };

  const handleDeleteClick = (classId: string) => {
    setClassToDelete(classId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (classToDelete) {
      await deleteClass(classToDelete);
      setDeleteDialogOpen(false);
      setClassToDelete(null);
    }
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Gestion des Classes
              </CardTitle>
              <CardDescription>
                Organisez les étudiants en classes/groupes pour chaque cours
              </CardDescription>
            </div>
            {selectedCourseId && selectedCourseId !== 'all' && (
              <Button
                onClick={() => {
                  setEditingClass(null);
                  setDialogOpen(true);
                }}
                size="lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Classe
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Cours</Label>
          </div>
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un cours pour gérer ses classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les cours</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedCourseId && (
            <>
              {selectedCourse && selectedCourseId !== 'all' && (
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 rounded-lg">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="font-medium">{selectedCourse.title}</span>
                  {classes.length > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {classes.length} classe{classes.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              )}
              
              {selectedCourseId === 'all' && classes.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 rounded-lg">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="font-medium">Toutes les classes</span>
                  <Badge variant="secondary" className="ml-auto">
                    {classes.length} classe{classes.length > 1 ? 's' : ''}
                  </Badge>
                </div>
              )}

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      {selectedCourseId === 'all' && <TableHead className="font-semibold">Cours</TableHead>}
                      <TableHead className="font-semibold">Classe</TableHead>
                      <TableHead className="font-semibold">Professeur</TableHead>
                      <TableHead className="font-semibold">Capacité</TableHead>
                      <TableHead className="font-semibold">Période</TableHead>
                      <TableHead className="font-semibold">Statut</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={selectedCourseId === 'all' ? 7 : 6} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm text-muted-foreground">Chargement des classes...</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : classes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={selectedCourseId === 'all' ? 7 : 6} className="text-center py-12">
                          <div className="flex flex-col items-center gap-3">
                            <GraduationCap className="w-12 h-12 text-muted-foreground/50" />
                            <div className="space-y-1">
                              <p className="font-medium">Aucune classe créée</p>
                              <p className="text-sm text-muted-foreground">
                                Créez votre première classe pour organiser les étudiants
                              </p>
                            </div>
                            <Button
                              onClick={() => {
                                setEditingClass(null);
                                setDialogOpen(true);
                              }}
                              className="mt-2"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Créer une classe
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      classes.map((classItem) => (
                        <TableRow key={classItem.id} className="hover:bg-muted/30">
                          {selectedCourseId === 'all' && (
                            <TableCell>
                              <Badge variant="outline">{classItem.course_name}</Badge>
                            </TableCell>
                          )}
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium">{classItem.class_name}</p>
                              {classItem.class_code && (
                                <Badge variant="outline" className="text-xs">
                                  {classItem.class_code}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {classItem.professor?.full_name ? (
                                <>
                                  <Users className="w-4 h-4 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm">{classItem.professor.full_name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {classItem.professor.email}
                                    </p>
                                  </div>
                                </>
                              ) : (
                                <span className="text-sm text-muted-foreground italic">
                                  Non assigné
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  classItem.current_students >= classItem.max_students
                                    ? 'destructive'
                                    : classItem.current_students > classItem.max_students * 0.8
                                    ? 'secondary'
                                    : 'default'
                                }
                              >
                                {classItem.current_students}/{classItem.max_students}
                              </Badge>
                              {classItem.current_students >= classItem.max_students && (
                                <span className="text-xs text-destructive">Complet</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {classItem.academic_year ? (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <div className="text-sm">
                                  <p>{classItem.academic_year}</p>
                                  {classItem.semester && (
                                    <p className="text-xs text-muted-foreground">
                                      {classItem.semester}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground italic">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(classItem.status)}>
                              {getStatusLabel(classItem.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAssignStudents(classItem)}
                                title="Gérer les étudiants de cette classe"
                              >
                                <Users className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(classItem)}
                                title="Modifier cette classe"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClick(classItem.id)}
                                title="Supprimer cette classe"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialogs rendered regardless of selectedCourse to support "Tous les cours" view */}
      {(dialogOpen && (selectedCourse || editingClass)) && (
        <CourseClassManagementDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          courseId={(selectedCourse?.id ?? editingClass?.course_id) as string}
          courseName={(selectedCourse?.title ?? editingClass?.course_name ?? editingClass?.course?.title ?? '') as string}
          editClass={editingClass}
        />
      )}

      {(assignDialogOpen && selectedClass) && (
        <AssignStudentsToClassDialog
          open={assignDialogOpen}
          onOpenChange={setAssignDialogOpen}
          courseId={(selectedCourse?.id ?? selectedClass.course_id) as string}
          selectedClass={selectedClass}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette classe ? Cette action est irréversible.
              Les étudiants assignés à cette classe ne seront pas désinscrits du cours.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
