
-- Fix admin_activity_logs RLS policies to allow security definer functions

-- Drop the overly restrictive deny policy
DROP POLICY IF EXISTS "admin_activity_logs_deny_anonymous" ON public.admin_activity_logs;

-- Update the insert policy to allow both authenticated admins AND security definer functions
DROP POLICY IF EXISTS "admin_activity_logs_admin_insert" ON public.admin_activity_logs;

CREATE POLICY "admin_activity_logs_admin_insert"
ON public.admin_activity_logs
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.uid() = admin_id) AND is_admin(auth.uid())
);

-- Add a policy to block all anonymous access explicitly for SELECT, UPDATE, DELETE
CREATE POLICY "admin_activity_logs_block_anon_read"
ON public.admin_activity_logs
FOR SELECT
TO anon
USING (false);

CREATE POLICY "admin_activity_logs_block_anon_write"
ON public.admin_activity_logs
FOR INSERT
TO anon
WITH CHECK (false);
