import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AbsenceJustificationDialog } from './AbsenceJustificationDialog';
import { FileCheck, XCircle, Clock, CheckCircle } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  attendance_date: string;
  status: string;
  notes: string | null;
  course_id: string;
  session_id: string | null;
  course_title: string;
  session_type: string | null;
  justification_status: string | null;
  justification_id: string | null;
}

interface AttendanceStats {
  total_sessions: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export const MyAttendance: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAttendanceId, setSelectedAttendanceId] = useState<string | null>(null);
  const [justificationDialogOpen, setJustificationDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAttendance();
    }
  }, [user]);

  const fetchAttendance = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          id,
          attendance_date,
          status,
          notes,
          course_id,
          session_id,
          courses(title),
          class_sessions(session_type),
          absence_justifications(id, status)
        `)
        .eq('student_id', user.id)
        .order('attendance_date', { ascending: false });

      if (error) throw error;

      const formattedRecords: AttendanceRecord[] = (data || []).map((record: any) => ({
        id: record.id,
        attendance_date: record.attendance_date,
        status: record.status,
        notes: record.notes,
        course_id: record.course_id,
        session_id: record.session_id,
        course_title: record.courses?.title || 'Unknown Course',
        session_type: record.class_sessions?.session_type || null,
        justification_status: record.absence_justifications?.[0]?.status || null,
        justification_id: record.absence_justifications?.[0]?.id || null
      }));

      setRecords(formattedRecords);

      // Calculate stats
      const total = formattedRecords.length;
      const present = formattedRecords.filter(r => r.status === 'present').length;
      const absent = formattedRecords.filter(r => r.status === 'absent').length;
      const late = formattedRecords.filter(r => r.status === 'late').length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

      setStats({ total_sessions: total, present, absent, late, percentage });
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJustifyAbsence = (attendanceId: string) => {
    setSelectedAttendanceId(attendanceId);
    setJustificationDialogOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'absent': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'late': return <Clock className="h-4 w-4 text-orange-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      present: 'default',
      absent: 'destructive',
      late: 'secondary'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const getJustificationBadge = (status: string | null) => {
    if (!status) return null;
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive'
    };
    return <Badge variant={variants[status] || 'outline'} className="ml-2">{status}</Badge>;
  };

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Taux de présence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.percentage}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Présent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Retard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.late}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Historique de présence</CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucun enregistrement de présence</p>
          ) : (
            <div className="space-y-3">
              {records.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(record.status)}
                    <div>
                      <div className="font-medium">{record.course_title}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(record.attendance_date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                        {record.session_type && ` • ${record.session_type}`}
                      </div>
                      {record.notes && (
                        <div className="text-sm text-muted-foreground mt-1">{record.notes}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(record.status)}
                    {record.justification_status && getJustificationBadge(record.justification_status)}
                    {record.status === 'absent' && !record.justification_id && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleJustifyAbsence(record.id)}
                      >
                        <FileCheck className="h-4 w-4 mr-1" />
                        Justifier
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedAttendanceId && (
        <AbsenceJustificationDialog
          attendanceId={selectedAttendanceId}
          open={justificationDialogOpen}
          onOpenChange={(open) => {
            setJustificationDialogOpen(open);
            if (!open) {
              setSelectedAttendanceId(null);
              fetchAttendance();
            }
          }}
        />
      )}
    </div>
  );
};
