-- Fix generate_sessions_from_schedule function to properly handle admin access and provide better error messages

CREATE OR REPLACE FUNCTION generate_sessions_from_schedule(
  p_schedule_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_schedule RECORD;
  v_current_date DATE;
  v_sessions_created INTEGER := 0;
  v_prof_id UUID;
  v_session_datetime TIMESTAMP;
BEGIN
  -- Get professor ID (can be NULL for admins)
  v_prof_id := get_professor_id(auth.uid());
  
  -- Get the schedule with proper error handling
  SELECT * INTO v_schedule
  FROM class_schedules
  WHERE id = p_schedule_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Schedule with ID % not found', p_schedule_id;
  END IF;
  
  -- Enhanced access control: Allow admins OR professors assigned to the course
  IF NOT (
    is_admin(auth.uid()) OR 
    v_prof_id = v_schedule.professor_id OR
    EXISTS (
      SELECT 1 FROM teaching_assignments ta
      WHERE ta.professor_id = v_prof_id 
      AND ta.course_id = v_schedule.course_id
    )
  ) THEN
    RAISE EXCEPTION 'Access denied: You do not have permission to generate sessions for this course';
  END IF;
  
  -- Validate date range
  IF p_end_date < p_start_date THEN
    RAISE EXCEPTION 'End date must be after start date';
  END IF;
  
  -- Loop through dates and create sessions
  v_current_date := p_start_date;
  
  WHILE v_current_date <= p_end_date LOOP
    -- Check if this date matches the day of week from the schedule
    IF EXTRACT(DOW FROM v_current_date) = v_schedule.day_of_week THEN
      -- Combine date with time
      v_session_datetime := v_current_date + v_schedule.start_time;
      
      -- Only insert if session doesn't already exist
      IF NOT EXISTS (
        SELECT 1 FROM class_sessions
        WHERE course_id = v_schedule.course_id
        AND session_date = v_current_date
        AND start_time = v_schedule.start_time
        AND professor_id = v_schedule.professor_id
      ) THEN
        INSERT INTO class_sessions (
          course_id,
          professor_id,
          schedule_id,
          session_date,
          start_time,
          end_time,
          room_location,
          session_type,
          notes,
          status
        ) VALUES (
          v_schedule.course_id,
          v_schedule.professor_id,
          p_schedule_id,
          v_current_date,
          v_schedule.start_time,
          v_schedule.end_time,
          v_schedule.room_location,
          v_schedule.session_type,
          v_schedule.notes,
          'scheduled'
        );
        
        v_sessions_created := v_sessions_created + 1;
      END IF;
    END IF;
    
    -- Move to next day
    v_current_date := v_current_date + INTERVAL '1 day';
  END LOOP;
  
  -- Return detailed result
  RETURN jsonb_build_object(
    'sessions_created', v_sessions_created,
    'start_date', p_start_date,
    'end_date', p_end_date,
    'schedule_id', p_schedule_id,
    'message', format('Successfully generated %s sessions', v_sessions_created)
  );
END;
$$;