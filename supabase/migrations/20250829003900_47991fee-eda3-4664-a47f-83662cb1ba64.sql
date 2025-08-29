-- Allow admins to update any user profile (needed for role promotion from admin panel)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
USING (check_admin_role())
WITH CHECK (check_admin_role());