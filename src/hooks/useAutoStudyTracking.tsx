import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logError } from '@/utils/logger';

interface StudyTrackingOptions {
  courseId?: string;
  lessonId?: string;
  autoSaveInterval?: number; // minutes
  minSessionDuration?: number; // minutes
}

export const useAutoStudyTracking = (options: StudyTrackingOptions = {}) => {
  const { user } = useAuth();
  const {
    courseId,
    lessonId,
    autoSaveInterval = 5, // Save every 5 minutes
    minSessionDuration = 1 // Minimum 1 minute to count as a session
  } = options;

  const startTimeRef = useRef<Date | null>(null);
  const lastActiveRef = useRef<Date>(new Date());
  const accumulatedTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  const isActiveSession = useCallback(() => {
    const now = new Date();
    const timeSinceLastActive = (now.getTime() - lastActiveRef.current.getTime()) / 1000 / 60;
    return timeSinceLastActive < 2; // Consider inactive after 2 minutes
  }, []);

  const trackActivity = useCallback(() => {
    lastActiveRef.current = new Date();
  }, []);

  const saveSession = useCallback(async (isEndingSession = false) => {
    if (!user || !startTimeRef.current || !courseId) return;

    const now = new Date();
    const sessionDuration = Math.floor((now.getTime() - startTimeRef.current.getTime()) / 1000 / 60);
    const totalDuration = accumulatedTimeRef.current + sessionDuration;

    if (totalDuration < minSessionDuration && !isEndingSession) return;

    try {
      if (sessionIdRef.current) {
        // Update existing session
        const { error } = await supabase
          .from('study_sessions')
          .update({
            duration_minutes: totalDuration,
            ended_at: now.toISOString(),
            metadata: {
              auto_tracked: true,
              last_activity: lastActiveRef.current.toISOString(),
              course_id: courseId,
              lesson_id: lessonId
            }
          })
          .eq('id', sessionIdRef.current);

        if (error) throw error;
      } else {
        // Create new session
        const { data, error } = await supabase.rpc('track_study_session', {
          p_course_id: courseId,
          p_lesson_id: lessonId,
          p_duration_minutes: totalDuration,
          p_session_type: lessonId ? 'lesson' : 'course_study'
        });

        if (error) throw error;
        sessionIdRef.current = data;
      }

      // Reset accumulated time after successful save
      if (!isEndingSession) {
        accumulatedTimeRef.current = 0;
        startTimeRef.current = new Date();
      }
    } catch (error) {
      logError('Error saving study session:', error);
    }
  }, [user, courseId, lessonId, minSessionDuration]);

  const startTracking = useCallback(() => {
    if (!user || !courseId) return;

    startTimeRef.current = new Date();
    lastActiveRef.current = new Date();
    accumulatedTimeRef.current = 0;
    sessionIdRef.current = null;

    // Set up auto-save interval
    intervalRef.current = setInterval(() => {
      if (isActiveSession()) {
        saveSession();
      }
    }, autoSaveInterval * 60 * 1000);

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, trackActivity, true);
    });

    console.log('Study tracking started for course:', courseId);
  }, [user, courseId, autoSaveInterval, isActiveSession, saveSession, trackActivity]);

  const stopTracking = useCallback(async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Remove activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.removeEventListener(event, trackActivity, true);
    });

    // Save final session
    if (startTimeRef.current) {
      await saveSession(true);
    }

    // Reset tracking state
    startTimeRef.current = null;
    sessionIdRef.current = null;
    accumulatedTimeRef.current = 0;

    console.log('Study tracking stopped');
  }, [saveSession, trackActivity]);

  const pauseTracking = useCallback(() => {
    if (startTimeRef.current) {
      const now = new Date();
      const sessionDuration = Math.floor((now.getTime() - startTimeRef.current.getTime()) / 1000 / 60);
      accumulatedTimeRef.current += sessionDuration;
      startTimeRef.current = null;
    }
  }, []);

  const resumeTracking = useCallback(() => {
    if (!startTimeRef.current) {
      startTimeRef.current = new Date();
      lastActiveRef.current = new Date();
    }
  }, []);

  // Auto cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  // Auto pause/resume based on page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseTracking();
      } else {
        resumeTracking();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pauseTracking, resumeTracking]);

  return {
    startTracking,
    stopTracking,
    pauseTracking,
    resumeTracking,
    isTracking: !!startTimeRef.current,
    accumulatedTime: accumulatedTimeRef.current
  };
};