-- Secure appointments table: restrict SELECT to owners and admins; harden INSERT for anonymous
-- 1) Ensure RLS is enabled (no-op if already enabled)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 2) Replace overly permissive SELECT policy
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
CREATE POLICY "Users can view their own appointments"
ON public.appointments
FOR SELECT
USING (
  auth.uid() = user_id
);

-- 3) Harden INSERT policy to prevent forging user_id by anonymous users
DROP POLICY IF EXISTS "Users can create appointments" ON public.appointments;
CREATE POLICY "Users can create appointments"
ON public.appointments
FOR INSERT
WITH CHECK (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  (auth.uid() IS NULL AND user_id IS NULL)
);

-- 4) Keep existing UPDATE policy (owner) and ALL (admin) policies unchanged
-- UPDATE policy already limits to owner: USING (auth.uid() = user_id)
-- Admin ALL policy remains: USING (check_admin_role())