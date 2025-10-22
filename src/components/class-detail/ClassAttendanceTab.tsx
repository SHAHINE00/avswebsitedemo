import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Papa from 'papaparse';

interface AttendanceRecord {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  attendance_date: string;
  status: string;
  session_id: string;
  session_time: string;
}

interface ClassAttendanceTabProps {
  classId: string;
  courseId: string;
}

export const ClassAttendanceTab: React.FC<ClassAttendanceTabProps> = ({ classId, courseId }) => {
  const [date, setDate] = useState<Date>();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAttendanceData = async (selectedDate?: Date) => {
    setLoading(true);
    try {
      // First, get attendance records
      let attendanceQuery = supabase
        .from('attendance')
        .select('*')
        .eq('course_id', courseId)
        .order('attendance_date', { ascending: false });

      if (selectedDate) {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        attendanceQuery = attendanceQuery.eq('attendance_date', dateStr);
      }

      const { data: attendanceData, error: attendanceError } = await attendanceQuery;

      if (attendanceError) throw attendanceError;

      // Get unique student IDs and session IDs
      const studentIds = [...new Set(attendanceData?.map(a => a.student_id) || [])];
      const sessionIds = [...new Set(attendanceData?.map(a => a.session_id).filter(Boolean) || [])];

      // Fetch profiles
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', studentIds);

      // Fetch sessions
      const { data: sessionsData } = await supabase
        .from('class_sessions')
        .select('id, start_time, end_time')
        .in('id', sessionIds);

      // Create lookup maps
      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
      const sessionsMap = new Map(sessionsData?.map(s => [s.id, s]) || []);

      const formattedData: AttendanceRecord[] = (attendanceData || []).map((record: any) => {
        const profile = profilesMap.get(record.student_id);
        const session = sessionsMap.get(record.session_id);
        
        return {
          id: record.id,
          student_id: record.student_id,
          student_name: profile?.full_name || 'Sans nom',
          student_email: profile?.email || '',
          attendance_date: record.attendance_date,
          status: record.status,
          session_id: record.session_id,
          session_time: session ? 
            `${session.start_time} - ${session.end_time}` : 
            'Non défini'
        };
      });

      setAttendance(formattedData);
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de charger les données de présence',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData(date);
  }, [classId, courseId, date]);

  const handleExportCSV = () => {
    const csvData = attendance.map(record => ({
      'Étudiant': record.student_name,
      'Email': record.student_email,
      'Date': format(new Date(record.attendance_date), 'dd/MM/yyyy', { locale: fr }),
      'Horaire': record.session_time,
      'Statut': record.status === 'present' ? 'Présent' :
                record.status === 'absent' ? 'Absent' :
                record.status === 'late' ? 'Retard' : 'Excusé'
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `presences_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();

    toast({
      title: 'Export réussi',
      description: 'Les données de présence ont été exportées'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="h-3 w-3 mr-1" />Présent</Badge>;
      case 'absent':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Absent</Badge>;
      case 'late':
        return <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />Retard</Badge>;
      case 'excused':
        return <Badge variant="outline"><CheckCircle className="h-3 w-3 mr-1" />Excusé</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const summary = {
    total: attendance.length,
    present: attendance.filter(a => a.status === 'present').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    late: attendance.filter(a => a.status === 'late').length,
    excused: attendance.filter(a => a.status === 'excused').length
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Présents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.present}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Absents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.absent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Retards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.late}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Excusés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.excused}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Registre des présences</CardTitle>
              <CardDescription>
                {date ? `Présences du ${format(date, 'dd MMMM yyyy', { locale: fr })}` : 'Toutes les présences'}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {date ? format(date, 'dd/MM/yyyy') : 'Filtrer par date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => setDate(newDate)}
                    locale={fr}
                  />
                  {date && (
                    <div className="p-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => setDate(undefined)}
                      >
                        Réinitialiser
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
              <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={attendance.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Exporter CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16" />)}
            </div>
          ) : attendance.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Étudiant</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Horaire</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.student_name}</TableCell>
                    <TableCell className="text-muted-foreground">{record.student_email}</TableCell>
                    <TableCell>
                      {format(new Date(record.attendance_date), 'dd MMM yyyy', { locale: fr })}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{record.session_time}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Aucune donnée de présence disponible
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
