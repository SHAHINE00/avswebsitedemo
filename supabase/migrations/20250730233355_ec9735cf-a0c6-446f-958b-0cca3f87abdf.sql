-- Update the get_dashboard_metrics function to include subscriber data
CREATE OR REPLACE FUNCTION public.get_dashboard_metrics()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
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