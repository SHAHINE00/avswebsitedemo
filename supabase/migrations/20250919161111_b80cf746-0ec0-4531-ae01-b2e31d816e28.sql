-- Create study_sessions table for tracking user study activities
CREATE TABLE public.study_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID,
  lesson_id UUID,
  session_type TEXT NOT NULL DEFAULT 'lesson', -- 'lesson', 'quiz', 'review', 'practice'
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on study_sessions
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for study_sessions
CREATE POLICY "Users can manage their own study sessions"
ON public.study_sessions
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all study sessions"
ON public.study_sessions
FOR SELECT
USING (check_admin_role());

-- Create study_goals table for user goal tracking
CREATE TABLE public.study_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  goal_type TEXT NOT NULL, -- 'weekly_hours', 'monthly_hours', 'course_completion', 'streak'
  target_value INTEGER NOT NULL,
  current_value INTEGER NOT NULL DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'failed', 'paused'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on study_goals
ALTER TABLE public.study_goals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for study_goals
CREATE POLICY "Users can manage their own study goals"
ON public.study_goals
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all study goals"
ON public.study_goals
FOR SELECT
USING (check_admin_role());

-- Create certificates table for digital certificates
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID,
  certificate_type TEXT NOT NULL, -- 'course_completion', 'achievement', 'skill_badge'
  title TEXT NOT NULL,
  description TEXT,
  issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
  certificate_data JSONB NOT NULL, -- Contains certificate details, design info, etc.
  verification_code TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on certificates
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for certificates
CREATE POLICY "Users can view their own certificates"
ON public.certificates
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all certificates"
ON public.certificates
FOR ALL
USING (check_admin_role());

CREATE POLICY "Anyone can verify certificates by code"
ON public.certificates
FOR SELECT
USING (true);

-- Create learning_paths table for personalized learning paths
CREATE TABLE public.learning_paths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  path_data JSONB NOT NULL, -- Contains course sequence, milestones, etc.
  progress_percentage INTEGER NOT NULL DEFAULT 0,
  estimated_duration_weeks INTEGER,
  difficulty_level TEXT NOT NULL DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'paused'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on learning_paths
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for learning_paths
CREATE POLICY "Users can manage their own learning paths"
ON public.learning_paths
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all learning paths"
ON public.learning_paths
FOR SELECT
USING (check_admin_role());

