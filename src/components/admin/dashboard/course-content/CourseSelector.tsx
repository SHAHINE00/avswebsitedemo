import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import type { Course } from '@/hooks/useCourses';

interface CourseSelectorProps {
  courses: Course[];
  selectedCourseId: string;
  onCourseChange: (courseId: string) => void;
  selectedCourse?: Course;
}

const CourseSelector = ({ courses, selectedCourseId, onCourseChange, selectedCourse }: CourseSelectorProps) => {
  if (courses.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun cours disponible</h3>
          <p className="text-muted-foreground">
            Créez d'abord des cours pour gérer leur contenu.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion du contenu des cours</h2>
          <p className="text-muted-foreground">
            Gérez les leçons, matériaux et annonces de vos cours
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedCourseId}
            onChange={(e) => onCourseChange(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedCourse && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {selectedCourse.title}
            </CardTitle>
            <CardDescription>{selectedCourse.subtitle}</CardDescription>
          </CardHeader>
        </Card>
      )}
    </>
  );
};

export default CourseSelector;