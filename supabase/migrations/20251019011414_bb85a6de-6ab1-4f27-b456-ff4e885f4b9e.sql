-- Drop the existing function first
DROP FUNCTION IF EXISTS public.generate_sessions_from_schedule(uuid, date, date);

-- Create function to generate class sessions from a recurring schedule
CREATE OR REPLACE FUNCTION public.generate_sessions_from_schedule(
  p_schedule_id uuid,
  p_start_date date,
  p_end_date date
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_schedule RECORD;
  v_current_date date;
  v_day_offset integer;
  v_sessions_created integer := 0;
  v_prof_id uuid;
BEGIN
  -- Get professor ID
  v_prof_id := get_professor_id(auth.uid());
  
  -- Get the schedule details
  SELECT cs.* INTO v_schedule
  FROM class_schedules cs
  WHERE cs.id = p_schedule_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Schedule not found';
  END IF;
  
  -- Verify professor has access
  IF NOT (
    is_admin(auth.uid()) OR 
    v_schedule.professor_id = v_prof_id OR
    EXISTS (
      SELECT 1 FROM teaching_assignments ta
      WHERE ta.professor_id = v_prof_id AND ta.course_id = v_schedule.course_id
    )
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  -- Calculate the first occurrence of the target day of week
  v_day_offset := (v_schedule.day_of_week - EXTRACT(DOW FROM p_start_date)::integer + 7) % 7;
  v_current_date := p_start_date + v_day_offset;
  
  -- Generate sessions for each occurrence of the day within the date range
  WHILE v_current_date <= p_end_date LOOP
    -- Check if session doesn't already exist for this date
    IF NOT EXISTS (
      SELECT 1 FROM class_sessions csess
      WHERE csess.course_id = v_schedule.course_id
        AND csess.session_date = v_current_date
        AND csess.start_time = v_schedule.start_time
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
    
    -- Move to next week
    v_current_date := v_current_date + INTERVAL '7 days';
  END LOOP;
  
  RETURN jsonb_build_object(
    'sessions_created', v_sessions_created,
    'start_date', p_start_date,
    'end_date', p_end_date
  );
END;
$$;