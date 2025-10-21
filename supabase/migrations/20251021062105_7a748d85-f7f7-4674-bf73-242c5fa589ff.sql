-- Fix bulk_enroll_users to make logging non-blocking
CREATE OR REPLACE FUNCTION public.bulk_enroll_users(p_user_ids uuid[], p_course_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_id uuid;
  success_count integer := 0;
  failed_count integer := 0;
  skipped_count integer := 0;
  error_details jsonb := '[]'::jsonb;
BEGIN
  -- Check if caller is admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Verify course exists
  IF NOT EXISTS (SELECT 1 FROM courses WHERE id = p_course_id) THEN
    RAISE EXCEPTION 'Course not found';
  END IF;

  -- Process each user
  FOREACH user_id IN ARRAY p_user_ids
  LOOP
    BEGIN
      -- Check if already enrolled
      IF EXISTS (
        SELECT 1 FROM course_enrollments 
        WHERE course_enrollments.user_id = bulk_enroll_users.user_id 
        AND course_id = p_course_id
      ) THEN
        skipped_count := skipped_count + 1;
        CONTINUE;
      END IF;

      -- Insert enrollment
      INSERT INTO public.course_enrollments (user_id, course_id)
      VALUES (user_id, p_course_id);
      
      -- Try to log admin activity (non-blocking)
      BEGIN
        PERFORM public.log_admin_activity(
          'user_enrolled_bulk',
          'course_enrollment',
          user_id,
          jsonb_build_object('course_id', p_course_id)
        );
      EXCEPTION
        WHEN OTHERS THEN
          -- Log the error but don't fail the enrollment
          RAISE WARNING 'Failed to log activity for user %: %', user_id, SQLERRM;
      END;
      
      success_count := success_count + 1;
    EXCEPTION
      WHEN OTHERS THEN
        failed_count := failed_count + 1;
        error_details := error_details || jsonb_build_object(
          'user_id', user_id,
          'error', SQLERRM
        );
    END;
  END LOOP;

  RETURN jsonb_build_object(
    'success_count', success_count,
    'failed_count', failed_count,
    'skipped_count', skipped_count,
    'errors', error_details
  );
END;
$function$;

-- Fix bulk_unenroll_users to make logging non-blocking
CREATE OR REPLACE FUNCTION public.bulk_unenroll_users(p_user_ids uuid[], p_course_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_id uuid;
  success_count integer := 0;
  failed_count integer := 0;
  skipped_count integer := 0;
  error_details jsonb := '[]'::jsonb;
BEGIN
  -- Check if caller is admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Process each user
  FOREACH user_id IN ARRAY p_user_ids
  LOOP
    BEGIN
      -- Check if enrolled
      IF NOT EXISTS (
        SELECT 1 FROM course_enrollments 
        WHERE course_enrollments.user_id = bulk_unenroll_users.user_id 
        AND course_id = p_course_id
      ) THEN
        skipped_count := skipped_count + 1;
        CONTINUE;
      END IF;

      -- Delete enrollment
      DELETE FROM public.course_enrollments
      WHERE course_enrollments.user_id = bulk_unenroll_users.user_id 
      AND course_id = p_course_id;
      
      -- Try to log admin activity (non-blocking)
      BEGIN
        PERFORM public.log_admin_activity(
          'user_unenrolled_bulk',
          'course_enrollment',
          user_id,
          jsonb_build_object('course_id', p_course_id)
        );
      EXCEPTION
        WHEN OTHERS THEN
          -- Log the error but don't fail the unenrollment
          RAISE WARNING 'Failed to log activity for user %: %', user_id, SQLERRM;
      END;
      
      success_count := success_count + 1;
    EXCEPTION
      WHEN OTHERS THEN
        failed_count := failed_count + 1;
        error_details := error_details || jsonb_build_object(
          'user_id', user_id,
          'error', SQLERRM
        );
    END;
  END LOOP;

  RETURN jsonb_build_object(
    'success_count', success_count,
    'failed_count', failed_count,
    'skipped_count', skipped_count,
    'errors', error_details
  );
END;
$function$;