import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar } from 'lucide-react';
import ComprehensiveUserManagement from './ComprehensiveUserManagement';
import AppointmentManagement from './AppointmentManagement';

const UserManagementSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Gestion des Utilisateurs
          </CardTitle>
          <CardDescription>
            Gérez les utilisateurs, leurs permissions et leurs rendez-vous
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Rendez-vous
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <ComprehensiveUserManagement />
        </TabsContent>

        <TabsContent value="appointments" className="mt-6">
          <AppointmentManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagementSection;