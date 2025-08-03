import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// Card skeleton for course cards
export const CourseCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("border rounded-lg p-4 space-y-3", className)}>
    <Skeleton className="h-48 w-full rounded-md" />
    <div className="space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-24 rounded-full" />
    </div>
  </div>
);

// List item skeleton
export const ListItemSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("flex items-center space-x-3 p-3", className)}>
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="space-y-2 flex-1">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-3 w-3/4" />
    </div>
    <Skeleton className="h-6 w-16" />
  </div>
);

// Text content skeleton
export const TextSkeleton: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 3, 
  className 
}) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        className={cn(
          "h-4",
          i === lines - 1 ? "w-2/3" : "w-full"
        )} 
      />
    ))}
  </div>
);

// Form skeleton
export const FormSkeleton: React.FC<{ fields?: number; className?: string }> = ({ 
  fields = 4, 
  className 
}) => (
  <div className={cn("space-y-4", className)}>
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    ))}
    <Skeleton className="h-10 w-32 rounded-md mt-6" />
  </div>
);

// Dashboard skeleton
export const DashboardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("space-y-6", className)}>
    {/* Header */}
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-32 rounded-md" />
    </div>
    
    {/* Stats cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-6 rounded" />
          </div>
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
    
    {/* Content area */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        {Array.from({ length: 4 }).map((_, i) => (
          <ListItemSkeleton key={i} />
        ))}
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="border rounded-lg p-4">
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  </div>
);

// Page skeleton wrapper
export const PageSkeleton: React.FC<{ children?: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn("animate-pulse", className)}>
    {children}
  </div>
);

// Course grid skeleton
export const CourseGridSkeleton: React.FC<{ count?: number; className?: string }> = ({ 
  count = 6, 
  className 
}) => (
  <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
    {Array.from({ length: count }).map((_, i) => (
      <CourseCardSkeleton key={i} />
    ))}
  </div>
);