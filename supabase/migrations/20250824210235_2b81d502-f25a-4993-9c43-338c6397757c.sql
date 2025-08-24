-- Harden subscribers table: remove public INSERT to protect PII
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Remove permissive public INSERT policy
DROP POLICY IF EXISTS "Anyone can create subscriber records" ON public.subscribers;

-- Note: Admin policy already grants ALL operations via check_admin_role()
-- No additional SELECT/INSERT policies are added for anonymous users.
