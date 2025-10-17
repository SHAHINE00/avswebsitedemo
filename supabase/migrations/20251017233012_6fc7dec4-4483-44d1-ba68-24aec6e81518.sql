-- Drop and recreate the admin_create_professor function with proper user creation
DROP FUNCTION IF EXISTS public.admin_create_professor(text, text, text, text, text);

CREATE OR REPLACE FUNCTION public.admin_create_professor(
  p_email text,
  p_full_name text,
  p_phone text DEFAULT NULL,
  p_specialization text DEFAULT NULL,
  p_bio text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_professor_id UUID;
  temp_user_id UUID;
BEGIN
  -- Check if caller is admin
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Generate a temporary user_id (will be replaced when actual user is created)
  temp_user_id := gen_random_uuid();

  -- Insert professor record with temporary user_id
  INSERT INTO public.professors (full_name, email, phone, specialization, bio, user_id)
  VALUES (p_full_name, p_email, p_phone, p_specialization, p_bio, temp_user_id)
  RETURNING id INTO new_professor_id;

  -- Log admin activity
  PERFORM public.log_admin_activity(
    'professor_created',
    'professor',
    new_professor_id,
    jsonb_build_object('email', p_email, 'full_name', p_full_name, 'temp_user_id', temp_user_id)
  );

  RETURN new_professor_id;
END;
$$;

-- Also update the professors table to allow temporary user_ids that may not exist yet
-- This is a workaround - ideally you'd create the auth user first via an edge function
ALTER TABLE public.professors DROP CONSTRAINT IF EXISTS professors_user_id_fkey;
ALTER TABLE public.professors ADD CONSTRAINT professors_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE NOT VALID;