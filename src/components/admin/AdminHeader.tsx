
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AdminHeaderProps {
  onCreateCourse: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onCreateCourse }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tableau de Bord Administrateur</h1>
        <p className="text-gray-600">Gérez votre plateforme avec des outils avancés</p>
      </div>
      <Button onClick={onCreateCourse}>
        <Plus className="w-4 h-4 mr-2" />
        Nouveau Cours
      </Button>
    </div>
  );
};

export default AdminHeader;
