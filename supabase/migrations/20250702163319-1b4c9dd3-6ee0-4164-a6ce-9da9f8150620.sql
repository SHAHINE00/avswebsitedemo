-- Create the get_advanced_analytics function
CREATE OR REPLACE FUNCTION public.get_advanced_analytics(
  p_start_date date DEFAULT (CURRENT_DATE - '30 days'::interval),
  p_end_date date DEFAULT CURRENT_DATE,
  p_metric_types text[] DEFAULT NULL::text[]
)
RETURNS TABLE(date date, metric_type text, metric_name text, value numeric, metadata jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Check if user is admin
  IF NOT check_admin_role() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT 
    a.date,
    a.metric_type,
    a.metric_name,
    a.value,
    a.metadata
  FROM analytics_data a
  WHERE a.date BETWEEN p_start_date AND p_end_date
    AND (p_metric_types IS NULL OR a.metric_type = ANY(p_metric_types))
  ORDER BY a.date DESC, a.created_at DESC;
END;
$function$;

-- Function to track analytics data
CREATE OR REPLACE FUNCTION public.track_analytics(
  p_metric_type text,
  p_metric_name text,
  p_value numeric,
  p_metadata jsonb DEFAULT NULL,
  p_date date DEFAULT CURRENT_DATE
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.analytics_data (metric_type, metric_name, value, metadata, date)
  VALUES (p_metric_type, p_metric_name, p_value, p_metadata, p_date)
  ON CONFLICT (date, metric_type, metric_name) 
  DO UPDATE SET 
    value = EXCLUDED.value,
    metadata = EXCLUDED.metadata,
    created_at = now();
END;
$function$;

-- Add unique constraint to prevent duplicate metrics for same date
ALTER TABLE public.analytics_data 
ADD CONSTRAINT analytics_data_unique_metric 
UNIQUE (date, metric_type, metric_name);

-- Trigger function to automatically track enrollment analytics
CREATE OR REPLACE FUNCTION public.track_enrollment_analytics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Track daily enrollments
  PERFORM track_analytics(
    'course_engagement',
    'daily_enrollments',
    1,
    jsonb_build_object('course_id', NEW.course_id, 'user_id', NEW.user_id)
  );
  
  RETURN NEW;
END;
$function$;

-- Create trigger for enrollment analytics
DROP TRIGGER IF EXISTS enrollment_analytics_trigger ON course_enrollments;
CREATE TRIGGER enrollment_analytics_trigger
  AFTER INSERT ON course_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION track_enrollment_analytics();

-- Trigger function to track course completion analytics
CREATE OR REPLACE FUNCTION public.track_completion_analytics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Only track when status changes to completed
  IF OLD.status != 'completed' AND NEW.status = 'completed' THEN
    PERFORM track_analytics(
      'course_engagement',
      'daily_completions',
      1,
      jsonb_build_object('course_id', NEW.course_id, 'user_id', NEW.user_id)
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for completion analytics
DROP TRIGGER IF EXISTS completion_analytics_trigger ON course_enrollments;
CREATE TRIGGER completion_analytics_trigger
  AFTER UPDATE ON course_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION track_completion_analytics();

-- Seed some sample analytics data for the last 30 days
DO $$
DECLARE
  current_date_iter date;
  random_enrollments integer;
  random_completions integer;
  random_active_users integer;
BEGIN
  -- Generate data for the last 30 days
  FOR current_date_iter IN 
    SELECT generate_series(CURRENT_DATE - interval '30 days', CURRENT_DATE, interval '1 day')::date
  LOOP
    -- Random enrollments (0-15 per day)
    random_enrollments := floor(random() * 15)::integer;
    INSERT INTO analytics_data (date, metric_type, metric_name, value, metadata)
    VALUES (current_date_iter, 'course_engagement', 'daily_enrollments', random_enrollments, '{}')
    ON CONFLICT DO NOTHING;
    
    -- Random completions (0-8 per day)
    random_completions := floor(random() * 8)::integer;
    INSERT INTO analytics_data (date, metric_type, metric_name, value, metadata)
    VALUES (current_date_iter, 'course_engagement', 'daily_completions', random_completions, '{}')
    ON CONFLICT DO NOTHING;
    
    -- Random active users (5-50 per day)
    random_active_users := 5 + floor(random() * 45)::integer;
    INSERT INTO analytics_data (date, metric_type, metric_name, value, metadata)
    VALUES (current_date_iter, 'user_activity', 'daily_active_users', random_active_users, '{}')
    ON CONFLICT DO NOTHING;
    
    -- Random page views (50-200 per day)
    INSERT INTO analytics_data (date, metric_type, metric_name, value, metadata)
    VALUES (current_date_iter, 'user_activity', 'daily_page_views', 50 + floor(random() * 150)::integer, '{}')
    ON CONFLICT DO NOTHING;
    
    -- Random system performance metrics
    INSERT INTO analytics_data (date, metric_type, metric_name, value, metadata)
    VALUES (current_date_iter, 'system_performance', 'avg_response_time', 100 + floor(random() * 200)::integer, '{"unit": "ms"}')
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;