-- Fix storage policies to allow professors and admins to upload to bulk-documents folder

-- Drop and recreate the professor upload policy for student-documents bucket
DROP POLICY IF EXISTS "Professors can upload documents for their students" ON storage.objects;

CREATE POLICY "Professors can upload documents for their students"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'student-documents' 
  AND (
    is_admin(auth.uid())
    OR 
    -- Allow upload to bulk-documents folder for professors
    (name LIKE 'bulk-documents/%')
    OR
    -- Allow upload to specific student folders for professors who teach them
    (
      EXISTS (
        SELECT 1
        FROM course_enrollments ce
        JOIN teaching_assignments ta ON ta.course_id = ce.course_id
        WHERE ta.professor_id = get_professor_id(auth.uid())
        AND ce.user_id::text = (storage.foldername(objects.name))[1]
      )
    )
  )
);

-- Add policy for professors to view bulk-documents
DROP POLICY IF EXISTS "Professors can view student documents for their courses" ON storage.objects;

CREATE POLICY "Professors can view student documents for their courses"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'student-documents'
  AND (
    is_admin(auth.uid())
    OR
    -- Professors can view bulk-documents
    (name LIKE 'bulk-documents/%')
    OR
    -- Professors can view documents of their students
    (
      EXISTS (
        SELECT 1
        FROM course_enrollments ce
        JOIN teaching_assignments ta ON ta.course_id = ce.course_id
        WHERE ta.professor_id = get_professor_id(auth.uid())
        AND ce.user_id::text = (storage.foldername(objects.name))[1]
      )
    )
  )
);

-- Also update admin policy to include bulk-documents if needed
DROP POLICY IF EXISTS "Admins can upload student documents" ON storage.objects;

CREATE POLICY "Admins can upload student documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'student-documents' 
  AND is_admin(auth.uid())
);