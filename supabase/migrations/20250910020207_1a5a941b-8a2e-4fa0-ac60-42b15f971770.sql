-- Add explicit deny-all RLS policies for newly created tables
DO $$ BEGIN
  -- For unsubscribes
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'unsubscribes' AND policyname = 'Public cannot access unsubscribes'
  ) THEN
    CREATE POLICY "Public cannot access unsubscribes"
    ON public.unsubscribes
    FOR ALL
    USING (false)
    WITH CHECK (false);
  END IF;

  -- For unsubscribe_tokens
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'unsubscribe_tokens' AND policyname = 'Public cannot access unsubscribe tokens'
  ) THEN
    CREATE POLICY "Public cannot access unsubscribe tokens"
    ON public.unsubscribe_tokens
    FOR ALL
    USING (false)
    WITH CHECK (false);
  END IF;
END $$;