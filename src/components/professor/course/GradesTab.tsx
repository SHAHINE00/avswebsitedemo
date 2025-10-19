import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Download, Upload } from 'lucide-react';
import { useProfessorGrades } from '@/hooks/useProfessorGrades';
import { useProfessorStudents } from '@/hooks/useProfessorStudents';
import { Textarea } from '@/components/ui/textarea';
import Papa from 'papaparse';

interface GradesTabProps {
  courseId: string;
}

const GradesTab: React.FC<GradesTabProps> = ({ courseId }) => {
  const { grades, stats, loading, fetchGrades, fetchStats, upsertGrade, deleteGrade } = useProfessorGrades(courseId);
  const { students, fetchStudents } = useProfessorStudents(courseId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string>('');
  const [formData, setFormData] = useState({
    studentId: '',
    assignmentName: '',
    grade: '',
    maxGrade: '100',
    comment: ''
  });

  useEffect(() => {
    fetchGrades();
    fetchStats();
    fetchStudents();
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await upsertGrade(
      formData.studentId,
      formData.assignmentName,
      parseFloat(formData.grade),
      parseFloat(formData.maxGrade),
      formData.comment
    );
    
    if (success) {
      setDialogOpen(false);
      setFormData({
        studentId: '',
        assignmentName: '',
        grade: '',
        maxGrade: '100',
        comment: ''
      });
    }
  };

  const handleDelete = async (gradeId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      await deleteGrade(gradeId);
    }
  };

  const handleExportCSV = () => {
    const exportData = grades.map(grade => ({
      'Étudiant': grade.student_name,
      'Devoir': grade.assignment_name,
      'Note': grade.grade,
      'Note maximale': grade.max_grade,
      'Pourcentage': grade.percentage,
      'Commentaire': grade.comment || '',
      'Date de notation': new Date(grade.graded_at).toLocaleDateString('fr-FR')
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `notes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportStatus('Traitement du fichier...');
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data as Array<{
          'Email étudiant': string;
          'Devoir': string;
          'Note': string;
          'Note maximale': string;
          'Commentaire'?: string;
        }>;

        let successCount = 0;
        let errorCount = 0;

        for (const row of data) {
          try {
            // Find student by email
            const student = students.find(s => 
              s.email?.toLowerCase() === row['Email étudiant']?.toLowerCase()
            );

            if (!student) {
              console.error('Student not found:', row['Email étudiant']);
              errorCount++;
              continue;
            }

            const success = await upsertGrade(
              student.student_id,
              row['Devoir'],
              parseFloat(row['Note']),
              parseFloat(row['Note maximale'] || '100'),
              row['Commentaire'] || undefined
            );

            if (success) {
              successCount++;
            } else {
              errorCount++;
            }
          } catch (error) {
            console.error('Error importing row:', error);
            errorCount++;
          }
        }

        setImportStatus(`Import terminé: ${successCount} notes importées, ${errorCount} erreurs`);
        setTimeout(() => {
          setImportDialogOpen(false);
          setImportStatus('');
          if (fileInputRef.current) fileInputRef.current.value = '';
        }, 3000);
      },
      error: (error) => {
        setImportStatus(`Erreur: ${error.message}`);
      }
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Carnet de notes</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExportCSV}
              disabled={grades.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter CSV
            </Button>
            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Importer CSV
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Importer des notes depuis CSV</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Le fichier CSV doit contenir les colonnes suivantes:
                    </p>
                    <ul className="text-sm list-disc list-inside space-y-1 mb-4">
                      <li>Email étudiant</li>
                      <li>Devoir</li>
                      <li>Note</li>
                      <li>Note maximale</li>
                      <li>Commentaire (optionnel)</li>
                    </ul>
                  </div>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleImportCSV}
                  />
                  {importStatus && (
                    <p className="text-sm font-medium">{importStatus}</p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter/Modifier une note</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Étudiant</Label>
                  <Select value={formData.studentId} onValueChange={(v) => setFormData({...formData, studentId: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un étudiant" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.student_id} value={student.student_id}>
                          {student.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Nom du devoir</Label>
                  <Input
                    value={formData.assignmentName}
                    onChange={(e) => setFormData({...formData, assignmentName: e.target.value})}
                    placeholder="Ex: Examen Final"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Note</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.grade}
                      onChange={(e) => setFormData({...formData, grade: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label>Note maximale</Label>
                    <Input
                      type="number"
                      value={formData.maxGrade}
                      onChange={(e) => setFormData({...formData, maxGrade: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label>Commentaire (optionnel)</Label>
                  <Textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                    placeholder="Remarques..."
                  />
                </div>
                <Button type="submit" className="w-full">Enregistrer</Button>
              </form>
            </DialogContent>
          </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Chargement...</p>
          ) : grades.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucune note enregistrée</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Étudiant</TableHead>
                  <TableHead>Devoir</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Pourcentage</TableHead>
                  <TableHead>Commentaire</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((grade) => (
                  <TableRow key={grade.grade_id}>
                    <TableCell className="font-medium">{grade.student_name}</TableCell>
                    <TableCell>{grade.assignment_name}</TableCell>
                    <TableCell>{grade.grade}/{grade.max_grade}</TableCell>
                    <TableCell>{grade.percentage}%</TableCell>
                    <TableCell className="max-w-xs truncate">{grade.comment || '-'}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(grade.grade_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Statistiques des notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Moyenne générale</p>
                <p className="text-2xl font-bold">{stats.average_grade}/100</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Note la plus haute</p>
                <p className="text-2xl font-bold">{stats.highest_grade}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Note la plus basse</p>
                <p className="text-2xl font-bold">{stats.lowest_grade}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de notes</p>
                <p className="text-2xl font-bold">{stats.total_grades}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GradesTab;
