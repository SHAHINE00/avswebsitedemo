import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, User, TrendingUp } from 'lucide-react';

interface UserStatsProps {
  totalUsers: number;
  admins: number;
  regularUsers: number;
  recentUsers: number;
}

export const UserStats: React.FC<UserStatsProps> = ({
  totalUsers,
  admins,
  regularUsers,
  recentUsers
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            Tous les utilisateurs inscrits
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{admins}</div>
          <p className="text-xs text-muted-foreground">
            Équipe d'administration
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Utilisateurs Standard</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{regularUsers}</div>
          <p className="text-xs text-muted-foreground">
            Utilisateurs normaux
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nouveaux (7j)</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recentUsers}</div>
          <p className="text-xs text-muted-foreground">
            Cette semaine
          </p>
        </CardContent>
      </Card>
    </div>
  );
};