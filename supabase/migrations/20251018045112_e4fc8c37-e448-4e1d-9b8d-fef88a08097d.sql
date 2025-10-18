-- Create function to get professor dashboard statistics
CREATE OR REPLACE FUNCTION public.get_professor_dashboard_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  prof_id uuid;
  result jsonb;
BEGIN
  -- Get professor ID for current user
  prof_id := get_professor_id(auth.uid());
  
  IF prof_id IS NULL THEN
    RAISE EXCEPTION 'Professor record not found for user';
  END IF;

  -- Build statistics object
  SELECT jsonb_build_object(
    'total_courses', (
      SELECT COUNT(DISTINCT ta.course_id)
      FROM teaching_assignments ta
      WHERE ta.professor_id = prof_id
    ),
    'total_students', (
      SELECT COUNT(DISTINCT ce.user_id)
      FROM teaching_assignments ta
      JOIN course_enrollments ce ON ce.course_id = ta.course_id
      WHERE ta.professor_id = prof_id
    ),
    'attendance_rate', (
      SELECT COALESCE(
        ROUND(
          (COUNT(*) FILTER (WHERE a.status = 'present')::numeric / 
           NULLIF(COUNT(*)::numeric, 0)) * 100, 
          2
        ), 
        0
      )
      FROM attendance a
      JOIN teaching_assignments ta ON ta.course_id = a.course_id
      WHERE ta.professor_id = prof_id
        AND a.attendance_date >= CURRENT_DATE - INTERVAL '30 days'
    ),
    'average_grade', (
      SELECT COALESCE(ROUND(AVG(g.grade), 2), 0)
      FROM grades g
      JOIN teaching_assignments ta ON ta.course_id = g.course_id
      WHERE ta.professor_id = prof_id
    ),
    'recent_announcements', (
      SELECT COUNT(*)
      FROM course_announcements ca
      JOIN teaching_assignments ta ON ta.course_id = ca.course_id
      WHERE ta.professor_id = prof_id
        AND ca.created_at >= CURRENT_DATE - INTERVAL '7 days'
    )
  ) INTO result;

  RETURN result;
END;
$$;