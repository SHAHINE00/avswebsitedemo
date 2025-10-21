-- Fix security definer view warning by removing SECURITY DEFINER
-- The view doesn't need elevated privileges as it only reads from storage.objects

DROP VIEW IF EXISTS public.storage_usage_stats;

CREATE OR REPLACE VIEW public.storage_usage_stats AS
SELECT 
  bucket_id,
  COUNT(*) as file_count,
  SUM(COALESCE((metadata->>'size')::bigint, 0)) as total_bytes,
  ROUND(SUM(COALESCE((metadata->>'size')::bigint, 0)) / 1024.0 / 1024.0, 2) as total_mb,
  MIN(created_at) as first_upload,
  MAX(created_at) as last_upload
FROM storage.objects
GROUP BY bucket_id;