-- Fix the mark_attendance_bulk function to resolve ambiguous column reference
DROP FUNCTION IF EXISTS public.mark_attendance_bulk(uuid, uuid[], date, text, text);
DROP FUNCTION IF EXISTS public.mark_attendance_bulk(uuid, uuid[], date, text, text, uuid);

CREATE OR REPLACE FUNCTION public.mark_attendance_bulk(
  p_course_id uuid,
  p_student_ids uuid[],
  p_attendance_date date,
  p_status text,
  p_notes text DEFAULT NULL,
  p_session_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_student_id uuid;
  inserted_count integer := 0;
  prof_id uuid;
BEGIN
  -- Get professor ID
  prof_id := get_professor_id(auth.uid());
  
  -- Verify professor has access to this course
  IF NOT (
    is_admin(auth.uid()) OR 
    EXISTS (
      SELECT 1 FROM teaching_assignments ta
      WHERE ta.professor_id = prof_id AND ta.course_id = p_course_id
    )
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- If session_id provided, verify it belongs to the course
  IF p_session_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM class_sessions cs
      WHERE cs.id = p_session_id AND cs.course_id = p_course_id
    ) THEN
      RAISE EXCEPTION 'Session does not belong to this course';
    END IF;
  END IF;

  -- Insert attendance for each student
  FOREACH v_student_id IN ARRAY p_student_ids
  LOOP
    INSERT INTO attendance (
      student_id,
      course_id,
      professor_id,
      session_id,
      attendance_date,
      status,
      notes
    ) VALUES (
      v_student_id,
      p_course_id,
      prof_id,
      p_session_id,
      p_attendance_date,
      p_status,
      p_notes
    )
    ON CONFLICT (student_id, course_id, attendance_date)
    DO UPDATE SET
      status = EXCLUDED.status,
      notes = EXCLUDED.notes,
      session_id = EXCLUDED.session_id,
      updated_at = now();
    
    inserted_count := inserted_count + 1;
  END LOOP;

  RETURN jsonb_build_object(
    'inserted', inserted_count,
    'total', array_length(p_student_ids, 1)
  );
END;
$$;