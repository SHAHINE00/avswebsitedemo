-- Create tables for unsubscribe flow
-- Unsubscribes registry
CREATE TABLE IF NOT EXISTS public.unsubscribes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS and keep data private (edge functions use service role)
ALTER TABLE public.unsubscribes ENABLE ROW LEVEL SECURITY;

-- No policies added intentionally to prevent client access

-- Unsubscribe tokens table
CREATE TABLE IF NOT EXISTS public.unsubscribe_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  used_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_unsubscribes_email ON public.unsubscribes(email);
CREATE INDEX IF NOT EXISTS idx_unsubscribe_tokens_email ON public.unsubscribe_tokens(email);

-- Enable RLS for tokens as well
ALTER TABLE public.unsubscribe_tokens ENABLE ROW LEVEL SECURITY;