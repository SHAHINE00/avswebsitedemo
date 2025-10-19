-- Add notification trigger for new grades
CREATE OR REPLACE FUNCTION notify_student_new_grade()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  course_title TEXT;
  percentage NUMERIC;
BEGIN
  -- Get course title
  SELECT title INTO course_title FROM courses WHERE id = NEW.course_id;
  
  -- Calculate percentage
  percentage := ROUND((NEW.grade / NULLIF(NEW.max_grade, 0)) * 100, 2);
  
  -- Create notification for the student
  PERFORM create_notification(
    NEW.student_id,
    'Nouvelle note disponible',
    format('Vous avez reçu une note de %s/%s (%s%%) pour "%s" dans le cours %s',
      NEW.grade, NEW.max_grade, percentage, NEW.assignment_name, course_title),
    'grade',
    '/dashboard?tab=grades'
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for grades
DROP TRIGGER IF EXISTS trigger_notify_new_grade ON grades;
CREATE TRIGGER trigger_notify_new_grade
  AFTER INSERT ON grades
  FOR EACH ROW
  EXECUTE FUNCTION notify_student_new_grade();

-- Add notification trigger for absences
CREATE OR REPLACE FUNCTION notify_student_absence()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  course_title TEXT;
  session_info TEXT;
BEGIN
  -- Only notify for absences
  IF NEW.status != 'absent' THEN
    RETURN NEW;
  END IF;
  
  -- Get course title
  SELECT title INTO course_title FROM courses WHERE id = NEW.course_id;
  
  -- Get session details if available
  IF NEW.session_id IS NOT NULL THEN
    SELECT format('%s - %s', session_date, session_type)
    INTO session_info
    FROM class_sessions
    WHERE id = NEW.session_id;
  ELSE
    session_info := to_char(NEW.attendance_date, 'DD/MM/YYYY');
  END IF;
  
  -- Create notification for the student
  PERFORM create_notification(
    NEW.student_id,
    'Absence enregistrée',
    format('Vous avez été marqué absent pour le cours %s le %s. Si vous avez un justificatif, veuillez le soumettre.',
      course_title, session_info),
    'attendance',
    '/dashboard?tab=attendance'
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for attendance absences
DROP TRIGGER IF EXISTS trigger_notify_absence ON attendance;
CREATE TRIGGER trigger_notify_absence
  AFTER INSERT OR UPDATE ON attendance
  FOR EACH ROW
  EXECUTE FUNCTION notify_student_absence();

-- Add notification for upcoming class sessions (will be called by edge function)
CREATE OR REPLACE FUNCTION notify_upcoming_session(
  p_session_id UUID,
  p_hours_before INTEGER DEFAULT 24
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_record RECORD;
  enrolled_student RECORD;
  notification_count INTEGER := 0;
  session_time TEXT;
BEGIN
  -- Get session details
  SELECT 
    cs.*,
    c.title as course_title
  INTO session_record
  FROM class_sessions cs
  JOIN courses c ON c.id = cs.course_id
  WHERE cs.id = p_session_id;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  -- Format session time
  session_time := format('%s de %s à %s',
    to_char(session_record.session_date, 'DD/MM/YYYY'),
    session_record.start_time::text,
    session_record.end_time::text
  );
  
  -- Notify all enrolled students
  FOR enrolled_student IN
    SELECT DISTINCT user_id
    FROM course_enrollments
    WHERE course_id = session_record.course_id
      AND status = 'active'
  LOOP
    PERFORM create_notification(
      enrolled_student.user_id,
      'Rappel de cours',
      format('Rappel: Cours de %s prévu %s%s',
        session_record.course_title,
        session_time,
        CASE 
          WHEN session_record.room_location IS NOT NULL 
          THEN ' - Salle: ' || session_record.room_location 
          ELSE '' 
        END
      ),
      'reminder',
      '/dashboard?tab=schedule'
    );
    
    notification_count := notification_count + 1;
  END LOOP;
  
  RETURN notification_count;
END;
$$;