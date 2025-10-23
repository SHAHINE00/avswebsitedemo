-- Fix Communication Center access for all roles - Clean approach
-- First verify current policies
DO $$ 
BEGIN
  -- Drop all existing policies for both tables
  DROP POLICY IF EXISTS "Admins can manage email templates" ON public.email_templates;
  DROP POLICY IF EXISTS "Professors and students can read email templates" ON public.email_templates;
  
  DROP POLICY IF EXISTS "Admins full access to communication_log" ON public.communication_log;
  DROP POLICY IF EXISTS "Admins have full access to communication_log" ON public.communication_log;
  DROP POLICY IF EXISTS "Professors have full access to communication_log" ON public.communication_log;
  DROP POLICY IF EXISTS "Students view own communication_log" ON public.communication_log;
  DROP POLICY IF EXISTS "Students can create own communication_log" ON public.communication_log;
END $$;

-- Email Templates: Admins can manage, everyone can read
CREATE POLICY "Admins manage email templates"
ON public.email_templates
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "All roles read email templates"
ON public.email_templates
FOR SELECT
TO authenticated
USING (true);

-- Communication Log: Admins and professors have full access, students can manage their own
CREATE POLICY "Admins full communication access"
ON public.communication_log
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Professors full communication access"
ON public.communication_log
FOR ALL
TO authenticated
USING (is_professor(auth.uid()))
WITH CHECK (is_professor(auth.uid()));

CREATE POLICY "Students view own communications"
ON public.communication_log
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Students create own communications"
ON public.communication_log
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());