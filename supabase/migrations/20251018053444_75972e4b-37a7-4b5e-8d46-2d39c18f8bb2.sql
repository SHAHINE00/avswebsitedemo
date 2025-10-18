-- Drop the existing function first
DROP FUNCTION IF EXISTS public.get_professor_dashboard_stats(uuid);

-- Create the get_professor_dashboard_stats function with proper permissions
CREATE OR REPLACE FUNCTION public.get_professor_dashboard_stats(_user_id uuid DEFAULT auth.uid())
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  prof_id uuid;
  result jsonb;
BEGIN
  -- Get professor ID for the user
  SELECT id INTO prof_id FROM public.professors WHERE user_id = _user_id LIMIT 1;
  
  -- If no professor record found, return error
  IF prof_id IS NULL THEN
    RAISE EXCEPTION 'No professor record found for user';
  END IF;

  -- Build statistics
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
      WHERE a.professor_id = prof_id
        AND a.attendance_date >= CURRENT_DATE - INTERVAL '30 days'
    ),
    'average_grade', (
      SELECT COALESCE(ROUND(AVG(g.grade), 2), 0)
      FROM grades g
      WHERE g.professor_id = prof_id
    ),
    'recent_announcements', (
      SELECT COUNT(*)
      FROM course_announcements ca
      WHERE ca.professor_id = prof_id
        AND ca.created_at >= CURRENT_DATE - INTERVAL '7 days'
    )
  ) INTO result;

  RETURN result;
END;
$$;