
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useEnrollment } from '@/hooks/useEnrollment';
import { CheckCircle, BookOpen, Loader2 } from 'lucide-react';

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
      console.log('Checking enrollment status for:', courseId);
      setCheckingStatus(true);
      
      if (user && courseId) {
        try {
          const enrolled = await checkEnrollmentStatus(courseId);
          console.log('Enrollment status result:', enrolled);
          setIsEnrolled(enrolled);
        } catch (error) {
          console.error('Error in useEffect checkStatus:', error);
          setIsEnrolled(false);
        }
      } else {
        console.log('No user or courseId, setting enrolled to false');
        setIsEnrolled(false);
      }
      
      setCheckingStatus(false);
    };

    checkStatus();
  }, [user, courseId, checkEnrollmentStatus]);

  const handleEnrollment = async () => {
    if (!user) {
      console.log('No user, redirecting to auth');
      window.location.href = '/auth';
      return;
    }

    console.log('Starting enrollment process for course:', courseId);
    const success = await enrollInCourse(courseId);
    
    if (success) {
      console.log('Enrollment successful, updating UI');
      setIsEnrolled(true);
    }
  };

  if (checkingStatus) {
    return (
      <Button disabled className="w-full">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Inscription...
          </>
        ) : (
          <>
            <BookOpen className="w-4 h-4 mr-2" />
            S'inscrire à la formation
          </>
        )}
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
