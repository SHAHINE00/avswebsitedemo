-- Phase 1: Update mark_attendance_bulk to support session_id
CREATE OR REPLACE FUNCTION mark_attendance_bulk(
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
SET search_path = public
AS $$
DECLARE
  student_id uuid;
  inserted_count integer := 0;
  prof_id uuid;
BEGIN
  -- Get professor ID
  prof_id := get_professor_id(auth.uid());
  
  -- Verify professor has access to this course
  IF NOT (
    is_admin(auth.uid()) OR 
    EXISTS (SELECT 1 FROM teaching_assignments WHERE professor_id = prof_id AND course_id = p_course_id)
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- If session_id provided, verify it belongs to the course
  IF p_session_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM class_sessions WHERE id = p_session_id AND course_id = p_course_id) THEN
      RAISE EXCEPTION 'Session does not belong to this course';
    END IF;
  END IF;

  -- Insert attendance for each student
  FOREACH student_id IN ARRAY p_student_ids
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
      student_id,
      p_course_id,
      prof_id,
      p_session_id,
      p_attendance_date,
      p_status,
      p_notes
    )
    ON CONFLICT (student_id, course_id, attendance_date, COALESCE(session_id, '00000000-0000-0000-0000-000000000000'::uuid))
    DO UPDATE SET
      status = EXCLUDED.status,
      notes = EXCLUDED.notes,
      updated_at = now();
    
    inserted_count := inserted_count + 1;
  END LOOP;

  RETURN jsonb_build_object(
    'inserted', inserted_count,
    'total', array_length(p_student_ids, 1)
  );
END;
$$;

-- Phase 4.3: Trigger to notify students when marked absent
CREATE OR REPLACE FUNCTION notify_student_on_absence()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  course_name text;
BEGIN
  -- Only notify for new absences
  IF NEW.status = 'absent' THEN
    -- Get course name
    SELECT title INTO course_name FROM courses WHERE id = NEW.course_id;
    
    -- Create notification
    PERFORM create_notification(
      NEW.student_id,
      'Absence enregistrée',
      'Vous avez été marqué absent pour le cours: ' || course_name || '. Vous pouvez justifier cette absence.',
      'attendance',
      '/student?tab=attendance'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for absence notifications
DROP TRIGGER IF EXISTS trigger_notify_absence ON attendance;
CREATE TRIGGER trigger_notify_absence
  AFTER INSERT ON attendance
  FOR EACH ROW
  EXECUTE FUNCTION notify_student_on_absence();

-- Phase 4.4: Trigger to notify students of justification status changes
CREATE OR REPLACE FUNCTION notify_justification_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  notification_title text;
  notification_message text;
BEGIN
  -- Only notify when status changes from pending
  IF OLD.status = 'pending' AND NEW.status != 'pending' THEN
    IF NEW.status = 'approved' THEN
      notification_title := 'Justification approuvée';
      notification_message := 'Votre justification d''absence a été approuvée.';
    ELSIF NEW.status = 'rejected' THEN
      notification_title := 'Justification rejetée';
      notification_message := 'Votre justification d''absence a été rejetée.';
      IF NEW.admin_notes IS NOT NULL THEN
        notification_message := notification_message || ' Raison: ' || NEW.admin_notes;
      END IF;
    END IF;
    
    -- Create notification
    PERFORM create_notification(
      NEW.student_id,
      notification_title,
      notification_message,
      'attendance',
      '/student?tab=attendance'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for justification status notifications
DROP TRIGGER IF EXISTS trigger_notify_justification_status ON absence_justifications;
CREATE TRIGGER trigger_notify_justification_status
  AFTER UPDATE ON absence_justifications
  FOR EACH ROW
  EXECUTE FUNCTION notify_justification_status_change();

-- Function to get students with attendance status for a specific session
CREATE OR REPLACE FUNCTION get_session_attendance(
  p_session_id uuid
)
RETURNS TABLE(
  student_id uuid,
  student_name text,
  student_email text,
  attendance_status text,
  attendance_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_course_id uuid;
  prof_id uuid;
BEGIN
  prof_id := get_professor_id(auth.uid());
  
  -- Get course ID for the session
  SELECT course_id INTO session_course_id FROM class_sessions WHERE id = p_session_id;
  
  -- Verify professor has access
  IF NOT (
    is_admin(auth.uid()) OR 
    EXISTS (SELECT 1 FROM class_sessions WHERE id = p_session_id AND professor_id = prof_id) OR
    EXISTS (SELECT 1 FROM teaching_assignments WHERE professor_id = prof_id AND course_id = session_course_id)
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT 
    ce.user_id as student_id,
    COALESCE(p.full_name, p.email) as student_name,
    p.email as student_email,
    COALESCE(a.status, 'not_marked') as attendance_status,
    a.id as attendance_id
  FROM course_enrollments ce
  JOIN profiles p ON p.id = ce.user_id
  LEFT JOIN attendance a ON a.student_id = ce.user_id AND a.session_id = p_session_id
  WHERE ce.course_id = session_course_id
  ORDER BY p.full_name, p.email;
END;
$$;