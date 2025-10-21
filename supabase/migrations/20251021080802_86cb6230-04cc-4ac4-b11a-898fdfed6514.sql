-- Add test data for class sessions, schedules, attendance, and grades
-- This will make all the class management features display data correctly

DO $$
DECLARE
  v_class_id UUID;
  v_course_id UUID;
  v_professor_id UUID;
  v_student_ids UUID[];
  v_session_id UUID;
BEGIN
  -- Get the first active class
  SELECT id, course_id, professor_id 
  INTO v_class_id, v_course_id, v_professor_id
  FROM public.course_classes 
  WHERE status = 'active' 
  LIMIT 1;

  IF v_class_id IS NULL THEN
    RAISE NOTICE 'No active class found, skipping test data creation';
    RETURN;
  END IF;

  -- Get enrolled students for this class
  SELECT ARRAY_AGG(user_id) 
  INTO v_student_ids
  FROM public.course_enrollments 
  WHERE class_id = v_class_id;

  IF v_student_ids IS NULL OR array_length(v_student_ids, 1) = 0 THEN
    RAISE NOTICE 'No students enrolled, skipping test data creation';
    RETURN;
  END IF;

  -- Create class schedules (recurring)
  INSERT INTO public.class_schedules (
    course_id, 
    class_id,
    professor_id,
    day_of_week, 
    start_time, 
    end_time, 
    room_location,
    session_type
  ) VALUES 
    (v_course_id, v_class_id, v_professor_id, 1, '09:00', '12:00', 'Salle A-101', 'lecture'),
    (v_course_id, v_class_id, v_professor_id, 3, '14:00', '17:00', 'Lab B-202', 'lab'),
    (v_course_id, v_class_id, v_professor_id, 5, '10:00', '13:00', 'Salle A-101', 'lecture')
  ON CONFLICT DO NOTHING;

  -- Create past sessions (completed)
  INSERT INTO public.class_sessions (
    course_id,
    class_id,
    professor_id,
    session_date,
    start_time,
    end_time,
    room_location,
    session_type,
    status,
    attendance_marked
  ) VALUES 
    (v_course_id, v_class_id, v_professor_id, CURRENT_DATE - 14, '09:00', '12:00', 'Salle A-101', 'lecture', 'completed', true),
    (v_course_id, v_class_id, v_professor_id, CURRENT_DATE - 12, '14:00', '17:00', 'Lab B-202', 'lab', 'completed', true),
    (v_course_id, v_class_id, v_professor_id, CURRENT_DATE - 7, '09:00', '12:00', 'Salle A-101', 'lecture', 'completed', true),
    (v_course_id, v_class_id, v_professor_id, CURRENT_DATE - 5, '14:00', '17:00', 'Lab B-202', 'lab', 'completed', true),
    (v_course_id, v_class_id, v_professor_id, CURRENT_DATE - 2, '10:00', '13:00', 'Salle A-101', 'lecture', 'completed', true)
  RETURNING id INTO v_session_id;

  -- Create upcoming sessions (scheduled)
  INSERT INTO public.class_sessions (
    course_id,
    class_id,
    professor_id,
    session_date,
    start_time,
    end_time,
    room_location,
    session_type,
    status,
    attendance_marked
  ) VALUES 
    (v_course_id, v_class_id, v_professor_id, CURRENT_DATE + 2, '09:00', '12:00', 'Salle A-101', 'lecture', 'scheduled', false),
    (v_course_id, v_class_id, v_professor_id, CURRENT_DATE + 5, '14:00', '17:00', 'Lab B-202', 'lab', 'scheduled', false),
    (v_course_id, v_class_id, v_professor_id, CURRENT_DATE + 9, '09:00', '12:00', 'Salle A-101', 'lecture', 'scheduled', false),
    (v_course_id, v_class_id, v_professor_id, CURRENT_DATE + 12, '14:00', '17:00', 'Lab B-202', 'lab', 'scheduled', false),
    (v_course_id, v_class_id, v_professor_id, CURRENT_DATE + 16, '10:00', '13:00', 'Salle A-101', 'lecture', 'scheduled', false);

  -- Create attendance records for each student for past sessions
  FOR i IN 1..array_length(v_student_ids, 1) LOOP
    -- Session 1: Everyone present
    INSERT INTO public.attendance (
      student_id, 
      course_id, 
      professor_id,
      attendance_date, 
      status
    ) VALUES 
      (v_student_ids[i], v_course_id, v_professor_id, CURRENT_DATE - 14, 'present');

    -- Session 2: Mix of present/absent
    INSERT INTO public.attendance (
      student_id, 
      course_id, 
      professor_id,
      attendance_date, 
      status
    ) VALUES 
      (v_student_ids[i], v_course_id, v_professor_id, CURRENT_DATE - 12, 
       CASE WHEN i % 3 = 0 THEN 'absent' ELSE 'present' END);

    -- Session 3: Everyone present
    INSERT INTO public.attendance (
      student_id, 
      course_id, 
      professor_id,
      attendance_date, 
      status
    ) VALUES 
      (v_student_ids[i], v_course_id, v_professor_id, CURRENT_DATE - 7, 'present');

    -- Session 4: Some late
    INSERT INTO public.attendance (
      student_id, 
      course_id, 
      professor_id,
      attendance_date, 
      status
    ) VALUES 
      (v_student_ids[i], v_course_id, v_professor_id, CURRENT_DATE - 5, 
       CASE WHEN i % 4 = 0 THEN 'late' ELSE 'present' END);

    -- Session 5: Most present
    INSERT INTO public.attendance (
      student_id, 
      course_id, 
      professor_id,
      attendance_date, 
      status
    ) VALUES 
      (v_student_ids[i], v_course_id, v_professor_id, CURRENT_DATE - 2, 
       CASE WHEN i % 5 = 0 THEN 'absent' ELSE 'present' END);
  END LOOP;

  -- Create grade records for each student
  FOR i IN 1..array_length(v_student_ids, 1) LOOP
    -- Quiz 1
    INSERT INTO public.grades (
      student_id, 
      course_id, 
      professor_id,
      assignment_name, 
      grade, 
      max_grade,
      graded_at
    ) VALUES 
      (v_student_ids[i], v_course_id, v_professor_id, 'Quiz 1', 
       70 + (i * 3) % 25, 100, CURRENT_DATE - 10);

    -- Assignment 1
    INSERT INTO public.grades (
      student_id, 
      course_id, 
      professor_id,
      assignment_name, 
      grade, 
      max_grade,
      graded_at
    ) VALUES 
      (v_student_ids[i], v_course_id, v_professor_id, 'Assignment 1', 
       75 + (i * 4) % 20, 100, CURRENT_DATE - 8);

    -- Midterm Exam
    INSERT INTO public.grades (
      student_id, 
      course_id, 
      professor_id,
      assignment_name, 
      grade, 
      max_grade,
      graded_at
    ) VALUES 
      (v_student_ids[i], v_course_id, v_professor_id, 'Midterm Exam', 
       65 + (i * 5) % 30, 100, CURRENT_DATE - 3);

    -- Lab Project
    INSERT INTO public.grades (
      student_id, 
      course_id, 
      professor_id,
      assignment_name, 
      grade, 
      max_grade,
      graded_at
    ) VALUES 
      (v_student_ids[i], v_course_id, v_professor_id, 'Lab Project', 
       80 + (i * 2) % 15, 100, CURRENT_DATE - 1);
  END LOOP;

  RAISE NOTICE 'Test data created successfully for class: %', v_class_id;
END $$;