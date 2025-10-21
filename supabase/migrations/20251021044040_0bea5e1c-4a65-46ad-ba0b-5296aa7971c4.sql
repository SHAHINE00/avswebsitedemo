-- Add new columns to student_documents table for professor uploads
ALTER TABLE student_documents 
  ADD COLUMN IF NOT EXISTS uploaded_by uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS uploaded_by_role text DEFAULT 'student',
  ADD COLUMN IF NOT EXISTS professor_note text,
  ADD COLUMN IF NOT EXISTS is_visible_to_student boolean DEFAULT true;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_student_documents_uploaded_by 
  ON student_documents(uploaded_by);

-- Update RLS policy for professors to insert documents for their students
CREATE POLICY "Professors can upload documents for their students"
ON student_documents
FOR INSERT
TO authenticated
WITH CHECK (
  uploaded_by = auth.uid() AND
  uploaded_by_role = 'professor' AND
  EXISTS (
    SELECT 1 FROM can_access_student_document(auth.uid(), user_id)
    WHERE can_access_student_document = true
  )
);

-- Allow professors to view documents they uploaded
CREATE POLICY "Professors can view documents they uploaded"
ON student_documents
FOR SELECT
TO authenticated
USING (
  uploaded_by = auth.uid() OR
  user_id = auth.uid() OR
  is_admin(auth.uid())
);