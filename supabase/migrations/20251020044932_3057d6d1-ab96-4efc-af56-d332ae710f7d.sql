-- Function to send bulk notifications to students
CREATE OR REPLACE FUNCTION send_bulk_notification(
  p_title TEXT,
  p_message TEXT,
  p_recipient_type TEXT DEFAULT 'all',
  p_course_id UUID DEFAULT NULL,
  p_student_id UUID DEFAULT NULL,
  p_notification_type TEXT DEFAULT 'general',
  p_priority TEXT DEFAULT 'normal',
  p_send_email BOOLEAN DEFAULT FALSE
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recipient_count INTEGER := 0;
  student_record RECORD;
  prof_id UUID;
BEGIN
  -- Get professor ID and verify permissions
  prof_id := get_professor_id(auth.uid());
  
  IF NOT (is_admin(auth.uid()) OR prof_id IS NOT NULL) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Send to all students
  IF p_recipient_type = 'all' THEN
    FOR student_record IN 
      SELECT DISTINCT ce.user_id 
      FROM course_enrollments ce
      JOIN teaching_assignments ta ON ta.course_id = ce.course_id
      WHERE ta.professor_id = prof_id OR is_admin(auth.uid())
    LOOP
      INSERT INTO notifications (user_id, title, message, type)
      VALUES (student_record.user_id, p_title, p_message, p_notification_type);
      
      recipient_count := recipient_count + 1;
    END LOOP;
  
  -- Send to students in a specific course
  ELSIF p_recipient_type = 'course' AND p_course_id IS NOT NULL THEN
    -- Verify professor has access to this course
    IF NOT (is_admin(auth.uid()) OR 
            EXISTS (SELECT 1 FROM teaching_assignments 
                    WHERE professor_id = prof_id AND course_id = p_course_id)) THEN
      RAISE EXCEPTION 'Access denied to this course';
    END IF;

    FOR student_record IN 
      SELECT user_id FROM course_enrollments WHERE course_id = p_course_id
    LOOP
      INSERT INTO notifications (user_id, title, message, type, action_url)
      VALUES (student_record.user_id, p_title, p_message, p_notification_type, '/courses/' || p_course_id);
      
      recipient_count := recipient_count + 1;
    END LOOP;
  
  -- Send to individual student
  ELSIF p_recipient_type = 'individual' AND p_student_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (p_student_id, p_title, p_message, p_notification_type);
    
    recipient_count := 1;
  END IF;

  -- Log the communication
  INSERT INTO communication_log (user_id, sent_by, communication_type, direction, subject, message, metadata)
  SELECT 
    n.user_id,
    auth.uid(),
    CASE WHEN p_send_email THEN 'email' ELSE 'notification' END,
    'outbound',
    p_title,
    p_message,
    jsonb_build_object(
      'recipient_type', p_recipient_type,
      'priority', p_priority,
      'notification_type', p_notification_type
    )
  FROM notifications n
  WHERE n.created_at >= now() - INTERVAL '1 second';

  RETURN recipient_count;
END;
$$;