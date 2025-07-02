
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  description: string;
  onCreateCourse?: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title, description, onCreateCourse }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-600">{description}</p>
          </div>
          {onCreateCourse && (
            <Button onClick={onCreateCourse}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Cours
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
