-- Helper function to check if user is a professor
CREATE OR REPLACE FUNCTION public.is_professor(_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'professor'::app_role)
$$;

-- Helper function to get professor_id from user_id
CREATE OR REPLACE FUNCTION public.get_professor_id(_user_id UUID DEFAULT auth.uid())
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.professors WHERE user_id = _user_id LIMIT 1
$$;

-- Professors table RLS policies
CREATE POLICY "Admins can manage all professors"
  ON public.professors FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Professors can view their own profile"
  ON public.professors FOR SELECT
  USING (user_id = auth.uid() OR public.is_professor(auth.uid()));

CREATE POLICY "Professors can update their own profile"
  ON public.professors FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Teaching assignments RLS policies
CREATE POLICY "Admins can manage all teaching assignments"
  ON public.teaching_assignments FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Professors can view their assignments"
  ON public.teaching_assignments FOR SELECT
  USING (professor_id = public.get_professor_id(auth.uid()));

-- Attendance RLS policies
CREATE POLICY "Admins can manage all attendance"
  ON public.attendance FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Professors can manage attendance for their courses"
  ON public.attendance FOR ALL
  USING (
    professor_id = public.get_professor_id(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.teaching_assignments ta
      WHERE ta.professor_id = public.get_professor_id(auth.uid())
      AND ta.course_id = attendance.course_id
    )
  )
  WITH CHECK (
    professor_id = public.get_professor_id(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.teaching_assignments ta
      WHERE ta.professor_id = public.get_professor_id(auth.uid())
      AND ta.course_id = attendance.course_id
    )
  );

CREATE POLICY "Students can view their own attendance"
  ON public.attendance FOR SELECT
  USING (student_id = auth.uid());

-- Grades RLS policies
CREATE POLICY "Admins can manage all grades"
  ON public.grades FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Professors can manage grades for their courses"
  ON public.grades FOR ALL
  USING (
    professor_id = public.get_professor_id(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.teaching_assignments ta
      WHERE ta.professor_id = public.get_professor_id(auth.uid())
      AND ta.course_id = grades.course_id
    )
  )
  WITH CHECK (
    professor_id = public.get_professor_id(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.teaching_assignments ta
      WHERE ta.professor_id = public.get_professor_id(auth.uid())
      AND ta.course_id = grades.course_id
    )
  );

CREATE POLICY "Students can view their own grades"
  ON public.grades FOR SELECT
  USING (student_id = auth.uid());

-- Update course_announcements policies for professors
CREATE POLICY "Professors can manage announcements for their courses"
  ON public.course_announcements FOR ALL
  USING (
    professor_id = public.get_professor_id(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.teaching_assignments ta
      WHERE ta.professor_id = public.get_professor_id(auth.uid())
      AND ta.course_id = course_announcements.course_id
    )
  )
  WITH CHECK (
    professor_id = public.get_professor_id(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.teaching_assignments ta
      WHERE ta.professor_id = public.get_professor_id(auth.uid())
      AND ta.course_id = course_announcements.course_id
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_professors_updated_at
  BEFORE UPDATE ON public.professors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at
  BEFORE UPDATE ON public.attendance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_grades_updated_at
  BEFORE UPDATE ON public.grades
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Admin helper functions
CREATE OR REPLACE FUNCTION public.admin_create_professor(
  p_email TEXT,
  p_full_name TEXT,
  p_phone TEXT DEFAULT NULL,
  p_specialization TEXT DEFAULT NULL,
  p_bio TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_professor_id UUID;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  INSERT INTO public.professors (full_name, email, phone, specialization, bio, user_id)
  VALUES (p_full_name, p_email, p_phone, p_specialization, p_bio, gen_random_uuid())
  RETURNING id INTO new_professor_id;

  PERFORM public.log_admin_activity(
    'professor_created',
    'professor',
    new_professor_id,
    jsonb_build_object('email', p_email, 'full_name', p_full_name)
  );

  RETURN new_professor_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_assign_professor_to_course(
  p_professor_id UUID,
  p_course_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  assignment_id UUID;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  INSERT INTO public.teaching_assignments (professor_id, course_id)
  VALUES (p_professor_id, p_course_id)
  ON CONFLICT (professor_id, course_id) DO NOTHING
  RETURNING id INTO assignment_id;

  PERFORM public.log_admin_activity(
    'professor_assigned_to_course',
    'teaching_assignment',
    assignment_id,
    jsonb_build_object('professor_id', p_professor_id, 'course_id', p_course_id)
  );

  RETURN assignment_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_professor_dashboard_stats(p_professor_id UUID DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_professor_id UUID;
  result JSONB;
BEGIN
  IF p_professor_id IS NULL THEN
    target_professor_id := public.get_professor_id(auth.uid());
  ELSE
    IF NOT public.is_admin(auth.uid()) THEN
      RAISE EXCEPTION 'Access denied';
    END IF;
    target_professor_id := p_professor_id;
  END IF;

  SELECT jsonb_build_object(
    'total_courses', (
      SELECT COUNT(*) FROM teaching_assignments 
      WHERE professor_id = target_professor_id
    ),
    'total_students', (
      SELECT COUNT(DISTINCT ce.user_id)
      FROM course_enrollments ce
      JOIN teaching_assignments ta ON ta.course_id = ce.course_id
      WHERE ta.professor_id = target_professor_id
    ),
    'attendance_rate', (
      SELECT COALESCE(
        ROUND(
          (COUNT(*) FILTER (WHERE status = 'present')::NUMERIC / 
          NULLIF(COUNT(*), 0) * 100), 2
        ), 0
      )
      FROM attendance
      WHERE professor_id = target_professor_id
      AND attendance_date >= CURRENT_DATE - INTERVAL '30 days'
    ),
    'average_grade', (
      SELECT COALESCE(ROUND(AVG(grade), 2), 0)
      FROM grades
      WHERE professor_id = target_professor_id
    ),
    'recent_announcements', (
      SELECT COUNT(*)
      FROM course_announcements
      WHERE professor_id = target_professor_id
      AND created_at >= CURRENT_DATE - INTERVAL '7 days'
    )
  ) INTO result;

  RETURN result;
END;
$$;