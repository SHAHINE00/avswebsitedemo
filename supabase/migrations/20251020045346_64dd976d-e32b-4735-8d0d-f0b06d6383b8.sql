-- Function for students to submit absence justifications
CREATE OR REPLACE FUNCTION submit_absence_justification(
  p_attendance_id UUID,
  p_justification_type TEXT,
  p_reason TEXT,
  p_document_url TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  justification_id UUID;
  attendance_student_id UUID;
BEGIN
  -- Verify the attendance record belongs to the current user
  SELECT student_id INTO attendance_student_id
  FROM attendance
  WHERE id = p_attendance_id;

  IF attendance_student_id IS NULL THEN
    RAISE EXCEPTION 'Attendance record not found';
  END IF;

  IF attendance_student_id != auth.uid() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Create justification
  INSERT INTO absence_justifications (
    attendance_id,
    student_id,
    justification_type,
    reason,
    document_url,
    status
  ) VALUES (
    p_attendance_id,
    auth.uid(),
    p_justification_type,
    p_reason,
    p_document_url,
    'pending'
  )
  RETURNING id INTO justification_id;

  -- Create notification for student
  PERFORM create_notification(
    auth.uid(),
    'Justification soumise',
    'Votre justification d''absence a été soumise et est en attente de révision.',
    'attendance',
    '/student?tab=attendance'
  );

  RETURN justification_id;
END;
$$;

-- Function for students to view their attendance with justifications
CREATE OR REPLACE FUNCTION get_student_attendance_with_justifications(
  p_course_id UUID DEFAULT NULL,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS TABLE(
  attendance_id UUID,
  course_id UUID,
  course_title TEXT,
  attendance_date DATE,
  status TEXT,
  notes TEXT,
  session_type TEXT,
  justification_id UUID,
  justification_status TEXT,
  justification_reason TEXT,
  justification_type TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id as attendance_id,
    a.course_id,
    c.title as course_title,
    a.attendance_date,
    a.status,
    a.notes,
    COALESCE(cs.session_type, 'lecture'::text) as session_type,
    aj.id as justification_id,
    aj.status as justification_status,
    aj.reason as justification_reason,
    aj.justification_type,
    aj.reviewed_at
  FROM attendance a
  JOIN courses c ON c.id = a.course_id
  LEFT JOIN class_sessions cs ON cs.id = a.session_id
  LEFT JOIN absence_justifications aj ON aj.attendance_id = a.id
  WHERE a.student_id = auth.uid()
    AND (p_course_id IS NULL OR a.course_id = p_course_id)
    AND (p_start_date IS NULL OR a.attendance_date >= p_start_date)
    AND (p_end_date IS NULL OR a.attendance_date <= p_end_date)
  ORDER BY a.attendance_date DESC, a.created_at DESC;
END;
$$;