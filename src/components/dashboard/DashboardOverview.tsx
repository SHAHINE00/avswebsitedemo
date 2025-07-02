import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar } from 'lucide-react';
import UserProfileCard from '@/components/user/UserProfileCard';
import CourseProgressCard from '@/components/user/CourseProgressCard';

interface Enrollment {
  id: string;
  course_id: string;
  enrolled_at: string;
  status: string;
  progress_percentage: number;
  courses: {
    title: string;
    subtitle: string;
    duration: string;
  };
}

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
  status: string;
  subject: string;
}

interface DashboardOverviewProps {
  enrollments: Enrollment[];
  appointments: Appointment[];
}

const DashboardOverview = ({ enrollments, appointments }: DashboardOverviewProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Recent Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Formations en cours</CardTitle>
            <CardDescription>
              Continuez votre progression
            </CardDescription>
          </CardHeader>
          <CardContent>
            {enrollments.filter(e => e.status === 'active').length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  Aucune formation en cours.
                </p>
                <Button asChild>
                  <a href="/curriculum">Découvrir nos formations</a>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {enrollments.filter(e => e.status === 'active').slice(0, 3).map((enrollment) => (
                  <CourseProgressCard key={enrollment.id} enrollment={enrollment} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Prochains rendez-vous</CardTitle>
            <CardDescription>
              Vos consultations programmées
            </CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.filter(a => a.status !== 'cancelled').length === 0 ? (
              <div className="text-center py-6">
                <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 mb-3">
                  Aucun rendez-vous programmé.
                </p>
                <Button size="sm" asChild>
                  <a href="/appointment">Prendre rendez-vous</a>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.filter(a => a.status !== 'cancelled').slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{appointment.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(appointment.appointment_date).toLocaleDateString()} à {appointment.appointment_time}
                      </p>
                    </div>
                    <Badge variant={
                      appointment.status === 'confirmed' ? 'default' : 'secondary'
                    }>
                      {appointment.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Profile Sidebar */}
      <div>
        <UserProfileCard />
      </div>
    </div>
  );
};

export default DashboardOverview;