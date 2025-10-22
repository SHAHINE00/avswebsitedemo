import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar } from 'lucide-react';
import UserProfileCard from '@/components/user/UserProfileCard';
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

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
  status: string;
  subject: string;
}

interface DashboardOverviewProps {
  enrollments: Enrollment[];
  appointments: Appointment[];
}

const DashboardOverview = ({ enrollments, appointments }: DashboardOverviewProps) => {
  const [animationKey, setAnimationKey] = useState(0);

  // Listen for real-time updates and trigger animations
  useEffect(() => {
    const handleRealTimeUpdate = () => {
      setAnimationKey(prev => prev + 1);
    };

    window.addEventListener('enrollmentUpdate', handleRealTimeUpdate);
    window.addEventListener('bookmarkUpdate', handleRealTimeUpdate);

    return () => {
      window.removeEventListener('enrollmentUpdate', handleRealTimeUpdate);
      window.removeEventListener('bookmarkUpdate', handleRealTimeUpdate);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Recent Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Formations en cours</CardTitle>
            <CardDescription>
              Continuez votre progression
            </CardDescription>
          </CardHeader>
          <CardContent>
            {enrollments.filter(e => e.status === 'active').length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  Aucune formation en cours.
                </p>
                <Button asChild>
                  <Link to="/curriculum">Découvrir nos formations</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {enrollments.filter(e => e.status === 'active').slice(0, 3).map((enrollment) => (
                  <div 
                    key={`${enrollment.id}-${animationKey}`}
                    className="transform transition-all duration-500 ease-in-out hover:scale-105"
                  >
                    <CourseProgressCard enrollment={enrollment} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Profile Sidebar */}
      <div>
        <UserProfileCard />
      </div>
    </div>
  );
};

export default DashboardOverview;