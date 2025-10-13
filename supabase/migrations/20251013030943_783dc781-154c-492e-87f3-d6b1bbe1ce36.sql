-- Create email templates table
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  template_type TEXT NOT NULL DEFAULT 'general',
  variables JSONB DEFAULT '[]'::jsonb,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage email templates"
  ON public.email_templates
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Create student cohorts table
CREATE TABLE IF NOT EXISTS public.student_cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  enrollment_start_date DATE,
  enrollment_end_date DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.student_cohorts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage student cohorts"
  ON public.student_cohorts
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Create automated tasks table
CREATE TABLE IF NOT EXISTS public.automated_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_type TEXT NOT NULL,
  task_status TEXT NOT NULL DEFAULT 'pending',
  scheduled_for TIMESTAMP WITH TIME ZONE,
  executed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.automated_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage automated tasks"
  ON public.automated_tasks
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Generate invoice number function
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num INTEGER;
  invoice_num TEXT;
BEGIN
  -- Get the highest invoice number
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM '\d+') AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.invoices
  WHERE invoice_number ~ '^INV-\d+$';
  
  -- Format as INV-00001
  invoice_num := 'INV-' || LPAD(next_num::TEXT, 5, '0');
  
  RETURN invoice_num;
END;
$$;

-- Get revenue analytics function
CREATE OR REPLACE FUNCTION public.get_revenue_analytics(
  p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '12 months',
  p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  SELECT jsonb_build_object(
    'total_revenue', (
      SELECT COALESCE(SUM(amount), 0)
      FROM payment_transactions
      WHERE payment_status = 'completed'
        AND paid_at BETWEEN p_start_date AND p_end_date
    ),
    'revenue_by_month', (
      SELECT COALESCE(jsonb_agg(month_data ORDER BY month), '[]'::jsonb)
      FROM (
        SELECT 
          DATE_TRUNC('month', paid_at)::DATE as month,
          SUM(amount) as revenue,
          COUNT(*) as transaction_count
        FROM payment_transactions
        WHERE payment_status = 'completed'
          AND paid_at BETWEEN p_start_date AND p_end_date
        GROUP BY DATE_TRUNC('month', paid_at)
      ) month_data
    ),
    'revenue_by_course', (
      SELECT COALESCE(jsonb_agg(course_data), '[]'::jsonb)
      FROM (
        SELECT 
          c.title as course_name,
          COALESCE(SUM(pt.amount), 0) as revenue,
          COUNT(pt.id) as payment_count
        FROM courses c
        LEFT JOIN payment_transactions pt ON pt.course_id = c.id AND pt.payment_status = 'completed'
        WHERE pt.paid_at BETWEEN p_start_date AND p_end_date OR pt.paid_at IS NULL
        GROUP BY c.id, c.title
        HAVING SUM(pt.amount) > 0
        ORDER BY revenue DESC
        LIMIT 10
      ) course_data
    ),
    'revenue_by_method', (
      SELECT COALESCE(jsonb_agg(method_data), '[]'::jsonb)
      FROM (
        SELECT 
          payment_method,
          SUM(amount) as revenue,
          COUNT(*) as transaction_count
        FROM payment_transactions
        WHERE payment_status = 'completed'
          AND paid_at BETWEEN p_start_date AND p_end_date
        GROUP BY payment_method
      ) method_data
    ),
    'average_payment', (
      SELECT COALESCE(AVG(amount), 0)
      FROM payment_transactions
      WHERE payment_status = 'completed'
        AND paid_at BETWEEN p_start_date AND p_end_date
    )
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Get at-risk students function
CREATE OR REPLACE FUNCTION public.get_at_risk_students()
RETURNS TABLE(
  user_id UUID,
  full_name TEXT,
  email TEXT,
  risk_type TEXT,
  risk_details JSONB,
  last_activity TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  -- Students with overdue payments (>30 days)
  SELECT DISTINCT
    p.id,
    p.full_name,
    p.email,
    'overdue_payment'::TEXT,
    jsonb_build_object(
      'days_overdue', EXTRACT(DAY FROM now() - pt.created_at),
      'amount', pt.amount,
      'transaction_id', pt.id
    ),
    pt.created_at
  FROM profiles p
  JOIN payment_transactions pt ON pt.user_id = p.id
  WHERE pt.payment_status = 'pending'
    AND pt.created_at < now() - INTERVAL '30 days'
  
  UNION ALL
  
  -- Students with no login in 14+ days
  SELECT DISTINCT
    p.id,
    p.full_name,
    p.email,
    'inactive'::TEXT,
    jsonb_build_object(
      'days_inactive', EXTRACT(DAY FROM now() - ce.last_accessed_at),
      'course_id', ce.course_id
    ),
    ce.last_accessed_at
  FROM profiles p
  JOIN course_enrollments ce ON ce.user_id = p.id
  WHERE ce.last_accessed_at < now() - INTERVAL '14 days'
    AND ce.status = 'active'
  
  UNION ALL
  
  -- Students stuck on same lesson for >7 days
  SELECT DISTINCT
    p.id,
    p.full_name,
    p.email,
    'stuck_on_lesson'::TEXT,
    jsonb_build_object(
      'days_stuck', EXTRACT(DAY FROM now() - lp.last_accessed_at),
      'lesson_id', lp.lesson_id
    ),
    lp.last_accessed_at
  FROM profiles p
  JOIN lesson_progress lp ON lp.user_id = p.id
  WHERE lp.last_accessed_at < now() - INTERVAL '7 days'
    AND lp.is_completed = false
  
  ORDER BY last_activity ASC;
END;
$$;

-- Get student engagement score function
CREATE OR REPLACE FUNCTION public.get_student_engagement_score(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
  login_count INTEGER;
  lesson_completion_rate NUMERIC;
  avg_time_spent NUMERIC;
  engagement_score NUMERIC;
BEGIN
  IF NOT public.is_admin(auth.uid()) AND auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Calculate login frequency (last 30 days)
  SELECT COUNT(DISTINCT DATE(created_at))
  INTO login_count
  FROM user_activity_logs
  WHERE user_id = p_user_id
    AND action = 'user_login'
    AND created_at >= now() - INTERVAL '30 days';

  -- Calculate lesson completion rate
  SELECT 
    CASE 
      WHEN COUNT(*) > 0 THEN (COUNT(*) FILTER (WHERE is_completed = true)::NUMERIC / COUNT(*)::NUMERIC) * 100
      ELSE 0
    END
  INTO lesson_completion_rate
  FROM lesson_progress
  WHERE user_id = p_user_id;

  -- Calculate average time spent
  SELECT COALESCE(AVG(time_spent_minutes), 0)
  INTO avg_time_spent
  FROM lesson_progress
  WHERE user_id = p_user_id;

  -- Calculate overall engagement score (0-100)
  engagement_score := LEAST(100, (
    (login_count * 3) +
    (lesson_completion_rate * 0.5) +
    (LEAST(avg_time_spent, 60) * 0.5)
  ));

  SELECT jsonb_build_object(
    'engagement_score', ROUND(engagement_score, 2),
    'login_count_30d', login_count,
    'lesson_completion_rate', ROUND(lesson_completion_rate, 2),
    'avg_time_spent_minutes', ROUND(avg_time_spent, 2),
    'engagement_level', 
      CASE 
        WHEN engagement_score >= 75 THEN 'high'
        WHEN engagement_score >= 40 THEN 'medium'
        ELSE 'low'
      END
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Send bulk email function (stub for edge function)
CREATE OR REPLACE FUNCTION public.create_bulk_email_task(
  p_user_ids UUID[],
  p_template_id UUID,
  p_custom_variables JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  task_id UUID;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  INSERT INTO public.automated_tasks (
    task_type,
    task_status,
    metadata
  ) VALUES (
    'bulk_email',
    'pending',
    jsonb_build_object(
      'user_ids', p_user_ids,
      'template_id', p_template_id,
      'custom_variables', p_custom_variables,
      'created_by', auth.uid()
    )
  ) RETURNING id INTO task_id;
  
  RETURN task_id;
END;
$$;