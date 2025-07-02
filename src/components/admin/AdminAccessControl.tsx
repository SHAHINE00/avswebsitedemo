
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface AdminAccessControlProps {
  children: React.ReactNode;
}

const AdminAccessControl: React.FC<AdminAccessControlProps> = ({
  children
}) => {
  return (
    <>{children}</>
  );
};

export default AdminAccessControl;
