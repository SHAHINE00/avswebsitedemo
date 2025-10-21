-- Fix test data for class A-09 (0dd62cd5-c95d-49ca-bdea-c41b8f0b74fa)
-- Using correct professor_id: 252368e4-ff98-4c6a-b1ab-30f1d5da451e

DO $$
DECLARE
  v_class_id uuid := '0dd62cd5-c95d-49ca-bdea-c41b8f0b74fa';
  v_course_id uuid := 'a345ea49-0a92-4263-a35e-33babef22819';
  v_professor_id uuid := '252368e4-ff98-4c6a-b1ab-30f1d5da451e';
  v_student1_id uuid;
  v_student2_id uuid;
  v_session1_id uuid;
  v_session2_id uuid;
  v_session3_id uuid;
  v_schedule_id uuid;
BEGIN
  -- Get the two enrolled students
  SELECT user_id INTO v_student1_id 
  FROM course_enrollments 
  WHERE class_id = v_class_id 
  LIMIT 1;
  
  SELECT user_id INTO v_student2_id 
  FROM course_enrollments 
  WHERE class_id = v_class_id 
  OFFSET 1 LIMIT 1;

  -- Create class schedule (every Monday and Wednesday, 10:00-12:00)
  INSERT INTO class_schedules (course_id, class_id, professor_id, day_of_week, start_time, end_time, room_location, session_type, is_recurring)
  VALUES 
    (v_course_id, v_class_id, v_professor_id, 1, '10:00', '12:00', 'Salle 101', 'lecture', true),
    (v_course_id, v_class_id, v_professor_id, 3, '10:00', '12:00', 'Salle 101', 'lecture', true);

  -- Store schedule ID for sessions
  SELECT id INTO v_schedule_id FROM class_schedules WHERE class_id = v_class_id LIMIT 1;

  -- Create past sessions (completed)
  INSERT INTO class_sessions (course_id, class_id, professor_id, session_date, start_time, end_time, room_location, session_type, status, attendance_marked, schedule_id)
  VALUES 
    (v_course_id, v_class_id, v_professor_id, CURRENT_DATE - INTERVAL '14 days', '10:00', '12:00', 'Salle 101', 'lecture', 'completed', true, v_schedule_id),
    (v_course_id, v_class_id, v_professor_id, CURRENT_DATE - INTERVAL '12 days', '10:00', '12:00', 'Salle 101', 'lecture', 'completed', true, v_schedule_id),
    (v_course_id, v_class_id, v_professor_id, CURRENT_DATE - INTERVAL '7 days', '10:00', '12:00', 'Salle 101', 'lecture', 'completed', true, v_schedule_id),
    (v_course_id, v_class_id, v_professor_id, CURRENT_DATE - INTERVAL '5 days', '10:00', '12:00', 'Salle 101', 'practical', 'completed', true, v_schedule_id);

  -- Create upcoming sessions
  INSERT INTO class_sessions (course_id, class_id, professor_id, session_date, start_time, end_time, room_location, session_type, status, attendance_marked, schedule_id)
  VALUES 
    (v_course_id, v_class_id, v_professor_id, CURRENT_DATE + INTERVAL '2 days', '10:00', '12:00', 'Salle 101', 'lecture', 'scheduled', false, v_schedule_id),
    (v_course_id, v_class_id, v_professor_id, CURRENT_DATE + INTERVAL '5 days', '10:00', '12:00', 'Salle 101', 'lecture', 'scheduled', false, v_schedule_id),
    (v_course_id, v_class_id, v_professor_id, CURRENT_DATE + INTERVAL '9 days', '10:00', '12:00', 'Salle 101', 'practical', 'scheduled', false, v_schedule_id);

  -- Get session IDs for attendance
  SELECT id INTO v_session1_id FROM class_sessions WHERE class_id = v_class_id AND session_date = CURRENT_DATE - INTERVAL '14 days';
  SELECT id INTO v_session2_id FROM class_sessions WHERE class_id = v_class_id AND session_date = CURRENT_DATE - INTERVAL '12 days';
  SELECT id INTO v_session3_id FROM class_sessions WHERE class_id = v_class_id AND session_date = CURRENT_DATE - INTERVAL '7 days';

  -- Create attendance records for past sessions
  IF v_student1_id IS NOT NULL AND v_student2_id IS NOT NULL THEN
    -- Session 1 - both present
    INSERT INTO attendance (course_id, session_id, student_id, professor_id, attendance_date, status)
    VALUES 
      (v_course_id, v_session1_id, v_student1_id, v_professor_id, CURRENT_DATE - INTERVAL '14 days', 'present'),
      (v_course_id, v_session1_id, v_student2_id, v_professor_id, CURRENT_DATE - INTERVAL '14 days', 'present');

    -- Session 2 - student 1 present, student 2 absent
    INSERT INTO attendance (course_id, session_id, student_id, professor_id, attendance_date, status)
    VALUES 
      (v_course_id, v_session2_id, v_student1_id, v_professor_id, CURRENT_DATE - INTERVAL '12 days', 'present'),
      (v_course_id, v_session2_id, v_student2_id, v_professor_id, CURRENT_DATE - INTERVAL '12 days', 'absent');

    -- Session 3 - both present
    INSERT INTO attendance (course_id, session_id, student_id, professor_id, attendance_date, status)
    VALUES 
      (v_course_id, v_session3_id, v_student1_id, v_professor_id, CURRENT_DATE - INTERVAL '7 days', 'present'),
      (v_course_id, v_session3_id, v_student2_id, v_professor_id, CURRENT_DATE - INTERVAL '7 days', 'present');

    -- Create grade records
    INSERT INTO grades (course_id, student_id, professor_id, assignment_name, grade, max_grade, comment)
    VALUES 
      (v_course_id, v_student1_id, v_professor_id, 'Quiz 1 - Introduction', 18, 20, 'Excellent travail'),
      (v_course_id, v_student1_id, v_professor_id, 'TP 1 - Algorithmes de base', 16, 20, 'Bien'),
      (v_course_id, v_student1_id, v_professor_id, 'Projet Mi-parcours', 17, 20, 'Très bon projet'),
      (v_course_id, v_student2_id, v_professor_id, 'Quiz 1 - Introduction', 15, 20, 'Bon résultat'),
      (v_course_id, v_student2_id, v_professor_id, 'TP 1 - Algorithmes de base', 14, 20, 'À améliorer'),
      (v_course_id, v_student2_id, v_professor_id, 'Projet Mi-parcours', 16, 20, 'Bon travail');
  END IF;

  -- Create some course materials
  INSERT INTO course_materials (course_id, title, description, file_type, file_url, file_size, is_public)
  VALUES 
    (v_course_id, 'Syllabus du cours', 'Programme complet du cours Introduction à l''IA', 'pdf', '/materials/ia-syllabus.pdf', 245678, true),
    (v_course_id, 'Slides - Chapitre 1', 'Introduction aux concepts de base de l''IA', 'pdf', '/materials/slides-ch1.pdf', 1234567, false),
    (v_course_id, 'TP 1 - Énoncé', 'Travaux pratiques sur les algorithmes', 'pdf', '/materials/tp1.pdf', 456789, false),
    (v_course_id, 'Dataset - Exercices', 'Données pour les exercices pratiques', 'zip', '/materials/dataset.zip', 5678901, false);

END $$;