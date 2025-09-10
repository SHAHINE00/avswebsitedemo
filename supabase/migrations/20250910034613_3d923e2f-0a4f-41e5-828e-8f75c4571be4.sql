-- Create admin enrollment management functions
CREATE OR REPLACE FUNCTION admin_enroll_user_in_course(p_user_id uuid, p_course_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  enrollment_id uuid;
BEGIN
  -- Check if caller is admin
  IF NOT check_admin_role() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Insert enrollment (will fail if already enrolled due to unique constraint)
  INSERT INTO public.course_enrollments (user_id, course_id)
  VALUES (p_user_id, p_course_id)
  RETURNING id INTO enrollment_id;

  -- Log admin activity
  PERFORM public.log_admin_activity(
    'user_enrolled_by_admin',
    'course_enrollment',
    enrollment_id,
    jsonb_build_object('user_id', p_user_id, 'course_id', p_course_id)
  );

  RETURN enrollment_id;
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'User already enrolled in this course';
END;
$$;

-- Create admin function to remove user from course
CREATE OR REPLACE FUNCTION admin_unenroll_user_from_course(p_user_id uuid, p_course_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  enrollment_record RECORD;
BEGIN
  -- Check if caller is admin
  IF NOT check_admin_role() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Get enrollment details for logging
  SELECT * INTO enrollment_record
  FROM public.course_enrollments
  WHERE user_id = p_user_id AND course_id = p_course_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User is not enrolled in this course';
  END IF;

  -- Remove enrollment
  DELETE FROM public.course_enrollments
  WHERE user_id = p_user_id AND course_id = p_course_id;

  -- Log admin activity
  PERFORM public.log_admin_activity(
    'user_unenrolled_by_admin',
    'course_enrollment',
    enrollment_record.id,
    jsonb_build_object('user_id', p_user_id, 'course_id', p_course_id)
  );
END;
$$;

-- Create function to get user enrollments for admin view
CREATE OR REPLACE FUNCTION get_user_enrollments_for_admin(p_user_id uuid)
RETURNS TABLE(
  enrollment_id uuid,
  course_id uuid,
  course_title text,
  enrolled_at timestamp with time zone,
  progress_percentage integer,
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT check_admin_role() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT 
    ce.id as enrollment_id,
    ce.course_id,
    c.title as course_title,
    ce.enrolled_at,
    ce.progress_percentage,
    ce.status
  FROM course_enrollments ce
  JOIN courses c ON ce.course_id = c.id
  WHERE ce.user_id = p_user_id
  ORDER BY ce.enrolled_at DESC;
END;
$$;