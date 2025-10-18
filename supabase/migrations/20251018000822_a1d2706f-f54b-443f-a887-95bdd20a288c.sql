-- Professor Dashboard: Complete Database Functions Migration (Fixed Parameter Order)
-- This migration adds all necessary functions for the professor dashboard

-- =====================================================
-- STUDENT MANAGEMENT FUNCTIONS
-- =====================================================

-- Get all students enrolled in a professor's course with their stats
CREATE OR REPLACE FUNCTION public.get_course_students(p_course_id uuid)
RETURNS TABLE(
  student_id uuid,
  full_name text,
  email text,
  enrolled_at timestamp with time zone,
  progress_percentage integer,
  status text,
  total_attendance integer,
  present_count integer,
  absent_count integer,
  average_grade numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prof_id uuid;
BEGIN
  prof_id := get_professor_id(auth.uid());
  
  IF NOT (
    is_admin(auth.uid()) OR 
    EXISTS (
      SELECT 1 FROM teaching_assignments 
      WHERE professor_id = prof_id AND course_id = p_course_id
    )
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT 
    ce.user_id,
    COALESCE(p.full_name, p.email) as full_name,
    p.email,
    ce.enrolled_at,
    ce.progress_percentage,
    ce.status,
    COUNT(DISTINCT a.id)::integer as total_attendance,
    COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'present')::integer as present_count,
    COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'absent')::integer as absent_count,
    ROUND(AVG(g.grade), 2) as average_grade
  FROM course_enrollments ce
  JOIN profiles p ON p.id = ce.user_id
  LEFT JOIN attendance a ON a.student_id = ce.user_id AND a.course_id = p_course_id
  LEFT JOIN grades g ON g.student_id = ce.user_id AND g.course_id = p_course_id
  WHERE ce.course_id = p_course_id
  GROUP BY ce.user_id, p.full_name, p.email, ce.enrolled_at, ce.progress_percentage, ce.status
  ORDER BY p.full_name;
END;
$$;

