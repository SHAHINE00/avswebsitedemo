import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon, Save, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useProfessorAttendance } from '@/hooks/useProfessorAttendance';
import { useProfessorStudents } from '@/hooks/useProfessorStudents';
import { supabase } from '@/integrations/supabase/client';
import { AttendanceAnalytics } from '@/components/professor/AttendanceAnalytics';

interface AttendanceTabProps {
  courseId: string;
  sessionId?: string;
}

const AttendanceTab: React.FC<AttendanceTabProps> = ({ courseId, sessionId }) => {
  const { attendance, stats, loading, fetchAttendance, fetchStats, markAttendance } = useProfessorAttendance(courseId);
  const { students, fetchStudents } = useProfessorStudents(courseId);
  const [date, setDate] = useState<Date>(new Date());
  const [selectedStudents, setSelectedStudents] = useState<Record<string, string>>({});
  const [sessionDetails, setSessionDetails] = useState<any>(null);

  useEffect(() => {
    fetchAttendance();
    fetchStats();
    fetchStudents();
    if (sessionId) {
      fetchSessionDetails();
    }
  }, [courseId, sessionId]);

  // Fetch attendance when date changes
  useEffect(() => {
    const dateStr = format(date, 'yyyy-MM-dd');
    fetchAttendance(dateStr, dateStr);
  }, [date]);

  // Pre-populate selected students from existing attendance records
  useEffect(() => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const todaysAttendance = attendance.filter(
      record => record.attendance_date === dateStr
    );
    
    if (todaysAttendance.length > 0) {
      const preselected: Record<string, string> = {};
      todaysAttendance.forEach(record => {
        preselected[record.student_id] = record.status;
      });
      setSelectedStudents(preselected);
    } else {
      setSelectedStudents({});
    }
  }, [attendance, date]);

  const fetchSessionDetails = async () => {
    if (!sessionId) return;
    try {
      const { data, error } = await supabase
        .from('class_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      if (error) throw error;
      setSessionDetails(data);
      setDate(new Date(data.session_date));
    } catch (error) {
      console.error('Error fetching session details:', error);
    }
  };

  const handleSaveAttendance = async () => {
    const presentStudents = Object.entries(selectedStudents)
      .filter(([_, status]) => status === 'present')
      .map(([id]) => id);
    
    const absentStudents = Object.entries(selectedStudents)
      .filter(([_, status]) => status === 'absent')
      .map(([id]) => id);

    if (presentStudents.length > 0) {
      await markAttendance(presentStudents, format(date, 'yyyy-MM-dd'), 'present', undefined, sessionId);
    }
    if (absentStudents.length > 0) {
      await markAttendance(absentStudents, format(date, 'yyyy-MM-dd'), 'absent', undefined, sessionId);
    }
    
    setSelectedStudents({});
  };

  const toggleStudent = (studentId: string, status: string) => {
    setSelectedStudents(prev => ({
      ...prev,
      [studentId]: prev[studentId] === status ? '' : status
    }));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Marquer les présences</CardTitle>
          {sessionDetails && (
            <div className="mt-2 p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{sessionDetails.start_time} - {sessionDetails.end_time}</span>
                </div>
                {sessionDetails.room_location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{sessionDetails.room_location}</span>
                  </div>
                )}
                <span className="capitalize">{sessionDetails.session_type}</span>
              </div>
            </div>
          )}
          <div className="flex items-center gap-4 mt-4 justify-between">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" disabled={!!sessionId}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            {Object.keys(selectedStudents).length > 0 && (
              <div className="text-sm text-muted-foreground">
                {Object.values(selectedStudents).filter(s => s === 'present').length} présents, 
                {' '}{Object.values(selectedStudents).filter(s => s === 'absent').length} absents
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucun étudiant inscrit</p>
          ) : (
            <>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {students.map((student) => (
                  <div key={student.student_id} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{student.full_name}</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={selectedStudents[student.student_id] === 'present' ? 'default' : 'outline'}
                        onClick={() => toggleStudent(student.student_id, 'present')}
                      >
                        Présent
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedStudents[student.student_id] === 'absent' ? 'destructive' : 'outline'}
                        onClick={() => toggleStudent(student.student_id, 'absent')}
                      >
                        Absent
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleSaveAttendance}
                className="w-full mt-4"
                disabled={Object.keys(selectedStudents).length === 0}
              >
                <Save className="h-4 w-4 mr-2" />
                Enregistrer les présences
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Statistiques de présence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Taux de présence</p>
                <p className="text-2xl font-bold">{stats.attendance_rate}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total présents</p>
                <p className="text-2xl font-bold">{stats.present_count}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total absents</p>
                <p className="text-2xl font-bold">{stats.absent_count}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sessions</p>
                <p className="text-2xl font-bold">{stats.total_sessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <AttendanceAnalytics courseId={courseId} />
    </div>
  );
};

export default AttendanceTab;
