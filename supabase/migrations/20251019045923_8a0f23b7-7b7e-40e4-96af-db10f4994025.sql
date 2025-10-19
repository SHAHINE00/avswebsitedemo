-- Create function to analyze student risk factors
CREATE OR REPLACE FUNCTION analyze_student_risk(
  p_course_id UUID
)
RETURNS TABLE(
  student_id UUID,
  student_name TEXT,
  risk_level TEXT,
  risk_score NUMERIC,
  attendance_rate NUMERIC,
  average_grade NUMERIC,
  missing_assignments INTEGER,
  last_activity_days INTEGER,
  recommendations JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prof_id UUID;
BEGIN
  prof_id := get_professor_id(auth.uid());
  
  IF NOT (
    is_admin(auth.uid()) OR 
    EXISTS (SELECT 1 FROM teaching_assignments WHERE professor_id = prof_id AND course_id = p_course_id)
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  WITH student_stats AS (
    SELECT 
      ce.user_id as student_id,
      COALESCE(p.full_name, p.email) as student_name,
      -- Attendance metrics
      COUNT(DISTINCT CASE WHEN a.status = 'present' THEN a.attendance_date END)::NUMERIC / 
        NULLIF(COUNT(DISTINCT a.attendance_date), 0) * 100 as attendance_rate,
      -- Grade metrics
      AVG(g.grade / NULLIF(g.max_grade, 0) * 100) as average_grade,
      -- Activity metrics
      EXTRACT(DAY FROM (NOW() - MAX(GREATEST(
        COALESCE(a.created_at, '1900-01-01'::timestamp),
        COALESCE(g.graded_at, '1900-01-01'::timestamp)
      )))) as last_activity_days,
      -- Count of assignments
      COUNT(DISTINCT g.assignment_name) as completed_assignments
    FROM course_enrollments ce
    JOIN profiles p ON p.id = ce.user_id
    LEFT JOIN attendance a ON a.student_id = ce.user_id AND a.course_id = ce.course_id
    LEFT JOIN grades g ON g.student_id = ce.user_id AND g.course_id = ce.course_id
    WHERE ce.course_id = p_course_id
      AND ce.status = 'active'
    GROUP BY ce.user_id, p.full_name, p.email
  ),
  total_assignments AS (
    SELECT COUNT(DISTINCT assignment_name) as total_count
    FROM grades
    WHERE course_id = p_course_id
  )
  SELECT 
    s.student_id,
    s.student_name,
    CASE 
      WHEN (
        COALESCE(s.attendance_rate, 100) < 60 OR 
        COALESCE(s.average_grade, 100) < 50 OR
        s.last_activity_days > 14
      ) THEN 'high'
      WHEN (
        COALESCE(s.attendance_rate, 100) < 75 OR 
        COALESCE(s.average_grade, 100) < 70 OR
        s.last_activity_days > 7
      ) THEN 'medium'
      ELSE 'low'
    END as risk_level,
    -- Risk score (0-100, higher = more risk)
    LEAST(100, (
      (100 - COALESCE(s.attendance_rate, 100)) * 0.4 +
      (100 - COALESCE(s.average_grade, 100)) * 0.4 +
      (LEAST(s.last_activity_days, 30) / 30.0 * 100) * 0.2
    ))::NUMERIC(5,2) as risk_score,
    COALESCE(s.attendance_rate, 0)::NUMERIC(5,2) as attendance_rate,
    COALESCE(s.average_grade, 0)::NUMERIC(5,2) as average_grade,
    (ta.total_count - s.completed_assignments)::INTEGER as missing_assignments,
    s.last_activity_days::INTEGER,
    jsonb_build_object(
      'attendance_concern', COALESCE(s.attendance_rate, 100) < 75,
      'grade_concern', COALESCE(s.average_grade, 100) < 70,
      'engagement_concern', s.last_activity_days > 7,
      'suggested_actions', 
        CASE 
          WHEN COALESCE(s.attendance_rate, 100) < 60 
          THEN jsonb_build_array('Contacter l''étudiant concernant les absences', 'Vérifier les justificatifs d''absence')
          WHEN COALESCE(s.average_grade, 100) < 50
          THEN jsonb_build_array('Proposer du tutorat', 'Organiser une séance de révision')
          WHEN s.last_activity_days > 14
          THEN jsonb_build_array('Vérifier l''engagement de l''étudiant', 'Envoyer un rappel')
          ELSE jsonb_build_array('Continuer le suivi régulier')
        END
    ) as recommendations
  FROM student_stats s
  CROSS JOIN total_assignments ta
  ORDER BY risk_score DESC;
END;
$$;

-- Create function to get attendance-grade correlation
CREATE OR REPLACE FUNCTION get_attendance_grade_correlation(
  p_course_id UUID
)
RETURNS TABLE(
  correlation_coefficient NUMERIC,
  total_students INTEGER,
  avg_attendance_high_grades NUMERIC,
  avg_attendance_low_grades NUMERIC,
  data_points JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prof_id UUID;
BEGIN
  prof_id := get_professor_id(auth.uid());
  
  IF NOT (
    is_admin(auth.uid()) OR 
    EXISTS (SELECT 1 FROM teaching_assignments WHERE professor_id = prof_id AND course_id = p_course_id)
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  WITH student_metrics AS (
    SELECT 
      ce.user_id,
      -- Attendance rate
      (COUNT(DISTINCT CASE WHEN a.status = 'present' THEN a.attendance_date END)::NUMERIC / 
        NULLIF(COUNT(DISTINCT a.attendance_date), 0) * 100) as attendance_rate,
      -- Average grade percentage
      AVG(g.grade / NULLIF(g.max_grade, 0) * 100) as avg_grade_pct
    FROM course_enrollments ce
    LEFT JOIN attendance a ON a.student_id = ce.user_id AND a.course_id = ce.course_id
    LEFT JOIN grades g ON g.student_id = ce.user_id AND g.course_id = ce.course_id
    WHERE ce.course_id = p_course_id
      AND ce.status = 'active'
    GROUP BY ce.user_id
    HAVING COUNT(DISTINCT a.attendance_date) > 0 AND COUNT(g.id) > 0
  ),
  correlation_calc AS (
    SELECT 
      COUNT(*)::INTEGER as n,
      -- Pearson correlation coefficient
      CASE 
        WHEN STDDEV(attendance_rate) > 0 AND STDDEV(avg_grade_pct) > 0 THEN
          (SUM((attendance_rate - AVG(attendance_rate) OVER()) * (avg_grade_pct - AVG(avg_grade_pct) OVER())) / 
           (COUNT(*) * STDDEV(attendance_rate) * STDDEV(avg_grade_pct)))::NUMERIC(5,3)
        ELSE 0
      END as corr_coef,
      -- Average attendance for high performers (>70% grade)
      AVG(CASE WHEN avg_grade_pct >= 70 THEN attendance_rate END)::NUMERIC(5,2) as high_grade_attendance,
      -- Average attendance for low performers (<70% grade)
      AVG(CASE WHEN avg_grade_pct < 70 THEN attendance_rate END)::NUMERIC(5,2) as low_grade_attendance,
      -- Collect data points for visualization
      jsonb_agg(jsonb_build_object(
        'attendance_rate', attendance_rate,
        'grade', avg_grade_pct
      )) as points
    FROM student_metrics
  )
  SELECT 
    corr_coef as correlation_coefficient,
    n as total_students,
    high_grade_attendance as avg_attendance_high_grades,
    low_grade_attendance as avg_attendance_low_grades,
    points as data_points
  FROM correlation_calc;
END;
$$;

-- Create function to get performance trends over time
CREATE OR REPLACE FUNCTION get_performance_trends(
  p_course_id UUID,
  p_weeks_back INTEGER DEFAULT 12
)
RETURNS TABLE(
  week_start DATE,
  avg_grade NUMERIC,
  avg_attendance_rate NUMERIC,
  total_assignments INTEGER,
  total_sessions INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prof_id UUID;
BEGIN
  prof_id := get_professor_id(auth.uid());
  
  IF NOT (
    is_admin(auth.uid()) OR 
    EXISTS (SELECT 1 FROM teaching_assignments WHERE professor_id = prof_id AND course_id = p_course_id)
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  WITH week_series AS (
    SELECT 
      date_trunc('week', d)::DATE as week_start
    FROM generate_series(
      CURRENT_DATE - (p_weeks_back || ' weeks')::INTERVAL,
      CURRENT_DATE,
      '1 week'::INTERVAL
    ) as d
  )
  SELECT 
    ws.week_start,
    COALESCE(AVG(g.grade / NULLIF(g.max_grade, 0) * 100), 0)::NUMERIC(5,2) as avg_grade,
    COALESCE(
      COUNT(DISTINCT CASE WHEN a.status = 'present' THEN a.id END)::NUMERIC / 
      NULLIF(COUNT(DISTINCT a.id), 0) * 100,
      0
    )::NUMERIC(5,2) as avg_attendance_rate,
    COUNT(DISTINCT g.assignment_name)::INTEGER as total_assignments,
    COUNT(DISTINCT a.attendance_date)::INTEGER as total_sessions
  FROM week_series ws
  LEFT JOIN grades g ON 
    g.course_id = p_course_id AND
    date_trunc('week', g.graded_at::DATE) = ws.week_start
  LEFT JOIN attendance a ON 
    a.course_id = p_course_id AND
    date_trunc('week', a.attendance_date) = ws.week_start
  GROUP BY ws.week_start
  ORDER BY ws.week_start;
END;
$$;