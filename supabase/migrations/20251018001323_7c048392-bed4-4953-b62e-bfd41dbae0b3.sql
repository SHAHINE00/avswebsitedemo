-- Create storage bucket for course materials
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-materials', 'course-materials', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for course materials storage
CREATE POLICY "Professors can upload course materials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'course-materials' AND
  (
    EXISTS (
      SELECT 1 FROM public.teaching_assignments ta
      WHERE ta.professor_id = public.get_professor_id(auth.uid())
        AND ta.course_id::text = (storage.foldername(name))[1]
    ) OR
    public.is_admin(auth.uid())
  )
);

CREATE POLICY "Professors can delete their course materials"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'course-materials' AND
  (
    EXISTS (
      SELECT 1 FROM public.teaching_assignments ta
      WHERE ta.professor_id = public.get_professor_id(auth.uid())
        AND ta.course_id::text = (storage.foldername(name))[1]
    ) OR
    public.is_admin(auth.uid())
  )
);

CREATE POLICY "Enrolled students can view course materials"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'course-materials' AND
  (
    EXISTS (
      SELECT 1 FROM public.course_enrollments ce
      WHERE ce.user_id = auth.uid()
        AND ce.course_id::text = (storage.foldername(name))[1]
    ) OR
    EXISTS (
      SELECT 1 FROM public.teaching_assignments ta
      WHERE ta.professor_id = public.get_professor_id(auth.uid())
        AND ta.course_id::text = (storage.foldername(name))[1]
    ) OR
    public.is_admin(auth.uid())
  )
);