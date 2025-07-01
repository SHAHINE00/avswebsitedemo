
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useEnrollment } from '@/hooks/useEnrollment';
import { CheckCircle, BookOpen } from 'lucide-react';

interface EnrollmentButtonProps {
  courseId: string;
  linkTo: string;
}

const EnrollmentButton: React.FC<EnrollmentButtonProps> = ({ courseId, linkTo }) => {
  const { user } = useAuth();
  const { enrollInCourse, checkEnrollmentStatus, loading } = useEnrollment();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      if (user && courseId) {
        const enrolled = await checkEnrollmentStatus(courseId);
        setIsEnrolled(enrolled);
      }
      setCheckingStatus(false);
    };

    checkStatus();
  }, [user, courseId, checkEnrollmentStatus]);

  const handleEnrollment = async () => {
    if (!user) {
      window.location.href = '/auth';
      return;
    }

    const success = await enrollInCourse(courseId);
    if (success) {
      setIsEnrolled(true);
    }
  };

  if (checkingStatus) {
    return (
      <Button disabled className="w-full">
        Vérification...
      </Button>
    );
  }

  if (isEnrolled) {
    return (
      <Button 
        asChild 
        className="w-full bg-green-600 hover:bg-green-700"
      >
        <a href="/dashboard" className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Inscrit - Voir le tableau de bord
        </a>
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <Button 
        onClick={handleEnrollment}
        disabled={loading}
        className="w-full"
      >
        <BookOpen className="w-4 h-4 mr-2" />
        {loading ? 'Inscription...' : 'S\'inscrire à la formation'}
      </Button>
      {linkTo && linkTo !== '#' && (
        <Button 
          asChild 
          variant="outline" 
          className="w-full"
        >
          <a href={linkTo}>
            Voir les détails
          </a>
        </Button>
      )}
    </div>
  );
};

export default EnrollmentButton;
