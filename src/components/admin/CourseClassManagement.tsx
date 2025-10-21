import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Plus, Edit, Users, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const CourseClassManagement: React.FC = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const { courses } = useCourses();
  const { classes, loading, deleteClass } = useCourseClasses(selectedCourseId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<CourseClass | null>(null);
  const [selectedClass, setSelectedClass] = useState<CourseClass | null>(null);

  const handleEdit = (classItem: CourseClass) => {
    setEditingClass(classItem);
    setDialogOpen(true);
  };

  const handleAssignStudents = (classItem: CourseClass) => {
    setSelectedClass(classItem);
    setAssignDialogOpen(true);
  };

  const handleDelete = async (classId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
      await deleteClass(classId);
    }
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Classes</CardTitle>
          <CardDescription>
            Organisez les étudiants en classes/groupes pour chaque cours
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
              <SelectTrigger className="w-[400px]">
                <SelectValue placeholder="Sélectionner un cours" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCourseId && (
              <Button
                onClick={() => {
                  setEditingClass(null);
                  setDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Classe
              </Button>
            )}
          </div>

          {selectedCourseId && (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom de la Classe</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Professeur</TableHead>
                    <TableHead>Étudiants</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Chargement...
                      </TableCell>
                    </TableRow>
                  ) : classes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Aucune classe créée pour ce cours
                      </TableCell>
                    </TableRow>
                  ) : (
                    classes.map((classItem) => (
                      <TableRow key={classItem.id}>
                        <TableCell className="font-medium">{classItem.class_name}</TableCell>
                        <TableCell>
                          {classItem.class_code && (
                            <Badge variant="outline">{classItem.class_code}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {classItem.professors?.full_name || 'Non assigné'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={classItem.current_students >= classItem.max_students ? 'destructive' : 'default'}>
                            {classItem.current_students}/{classItem.max_students}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {classItem.academic_year && `${classItem.academic_year} - ${classItem.semester || ''}`}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              classItem.status === 'active'
                                ? 'default'
                                : classItem.status === 'completed'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {classItem.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAssignStudents(classItem)}
                            >
                              <Users className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(classItem)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(classItem.id)}
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
          )}
        </CardContent>
      </Card>

      {selectedCourse && (
        <>
          <CourseClassManagementDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            courseId={selectedCourse.id}
            courseName={selectedCourse.title}
            editClass={editingClass}
          />

          {selectedClass && (
            <AssignStudentsToClassDialog
              open={assignDialogOpen}
              onOpenChange={setAssignDialogOpen}
              courseId={selectedCourse.id}
              selectedClass={selectedClass}
            />
          )}
        </>
      )}
    </div>
  );
};
