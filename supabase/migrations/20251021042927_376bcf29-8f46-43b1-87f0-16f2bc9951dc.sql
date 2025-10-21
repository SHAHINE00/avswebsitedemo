-- ============================================================================
-- COMPREHENSIVE STORAGE SYSTEM ENHANCEMENTS
-- ============================================================================

-- 1. CREATE HELPER FUNCTIONS FOR ACCESS CONTROL (prevents RLS recursion)
-- ============================================================================

-- Check if a user can access a student's document
CREATE OR REPLACE FUNCTION public.can_access_student_document(
  p_accessor_id uuid,
  p_student_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Admin always has access
  SELECT CASE 
    WHEN is_admin(p_accessor_id) THEN true
    -- Student accessing own document
    WHEN p_accessor_id = p_student_id THEN true
    -- Professor accessing student in their courses
    WHEN EXISTS (
      SELECT 1 
      FROM course_enrollments ce
      JOIN teaching_assignments ta ON ta.course_id = ce.course_id
      WHERE ce.user_id = p_student_id
        AND ta.professor_id = get_professor_id(p_accessor_id)
    ) THEN true
    ELSE false
  END;
$$;

-- Get all courses for a student
CREATE OR REPLACE FUNCTION public.get_student_courses(p_student_id uuid)
RETURNS TABLE(course_id uuid)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT course_id
  FROM course_enrollments
  WHERE user_id = p_student_id
    AND status = 'active';
$$;

-- 2. CREATE PROFESSOR MATERIALS BUCKET
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'professor-materials',
  'professor-materials',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- 3. ENHANCED STORAGE POLICIES FOR STUDENT-DOCUMENTS
-- ============================================================================

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Admins have full access to student documents" ON storage.objects;
DROP POLICY IF EXISTS "Students can view their own documents" ON storage.objects;

-- Admin full access
CREATE POLICY "Admins have full access to student documents"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'student-documents' 
  AND is_admin(auth.uid())
)
WITH CHECK (
  bucket_id = 'student-documents' 
  AND is_admin(auth.uid())
);

-- Students can SELECT their own documents
CREATE POLICY "Students can view their own documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'student-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Students can INSERT their own documents
CREATE POLICY "Students can upload their own documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'student-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Students can UPDATE their own documents
CREATE POLICY "Students can update their own documents"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'student-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Students can DELETE their own documents
CREATE POLICY "Students can delete their own documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'student-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Professors can SELECT documents of students in their courses
CREATE POLICY "Professors can view student documents for their courses"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'student-documents'
  AND (
    is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1
      FROM course_enrollments ce
      JOIN teaching_assignments ta ON ta.course_id = ce.course_id
      WHERE ta.professor_id = get_professor_id(auth.uid())
        AND ce.user_id::text = (storage.foldername(name))[1]
    )
  )
);

-- Professors can INSERT documents for students in their courses
CREATE POLICY "Professors can upload documents for their students"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'student-documents'
  AND (
    is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1
      FROM course_enrollments ce
      JOIN teaching_assignments ta ON ta.course_id = ce.course_id
      WHERE ta.professor_id = get_professor_id(auth.uid())
        AND ce.user_id::text = (storage.foldername(name))[1]
    )
  )
);

-- 4. STORAGE POLICIES FOR PROFESSOR-MATERIALS
-- ============================================================================

-- Professors can manage their own materials
CREATE POLICY "Professors can manage their own materials"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'professor-materials'
  AND (
    is_admin(auth.uid()) OR
    auth.uid()::text = (storage.foldername(name))[1]
  )
)
WITH CHECK (
  bucket_id = 'professor-materials'
  AND (
    is_admin(auth.uid()) OR
    auth.uid()::text = (storage.foldername(name))[1]
  )
);

