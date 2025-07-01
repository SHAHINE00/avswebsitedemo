
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface AdminAccessControlProps {
  isAdmin: boolean;
  loading: boolean;
  children: React.ReactNode;
}

const AdminAccessControl: React.FC<AdminAccessControlProps> = ({
  isAdmin,
  loading,
  children
}) => {
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h1>
            <p className="text-gray-600">Vous n'avez pas les permissions d'administrateur.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminAccessControl;
