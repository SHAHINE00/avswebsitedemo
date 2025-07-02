
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, BookOpen, Clock, CheckCircle, User, Settings, LogOut, Bell, Trophy, Heart } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ErrorBoundary from '@/components/ui/error-boundary';
import UserProfileCard from '@/components/user/UserProfileCard';
import CourseProgressCard from '@/components/user/CourseProgressCard';
import { useNotifications } from '@/hooks/useNotifications';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useCourseInteractions } from '@/hooks/useCourseInteractions';

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
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { achievements } = useUserProfile();
  const { bookmarks } = useCourseInteractions();
  
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="courses">Formations</TabsTrigger>
              <TabsTrigger value="notifications" className="relative">
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="achievements">Succès</TabsTrigger>
              <TabsTrigger value="profile">Profil</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
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
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {enrollments.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune formation</h3>
                    <p className="text-gray-500 mb-6">
                      Vous n'êtes inscrit à aucune formation pour le moment.
                    </p>
                    <Button asChild>
                      <a href="/curriculum">Découvrir nos formations</a>
                    </Button>
                  </div>
                ) : (
                  enrollments.map((enrollment) => (
                    <CourseProgressCard key={enrollment.id} enrollment={enrollment} />
                  ))
                )}
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                  <CardDescription>
                    Restez informé de vos activités
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {notifications.length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Aucune notification</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={`p-4 rounded-lg border ${!notification.is_read ? 'bg-accent/20 border-primary/20' : ''}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium">{notification.title}</h4>
                            <span className="text-sm text-muted-foreground">
                              {new Date(notification.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          {!notification.is_read && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Marquer comme lu
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Succès et Réalisations
                  </CardTitle>
                  <CardDescription>
                    Vos accomplissements dans vos formations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {achievements.length === 0 ? (
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Aucun succès débloqué pour le moment</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {achievements.map((achievement) => (
                        <div key={achievement.id} className="p-4 rounded-lg border bg-accent/10">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                              <Trophy className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{achievement.achievement_title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(achievement.achieved_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {achievement.achievement_description && (
                            <p className="text-sm text-muted-foreground">
                              {achievement.achievement_description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UserProfileCard />
                
                {/* Bookmarked Courses */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Formations favorites
                    </CardTitle>
                    <CardDescription>
                      Vos formations mises en favoris
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {bookmarks.length === 0 ? (
                      <div className="text-center py-6">
                        <Heart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Aucune formation favorite</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {bookmarks.slice(0, 5).map((bookmark) => (
                          <div key={bookmark.id} className="p-3 rounded-lg border">
                            <p className="font-medium">Formation {bookmark.course_id}</p>
                            <p className="text-sm text-muted-foreground">
                              Ajouté le {new Date(bookmark.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
