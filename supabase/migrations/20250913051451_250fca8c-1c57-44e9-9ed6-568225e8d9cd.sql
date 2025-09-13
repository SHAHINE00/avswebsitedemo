-- Secure appointments table RLS: enforce owner-only access and admin full access (no IF NOT EXISTS)

-- Ensure RLS is enabled and forced
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments FORCE ROW LEVEL SECURITY;

-- Drop any prior policies to avoid conflicts
DROP POLICY IF EXISTS "admins_full_access_appointments" ON public.appointments;
DROP POLICY IF EXISTS "deny_all_other_access_appointments" ON public.appointments;
DROP POLICY IF EXISTS "explicit_deny_anon_access_appointments" ON public.appointments;
DROP POLICY IF EXISTS "users_create_own_appointments" ON public.appointments;
DROP POLICY IF EXISTS "users_update_own_appointments" ON public.appointments;
DROP POLICY IF EXISTS "users_view_own_appointments" ON public.appointments;
DROP POLICY IF EXISTS "appointments_anon_no_access" ON public.appointments;
DROP POLICY IF EXISTS "appointments_admins_all" ON public.appointments;
DROP POLICY IF EXISTS "appointments_users_select_own" ON public.appointments;
DROP POLICY IF EXISTS "appointments_users_insert_own" ON public.appointments;
DROP POLICY IF EXISTS "appointments_users_update_own" ON public.appointments;

-- Explicitly deny all access to anon
CREATE POLICY "appointments_anon_no_access"
ON public.appointments
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

COMMENT ON POLICY "appointments_anon_no_access" ON public.appointments
IS 'Anon role has no access to appointments';

-- Admins can do everything
CREATE POLICY "appointments_admins_all"
ON public.appointments
FOR ALL
TO authenticated
USING (check_admin_role_strict())
WITH CHECK (check_admin_role_strict());

COMMENT ON POLICY "appointments_admins_all" ON public.appointments
IS 'Admins (via profiles + check_admin_role_strict) have full access';

-- Authenticated users can view their own appointments
CREATE POLICY "appointments_users_select_own"
ON public.appointments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Authenticated users can insert their own appointments
CREATE POLICY "appointments_users_insert_own"
ON public.appointments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Authenticated users can update their own appointments
CREATE POLICY "appointments_users_update_own"
ON public.appointments
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

COMMENT ON POLICY "appointments_users_select_own" ON public.appointments
IS 'Users can only read their own appointments';
COMMENT ON POLICY "appointments_users_insert_own" ON public.appointments
IS 'Users can only create appointments for themselves';
COMMENT ON POLICY "appointments_users_update_own" ON public.appointments
IS 'Users can only update their own appointments';
