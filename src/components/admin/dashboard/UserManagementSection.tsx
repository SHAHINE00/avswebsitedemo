import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import ComprehensiveUserManagement from './ComprehensiveUserManagement';

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
            Gérez les utilisateurs et leurs permissions
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="mt-6">
        <ComprehensiveUserManagement />
      </div>
    </div>
  );
};

export default UserManagementSection;