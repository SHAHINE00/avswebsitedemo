-- Phase 1: Class Schedule Foundation
-- Create class_schedules table for recurring schedule definitions
CREATE TABLE IF NOT EXISTS public.class_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  professor_id UUID NOT NULL REFERENCES public.professors(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room_location TEXT,
  session_type TEXT NOT NULL DEFAULT 'lecture' CHECK (session_type IN ('lecture', 'lab', 'tutorial', 'exam', 'workshop')),
  is_recurring BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

CREATE TABLE IF NOT EXISTS public.class_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES public.class_schedules(id) ON DELETE SET NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  professor_id UUID NOT NULL REFERENCES public.professors(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room_location TEXT,
  session_type TEXT NOT NULL DEFAULT 'lecture',
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  attendance_marked BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(course_id, session_date, start_time)
);

ALTER TABLE public.attendance 
ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES public.class_sessions(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.absence_justifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attendance_id UUID NOT NULL REFERENCES public.attendance(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  justification_type TEXT NOT NULL CHECK (justification_type IN ('medical', 'family_emergency', 'official_event', 'other')),
  reason TEXT NOT NULL,
  document_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.absence_justifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all schedules"
ON public.class_schedules FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Professors can manage schedules for their courses"
ON public.class_schedules FOR ALL
USING (
  professor_id = get_professor_id(auth.uid()) OR
  EXISTS (SELECT 1 FROM teaching_assignments ta WHERE ta.professor_id = get_professor_id(auth.uid()) AND ta.course_id = class_schedules.course_id)
)
WITH CHECK (
  professor_id = get_professor_id(auth.uid()) OR
  EXISTS (SELECT 1 FROM teaching_assignments ta WHERE ta.professor_id = get_professor_id(auth.uid()) AND ta.course_id = class_schedules.course_id)
);

CREATE POLICY "Students can view schedules for enrolled courses"
ON public.class_schedules FOR SELECT
USING (EXISTS (SELECT 1 FROM course_enrollments ce WHERE ce.user_id = auth.uid() AND ce.course_id = class_schedules.course_id));

CREATE POLICY "Admins can manage all sessions"
ON public.class_sessions FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Professors can manage sessions for their courses"
ON public.class_sessions FOR ALL
USING (
  professor_id = get_professor_id(auth.uid()) OR
  EXISTS (SELECT 1 FROM teaching_assignments ta WHERE ta.professor_id = get_professor_id(auth.uid()) AND ta.course_id = class_sessions.course_id)
)
WITH CHECK (
  professor_id = get_professor_id(auth.uid()) OR
  EXISTS (SELECT 1 FROM teaching_assignments ta WHERE ta.professor_id = get_professor_id(auth.uid()) AND ta.course_id = class_sessions.course_id)
);

CREATE POLICY "Students can view sessions for enrolled courses"
ON public.class_sessions FOR SELECT
USING (EXISTS (SELECT 1 FROM course_enrollments ce WHERE ce.user_id = auth.uid() AND ce.course_id = class_sessions.course_id));

CREATE POLICY "Admins can manage all justifications"
ON public.absence_justifications FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Professors can view and review justifications for their courses"
ON public.absence_justifications FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM attendance a
    JOIN class_sessions cs ON a.session_id = cs.id
    WHERE a.id = absence_justifications.attendance_id
    AND (cs.professor_id = get_professor_id(auth.uid()) OR
         EXISTS (SELECT 1 FROM teaching_assignments ta WHERE ta.professor_id = get_professor_id(auth.uid()) AND ta.course_id = cs.course_id))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM attendance a
    JOIN class_sessions cs ON a.session_id = cs.id
    WHERE a.id = absence_justifications.attendance_id
    AND (cs.professor_id = get_professor_id(auth.uid()) OR
         EXISTS (SELECT 1 FROM teaching_assignments ta WHERE ta.professor_id = get_professor_id(auth.uid()) AND ta.course_id = cs.course_id))
  )
);

CREATE POLICY "Students can manage their own justifications"
ON public.absence_justifications FOR ALL
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_class_schedules_course ON public.class_schedules(course_id);
CREATE INDEX IF NOT EXISTS idx_class_schedules_professor ON public.class_schedules(professor_id);
CREATE INDEX IF NOT EXISTS idx_class_schedules_day ON public.class_schedules(day_of_week);
CREATE INDEX IF NOT EXISTS idx_class_sessions_course ON public.class_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_class_sessions_professor ON public.class_sessions(professor_id);
CREATE INDEX IF NOT EXISTS idx_class_sessions_date ON public.class_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_class_sessions_schedule ON public.class_sessions(schedule_id);
CREATE INDEX IF NOT EXISTS idx_attendance_session ON public.attendance(session_id);
CREATE INDEX IF NOT EXISTS idx_absence_justifications_attendance ON public.absence_justifications(attendance_id);
CREATE INDEX IF NOT EXISTS idx_absence_justifications_student ON public.absence_justifications(student_id);

CREATE OR REPLACE FUNCTION public.generate_sessions_from_schedule(
  p_schedule_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE(session_id UUID, session_date DATE)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  schedule_record RECORD;
  iter_date DATE;
  new_session_id UUID;
BEGIN
  SELECT * INTO schedule_record FROM class_schedules WHERE id = p_schedule_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Schedule not found'; END IF;
  
  iter_date := p_start_date;
  WHILE iter_date <= p_end_date LOOP
    IF EXTRACT(DOW FROM iter_date)::INTEGER = schedule_record.day_of_week THEN
      INSERT INTO class_sessions (schedule_id, course_id, professor_id, session_date, start_time, end_time, room_location, session_type)
      VALUES (p_schedule_id, schedule_record.course_id, schedule_record.professor_id, iter_date, schedule_record.start_time, schedule_record.end_time, schedule_record.room_location, schedule_record.session_type)
      ON CONFLICT (course_id, session_date, start_time) DO NOTHING
      RETURNING id INTO new_session_id;
      
      IF new_session_id IS NOT NULL THEN
        session_id := new_session_id;
        session_date := iter_date;
        RETURN NEXT;
      END IF;
    END IF;
    iter_date := iter_date + INTERVAL '1 day';
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_student_upcoming_sessions(p_student_id UUID DEFAULT auth.uid(), p_days_ahead INTEGER DEFAULT 7)
RETURNS TABLE(session_id UUID, course_id UUID, course_title TEXT, professor_name TEXT, session_date DATE, start_time TIME, end_time TIME, room_location TEXT, session_type TEXT, status TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT cs.id, cs.course_id, c.title, p.full_name, cs.session_date, cs.start_time, cs.end_time, cs.room_location, cs.session_type, cs.status
  FROM class_sessions cs
  JOIN courses c ON c.id = cs.course_id
  JOIN professors p ON p.id = cs.professor_id
  WHERE cs.session_date BETWEEN CURRENT_DATE AND CURRENT_DATE + p_days_ahead
    AND EXISTS (SELECT 1 FROM course_enrollments ce WHERE ce.user_id = p_student_id AND ce.course_id = cs.course_id)
  ORDER BY cs.session_date, cs.start_time;
END;
$$;