-- Harden RLS on sensitive tables by enforcing RLS and ensuring it is enabled
-- This prevents table owners from bypassing RLS and strengthens protection for sensitive data

-- Appointments (PII)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments FORCE ROW LEVEL SECURITY;

-- Subscribers (marketing PII)
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers FORCE ROW LEVEL SECURITY;

-- Profiles (user PII)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- Pending users (sensitive onboarding data)
ALTER TABLE public.pending_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_users FORCE ROW LEVEL SECURITY;

-- User activity logs (security telemetry)
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs FORCE ROW LEVEL SECURITY;

-- Email stats (campaign analytics)
ALTER TABLE public.email_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_stats FORCE ROW LEVEL SECURITY;