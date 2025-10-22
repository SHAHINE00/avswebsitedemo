-- Add class_id column to course_materials table
ALTER TABLE course_materials 
ADD COLUMN class_id UUID REFERENCES course_classes(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX idx_course_materials_class_id ON course_materials(class_id);

-- Update RLS policy for professors to manage class-specific materials
DROP POLICY IF EXISTS "Professors can manage materials for their courses" ON course_materials;

CREATE POLICY "Professors can manage materials for their courses"
ON course_materials
FOR ALL
USING (
  is_admin(auth.uid()) OR 
  EXISTS (
    SELECT 1 FROM teaching_assignments ta
    WHERE ta.professor_id = get_professor_id(auth.uid()) 
    AND ta.course_id = course_materials.course_id
  ) OR
  EXISTS (
    SELECT 1 FROM course_classes cc
    WHERE cc.id = course_materials.class_id
    AND cc.professor_id = get_professor_id(auth.uid())
  )
)
WITH CHECK (
  is_admin(auth.uid()) OR 
  EXISTS (
    SELECT 1 FROM teaching_assignments ta
    WHERE ta.professor_id = get_professor_id(auth.uid()) 
    AND ta.course_id = course_materials.course_id
  ) OR
  EXISTS (
    SELECT 1 FROM course_classes cc
    WHERE cc.id = course_materials.class_id
    AND cc.professor_id = get_professor_id(auth.uid())
  )
);

-- Update RLS policy for students to view class-specific materials
DROP POLICY IF EXISTS "Enrolled users can view course materials" ON course_materials;

CREATE POLICY "Enrolled users can view course materials"
ON course_materials
FOR SELECT
USING (
  is_public = true OR
  -- Course-wide materials
  (class_id IS NULL AND EXISTS (
    SELECT 1 FROM course_enrollments
    WHERE course_enrollments.user_id = auth.uid() 
    AND course_enrollments.course_id = course_materials.course_id
  )) OR
  -- Class-specific materials
  (class_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM course_enrollments
    WHERE course_enrollments.user_id = auth.uid() 
    AND course_enrollments.class_id = course_materials.class_id
  ))
);

-- Update add_course_material function to support class_id
CREATE OR REPLACE FUNCTION public.add_course_material(
  p_course_id uuid,
  p_title text,
  p_file_url text,
  p_file_type text,
  p_lesson_id uuid DEFAULT NULL,
  p_description text DEFAULT NULL,
  p_file_size integer DEFAULT NULL,
  p_is_public boolean DEFAULT false,
  p_class_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prof_id uuid;
  material_id uuid;
BEGIN
  prof_id := get_professor_id(auth.uid());
  
  IF NOT (
    is_admin(auth.uid()) OR 
    EXISTS (SELECT 1 FROM teaching_assignments WHERE professor_id = prof_id AND course_id = p_course_id) OR
    (p_class_id IS NOT NULL AND EXISTS (SELECT 1 FROM course_classes WHERE id = p_class_id AND professor_id = prof_id))
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  INSERT INTO course_materials (course_id, class_id, lesson_id, title, description, file_url, file_type, file_size, is_public)
  VALUES (p_course_id, p_class_id, p_lesson_id, p_title, p_description, p_file_url, p_file_type, p_file_size, p_is_public)
  RETURNING id INTO material_id;

  RETURN material_id;
END;
$$;