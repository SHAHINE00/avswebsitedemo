-- Add function to create announcements for multiple courses
CREATE OR REPLACE FUNCTION create_bulk_announcements(
  p_course_ids UUID[],
  p_title TEXT,
  p_content TEXT,
  p_priority TEXT DEFAULT 'normal',
  p_is_pinned BOOLEAN DEFAULT false
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prof_id UUID;
  course_id UUID;
  created_count INTEGER := 0;
BEGIN
  -- Get professor ID
  prof_id := get_professor_id(auth.uid());
  
  -- Verify professor has access to all courses (or is admin)
  IF NOT is_admin(auth.uid()) THEN
    IF NOT (
      SELECT COUNT(*) = array_length(p_course_ids, 1)
      FROM teaching_assignments ta
      WHERE ta.professor_id = prof_id 
        AND ta.course_id = ANY(p_course_ids)
    ) THEN
      RAISE EXCEPTION 'Access denied to one or more courses';
    END IF;
  END IF;

  -- Create announcement for each course
  FOREACH course_id IN ARRAY p_course_ids
  LOOP
    INSERT INTO course_announcements (
      course_id, 
      professor_id, 
      created_by, 
      title, 
      content, 
      priority, 
      is_pinned
    )
    VALUES (
      course_id,
      prof_id,
      auth.uid(),
      p_title,
      p_content,
      p_priority,
      p_is_pinned
    );
    
    created_count := created_count + 1;
  END LOOP;

  RETURN created_count;
END;
$$;