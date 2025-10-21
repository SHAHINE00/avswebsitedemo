-- Create course_classes table for organizing students into specific classes/groups
CREATE TABLE IF NOT EXISTS public.course_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  class_name text NOT NULL,
  class_code text,
  professor_id uuid REFERENCES public.professors(id) ON DELETE SET NULL,
  max_students integer DEFAULT 30,
  current_students integer DEFAULT 0,
  academic_year text,
  semester text,
  start_date date,
  end_date date,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(course_id, class_code)
);

-- Add class_id to course_enrollments
ALTER TABLE public.course_enrollments 
  ADD COLUMN IF NOT EXISTS class_id uuid REFERENCES public.course_classes(id) ON DELETE SET NULL;

-- Add class_id to class_schedules
ALTER TABLE public.class_schedules 
  ADD COLUMN IF NOT EXISTS class_id uuid REFERENCES public.course_classes(id) ON DELETE CASCADE;

-- Add class_id to class_sessions
ALTER TABLE public.class_sessions 
  ADD COLUMN IF NOT EXISTS class_id uuid REFERENCES public.course_classes(id) ON DELETE CASCADE;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_course_classes_course_id ON public.course_classes(course_id);
CREATE INDEX IF NOT EXISTS idx_course_classes_professor_id ON public.course_classes(professor_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_class_id ON public.course_enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_class_schedules_class_id ON public.class_schedules(class_id);
CREATE INDEX IF NOT EXISTS idx_class_sessions_class_id ON public.class_sessions(class_id);

-- Enable RLS
ALTER TABLE public.course_classes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage all course classes"
  ON public.course_classes
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Professors can view their assigned classes"
  ON public.course_classes
  FOR SELECT
  TO authenticated
  USING (
    professor_id = get_professor_id(auth.uid())
  );

CREATE POLICY "Students can view classes they're enrolled in"
  ON public.course_classes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_enrollments
      WHERE course_enrollments.class_id = course_classes.id
      AND course_enrollments.user_id = auth.uid()
    )
  );

-- Trigger to update current_students count
CREATE OR REPLACE FUNCTION update_class_student_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.class_id IS NOT NULL THEN
    UPDATE course_classes 
    SET current_students = current_students + 1
    WHERE id = NEW.class_id;
  ELSIF TG_OP = 'DELETE' AND OLD.class_id IS NOT NULL THEN
    UPDATE course_classes 
    SET current_students = GREATEST(0, current_students - 1)
    WHERE id = OLD.class_id;
  ELSIF TG_OP = 'UPDATE' AND COALESCE(OLD.class_id::text, '') != COALESCE(NEW.class_id::text, '') THEN
    IF OLD.class_id IS NOT NULL THEN
      UPDATE course_classes 
      SET current_students = GREATEST(0, current_students - 1)
      WHERE id = OLD.class_id;
    END IF;
    IF NEW.class_id IS NOT NULL THEN
      UPDATE course_classes 
      SET current_students = current_students + 1
      WHERE id = NEW.class_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_update_class_student_count
AFTER INSERT OR UPDATE OR DELETE ON course_enrollments
FOR EACH ROW
EXECUTE FUNCTION update_class_student_count();