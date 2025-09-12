-- Add explicit restrictive policy for anonymous users to satisfy security scanner
-- This policy explicitly denies all access for the anon role, making the scanner happy
-- while maintaining existing functionality through the secure edge function

CREATE POLICY "explicit_deny_anon_access_appointments"
ON public.appointments
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Add a comment to document this is for security scanner compliance
COMMENT ON POLICY "explicit_deny_anon_access_appointments" ON public.appointments 
IS 'Explicit restrictive policy to satisfy security scanner - denies all anonymous access to appointments table';