-- Create course_progress_detailed table for granular progress tracking
CREATE TABLE public.course_progress_detailed (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID NOT NULL,
  lesson_id UUID,
  progress_type TEXT NOT NULL, -- 'lesson_start', 'lesson_complete', 'quiz_attempt', 'material_download'
  progress_value NUMERIC DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on course_progress_detailed
ALTER TABLE public.course_progress_detailed ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for course_progress_detailed
CREATE POLICY "Users can manage their own detailed progress"
ON public.course_progress_detailed
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all detailed progress"
ON public.course_progress_detailed
FOR SELECT
USING (check_admin_role());

-- Create notification_preferences table for user notification settings
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email_notifications JSONB NOT NULL DEFAULT '{"study_reminders": true, "goal_updates": true, "certificates": true, "course_updates": true}',
  push_notifications JSONB NOT NULL DEFAULT '{"study_reminders": true, "goal_updates": true, "achievements": true}',
  notification_frequency TEXT NOT NULL DEFAULT 'daily', -- 'immediate', 'daily', 'weekly', 'never'
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '08:00',
  timezone TEXT DEFAULT 'Europe/Paris',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notification_preferences
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notification_preferences
CREATE POLICY "Users can manage their own notification preferences"
ON public.notification_preferences
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_study_goals_updated_at
  BEFORE UPDATE ON public.study_goals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_learning_paths_updated_at
  BEFORE UPDATE ON public.learning_paths
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to track study session
CREATE OR REPLACE FUNCTION public.track_study_session(
  p_course_id UUID,
  p_lesson_id UUID DEFAULT NULL,
  p_duration_minutes INTEGER,
  p_session_type TEXT DEFAULT 'lesson'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_id UUID;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Insert study session
  INSERT INTO public.study_sessions (
    user_id, 
    course_id, 
    lesson_id, 
    session_type, 
    duration_minutes,
    ended_at
  )
  VALUES (
    auth.uid(), 
    p_course_id, 
    p_lesson_id, 
    p_session_type, 
    p_duration_minutes,
    now()
  )
  RETURNING id INTO session_id;

  -- Update study goals progress
  UPDATE public.study_goals
  SET 
    current_value = current_value + p_duration_minutes,
    updated_at = now()
  WHERE 
    user_id = auth.uid() 
    AND goal_type IN ('weekly_hours', 'monthly_hours')
    AND status = 'active'
    AND CURRENT_DATE BETWEEN period_start AND period_end;

  -- Track analytics
  PERFORM track_analytics(
    'study_engagement',
    'session_completed',
    1,
    jsonb_build_object(
      'user_id', auth.uid(),
      'course_id', p_course_id,
      'duration_minutes', p_duration_minutes,
      'session_type', p_session_type
    )
  );

  RETURN session_id;
END;
$$;

-- Create function to generate certificate
CREATE OR REPLACE FUNCTION public.generate_certificate(
  p_course_id UUID,
  p_certificate_type TEXT DEFAULT 'course_completion'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  certificate_id UUID;
  course_title TEXT;
  verification_code TEXT;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Get course title
  SELECT title INTO course_title
  FROM public.courses
  WHERE id = p_course_id;

  -- Generate unique verification code
  verification_code := 'CERT-' || UPPER(SUBSTR(gen_random_uuid()::text, 1, 8));

  -- Insert certificate
  INSERT INTO public.certificates (
    user_id,
    course_id,
    certificate_type,
    title,
    description,
    certificate_data,
    verification_code
  )
  VALUES (
    auth.uid(),
    p_course_id,
    p_certificate_type,
    'Certificat de Réussite - ' || course_title,
    'Certifie la réussite du cours ' || course_title,
    jsonb_build_object(
      'course_title', course_title,
      'completion_date', CURRENT_DATE,
      'certificate_type', p_certificate_type
    ),
    verification_code
  )
  RETURNING id INTO certificate_id;

  -- Create achievement notification
  PERFORM create_notification(
    auth.uid(),
    'Nouveau Certificat Obtenu!',
    'Félicitations! Vous avez obtenu un certificat pour le cours: ' || course_title,
    'achievement',
    '/dashboard?tab=certificates'
  );

  RETURN certificate_id;
END;
$$;

-- Create function to update study goals
CREATE OR REPLACE FUNCTION public.update_study_goal(
  p_goal_id UUID,
  p_target_value INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Update the goal
  UPDATE public.study_goals
  SET 
    target_value = p_target_value,
    updated_at = now()
  WHERE 
    id = p_goal_id 
    AND user_id = auth.uid();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Goal not found or access denied';
  END IF;
END;
$$;

-- Create function to get user study statistics
CREATE OR REPLACE FUNCTION public.get_study_statistics(p_user_id UUID DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id UUID;
  result JSONB;
BEGIN
  -- Use current user if no user specified, or check admin access for other users
  IF p_user_id IS NULL THEN
    target_user_id := auth.uid();
  ELSE
    IF auth.uid() != p_user_id AND NOT check_admin_role() THEN
      RAISE EXCEPTION 'Access denied';
    END IF;
    target_user_id := p_user_id;
  END IF;

  -- Build comprehensive statistics
  SELECT jsonb_build_object(
    'total_study_hours', COALESCE((
      SELECT SUM(duration_minutes) / 60.0
      FROM study_sessions 
      WHERE user_id = target_user_id
    ), 0),
    'weekly_study_hours', COALESCE((
      SELECT SUM(duration_minutes) / 60.0
      FROM study_sessions 
      WHERE user_id = target_user_id 
        AND started_at >= CURRENT_DATE - INTERVAL '7 days'
    ), 0),
    'current_streak', COALESCE((
      SELECT COUNT(DISTINCT DATE(started_at))
      FROM study_sessions s1
      WHERE s1.user_id = target_user_id
        AND DATE(s1.started_at) >= (
          SELECT COALESCE(MAX(break_date), CURRENT_DATE - INTERVAL '365 days')
          FROM (
            SELECT DATE(started_at) + INTERVAL '1 day' as break_date
            FROM study_sessions s2
            WHERE s2.user_id = target_user_id
              AND NOT EXISTS (
                SELECT 1 FROM study_sessions s3
                WHERE s3.user_id = target_user_id
                  AND DATE(s3.started_at) = DATE(s2.started_at) + INTERVAL '1 day'
              )
            ORDER BY started_at DESC
            LIMIT 1
          ) breaks
        )
    ), 0),
    'certificates_earned', (
      SELECT COUNT(*) 
      FROM certificates 
      WHERE user_id = target_user_id AND is_active = true
    ),
    'active_goals', (
      SELECT COUNT(*) 
      FROM study_goals 
      WHERE user_id = target_user_id AND status = 'active'
    ),
    'completed_goals', (
      SELECT COUNT(*) 
      FROM study_goals 
      WHERE user_id = target_user_id AND status = 'completed'
    )
  ) INTO result;

  RETURN result;
END;
$$;