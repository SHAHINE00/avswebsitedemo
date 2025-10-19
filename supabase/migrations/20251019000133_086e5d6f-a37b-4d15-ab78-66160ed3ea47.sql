-- Add unique constraint to grades table for upsert functionality
-- This allows a student to have only one grade per assignment per course
ALTER TABLE public.grades
ADD CONSTRAINT grades_student_course_assignment_unique 
UNIQUE (student_id, course_id, assignment_name);