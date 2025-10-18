import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search, Eye } from 'lucide-react';
import { useProfessorStudents } from '@/hooks/useProfessorStudents';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface StudentListTabProps {
  courseId: string;
}

const StudentListTab: React.FC<StudentListTabProps> = ({ courseId }) => {
  const { students, loading, fetchStudents, fetchStudentDetail } = useProfessorStudents(courseId);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);

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

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <>
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
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de l'étudiant</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Informations générales</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nom complet</p>
                    <p className="font-medium">{selectedStudent.profile.full_name || selectedStudent.profile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedStudent.profile.email}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Statistiques</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Taux de présence</p>
                    <p className="text-2xl font-bold">{selectedStudent.statistics.attendance_rate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Moyenne générale</p>
                    <p className="text-2xl font-bold">
                      {selectedStudent.statistics.average_grade || '-'}/100
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total présences</p>
                    <p className="text-xl font-semibold">{selectedStudent.statistics.present_count}/{selectedStudent.statistics.total_attendance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Notes enregistrées</p>
                    <p className="text-xl font-semibold">{selectedStudent.statistics.total_grades}</p>
                  </div>
                </div>
              </div>

              {selectedStudent.grades && selectedStudent.grades.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Dernières notes</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Devoir</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedStudent.grades.slice(0, 5).map((grade: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell>{grade.assignment_name}</TableCell>
                          <TableCell>{grade.grade}/{grade.max_grade}</TableCell>
                          <TableCell>{new Date(grade.graded_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StudentListTab;
