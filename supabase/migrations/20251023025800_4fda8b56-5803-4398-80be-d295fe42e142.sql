-- Fix Communication Center access for all roles
-- Allow professors and students to access email templates (read-only for non-admins)
-- Allow professors and admins full access to communication_log
-- Students can only view their own communication logs

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can manage email templates" ON public.email_templates;
DROP POLICY IF EXISTS "Admins full access to communication_log" ON public.communication_log;
DROP POLICY IF EXISTS "Students view own communication_log" ON public.communication_log;

-- Email Templates: Admins can manage, professors and students can read
CREATE POLICY "Admins can manage email templates"
ON public.email_templates
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Professors and students can read email templates"
ON public.email_templates
FOR SELECT
TO authenticated
USING (true);

-- Communication Log: Admins and professors have full access
CREATE POLICY "Admins have full access to communication_log"
ON public.communication_log
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Professors have full access to communication_log"
ON public.communication_log
FOR ALL
TO authenticated
USING (is_professor(auth.uid()))
WITH CHECK (is_professor(auth.uid()));

-- Students can view their own communication logs
CREATE POLICY "Students view own communication_log"
ON public.communication_log
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Students can insert communication logs for themselves
CREATE POLICY "Students can create own communication_log"
ON public.communication_log
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());