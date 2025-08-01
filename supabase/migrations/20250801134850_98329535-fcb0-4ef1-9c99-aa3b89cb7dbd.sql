-- Security Hardening: Fix database function search paths
-- This addresses all the security warnings from the linter

-- Fix check_admin_role function
CREATE OR REPLACE FUNCTION public.check_admin_role()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$function$;

-- Fix create_notification function
CREATE OR REPLACE FUNCTION public.create_notification(p_user_id uuid, p_title text, p_message text, p_type text DEFAULT 'general'::text, p_action_url text DEFAULT NULL::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, action_url)
  VALUES (p_user_id, p_title, p_message, p_type, p_action_url)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$function$;

-- Fix mark_notification_read function
CREATE OR REPLACE FUNCTION public.mark_notification_read(p_notification_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.notifications 
  SET is_read = true, read_at = now() 
  WHERE id = p_notification_id AND user_id = auth.uid();
END;
$function$;

-- Fix log_admin_activity function
CREATE OR REPLACE FUNCTION public.log_admin_activity(p_action text, p_entity_type text, p_entity_id uuid DEFAULT NULL::uuid, p_details jsonb DEFAULT NULL::jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.admin_activity_logs (admin_id, action, entity_type, entity_id, details)
  VALUES (auth.uid(), p_action, p_entity_type, p_entity_id, p_details);
END;
$function$;

-- Fix enroll_in_course function
CREATE OR REPLACE FUNCTION public.enroll_in_course(p_course_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  enrollment_id uuid;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Insert enrollment (will fail if already enrolled due to unique constraint)
  INSERT INTO public.course_enrollments (user_id, course_id)
  VALUES (auth.uid(), p_course_id)
  RETURNING id INTO enrollment_id;

  -- Log enrollment activity
  INSERT INTO public.user_activity_logs (user_id, action, details)
  VALUES (auth.uid(), 'course_enrolled', jsonb_build_object('course_id', p_course_id));

  RETURN enrollment_id;
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Already enrolled in this course';
END;
$function$;

-- Fix get_dashboard_metrics function
CREATE OR REPLACE FUNCTION public.get_dashboard_metrics()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  result JSONB;
BEGIN
  -- Check if user is admin
  IF NOT check_admin_role() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  SELECT jsonb_build_object(
    'total_courses', (SELECT COUNT(*) FROM courses),
    'published_courses', (SELECT COUNT(*) FROM courses WHERE status = 'published'),
    'draft_courses', (SELECT COUNT(*) FROM courses WHERE status = 'draft'),
    'archived_courses', (SELECT COUNT(*) FROM courses WHERE status = 'archived'),
    'total_users', (SELECT COUNT(*) FROM profiles),
    'total_admins', (SELECT COUNT(*) FROM profiles WHERE role = 'admin'),
    'recent_users', (SELECT COUNT(*) FROM profiles WHERE created_at >= NOW() - INTERVAL '30 days'),
    'recent_courses', (SELECT COUNT(*) FROM courses WHERE created_at >= NOW() - INTERVAL '30 days'),
    'total_subscribers', (SELECT COUNT(*) FROM subscribers),
    'recent_subscribers', (SELECT COUNT(*) FROM subscribers WHERE created_at >= NOW() - INTERVAL '30 days')
  ) INTO result;
  
  RETURN result;
END;
$function$;

-- Fix get_advanced_analytics function
CREATE OR REPLACE FUNCTION public.get_advanced_analytics(p_start_date date DEFAULT (CURRENT_DATE - '30 days'::interval), p_end_date date DEFAULT CURRENT_DATE, p_metric_types text[] DEFAULT NULL::text[])
RETURNS TABLE(date date, metric_type text, metric_name text, value numeric, metadata jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

-- Fix get_system_health function
CREATE OR REPLACE FUNCTION public.get_system_health()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  result JSONB;
  table_stats JSONB;
BEGIN
  -- Check if user is admin
  IF NOT check_admin_role() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Get table stats with proper column names
  SELECT jsonb_object_agg(table_name, stats) INTO table_stats
  FROM (
    SELECT 
      (schemaname||'.'||relname) as table_name,
      jsonb_build_object(
        'rows', COALESCE(n_tup_ins + n_tup_upd + n_tup_del, 0),
        'size', COALESCE(pg_total_relation_size(schemaname||'.'||relname), 0)
      ) as stats
    FROM pg_stat_user_tables
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname||'.'||relname) DESC NULLS LAST
    LIMIT 10
  ) t;

  -- Build the final result with error handling
  SELECT jsonb_build_object(
    'database_size', COALESCE(pg_database_size(current_database()), 0),
    'active_connections', COALESCE((SELECT count(*) FROM pg_stat_activity WHERE state = 'active'), 0),
    'table_stats', COALESCE(table_stats, '{}'::jsonb),
    'last_updated', now()
  ) INTO result;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    -- Return fallback data if there's an error
    RETURN jsonb_build_object(
      'database_size', 0,
      'active_connections', 0,
      'table_stats', '{}'::jsonb,
      'last_updated', now(),
      'error', SQLERRM
    );
END;
$function$;

-- Fix get_user_statistics function
CREATE OR REPLACE FUNCTION public.get_user_statistics(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_enrollments', (
      SELECT COUNT(*) FROM course_enrollments WHERE user_id = p_user_id
    ),
    'completed_courses', (
      SELECT COUNT(*) FROM course_enrollments 
      WHERE user_id = p_user_id AND status = 'completed'
    ),
    'active_courses', (
      SELECT COUNT(*) FROM course_enrollments 
      WHERE user_id = p_user_id AND status = 'active'
    ),
    'total_achievements', (
      SELECT COUNT(*) FROM user_achievements WHERE user_id = p_user_id
    ),
    'bookmarked_courses', (
      SELECT COUNT(*) FROM course_bookmarks WHERE user_id = p_user_id
    ),
    'avg_progress', (
      SELECT COALESCE(AVG(progress_percentage), 0) 
      FROM course_enrollments 
      WHERE user_id = p_user_id AND status = 'active'
    )
  ) INTO result;
  
  RETURN result;
END;
$function$;

-- Fix track_analytics function
CREATE OR REPLACE FUNCTION public.track_analytics(p_metric_type text, p_metric_name text, p_value numeric, p_metadata jsonb DEFAULT NULL::jsonb, p_date date DEFAULT CURRENT_DATE)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

-- Fix update_appointment_status function
CREATE OR REPLACE FUNCTION public.update_appointment_status(appointment_id uuid, new_status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if user is admin or appointment owner
  IF NOT (check_admin_role() OR EXISTS (
    SELECT 1 FROM public.appointments 
    WHERE id = appointment_id AND user_id = auth.uid()
  )) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  UPDATE public.appointments 
  SET status = new_status, updated_at = now() 
  WHERE id = appointment_id;
END;
$function$;

-- Fix reorder_sections_on_page function
CREATE OR REPLACE FUNCTION public.reorder_sections_on_page(p_page_name text, p_section_key text, p_new_order integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  old_order integer;
  max_order integer;
BEGIN
  -- Get current order of the section being moved
  SELECT display_order INTO old_order
  FROM section_visibility
  WHERE page_name = p_page_name AND section_key = p_section_key;
  
  -- Get max order for the page
  SELECT COALESCE(MAX(display_order), -1) INTO max_order
  FROM section_visibility
  WHERE page_name = p_page_name;
  
  -- Ensure new order is within bounds
  p_new_order := GREATEST(0, LEAST(p_new_order, max_order));
  
  -- If moving to same position, do nothing
  IF old_order = p_new_order THEN
    RETURN;
  END IF;
  
  -- Temporarily set the moving section to a high number to avoid constraint conflicts
  UPDATE section_visibility 
  SET display_order = 9999
  WHERE page_name = p_page_name AND section_key = p_section_key;
  
  -- Shift other sections
  IF old_order < p_new_order THEN
    -- Moving down: shift sections up between old and new position
    UPDATE section_visibility 
    SET display_order = display_order - 1
    WHERE page_name = p_page_name 
      AND display_order > old_order 
      AND display_order <= p_new_order
      AND section_key != p_section_key;
  ELSE
    -- Moving up: shift sections down between new and old position
    UPDATE section_visibility 
    SET display_order = display_order + 1
    WHERE page_name = p_page_name 
      AND display_order >= p_new_order 
      AND display_order < old_order
      AND section_key != p_section_key;
  END IF;
  
  -- Set the moved section to its new position
  UPDATE section_visibility 
  SET display_order = p_new_order
  WHERE page_name = p_page_name AND section_key = p_section_key;
  
END;
$function$;

-- Fix trigger functions
CREATE OR REPLACE FUNCTION public.track_enrollment_analytics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

CREATE OR REPLACE FUNCTION public.track_completion_analytics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  -- Log user registration activity
  INSERT INTO public.user_activity_logs (user_id, action, details)
  VALUES (NEW.id, 'user_registered', jsonb_build_object('email', NEW.email));
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user_preferences()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_blog_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;