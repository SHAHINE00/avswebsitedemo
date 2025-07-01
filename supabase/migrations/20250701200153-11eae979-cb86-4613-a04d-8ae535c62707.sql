
-- Fix the get_system_health function to resolve the tablename column issue
CREATE OR REPLACE FUNCTION public.get_system_health()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;
