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