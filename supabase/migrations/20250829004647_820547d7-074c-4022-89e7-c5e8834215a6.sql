-- Create secure RPCs for promoting/demoting users
-- Ensures only admins can change roles and logs the action

CREATE OR REPLACE FUNCTION public.promote_user_to_admin(p_target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Verify caller is admin
  IF NOT check_admin_role() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Upsert profile with admin role
  INSERT INTO public.profiles (id, role, updated_at)
  VALUES (p_target_user_id, 'admin', now())
  ON CONFLICT (id) DO UPDATE SET role = 'admin', updated_at = now();

  -- Log admin activity
  PERFORM public.log_admin_activity(
    'user_promoted',
    'user',
    p_target_user_id,
    jsonb_build_object('new_role','admin')
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.demote_user_to_user(p_target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Verify caller is admin
  IF NOT check_admin_role() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Upsert profile with user role
  INSERT INTO public.profiles (id, role, updated_at)
  VALUES (p_target_user_id, 'user', now())
  ON CONFLICT (id) DO UPDATE SET role = 'user', updated_at = now();

  -- Log admin activity
  PERFORM public.log_admin_activity(
    'user_demoted',
    'user',
    p_target_user_id,
    jsonb_build_object('new_role','user')
  );
END;
$$;