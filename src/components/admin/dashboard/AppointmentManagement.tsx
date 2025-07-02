import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, User, Phone, Video, Building, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface Appointment {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type: 'phone' | 'video' | 'office';
  subject: string;
  message: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
}

const AppointmentManagement: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) throw error;
      
      // Type cast the data to ensure TypeScript compatibility
      const typedAppointments = (data || []).map(appointment => ({
        ...appointment,
        appointment_type: appointment.appointment_type as 'phone' | 'video' | 'office',
        status: appointment.status as 'pending' | 'confirmed' | 'cancelled' | 'completed'
      }));
      
      setAppointments(typedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les rendez-vous",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      setUpdatingStatus(appointmentId);
      const { error } = await supabase.rpc('update_appointment_status', {
        appointment_id: appointmentId,
        new_status: newStatus,
      });

      if (error) throw error;

      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: newStatus as any }
            : apt
        )
      );

      toast({
        title: "Statut mis à jour",
        description: `Le rendez-vous a été marqué comme ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'secondary' as const, icon: AlertCircle },
      confirmed: { label: 'Confirmé', variant: 'default' as const, icon: CheckCircle },
      cancelled: { label: 'Annulé', variant: 'destructive' as const, icon: XCircle },
      completed: { label: 'Terminé', variant: 'outline' as const, icon: CheckCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || AlertCircle;

    return (
      <Badge variant={config?.variant || 'secondary'} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config?.label || status}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'office': return <Building className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getStats = () => {
    const total = appointments.length;
    const pending = appointments.filter(apt => apt.status === 'pending').length;
    const confirmed = appointments.filter(apt => apt.status === 'confirmed').length;
    const completed = appointments.filter(apt => apt.status === 'completed').length;

    return { total, pending, confirmed, completed };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminés</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Rendez-vous</CardTitle>
          <CardDescription>Gérez les demandes de rendez-vous des utilisateurs</CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun rendez-vous trouvé
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date & Heure</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {appointment.first_name} {appointment.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(appointment.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{appointment.email}</div>
                        <div className="text-muted-foreground">{appointment.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div>{new Date(appointment.appointment_date).toLocaleDateString('fr-FR')}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {appointment.appointment_time}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(appointment.appointment_type)}
                        <span className="capitalize">{appointment.appointment_type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{appointment.subject || 'Non spécifié'}</div>
                        {appointment.message && (
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {appointment.message}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(appointment.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {appointment.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                            disabled={updatingStatus === appointment.id}
                          >
                            {updatingStatus === appointment.id ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              'Confirmer'
                            )}
                          </Button>
                        )}
                        {appointment.status === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                            disabled={updatingStatus === appointment.id}
                          >
                            {updatingStatus === appointment.id ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              'Terminer'
                            )}
                          </Button>
                        )}
                        {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                            disabled={updatingStatus === appointment.id}
                          >
                            {updatingStatus === appointment.id ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              'Annuler'
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentManagement;
