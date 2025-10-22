-- Fix student-documents bucket to be public for document access
-- This allows direct viewing and downloading of documents via public URLs

UPDATE storage.buckets 
SET public = true 
WHERE id = 'student-documents';

-- Note: RLS policies on storage.objects still control who can upload/delete
-- Making the bucket public only allows viewing files via their URLs