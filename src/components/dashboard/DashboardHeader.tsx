import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  userName: string;
  onSettingsClick: () => void;
  onSignOut: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  onSettingsClick,
  onSignOut
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Bienvenue, {userName}
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onSettingsClick}>
          <Settings className="w-4 h-4 mr-2" />
          Paramètres
        </Button>
        <Button variant="outline" size="sm" onClick={onSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;