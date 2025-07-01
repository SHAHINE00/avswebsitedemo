
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, User, Clock, Award, TrendingUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';

interface Enrollment {
  id: string;
  course_id: string;
  enrolled_at: string;
  status: string;
  progress_percentage: number;
  last_accessed_at: string | null;
  completion_date: string | null;
  courses: {
    title: string;
    subtitle: string | null;
    duration: string | null;
  };
}

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
  status: string;
  subject: string | null;
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch course enrollments
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses(title, subtitle, duration)
        `)
        .eq('user_id', user?.id)
        .order('enrolled_at', { ascending: false });

      if (enrollmentError) throw enrollmentError;

      // Fetch appointments
      const { data: appointmentData, error: appointmentError } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user?.id)
        .order('appointment_date', { ascending: false });

      if (appointmentError) throw appointmentError;

      setEnrollments(enrollmentData || []);
      setAppointments(appointmentData || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos données.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      paused: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-orange-100 text-orange-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status === 'active' ? 'Actif' : 
         status === 'completed' ? 'Terminé' : 
         status === 'paused' ? 'En pause' :
         status === 'pending' ? 'En attente' :
         status === 'confirmed' ? 'Confirmé' :
         status === 'cancelled' ? 'Annulé' : status}
      </Badge>
    );
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Welcome Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tableau de bord
              </h1>
              <p className="text-gray-600">
                Bienvenue, {user.email}
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-academy-blue" />
                    <div>
                      <p className="text-2xl font-bold">{enrollments.length}</p>
                      <p className="text-sm text-gray-600">Formations inscrites</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8 text-academy-purple" />
                    <div>
                      <p className="text-2xl font-bold">
                        {enrollments.filter(e => e.status === 'completed').length}
                      </p>
                      <p className="text-sm text-gray-600">Formations terminées</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{appointments.length}</p>
                      <p className="text-sm text-gray-600">Rendez-vous</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Course Enrollments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Mes formations
                </CardTitle>
                <CardDescription>
                  Suivez votre progression dans vos formations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Chargement...</p>
                ) : enrollments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Vous n'êtes inscrit à aucune formation.</p>
                    <Button asChild>
                      <a href="/curriculum">Découvrir les formations</a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrollments.map((enrollment) => (
                      <div key={enrollment.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {enrollment.courses.title}
                            </h3>
                            {enrollment.courses.subtitle && (
                              <p className="text-gray-600 text-sm">
                                {enrollment.courses.subtitle}
                              </p>
                            )}
                          </div>
                          {getStatusBadge(enrollment.status)}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progression</span>
                            <span>{enrollment.progress_percentage}%</span>
                          </div>
                          <Progress value={enrollment.progress_percentage} className="h-2" />
                        </div>
                        
                        <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
                          <span>
                            Inscrit le {new Date(enrollment.enrolled_at).toLocaleDateString('fr-FR')}
                          </span>
                          {enrollment.courses.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {enrollment.courses.duration}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Mes rendez-vous
                </CardTitle>
                <CardDescription>
                  Gérez vos rendez-vous et consultations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Aucun rendez-vous programmé.</p>
                    <Button asChild>
                      <a href="/appointment">Prendre rendez-vous</a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">
                              {appointment.subject || 'Consultation'}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {new Date(appointment.appointment_date).toLocaleDateString('fr-FR')} à {appointment.appointment_time}
                            </p>
                          </div>
                          {getStatusBadge(appointment.status)}
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          Type: {appointment.appointment_type === 'phone' ? 'Téléphone' : 
                                appointment.appointment_type === 'video' ? 'Visioconférence' : 'Présentiel'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
