import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { Notification } from '@/hooks/useNotifications';

interface DashboardNotificationsProps {
  notifications: Notification[];
  markAsRead: (notificationId: string) => Promise<void>;
}

const DashboardNotifications = ({ notifications, markAsRead }: DashboardNotificationsProps) => {
  return (
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
  );
};

export default DashboardNotifications;