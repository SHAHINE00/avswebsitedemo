
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
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-6 sm:py-8">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 truncate">{title}</h1>
            <p className="text-gray-600 text-sm sm:text-base">{description}</p>
          </div>
          {onCreateCourse && (
            <Button onClick={onCreateCourse} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Nouveau Cours</span>
              <span className="sm:hidden">Nouveau</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
