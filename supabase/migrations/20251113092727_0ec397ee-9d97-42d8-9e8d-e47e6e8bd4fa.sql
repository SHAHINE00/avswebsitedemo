-- Create public 'brochures' bucket for hosting marketing PDFs
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'brochures') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('brochures', 'brochures', true);
  END IF;
END $$;

-- Allow public read access to brochures objects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies p
    WHERE p.schemaname = 'storage' AND p.tablename = 'objects' AND p.policyname = 'Public read brochures'
  ) THEN
    CREATE POLICY "Public read brochures"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'brochures');
  END IF;
END $$;

-- Allow authenticated users to upload brochures
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies p
    WHERE p.schemaname = 'storage' AND p.tablename = 'objects' AND p.policyname = 'Authenticated can insert brochures'
  ) THEN
    CREATE POLICY "Authenticated can insert brochures"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'brochures');
  END IF;
END $$;

-- Allow authenticated users to update brochures
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies p
    WHERE p.schemaname = 'storage' AND p.tablename = 'objects' AND p.policyname = 'Authenticated can update brochures'
  ) THEN
    CREATE POLICY "Authenticated can update brochures"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'brochures')
    WITH CHECK (bucket_id = 'brochures');
  END IF;
END $$;

-- Allow authenticated users to delete brochures
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies p
    WHERE p.schemaname = 'storage' AND p.tablename = 'objects' AND p.policyname = 'Authenticated can delete brochures'
  ) THEN
    CREATE POLICY "Authenticated can delete brochures"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'brochures');
  END IF;
END $$;