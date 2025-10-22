-- Create check_admin_role function (security definer to check admin access)
CREATE OR REPLACE FUNCTION public.check_admin_role()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN public.is_admin(auth.uid());
END;
$$;

-- Create get_system_health function for monitoring dashboard
CREATE OR REPLACE FUNCTION public.get_system_health()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result jsonb;
  db_size bigint;
  active_conns integer;
  table_stats jsonb;
BEGIN
  -- Check if caller is admin
  IF NOT public.check_admin_role() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Get database size
  SELECT pg_database_size(current_database()) INTO db_size;

  -- Get active connections
  SELECT count(*) INTO active_conns
  FROM pg_stat_activity
  WHERE state = 'active';

  -- Get table statistics (top 10 tables by size)
  SELECT jsonb_object_agg(
    tablename,
    jsonb_build_object(
      'rows', n_live_tup,
      'size', pg_total_relation_size(schemaname||'.'||tablename)
    )
  ) INTO table_stats
  FROM (
    SELECT 
      schemaname,
      tablename,
      n_live_tup
    FROM pg_stat_user_tables
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
    LIMIT 10
  ) sub;

  -- Build result
  result := jsonb_build_object(
    'database_size', db_size,
    'active_connections', active_conns,
    'table_stats', COALESCE(table_stats, '{}'::jsonb),
    'last_updated', now()
  );

  RETURN result;
EXCEPTION
  WHEN insufficient_privilege THEN
    -- Return partial data if we don't have all privileges
    RETURN jsonb_build_object(
      'database_size', 0,
      'active_connections', 0,
      'table_stats', '{}'::jsonb,
      'last_updated', now(),
      'error', 'Insufficient privileges to access system statistics'
    );
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'database_size', 0,
      'active_connections', 0,
      'table_stats', '{}'::jsonb,
      'last_updated', now(),
      'error', SQLERRM
    );
END;
$$;