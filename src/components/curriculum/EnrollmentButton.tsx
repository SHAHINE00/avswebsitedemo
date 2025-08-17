
import React from 'react';
import { useSafeState, useSafeEffect } from '@/utils/safeHooks';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useEnrollment } from '@/hooks/useEnrollment';
import { CheckCircle, BookOpen, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EnrollmentConfirmationModal from './EnrollmentConfirmationModal';
import { logInfo, logError } from '@/utils/logger';

interface EnrollmentButtonProps {
  courseId: string;
  linkTo: string;
  courseTitle?: string;
  courseDuration?: string;
}

const EnrollmentButton: React.FC<EnrollmentButtonProps> = ({ 
  courseId, 
  linkTo, 
  courseTitle = "Formation", 
  courseDuration 
}) => {
  const { user } = useAuth();
  const { enrollInCourse, checkEnrollmentStatus, loading } = useEnrollment();
  const [isEnrolled, setIsEnrolled] = useSafeState(false);
  const [checkingStatus, setCheckingStatus] = useSafeState(true);
  const [showConfirmation, setShowConfirmation] = useSafeState(false);
  const navigate = useNavigate();

  useSafeEffect(() => {
    const checkStatus = async () => {
      logInfo('Starting enrollment check for course:', { courseId, userId: user?.id });
      setCheckingStatus(true);
      
      if (user && courseId) {
        try {
          const enrolled = await checkEnrollmentStatus(courseId);
          logInfo('Enrollment check result:', { enrolled });
          setIsEnrolled(enrolled);
        } catch (error) {
          logError('Error checking enrollment status:', error);
          setIsEnrolled(false);
        }
      } else {
        logInfo('No user or courseId available - not enrolled');
        setIsEnrolled(false);
      }
      
      setCheckingStatus(false);
      logInfo('Enrollment check completed');
    };

    checkStatus();
  }, [user, courseId, checkEnrollmentStatus]);

  const handleEnrollment = async () => {
    if (!user) {
      // Redirect to authentication
      navigate('/auth');
      return;
    }

    // Start enrollment process
    const success = await enrollInCourse(courseId);
    
    if (success) {
      // Enrollment successful
      setIsEnrolled(true);
      setShowConfirmation(true);
    }
  };

  const handleViewDashboard = () => {
    setShowConfirmation(false);
    navigate('/dashboard');
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
        onClick={() => navigate('/dashboard')}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Inscrit - Voir le tableau de bord
      </Button>
    );
  }

  return (
    <>
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

      <EnrollmentConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        courseTitle={courseTitle}
        courseDuration={courseDuration}
        onViewDashboard={handleViewDashboard}
      />
    </>
  );
};

export default EnrollmentButton;
