import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Target,
  Activity
} from 'lucide-react';
import { useAutoStudyTracking } from '@/hooks/useAutoStudyTracking';
import { useRealTimeData } from '@/hooks/useRealTimeData';
import { useEnhancedLearning } from '@/hooks/useEnhancedLearning';
import QuizPlayer from '@/components/enhanced-learning/QuizPlayer';

interface Lesson {
  id: string;
  title: string;
  description?: string;
  content: string;
  video_url?: string;
  duration_minutes?: number;
  status: string;
}

interface Course {
  id: string;
  title: string;
  subtitle?: string;
  status: string;
}

interface EnhancedCoursePlayerProps {
  course: Course;
  lesson: Lesson;
  onLessonComplete?: (lessonId: string) => void;
  onProgressUpdate?: (progress: number) => void;
}

const EnhancedCoursePlayer: React.FC<EnhancedCoursePlayerProps> = ({
  course,
  lesson,
  onLessonComplete,
  onProgressUpdate
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSection, setCurrentSection] = useState<'content' | 'quiz'>('content');
  const [lessonProgress, setLessonProgress] = useState(0);
  
  const { 
    startTracking, 
    stopTracking, 
    pauseTracking, 
    resumeTracking, 
    isTracking 
  } = useAutoStudyTracking({
    courseId: course.id,
    lessonId: lesson.id,
    autoSaveInterval: 30000 // Save every 30 seconds
  });

  const { setupRealTimeSubscriptions } = useRealTimeData();

  useEffect(() => {
    // Set up real-time subscriptions for this lesson
    const channel = setupRealTimeSubscriptions();
    
    return () => {
      if (channel) {
        // Cleanup handled by hook
      }
    };
  }, [setupRealTimeSubscriptions]);

  useEffect(() => {
    // Auto-start tracking when lesson begins
    if (isPlaying && !isTracking) {
      startTracking();
    } else if (!isPlaying && isTracking) {
      pauseTracking();
    }
  }, [isPlaying, isTracking, startTracking, pauseTracking]);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      pauseTracking();
    } else {
      setIsPlaying(true);
      if (isTracking) {
        resumeTracking();
      } else {
        startTracking();
      }
    }
  };

  const handleLessonComplete = async () => {
    try {
      stopTracking();
      setLessonProgress(100);
      onProgressUpdate?.(100);
      onLessonComplete?.(lesson.id);
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

  const handleQuizComplete = () => {
    handleLessonComplete();
  };

  const handleSectionChange = (section: 'content' | 'quiz') => {
    if (section === 'quiz' && isPlaying) {
      setIsPlaying(false);
      pauseTracking();
    }
    setCurrentSection(section);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Course Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {lesson.title}
              </CardTitle>
              <p className="text-muted-foreground mt-1">{course.title}</p>
            </div>
            <div className="flex items-center gap-2">
              {isTracking && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Activity className="w-3 h-3 animate-pulse" />
                  Session active
                </Badge>
              )}
              {lesson.duration_minutes && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {lesson.duration_minutes} min
                </Badge>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progression de la leçon</span>
              <span>{Math.round(lessonProgress)}%</span>
            </div>
            <Progress value={lessonProgress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex gap-2">
        <Button
          variant={currentSection === 'content' ? 'default' : 'outline'}
          onClick={() => handleSectionChange('content')}
          className="flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          Contenu
        </Button>
        <Button
          variant={currentSection === 'quiz' ? 'default' : 'outline'}
          onClick={() => handleSectionChange('quiz')}
          className="flex items-center gap-2"
        >
          <Target className="w-4 h-4" />
          Quiz
        </Button>
      </div>

      {/* Content Section */}
      {currentSection === 'content' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Contenu de la leçon</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlayPause}
                  className="flex items-center gap-2"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Commencer
                    </>
                  )}
                </Button>
                
                {lessonProgress >= 90 && (
                  <Button
                    onClick={handleLessonComplete}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Marquer comme terminé
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Video Player (if video_url exists) */}
            {lesson.video_url && (
              <div className="mb-6 aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Video Player Placeholder</p>
                  <p className="text-sm text-gray-400">{lesson.video_url}</p>
                </div>
              </div>
            )}
            
            {/* Lesson Content */}
            <div className="prose max-w-none">
              {lesson.description && (
                <p className="text-lg text-muted-foreground mb-4">
                  {lesson.description}
                </p>
              )}
              <div 
                className="space-y-4"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quiz Section */}
      {currentSection === 'quiz' && (
        <QuizPlayer
          lessonId={lesson.id}
          courseId={course.id}
          onQuizComplete={handleQuizComplete}
        />
      )}
    </div>
  );
};

export default EnhancedCoursePlayer;