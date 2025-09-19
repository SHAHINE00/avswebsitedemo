-- Create function to track study session
CREATE OR REPLACE FUNCTION public.track_study_session(
  p_course_id UUID,
  p_lesson_id UUID DEFAULT NULL,
  p_duration_minutes INTEGER DEFAULT 0,
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