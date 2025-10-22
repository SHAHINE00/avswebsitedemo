import React, { useState, useEffect } from 'react';
import { Download, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Papa from 'papaparse';
import { format } from 'date-fns';

interface GradeRecord {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  assignment_name: string;
  grade: number;
  max_grade: number;
  percentage: number;
  comment: string | null;
  graded_at: string;
}

interface ClassGradesTabProps {
  classId: string;
  courseId: string;
}

export const ClassGradesTab: React.FC<ClassGradesTabProps> = ({ classId, courseId }) => {
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchGrades = async () => {
    setLoading(true);
    try {
      // First, get grades
      const { data: gradesData, error: gradesError } = await supabase
        .from('grades')
        .select('*')
        .eq('course_id', courseId)
        .order('graded_at', { ascending: false });

      if (gradesError) throw gradesError;

      // Get unique student IDs
      const studentIds = [...new Set(gradesData?.map(g => g.student_id) || [])];

      // Fetch profiles
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', studentIds);

      // Create lookup map
      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

      const formattedData: GradeRecord[] = (gradesData || []).map((record: any) => {
        const profile = profilesMap.get(record.student_id);
        
        return {
          id: record.id,
          student_id: record.student_id,
          student_name: profile?.full_name || 'Sans nom',
          student_email: profile?.email || '',
          assignment_name: record.assignment_name,
          grade: record.grade,
          max_grade: record.max_grade,
          percentage: (record.grade / record.max_grade) * 100,
          comment: record.comment,
          graded_at: record.graded_at
        };
      });

      setGrades(formattedData);
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de charger les notes',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [classId, courseId]);

  const handleExportCSV = () => {
    const csvData = grades.map(record => ({
      'Étudiant': record.student_name,
      'Email': record.student_email,
      'Évaluation': record.assignment_name,
      'Note': record.grade,
      'Note max': record.max_grade,
      'Pourcentage': `${record.percentage.toFixed(2)}%`,
      'Commentaire': record.comment || '',
      'Date': format(new Date(record.graded_at), 'dd/MM/yyyy')
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `notes_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();

    toast({
      title: 'Export réussi',
      description: 'Les notes ont été exportées'
    });
  };

  const stats = {
    totalGrades: grades.length,
    averageGrade: grades.length > 0 
      ? grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length 
      : 0,
    highestGrade: grades.length > 0 
      ? Math.max(...grades.map(g => g.percentage)) 
      : 0,
    lowestGrade: grades.length > 0 
      ? Math.min(...grades.map(g => g.percentage)) 
      : 0
  };

  const getGradeBadge = (percentage: number) => {
    if (percentage >= 90) return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Excellent</Badge>;
    if (percentage >= 80) return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Très bien</Badge>;
    if (percentage >= 70) return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Bien</Badge>;
    if (percentage >= 60) return <Badge variant="secondary">Passable</Badge>;
    return <Badge variant="destructive">Insuffisant</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total des notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGrades}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Moyenne générale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageGrade.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Note maximale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.highestGrade.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Note minimale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.lowestGrade.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Relevé de notes</CardTitle>
              <CardDescription>
                Toutes les notes des étudiants de cette classe
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={grades.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Exporter CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16" />)}
            </div>
          ) : grades.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Étudiant</TableHead>
                  <TableHead>Évaluation</TableHead>
                  <TableHead className="text-right">Note</TableHead>
                  <TableHead className="text-right">Pourcentage</TableHead>
                  <TableHead>Appréciation</TableHead>
                  <TableHead>Commentaire</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{record.student_name}</div>
                        <div className="text-xs text-muted-foreground">{record.student_email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{record.assignment_name}</TableCell>
                    <TableCell className="text-right">
                      {record.grade} / {record.max_grade}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {record.percentage.toFixed(1)}%
                    </TableCell>
                    <TableCell>{getGradeBadge(record.percentage)}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {record.comment || '-'}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {format(new Date(record.graded_at), 'dd/MM/yyyy')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Aucune note disponible
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
