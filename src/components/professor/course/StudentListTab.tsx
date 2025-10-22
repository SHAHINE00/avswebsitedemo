import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search, Eye, Calendar, CheckCircle, XCircle, AlertCircle, TrendingUp, Upload, FileUp } from 'lucide-react';
import { useProfessorStudents } from '@/hooks/useProfessorStudents';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { StudentDocumentUploader } from '@/components/professor/StudentDocumentUploader';
import { BulkDocumentUploader } from '@/components/shared/BulkDocumentUploader';
import { Checkbox } from '@/components/ui/checkbox';

interface StudentListTabProps {
  courseId: string;
}

const StudentListTab: React.FC<StudentListTabProps> = ({ courseId }) => {
  const { students, loading, fetchStudents, fetchStudentDetail } = useProfessorStudents(courseId);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [bulkUploaderOpen, setBulkUploaderOpen] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [courseId]);

  const filteredStudents = students.filter(s =>
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewDetails = async (studentId: string) => {
    const detail = await fetchStudentDetail(studentId);
    if (detail) {
      setSelectedStudent(detail);
      setDetailOpen(true);
    }
  };

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedStudents(checked ? filteredStudents.map(s => s.student_id) : []);
  };

  const getSelectedStudentNames = () => {
    return filteredStudents
      .filter(s => selectedStudents.includes(s.student_id))
      .map(s => s.full_name);
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      {selectedStudents.length > 0 && (
        <div className="mb-4 flex items-center justify-between p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedStudents.length} étudiant(s) sélectionné(s)
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedStudents([])}>
              Désélectionner
            </Button>
            <Button variant="default" size="sm" onClick={() => setBulkUploaderOpen(true)}>
              <FileUp className="w-4 h-4 mr-1" />
              Envoyer un document
            </Button>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Liste des étudiants</CardTitle>
          <div className="flex items-center gap-2 mt-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un étudiant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucun étudiant trouvé
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Progrès</TableHead>
                  <TableHead>Présences</TableHead>
                  <TableHead>Moyenne</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.student_id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedStudents.includes(student.student_id)}
                        onCheckedChange={() => handleSelectStudent(student.student_id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{student.full_name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.progress_percentage}%</TableCell>
                    <TableCell>
                      {student.present_count}/{student.total_attendance}
                    </TableCell>
                    <TableCell>
                      {student.average_grade ? `${student.average_grade.toFixed(2)}/100` : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                        {student.status === 'active' ? 'Actif' : student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewDetails(student.student_id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Détails de l'étudiant</span>
              {selectedStudent && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUploaderOpen(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Envoyer un document
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              {/* Informations générales */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Informations générales
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nom complet</p>
                    <p className="font-medium">{selectedStudent.profile?.full_name || 'Non renseigné'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedStudent.profile?.email || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Formation</p>
                    <p className="font-medium">{selectedStudent.profile?.formation_tag || 'Non renseignée'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Statut</p>
                    <Badge variant={selectedStudent.enrollment?.status === 'active' ? 'default' : 'secondary'}>
                      {selectedStudent.enrollment?.status === 'active' ? 'Actif' : selectedStudent.enrollment?.status || 'Inconnu'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date d'inscription</p>
                    <p className="font-medium">
                      {selectedStudent.enrollment?.enrolled_at 
                        ? format(new Date(selectedStudent.enrollment.enrolled_at), 'dd MMMM yyyy', { locale: fr })
                        : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Progrès du cours</p>
                    <div className="space-y-1">
                      <Progress value={selectedStudent.enrollment?.progress_percentage || 0} className="h-2" />
                      <p className="text-xs font-medium">{selectedStudent.enrollment?.progress_percentage || 0}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistiques */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Statistiques de performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Taux de présence</p>
                    <p className="text-3xl font-bold text-primary">{selectedStudent.statistics.attendance_rate}%</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Moyenne générale</p>
                    <p className="text-3xl font-bold text-primary">
                      {selectedStudent.statistics.average_grade ? selectedStudent.statistics.average_grade.toFixed(1) : '—'}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Présences</p>
                    <p className="text-2xl font-semibold text-green-600">
                      {selectedStudent.statistics.present_count}/{selectedStudent.statistics.total_attendance}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Notes</p>
                    <p className="text-2xl font-semibold text-blue-600">{selectedStudent.statistics.total_grades}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Historique des présences */}
              {selectedStudent.attendance_records && selectedStudent.attendance_records.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Historique des présences
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedStudent.attendance_records.map((record: any) => (
                          <TableRow key={record.id}>
                            <TableCell>
                              {format(new Date(record.attendance_date), 'dd/MM/yyyy', { locale: fr })}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  record.status === 'present' ? 'default' : 
                                  record.status === 'absent' ? 'destructive' : 
                                  'secondary'
                                }
                                className="flex items-center gap-1 w-fit"
                              >
                                {record.status === 'present' && <CheckCircle className="h-3 w-3" />}
                                {record.status === 'absent' && <XCircle className="h-3 w-3" />}
                                {record.status === 'excused' && <AlertCircle className="h-3 w-3" />}
                                {record.status === 'present' ? 'Présent' : 
                                 record.status === 'absent' ? 'Absent' : 
                                 record.status === 'excused' ? 'Excusé' : record.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {record.notes || '—'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Aucun enregistrement de présence</p>
                  </CardContent>
                </Card>
              )}

              {/* Historique des notes */}
              {selectedStudent.grades && selectedStudent.grades.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Toutes les notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Devoir</TableHead>
                          <TableHead>Note</TableHead>
                          <TableHead>Pourcentage</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Commentaire</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedStudent.grades.map((grade: any) => {
                          const percentage = (grade.grade / grade.max_grade) * 100;
                          return (
                            <TableRow key={grade.id}>
                              <TableCell className="font-medium">{grade.assignment_name}</TableCell>
                              <TableCell>{grade.grade}/{grade.max_grade}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={
                                    percentage >= 75 ? 'default' : 
                                    percentage >= 50 ? 'secondary' : 
                                    'destructive'
                                  }
                                >
                                  {percentage.toFixed(0)}%
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {format(new Date(grade.graded_at), 'dd/MM/yyyy', { locale: fr })}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {grade.comment || '—'}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Aucune note enregistrée</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {selectedStudent && (
        <StudentDocumentUploader
          studentId={selectedStudent.profile?.id}
          studentName={selectedStudent.profile?.full_name || selectedStudent.profile?.email}
          open={uploaderOpen}
          onOpenChange={setUploaderOpen}
          onSuccess={() => {
            handleViewDetails(selectedStudent.profile?.id);
          }}
        />
      )}

      <BulkDocumentUploader
        studentIds={selectedStudents}
        studentNames={getSelectedStudentNames()}
        open={bulkUploaderOpen}
        onOpenChange={setBulkUploaderOpen}
        onSuccess={() => {
          setSelectedStudents([]);
          fetchStudents();
        }}
        role="professor"
      />
    </>
  );
};

export default StudentListTab;
