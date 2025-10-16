-- Fix nested aggregate error in get_student_analytics function
DROP FUNCTION IF EXISTS public.get_student_analytics(date, date);

CREATE OR REPLACE FUNCTION public.get_student_analytics(
  p_start_date date DEFAULT (CURRENT_DATE - INTERVAL '30 days'),
  p_end_date date DEFAULT CURRENT_DATE
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
  total_enrollments integer;
  completed_enrollments integer;
  completion_rate_value numeric;
BEGIN
  -- Check if caller is admin
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Calculate completion rate separately to avoid nested aggregates
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'completed')
  INTO total_enrollments, completed_enrollments
  FROM course_enrollments;

  -- Calculate the rate
  IF total_enrollments > 0 THEN
    completion_rate_value := ROUND((completed_enrollments::numeric / total_enrollments * 100), 2);
  ELSE
    completion_rate_value := 0;
  END IF;

  SELECT jsonb_build_object(
    'total_students', (SELECT COUNT(*) FROM profiles),
    'new_this_month', (SELECT COUNT(*) FROM profiles WHERE created_at >= date_trunc('month', CURRENT_DATE)),
    'active_students', (SELECT COUNT(*) FROM profiles WHERE student_status = 'active'),
    'total_revenue', COALESCE((SELECT SUM(amount) FROM payment_transactions WHERE payment_status = 'completed'), 0),
    'monthly_revenue', (
      SELECT jsonb_agg(jsonb_build_object(
        'month', to_char(date_trunc('month', paid_at), 'Mon YYYY'),
        'revenue', COALESCE(SUM(amount), 0)
      ))
      FROM payment_transactions
      WHERE paid_at BETWEEN p_start_date AND p_end_date
        AND payment_status = 'completed'
      GROUP BY date_trunc('month', paid_at)
      ORDER BY date_trunc('month', paid_at)
    ),
    'enrollments_by_program', (
      SELECT jsonb_agg(jsonb_build_object(
        'program', COALESCE(p.formation_type, 'Unknown'),
        'count', COUNT(*)
      ))
      FROM profiles p
      WHERE p.formation_type IS NOT NULL
      GROUP BY p.formation_type
    ),
    'completion_rate', completion_rate_value,
    'certificates_issued', (SELECT COUNT(*) FROM certificates WHERE is_active = true),
    'payment_status_distribution', (
      SELECT jsonb_agg(jsonb_build_object(
        'status', payment_status,
        'count', COUNT(*),
        'amount', COALESCE(SUM(amount), 0)
      ))
      FROM payment_transactions
      GROUP BY payment_status
    )
  ) INTO result;

  RETURN result;
END;
$$;