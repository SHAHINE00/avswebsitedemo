import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Check, CheckCheck, ExternalLink, Calendar, GraduationCap } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AbsenceJustificationDialog } from './AbsenceJustificationDialog';


const NotificationCenter: React.FC = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [justificationDialogOpen, setJustificationDialogOpen] = useState(false);
  const [selectedAttendanceId, setSelectedAttendanceId] = useState<string | null>(null);
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState<string | null>(null);

  const handleNotificationClick = (notification: any) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  const loadAttendanceData = async () => {
    setAttendanceLoading(true);
    try {
      const { data, error } = await (supabase.rpc as any)('get_student_attendance_with_justifications', {});
      
      if (error) throw error;
      setAttendanceData(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de présence",
        variant: "destructive"
      });
    } finally {
      setAttendanceLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    return <Bell className="h-4 w-4" />;
  };

  if (loading) {
    return <div>Chargement des notifications...</div>;
  }

  return (
    <>
    <Tabs defaultValue="notifications" className="space-y-4">
      <TabsList>
        <TabsTrigger value="notifications">
          <Bell className="h-4 w-4 mr-2" />
          Notifications
        </TabsTrigger>
        <TabsTrigger value="attendance" onClick={loadAttendanceData}>
          <Calendar className="h-4 w-4 mr-2" />
          Présences
        </TabsTrigger>
      </TabsList>

      <TabsContent value="notifications" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Centre de notifications</CardTitle>
                <CardDescription>
                  {unreadCount > 0 ? `${unreadCount} notification(s) non lue(s)` : 'Aucune nouvelle notification'}
                </CardDescription>
              </div>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Tout marquer comme lu
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-2">
          {loading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Chargement...</p>
              </CardContent>
            </Card>
          ) : notifications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Aucune notification</p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card 
                key={notification.id}
                className={`cursor-pointer transition-colors hover:bg-accent ${!notification.is_read ? 'border-l-4 border-l-primary' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${!notification.is_read ? 'bg-primary/10' : 'bg-muted'}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold">{notification.title}</h4>
                        {!notification.is_read && (
                          <Badge variant="default" className="text-xs">Nouveau</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{new Date(notification.created_at).toLocaleDateString('fr-FR', { 
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                        {notification.action_url && (
                          <div className="flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            <span>Voir détails</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {!notification.is_read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="attendance" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Registre de présence</CardTitle>
            <CardDescription>
              Consultez votre historique de présence et soumettez des justifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceLoading ? (
              <p className="text-center py-8 text-muted-foreground">Chargement...</p>
            ) : attendanceData.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Aucun enregistrement de présence
              </p>
            ) : (
              <div className="space-y-3">
                {attendanceData.map((record) => (
                  <div key={record.attendance_id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{record.course_title}</h4>
                        <Badge variant={record.status === 'present' ? 'default' : record.status === 'absent' ? 'destructive' : 'secondary'}>
                          {record.status === 'present' ? 'Présent' : record.status === 'absent' ? 'Absent' : 'Retard'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(record.attendance_date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      {record.justification_id && (
                        <div className="mt-2 text-sm">
                          <Badge variant="outline" className="text-xs">
                            Justification: {record.justification_status === 'pending' ? 'En attente' : 
                                          record.justification_status === 'approved' ? 'Approuvée' : 'Rejetée'}
                          </Badge>
                        </div>
                      )}
                    </div>
                    {record.status === 'absent' && !record.justification_id && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedAttendanceId(record.attendance_id);
                          setSelectedAttendanceDate(record.attendance_date);
                          setJustificationDialogOpen(true);
                        }}
                      >
                        Justifier
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    {selectedAttendanceId && (
      <AbsenceJustificationDialog
        attendanceId={selectedAttendanceId}
        attendanceDate={selectedAttendanceDate || undefined}
        open={justificationDialogOpen}
        onOpenChange={(open) => {
          setJustificationDialogOpen(open);
          if (!open) {
            setSelectedAttendanceId(null);
            setSelectedAttendanceDate(null);
            loadAttendanceData();
          }
        }}
      />
    )}
    </>
  );
};

export default NotificationCenter;
