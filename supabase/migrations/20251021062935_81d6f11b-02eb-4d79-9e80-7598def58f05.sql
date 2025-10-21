-- Fix variable scoping in bulk operations: use v_user_id and remove invalid table-qualified variable references

-- 1) bulk_enroll_users
CREATE OR REPLACE FUNCTION public.bulk_enroll_users(p_user_ids uuid[], p_course_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id uuid;
  success_count integer := 0;
  failed_count integer := 0;
  skipped_count integer := 0;
  error_details jsonb := '[]'::jsonb;
BEGIN
  -- Check if caller is admin
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Verify course exists
  IF NOT EXISTS (SELECT 1 FROM public.courses WHERE id = p_course_id) THEN
    RAISE EXCEPTION 'Course not found';
  END IF;

  -- Process each user
  FOREACH v_user_id IN ARRAY p_user_ids LOOP
    BEGIN
      -- Check if already enrolled
      IF EXISTS (
        SELECT 1 FROM public.course_enrollments 
        WHERE user_id = v_user_id 
          AND course_id = p_course_id
      ) THEN
        skipped_count := skipped_count + 1;
        CONTINUE;
      END IF;

      -- Insert enrollment
      INSERT INTO public.course_enrollments (user_id, course_id)
      VALUES (v_user_id, p_course_id);
      
      -- Try to log admin activity (non-blocking)
      BEGIN
        PERFORM public.log_admin_activity(
          'user_enrolled_bulk',
          'course_enrollment',
          v_user_id,
          jsonb_build_object('course_id', p_course_id)
        );
      EXCEPTION WHEN OTHERS THEN
        -- Log the error but don't fail the enrollment
        RAISE WARNING 'Failed to log activity for user %: %', v_user_id, SQLERRM;
      END;
      
      success_count := success_count + 1;
    EXCEPTION WHEN OTHERS THEN
      failed_count := failed_count + 1;
      error_details := error_details || jsonb_build_object(
        'user_id', v_user_id,
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

-- 2) bulk_unenroll_users
CREATE OR REPLACE FUNCTION public.bulk_unenroll_users(p_user_ids uuid[], p_course_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id uuid;
  success_count integer := 0;
  failed_count integer := 0;
  skipped_count integer := 0;
  error_details jsonb := '[]'::jsonb;
BEGIN
  -- Check if caller is admin
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Process each user
  FOREACH v_user_id IN ARRAY p_user_ids LOOP
    BEGIN
      -- Check if enrolled
      IF NOT EXISTS (
        SELECT 1 FROM public.course_enrollments 
        WHERE user_id = v_user_id 
          AND course_id = p_course_id
      ) THEN
        skipped_count := skipped_count + 1;
        CONTINUE;
      END IF;

      -- Delete enrollment
      DELETE FROM public.course_enrollments
      WHERE user_id = v_user_id 
        AND course_id = p_course_id;
      
      -- Try to log admin activity (non-blocking)
      BEGIN
        PERFORM public.log_admin_activity(
          'user_unenrolled_bulk',
          'course_enrollment',
          v_user_id,
          jsonb_build_object('course_id', p_course_id)
        );
      EXCEPTION WHEN OTHERS THEN
        -- Log the error but don't fail the unenrollment
        RAISE WARNING 'Failed to log activity for user %: %', v_user_id, SQLERRM;
      END;
      
      success_count := success_count + 1;
    EXCEPTION WHEN OTHERS THEN
      failed_count := failed_count + 1;
      error_details := error_details || jsonb_build_object(
        'user_id', v_user_id,
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

-- 3) bulk_demote_users_to_student
CREATE OR REPLACE FUNCTION public.bulk_demote_users_to_student(p_user_ids uuid[])
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id uuid;
  success_count integer := 0;
  failed_count integer := 0;
  error_details jsonb := '[]'::jsonb;
BEGIN
  -- Check if caller is admin
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Process each user
  FOREACH v_user_id IN ARRAY p_user_ids LOOP
    BEGIN
      -- Remove admin role
      DELETE FROM public.user_roles 
      WHERE user_id = v_user_id 
        AND role = 'admin'::app_role;
      
      -- Ensure student role exists
      INSERT INTO public.user_roles (user_id, role, assigned_by)
      VALUES (v_user_id, 'student'::app_role, auth.uid())
      ON CONFLICT (user_id, role) DO NOTHING;
      
      -- Log admin activity
      PERFORM public.log_admin_activity(
        'user_demoted_bulk',
        'user',
        v_user_id,
        jsonb_build_object('new_role', 'student')
      );
      
      success_count := success_count + 1;
    EXCEPTION WHEN OTHERS THEN
      failed_count := failed_count + 1;
      error_details := error_details || jsonb_build_object(
        'user_id', v_user_id,
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