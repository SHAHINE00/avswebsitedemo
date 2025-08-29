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
        <TabsList className="grid w-full grid-cols-2 max-w-full sm:max-w-md">
          <TabsTrigger value="users" className="flex items-center gap-1 sm:gap-2 text-sm">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Utilisateurs</span>
            <span className="sm:hidden">Users</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-1 sm:gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Rendez-vous</span>
            <span className="sm:hidden">RDV</span>
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