-- Migrate existing Supabase Storage URLs to relative paths
-- This updates course_materials table to use /files/course-materials/{courseId}/{filename}
-- instead of full Supabase URLs

-- Update file_url for all course materials that have Supabase URLs
UPDATE public.course_materials
SET file_url = CONCAT(
  '/files/course-materials/',
  -- Extract the path after 'course-materials/'
  SUBSTRING(
    file_url 
    FROM 'course-materials/(.+)$'
  )
)
WHERE file_url LIKE '%supabase.co/storage/v1/object/public/course-materials/%';

-- Verify the migration
DO $$
DECLARE
  migrated_count INTEGER;
  old_format_count INTEGER;
BEGIN
  -- Count how many were migrated
  SELECT COUNT(*) INTO migrated_count
  FROM public.course_materials
  WHERE file_url LIKE '/files/course-materials/%';
  
  -- Count how many still have old format
  SELECT COUNT(*) INTO old_format_count
  FROM public.course_materials
  WHERE file_url LIKE '%supabase.co/storage/v1/object/public/course-materials/%';
  
  RAISE NOTICE 'Migration complete:';
  RAISE NOTICE '  - Files with new format: %', migrated_count;
  RAISE NOTICE '  - Files with old format remaining: %', old_format_count;
END $$;