-- 5. CREATE STORAGE ACCESS AUDIT TRAIL
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.storage_access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  bucket_id text NOT NULL,
  object_path text NOT NULL,
  action text NOT NULL, -- 'view', 'download', 'upload', 'delete'
  file_size bigint,
  ip_address inet,
  user_agent text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_storage_access_logs_user_id ON public.storage_access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_storage_access_logs_bucket_id ON public.storage_access_logs(bucket_id);
CREATE INDEX IF NOT EXISTS idx_storage_access_logs_created_at ON public.storage_access_logs(created_at DESC);

-- Enable RLS
ALTER TABLE public.storage_access_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for audit logs
CREATE POLICY "Admins can view all storage access logs"
ON public.storage_access_logs
FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own storage access logs"
ON public.storage_access_logs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert storage access logs"
ON public.storage_access_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 6. FUNCTION TO LOG STORAGE ACCESS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.log_storage_access(
  p_bucket_id text,
  p_object_path text,
  p_action text,
  p_file_size bigint DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO public.storage_access_logs (
    user_id,
    bucket_id,
    object_path,
    action,
    file_size,
    metadata
  ) VALUES (
    auth.uid(),
    p_bucket_id,
    p_object_path,
    p_action,
    p_file_size,
    p_metadata
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- 7. ENHANCED DOCUMENT VERIFICATION FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.verify_student_document(
  p_document_id uuid,
  p_admin_notes text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_student_id uuid;
  v_document_type text;
BEGIN
  -- Check if user is admin or professor
  IF NOT (is_admin(auth.uid()) OR is_professor(auth.uid())) THEN
    RAISE EXCEPTION 'Access denied. Admin or professor role required.';
  END IF;

  -- Get document details
  SELECT user_id, document_type INTO v_student_id, v_document_type
  FROM student_documents
  WHERE id = p_document_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Document not found';
  END IF;

  -- If professor, verify they teach the student
  IF is_professor(auth.uid()) AND NOT is_admin(auth.uid()) THEN
    IF NOT can_access_student_document(auth.uid(), v_student_id) THEN
      RAISE EXCEPTION 'Access denied. You do not teach this student.';
    END IF;
  END IF;

  -- Update document
  UPDATE student_documents
  SET 
    is_verified = true,
    verified_at = now(),
    verified_by = auth.uid(),
    admin_notes = COALESCE(p_admin_notes, admin_notes)
  WHERE id = p_document_id;

  -- Log the action
  PERFORM log_admin_activity(
    'document_verified',
    'student_document',
    p_document_id,
    jsonb_build_object(
      'student_id', v_student_id,
      'document_type', v_document_type,
      'verified_by', auth.uid()
    )
  );

  -- Create notification for student
  PERFORM create_notification(
    v_student_id,
    'Document vérifié',
    'Votre document "' || v_document_type || '" a été vérifié.',
    'document',
    '/student?tab=documents'
  );
END;
$$;

-- 8. ADD MISSING COLUMNS TO STUDENT_DOCUMENTS TABLE
-- ============================================================================

ALTER TABLE public.student_documents
ADD COLUMN IF NOT EXISTS verified_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS verified_by uuid,
ADD COLUMN IF NOT EXISTS admin_notes text;

-- 9. UPDATE COURSE MATERIALS DOWNLOAD TRACKING
-- ============================================================================

CREATE OR REPLACE FUNCTION public.increment_material_download(p_material_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_file_url text;
  v_course_id uuid;
BEGIN
  -- Get material details
  SELECT file_url, course_id INTO v_file_url, v_course_id
  FROM course_materials
  WHERE id = p_material_id;

  -- Increment download count
  UPDATE course_materials
  SET download_count = download_count + 1
  WHERE id = p_material_id;

  -- Log the download
  PERFORM log_storage_access(
    'course-materials',
    v_file_url,
    'download',
    NULL,
    jsonb_build_object('material_id', p_material_id, 'course_id', v_course_id)
  );
END;
$$;

-- 10. STORAGE USAGE ANALYTICS VIEW
-- ============================================================================

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