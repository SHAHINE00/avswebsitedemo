import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Settings, FileText } from 'lucide-react';
import EnhancedCourseManagement from './EnhancedCourseManagement';
import CourseContentManagement from './CourseContentManagement';
import type { Course } from '@/hooks/useCourses';

interface CourseManagementSectionProps {
  courses: Course[];
  onRefresh: () => void;
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
}

const CourseManagementSection: React.FC<CourseManagementSectionProps> = ({
  courses,
  onRefresh,
  onEdit,
  onDelete
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Gestion Complète des Cours
          </CardTitle>
          <CardDescription>
            Gérez vos cours, leur contenu et leurs paramètres depuis cette interface centralisée
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="management" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-full sm:max-w-md">
          <TabsTrigger value="management" className="flex items-center gap-1 sm:gap-2 text-sm">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Gestion</span>
            <span className="sm:hidden">Gérer</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-1 sm:gap-2 text-sm">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Contenu</span>
            <span className="sm:hidden">Contenu</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="management" className="mt-6">
          <EnhancedCourseManagement
            courses={courses}
            onRefresh={onRefresh}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <CourseContentManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseManagementSection;