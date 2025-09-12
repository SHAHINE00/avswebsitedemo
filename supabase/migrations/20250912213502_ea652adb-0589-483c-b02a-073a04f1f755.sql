-- Harden RLS for pending_users and subscribers to satisfy security scanner and enforce admin-only access

-- Pending Users: ensure RLS is enabled and forced
ALTER TABLE public.pending_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_users FORCE ROW LEVEL SECURITY;

-- Explicitly deny anon on pending_users
CREATE POLICY IF NOT EXISTS "pending_users_restrict_anon"
ON public.pending_users
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

COMMENT ON POLICY "pending_users_restrict_anon" ON public.pending_users
IS 'Explicit restrictive deny for anon to satisfy security scanner';

-- Restrict authenticated access to admins only on pending_users
CREATE POLICY IF NOT EXISTS "pending_users_authenticated_admin_only"
ON public.pending_users
AS RESTRICTIVE
FOR ALL
TO authenticated
USING (check_admin_role_strict())
WITH CHECK (check_admin_role_strict());

COMMENT ON POLICY "pending_users_authenticated_admin_only" ON public.pending_users
IS 'Restrictive policy: only admins among authenticated can access pending users';


-- Subscribers: ensure RLS is enabled and forced
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers FORCE ROW LEVEL SECURITY;

-- Explicitly deny anon on subscribers
CREATE POLICY IF NOT EXISTS "subscribers_restrict_anon"
ON public.subscribers
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

COMMENT ON POLICY "subscribers_restrict_anon" ON public.subscribers
IS 'Explicit restrictive deny for anon to satisfy security scanner';

-- Restrict authenticated access to admins only on subscribers
CREATE POLICY IF NOT EXISTS "subscribers_authenticated_admin_only"
ON public.subscribers
AS RESTRICTIVE
FOR ALL
TO authenticated
USING (check_admin_role_strict())
WITH CHECK (check_admin_role_strict());

COMMENT ON POLICY "subscribers_authenticated_admin_only" ON public.subscribers
IS 'Restrictive policy: only admins among authenticated can access subscribers';