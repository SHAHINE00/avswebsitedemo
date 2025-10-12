-- Add bulk user management operations

-- Function: Bulk promote users to admin
CREATE OR REPLACE FUNCTION public.bulk_promote_users_to_admin(p_user_ids uuid[])
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_id uuid;
  success_count integer := 0;
  failed_count integer := 0;
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
      -- Insert admin role (will skip if already exists due to unique constraint)
      INSERT INTO public.user_roles (user_id, role, assigned_by)
      VALUES (user_id, 'admin'::app_role, auth.uid())
      ON CONFLICT (user_id, role) DO NOTHING;
      
      -- Log admin activity
      PERFORM public.log_admin_activity(
        'user_promoted_bulk',
        'user',
        user_id,
        jsonb_build_object('new_role', 'admin')
      );
      
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
    'errors', error_details
  );
END;
$function$;

-- Function: Bulk demote users to student
CREATE OR REPLACE FUNCTION public.bulk_demote_users_to_student(p_user_ids uuid[])
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_id uuid;
  success_count integer := 0;
  failed_count integer := 0;
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
      -- Remove admin role
      DELETE FROM public.user_roles 
      WHERE user_roles.user_id = bulk_demote_users_to_student.user_id 
      AND role = 'admin'::app_role;
      
      -- Ensure student role exists
      INSERT INTO public.user_roles (user_id, role, assigned_by)
      VALUES (user_id, 'student'::app_role, auth.uid())
      ON CONFLICT (user_id, role) DO NOTHING;
      
      -- Log admin activity
      PERFORM public.log_admin_activity(
        'user_demoted_bulk',
        'user',
        user_id,
        jsonb_build_object('new_role', 'student')
      );
      
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
    'errors', error_details
  );
END;
$function$;

-- Function: Bulk enroll users in a course
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
      
      -- Log admin activity
      PERFORM public.log_admin_activity(
        'user_enrolled_bulk',
        'course_enrollment',
        user_id,
        jsonb_build_object('course_id', p_course_id)
      );
      
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

-- Function: Bulk unenroll users from a course
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
      
      -- Log admin activity
      PERFORM public.log_admin_activity(
        'user_unenrolled_bulk',
        'course_enrollment',
        user_id,
        jsonb_build_object('course_id', p_course_id)
      );
      
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