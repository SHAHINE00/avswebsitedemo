import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon, Save } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useProfessorAttendance } from '@/hooks/useProfessorAttendance';
import { useProfessorStudents } from '@/hooks/useProfessorStudents';

interface AttendanceTabProps {
  courseId: string;
}

const AttendanceTab: React.FC<AttendanceTabProps> = ({ courseId }) => {
  const { attendance, stats, loading, fetchAttendance, fetchStats, markAttendance } = useProfessorAttendance(courseId);
  const { students, fetchStudents } = useProfessorStudents(courseId);
  const [date, setDate] = useState<Date>(new Date());
  const [selectedStudents, setSelectedStudents] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchAttendance();
    fetchStats();
    fetchStudents();
  }, [courseId]);

  const handleSaveAttendance = async () => {
    const presentStudents = Object.entries(selectedStudents)
      .filter(([_, status]) => status === 'present')
      .map(([id]) => id);
    
    const absentStudents = Object.entries(selectedStudents)
      .filter(([_, status]) => status === 'absent')
      .map(([id]) => id);

    if (presentStudents.length > 0) {
      await markAttendance(presentStudents, format(date, 'yyyy-MM-dd'), 'present');
    }
    if (absentStudents.length > 0) {
      await markAttendance(absentStudents, format(date, 'yyyy-MM-dd'), 'absent');
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
          <div className="flex items-center gap-4 mt-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
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
    </div>
  );
};

export default AttendanceTab;
