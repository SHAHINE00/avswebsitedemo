import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <Loader2 className={cn('animate-spin', sizeClasses[size], className)} />
  );
};

interface LoadingButtonProps {
  loading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  children,
  loadingText = 'Chargement...',
  className
}) => {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {loading && <LoadingSpinner />}
      {loading ? loadingText : children}
    </div>
  );
};

interface FieldLoadingProps {
  loading: boolean;
  children: React.ReactNode;
}

export const FieldLoading: React.FC<FieldLoadingProps> = ({ loading, children }) => {
  if (loading) {
    return (
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
        <LoadingSpinner size="sm" />
        <span className="text-sm text-gray-600">Chargement des options...</span>
      </div>
    );
  }

  return <>{children}</>;
};