-- Security Hardening Migration: Log retention, IP anonymization, and indexing
-- 1) Create indexes to optimize cleanup and queries
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON public.user_activity_logs (created_at);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON public.user_activity_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON public.admin_activity_logs (created_at);

-- 2) Function to anonymize IPs and delete old logs
CREATE OR REPLACE FUNCTION public.cleanup_security_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Anonymize IP addresses older than 30 days for privacy
  UPDATE public.user_activity_logs
  SET ip_address = NULL
  WHERE ip_address IS NOT NULL
    AND created_at < now() - INTERVAL '30 days';

  -- Delete user activity logs older than 90 days
  DELETE FROM public.user_activity_logs
  WHERE created_at < now() - INTERVAL '90 days';

  -- Delete admin activity logs older than 180 days (longer retention for audits)
  DELETE FROM public.admin_activity_logs
  WHERE created_at < now() - INTERVAL '180 days';
END;
$$;

-- 3) Lightweight trigger function to run cleanup on inserts
CREATE OR REPLACE FUNCTION public.run_cleanup_on_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.cleanup_security_logs();
  RETURN NEW;
END;
$$;

-- 4) Attach triggers to run after batched inserts
DROP TRIGGER IF EXISTS trig_cleanup_on_user_activity_logs ON public.user_activity_logs;
CREATE TRIGGER trig_cleanup_on_user_activity_logs
AFTER INSERT ON public.user_activity_logs
FOR EACH STATEMENT
EXECUTE FUNCTION public.run_cleanup_on_insert();

DROP TRIGGER IF EXISTS trig_cleanup_on_admin_activity_logs ON public.admin_activity_logs;
CREATE TRIGGER trig_cleanup_on_admin_activity_logs
AFTER INSERT ON public.admin_activity_logs
FOR EACH STATEMENT
EXECUTE FUNCTION public.run_cleanup_on_insert();