-- Get detailed student information for a specific course
CREATE OR REPLACE FUNCTION public.get_student_detail(p_student_id uuid, p_course_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prof_id uuid;
  result jsonb;
BEGIN
  prof_id := get_professor_id(auth.uid());
  
  IF NOT (
    is_admin(auth.uid()) OR 
    EXISTS (SELECT 1 FROM teaching_assignments WHERE professor_id = prof_id AND course_id = p_course_id)
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT jsonb_build_object(
    'profile', (SELECT row_to_json(p.*) FROM profiles p WHERE id = p_student_id),
    'enrollment', (SELECT row_to_json(ce.*) FROM course_enrollments ce WHERE user_id = p_student_id AND course_id = p_course_id),
    'attendance_records', (SELECT jsonb_agg(row_to_json(a.*)) FROM attendance a WHERE student_id = p_student_id AND course_id = p_course_id ORDER BY attendance_date DESC),
    'grades', (SELECT jsonb_agg(row_to_json(g.*)) FROM grades g WHERE student_id = p_student_id AND course_id = p_course_id ORDER BY graded_at DESC),
    'statistics', jsonb_build_object(
      'total_attendance', (SELECT COUNT(*) FROM attendance WHERE student_id = p_student_id AND course_id = p_course_id),
      'present_count', (SELECT COUNT(*) FROM attendance WHERE student_id = p_student_id AND course_id = p_course_id AND status = 'present'),
      'attendance_rate', ROUND((SELECT COUNT(*) FILTER (WHERE status = 'present') * 100.0 / NULLIF(COUNT(*), 0) FROM attendance WHERE student_id = p_student_id AND course_id = p_course_id), 2),
      'average_grade', (SELECT ROUND(AVG(grade), 2) FROM grades WHERE student_id = p_student_id AND course_id = p_course_id),
      'total_grades', (SELECT COUNT(*) FROM grades WHERE student_id = p_student_id AND course_id = p_course_id)
    )
  ) INTO result;

  RETURN result;
END;
$$;

-- =====================================================
-- ATTENDANCE MANAGEMENT FUNCTIONS
-- =====================================================

-- Bulk mark attendance for multiple students
CREATE OR REPLACE FUNCTION public.mark_attendance_bulk(
  p_course_id uuid,
  p_student_ids uuid[],
  p_attendance_date date,
  p_status text,
  p_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prof_id uuid;
  student_id uuid;
  inserted_count integer := 0;
  updated_count integer := 0;
BEGIN
  prof_id := get_professor_id(auth.uid());
  
  IF NOT (
    is_admin(auth.uid()) OR 
    EXISTS (SELECT 1 FROM teaching_assignments WHERE professor_id = prof_id AND course_id = p_course_id)
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  FOREACH student_id IN ARRAY p_student_ids
  LOOP
    INSERT INTO attendance (student_id, course_id, professor_id, attendance_date, status, notes)
    VALUES (student_id, p_course_id, prof_id, p_attendance_date, p_status, p_notes)
    ON CONFLICT (student_id, course_id, attendance_date) 
    DO UPDATE SET status = p_status, notes = p_notes, updated_at = now();
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    IF updated_count > 0 THEN
      inserted_count := inserted_count + 1;
    END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'inserted', inserted_count,
    'total', array_length(p_student_ids, 1)
  );
END;
$$;

-- Update single attendance record
CREATE OR REPLACE FUNCTION public.update_attendance_record(
  p_attendance_id uuid,
  p_status text,
  p_notes text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prof_id uuid;
  attendance_course_id uuid;
BEGIN
  prof_id := get_professor_id(auth.uid());
  
  SELECT course_id INTO attendance_course_id FROM attendance WHERE id = p_attendance_id;
  
  IF NOT (
    is_admin(auth.uid()) OR 
    EXISTS (SELECT 1 FROM teaching_assignments WHERE professor_id = prof_id AND course_id = attendance_course_id)
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  UPDATE attendance 
  SET status = p_status, notes = p_notes, updated_at = now()
  WHERE id = p_attendance_id;
END;
$$;

-- Get attendance records for a course
CREATE OR REPLACE FUNCTION public.get_course_attendance(
  p_course_id uuid,
  p_start_date date DEFAULT NULL,
  p_end_date date DEFAULT NULL
)
RETURNS TABLE(
  attendance_id uuid,
  student_id uuid,
  student_name text,
  attendance_date date,
  status text,
  notes text,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prof_id uuid;
BEGIN
  prof_id := get_professor_id(auth.uid());
  
  IF NOT (
    is_admin(auth.uid()) OR 
    EXISTS (SELECT 1 FROM teaching_assignments WHERE professor_id = prof_id AND course_id = p_course_id)
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT 
    a.id,
    a.student_id,
    COALESCE(p.full_name, p.email) as student_name,
    a.attendance_date,
    a.status,
    a.notes,
    a.created_at
  FROM attendance a
  JOIN profiles p ON p.id = a.student_id
  WHERE a.course_id = p_course_id
    AND (p_start_date IS NULL OR a.attendance_date >= p_start_date)
    AND (p_end_date IS NULL OR a.attendance_date <= p_end_date)
  ORDER BY a.attendance_date DESC, p.full_name;
END;
$$;

-- Get attendance statistics for a course
CREATE OR REPLACE FUNCTION public.get_attendance_statistics(p_course_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prof_id uuid;
  result jsonb;
BEGIN
  prof_id := get_professor_id(auth.uid());
  
  IF NOT (
    is_admin(auth.uid()) OR 
    EXISTS (SELECT 1 FROM teaching_assignments WHERE professor_id = prof_id AND course_id = p_course_id)
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT jsonb_build_object(
    'total_sessions', COUNT(DISTINCT attendance_date),
    'total_records', COUNT(*),
    'present_count', COUNT(*) FILTER (WHERE status = 'present'),
    'absent_count', COUNT(*) FILTER (WHERE status = 'absent'),
    'late_count', COUNT(*) FILTER (WHERE status = 'late'),
    'excused_count', COUNT(*) FILTER (WHERE status = 'excused'),
    'attendance_rate', ROUND(COUNT(*) FILTER (WHERE status = 'present') * 100.0 / NULLIF(COUNT(*), 0), 2),
    'by_date', (
      SELECT jsonb_object_agg(
        attendance_date::text,
        jsonb_build_object(
          'total', cnt,
          'present', present_cnt,
          'absent', absent_cnt,
          'rate', ROUND(present_cnt * 100.0 / NULLIF(cnt, 0), 2)
        )
      )
      FROM (
        SELECT 
          attendance_date,
          COUNT(*) as cnt,
          COUNT(*) FILTER (WHERE status = 'present') as present_cnt,
          COUNT(*) FILTER (WHERE status = 'absent') as absent_cnt
        FROM attendance
        WHERE course_id = p_course_id
        GROUP BY attendance_date
      ) sub
    )
  ) INTO result
  FROM attendance
  WHERE course_id = p_course_id;

  RETURN result;
END;
$$;

-- =====================================================
-- GRADE MANAGEMENT FUNCTIONS
-- =====================================================

-- Create or update a grade
CREATE OR REPLACE FUNCTION public.upsert_grade(
  p_student_id uuid,
  p_course_id uuid,
  p_assignment_name text,
  p_grade numeric,
  p_max_grade numeric DEFAULT 100,
  p_comment text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prof_id uuid;
  grade_id uuid;
BEGIN
  prof_id := get_professor_id(auth.uid());
  
  IF NOT (
    is_admin(auth.uid()) OR 
    EXISTS (SELECT 1 FROM teaching_assignments WHERE professor_id = prof_id AND course_id = p_course_id)
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  INSERT INTO grades (student_id, course_id, professor_id, assignment_name, grade, max_grade, comment)
  VALUES (p_student_id, p_course_id, prof_id, p_assignment_name, p_grade, p_max_grade, p_comment)
  ON CONFLICT (student_id, course_id, assignment_name)
  DO UPDATE SET grade = p_grade, max_grade = p_max_grade, comment = p_comment, updated_at = now()
  RETURNING id INTO grade_id;

  RETURN grade_id;
END;
$$;

-- Delete a grade
CREATE OR REPLACE FUNCTION public.delete_grade_record(p_grade_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prof_id uuid;
  grade_course_id uuid;
BEGIN
  prof_id := get_professor_id(auth.uid());
  
  SELECT course_id INTO grade_course_id FROM grades WHERE id = p_grade_id;
  
  IF NOT (
    is_admin(auth.uid()) OR 
    EXISTS (SELECT 1 FROM teaching_assignments WHERE professor_id = prof_id AND course_id = grade_course_id)
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  DELETE FROM grades WHERE id = p_grade_id;
END;
$$;

-- Get all grades for a course
CREATE OR REPLACE FUNCTION public.get_course_gradebook(p_course_id uuid)
RETURNS TABLE(
  grade_id uuid,
  student_id uuid,
  student_name text,
  assignment_name text,
  grade numeric,
  max_grade numeric,
  percentage numeric,
  comment text,
  graded_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prof_id uuid;
BEGIN
  prof_id := get_professor_id(auth.uid());
  
  IF NOT (
    is_admin(auth.uid()) OR 
    EXISTS (SELECT 1 FROM teaching_assignments WHERE professor_id = prof_id AND course_id = p_course_id)
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT 
    g.id,
    g.student_id,
    COALESCE(p.full_name, p.email) as student_name,
    g.assignment_name,
    g.grade,
    g.max_grade,
    ROUND((g.grade / NULLIF(g.max_grade, 0)) * 100, 2) as percentage,
    g.comment,
    g.graded_at
  FROM grades g
  JOIN profiles p ON p.id = g.student_id
  WHERE g.course_id = p_course_id
  ORDER BY p.full_name, g.graded_at DESC;
END;
$$;

-- Get grade statistics for a course
CREATE OR REPLACE FUNCTION public.get_grade_statistics(p_course_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prof_id uuid;
  result jsonb;
BEGIN
  prof_id := get_professor_id(auth.uid());
  
  IF NOT (
    is_admin(auth.uid()) OR 
    EXISTS (SELECT 1 FROM teaching_assignments WHERE professor_id = prof_id AND course_id = p_course_id)
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT jsonb_build_object(
    'total_grades', COUNT(*),
    'average_grade', ROUND(AVG(grade), 2),
    'average_percentage', ROUND(AVG((grade / NULLIF(max_grade, 0)) * 100), 2),
    'highest_grade', MAX(grade),
    'lowest_grade', MIN(grade),
    'by_assignment', (
      SELECT jsonb_object_agg(
        assignment_name,
        jsonb_build_object(
          'count', cnt,
          'average', ROUND(avg_grade, 2),
          'max', max_grade_val,
          'min', min_grade_val
        )
      )
      FROM (
        SELECT 
          assignment_name,
          COUNT(*) as cnt,
          AVG(grade) as avg_grade,
          MAX(grade) as max_grade_val,
          MIN(grade) as min_grade_val
        FROM grades
        WHERE course_id = p_course_id
        GROUP BY assignment_name
      ) sub
    ),
    'distribution', (
      SELECT jsonb_object_agg(
        range_label,
        student_count
      )
      FROM (
        SELECT 
          CASE 
            WHEN (grade / NULLIF(max_grade, 0)) * 100 >= 90 THEN 'A (90-100)'
            WHEN (grade / NULLIF(max_grade, 0)) * 100 >= 80 THEN 'B (80-89)'
            WHEN (grade / NULLIF(max_grade, 0)) * 100 >= 70 THEN 'C (70-79)'
            WHEN (grade / NULLIF(max_grade, 0)) * 100 >= 60 THEN 'D (60-69)'
            ELSE 'F (0-59)'
          END as range_label,
          COUNT(DISTINCT student_id) as student_count
        FROM grades
        WHERE course_id = p_course_id
        GROUP BY range_label
      ) dist
    )
  ) INTO result
  FROM grades
  WHERE course_id = p_course_id;

  RETURN result;
END;
$$;

-- =====================================================
-- ANNOUNCEMENT MANAGEMENT FUNCTIONS
-- =====================================================

-- Create announcement
CREATE OR REPLACE FUNCTION public.create_course_announcement(
  p_course_id uuid,
  p_title text,
  p_content text,
  p_priority text DEFAULT 'normal',
  p_is_pinned boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prof_id uuid;
  announcement_id uuid;
BEGIN
  prof_id := get_professor_id(auth.uid());
  
  IF NOT (
    is_admin(auth.uid()) OR 
    EXISTS (SELECT 1 FROM teaching_assignments WHERE professor_id = prof_id AND course_id = p_course_id)
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  INSERT INTO course_announcements (course_id, professor_id, created_by, title, content, priority, is_pinned)
  VALUES (p_course_id, prof_id, auth.uid(), p_title, p_content, p_priority, p_is_pinned)
  RETURNING id INTO announcement_id;

  RETURN announcement_id;
END;
$$;

-- Update announcement
CREATE OR REPLACE FUNCTION public.update_course_announcement(
  p_announcement_id uuid,
  p_title text DEFAULT NULL,
  p_content text DEFAULT NULL,
  p_priority text DEFAULT NULL,
  p_is_pinned boolean DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prof_id uuid;
  announcement_course_id uuid;
BEGIN
  prof_id := get_professor_id(auth.uid());
  
  SELECT course_id INTO announcement_course_id FROM course_announcements WHERE id = p_announcement_id;
  
  IF NOT (
    is_admin(auth.uid()) OR 
    EXISTS (SELECT 1 FROM teaching_assignments WHERE professor_id = prof_id AND course_id = announcement_course_id)
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  UPDATE course_announcements
  SET 
    title = COALESCE(p_title, title),
    content = COALESCE(p_content, content),
    priority = COALESCE(p_priority, priority),
    is_pinned = COALESCE(p_is_pinned, is_pinned),
    updated_at = now()
  WHERE id = p_announcement_id;
END;
$$;

-- Delete announcement
CREATE OR REPLACE FUNCTION public.delete_course_announcement(p_announcement_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prof_id uuid;
  announcement_course_id uuid;
BEGIN
  prof_id := get_professor_id(auth.uid());
  
  SELECT course_id INTO announcement_course_id FROM course_announcements WHERE id = p_announcement_id;
  
  IF NOT (
    is_admin(auth.uid()) OR 
    EXISTS (SELECT 1 FROM teaching_assignments WHERE professor_id = prof_id AND course_id = announcement_course_id)
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  DELETE FROM course_announcements WHERE id = p_announcement_id;
END;
$$;

-- =====================================================
-- COURSE MATERIALS MANAGEMENT FUNCTIONS
-- =====================================================

-- Add course material
CREATE OR REPLACE FUNCTION public.add_course_material(
  p_course_id uuid,
  p_title text,
  p_file_url text,
  p_file_type text,
  p_lesson_id uuid DEFAULT NULL,
  p_description text DEFAULT NULL,
  p_file_size integer DEFAULT NULL,
  p_is_public boolean DEFAULT false
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
    EXISTS (SELECT 1 FROM teaching_assignments WHERE professor_id = prof_id AND course_id = p_course_id)
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  INSERT INTO course_materials (course_id, lesson_id, title, description, file_url, file_type, file_size, is_public)
  VALUES (p_course_id, p_lesson_id, p_title, p_description, p_file_url, p_file_type, p_file_size, p_is_public)
  RETURNING id INTO material_id;

  RETURN material_id;
END;
$$;

-- Delete course material
CREATE OR REPLACE FUNCTION public.delete_course_material(p_material_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prof_id uuid;
  material_course_id uuid;
BEGIN
  prof_id := get_professor_id(auth.uid());
  
  SELECT course_id INTO material_course_id FROM course_materials WHERE id = p_material_id;
  
  IF NOT (
    is_admin(auth.uid()) OR 
    EXISTS (SELECT 1 FROM teaching_assignments WHERE professor_id = prof_id AND course_id = material_course_id)
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  DELETE FROM course_materials WHERE id = p_material_id;
END;
$$;

-- Get course materials
CREATE OR REPLACE FUNCTION public.get_professor_course_materials(p_course_id uuid)
RETURNS TABLE(
  material_id uuid,
  lesson_id uuid,
  title text,
  description text,
  file_url text,
  file_type text,
  file_size integer,
  is_public boolean,
  download_count integer,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prof_id uuid;
BEGIN
  prof_id := get_professor_id(auth.uid());
  
  IF NOT (
    is_admin(auth.uid()) OR 
    EXISTS (SELECT 1 FROM teaching_assignments WHERE professor_id = prof_id AND course_id = p_course_id)
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT 
    cm.id,
    cm.lesson_id,
    cm.title,
    cm.description,
    cm.file_url,
    cm.file_type,
    cm.file_size,
    cm.is_public,
    cm.download_count,
    cm.created_at
  FROM course_materials cm
  WHERE cm.course_id = p_course_id
  ORDER BY cm.created_at DESC;
END;
$$;

-- =====================================================
-- DASHBOARD STATS FUNCTION (Enhanced)
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_professor_dashboard_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prof_id uuid;
  result jsonb;
BEGIN
  prof_id := get_professor_id(auth.uid());
  
  IF prof_id IS NULL THEN
    RAISE EXCEPTION 'Not a professor';
  END IF;

  SELECT jsonb_build_object(
    'total_courses', (
      SELECT COUNT(DISTINCT ta.course_id)
      FROM teaching_assignments ta
      WHERE ta.professor_id = prof_id
    ),
    'total_students', (
      SELECT COUNT(DISTINCT ce.user_id)
      FROM teaching_assignments ta
      JOIN course_enrollments ce ON ce.course_id = ta.course_id
      WHERE ta.professor_id = prof_id
    ),
    'attendance_rate', COALESCE((
      SELECT ROUND(
        COUNT(*) FILTER (WHERE a.status = 'present') * 100.0 / NULLIF(COUNT(*), 0),
        2
      )
      FROM teaching_assignments ta
      JOIN attendance a ON a.course_id = ta.course_id
      WHERE ta.professor_id = prof_id
    ), 0),
    'average_grade', COALESCE((
      SELECT ROUND(AVG(g.grade), 2)
      FROM teaching_assignments ta
      JOIN grades g ON g.course_id = ta.course_id
      WHERE ta.professor_id = prof_id
    ), 0),
    'recent_announcements', (
      SELECT COUNT(*)
      FROM course_announcements ca
      WHERE ca.professor_id = prof_id
        AND ca.created_at >= NOW() - INTERVAL '30 days'
    ),
    'total_grades_entered', (
      SELECT COUNT(*)
      FROM teaching_assignments ta
      JOIN grades g ON g.course_id = ta.course_id
      WHERE ta.professor_id = prof_id
    ),
    'total_materials_uploaded', (
      SELECT COUNT(*)
      FROM teaching_assignments ta
      JOIN course_materials cm ON cm.course_id = ta.course_id
      WHERE ta.professor_id = prof_id
    )
  ) INTO result;

  RETURN result;
END;
$$;