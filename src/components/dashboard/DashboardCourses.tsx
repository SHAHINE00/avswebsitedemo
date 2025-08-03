import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import CourseProgressCard from '@/components/user/CourseProgressCard';

interface Enrollment {
  id: string;
  course_id: string;
  enrolled_at: string;
  status: string;
  progress_percentage: number;
  courses: {
    title: string;
    subtitle: string;
    duration: string;
  };
}

interface DashboardCoursesProps {
  enrollments: Enrollment[];
}

const DashboardCourses = ({ enrollments }: DashboardCoursesProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {enrollments.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune formation</h3>
          <p className="text-gray-500 mb-6">
            Vous n'êtes inscrit à aucune formation pour le moment.
          </p>
          <Button asChild>
            <Link to="/curriculum">Découvrir nos formations</Link>
          </Button>
        </div>
      ) : (
        enrollments.map((enrollment) => (
          <CourseProgressCard key={enrollment.id} enrollment={enrollment} />
        ))
      )}
    </div>
  );
};

export default DashboardCourses;