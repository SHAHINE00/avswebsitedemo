
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAppointmentBooking } from '@/hooks/useAppointmentBooking';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, BookOpen, Clock, CheckCircle, User, Settings, LogOut } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ErrorBoundary from '@/components/ui/error-boundary';

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

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { getUserAppointments } = useAppointmentBooking();
  
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      window.location.href = '/auth';
      return;
    }
    
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching dashboard data for user:', user.id);
      
      // Fetch enrollments
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (
            title,
            subtitle,
            duration
          )
        `)
        .eq('user_id', user.id)
        .order('enrolled_at', { ascending: false });

      if (enrollmentError) {
        console.error('Error fetching enrollments:', enrollmentError);
        throw enrollmentError;
      }

      console.log('Enrollments fetched:', enrollmentData);
      setEnrollments(enrollmentData || []);

      // Fetch appointments
      const appointmentData = await getUserAppointments();
      console.log('Appointments fetched:', appointmentData);
      setAppointments(appointmentData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Erreur lors du chargement des données');
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger vos données. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchDashboardData}>Réessayer</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tableau de bord
              </h1>
              <p className="text-gray-600">
                Bienvenue, {user.email}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Formations inscrites
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{enrollments.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Rendez-vous programmés
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {appointments.filter(apt => apt.status === 'pending' || apt.status === 'confirmed').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Formations complétées
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {enrollments.filter(e => e.status === 'completed').length}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enrollments */}
            <Card>
              <CardHeader>
                <CardTitle>Mes Formations</CardTitle>
                <CardDescription>
                  Suivez votre progression dans vos formations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {enrollments.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">
                      Vous n'êtes inscrit à aucune formation pour le moment.
                    </p>
                    <Button asChild>
                      <a href="/curriculum">Découvrir nos formations</a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrollments.map((enrollment) => (
                      <div key={enrollment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">
                              {enrollment.courses.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {enrollment.courses.subtitle}
                            </p>
                          </div>
                          <Badge variant={enrollment.status === 'active' ? 'default' : 'secondary'}>
                            {enrollment.status === 'active' ? 'En cours' : 
                             enrollment.status === 'completed' ? 'Terminé' : 
                             enrollment.status}
                          </Badge>
                        </div>
                        <div className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progression</span>
                            <span>{enrollment.progress_percentage}%</span>
                          </div>
                          <Progress value={enrollment.progress_percentage} className="h-2" />
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>Durée: {enrollment.courses.duration}</span>
                          <span>Inscrit le {new Date(enrollment.enrolled_at).toLocaleDateString()}</span>
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
                <CardTitle>Mes Rendez-vous</CardTitle>
                <CardDescription>
                  Vos consultations programmées
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">
                      Aucun rendez-vous programmé.
                    </p>
                    <Button asChild>
                      <a href="/appointment">Prendre rendez-vous</a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.slice(0, 5).map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{appointment.subject}</h3>
                            <p className="text-sm text-gray-600">
                              {appointment.appointment_type === 'phone' ? 'Téléphone' :
                               appointment.appointment_type === 'video' ? 'Visioconférence' :
                               'Au bureau'}
                            </p>
                          </div>
                          <Badge variant={
                            appointment.status === 'confirmed' ? 'default' :
                            appointment.status === 'pending' ? 'secondary' :
                            appointment.status === 'cancelled' ? 'destructive' :
                            'outline'
                          }>
                            {appointment.status === 'confirmed' ? 'Confirmé' :
                             appointment.status === 'pending' ? 'En attente' :
                             appointment.status === 'cancelled' ? 'Annulé' :
                             appointment.status}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(appointment.appointment_date).toLocaleDateString()} à {appointment.appointment_time}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
