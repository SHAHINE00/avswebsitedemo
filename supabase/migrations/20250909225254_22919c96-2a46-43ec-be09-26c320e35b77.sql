-- Create enum for user approval status
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');

-- Add status column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN status approval_status DEFAULT 'approved';

-- Create pending_users table for pre-approval storage
CREATE TABLE public.pending_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  formation_type TEXT,
  formation_domaine TEXT,
  formation_programme TEXT,
  formation_programme_title TEXT,
  formation_tag TEXT,
  encrypted_password TEXT NOT NULL,
  status approval_status NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES public.profiles(id),
  rejection_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on pending_users
ALTER TABLE public.pending_users ENABLE ROW LEVEL SECURITY;

-- Create policies for pending_users
CREATE POLICY "Admins can manage all pending users" 
ON public.pending_users 
FOR ALL 
USING (check_admin_role());

-- Create approval_notifications table for tracking admin notifications
CREATE TABLE public.approval_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pending_user_id UUID NOT NULL REFERENCES public.pending_users(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES public.profiles(id),
  notification_type TEXT NOT NULL CHECK (notification_type IN ('new_registration', 'approved', 'rejected')),
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  email_sent BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS on approval_notifications
ALTER TABLE public.approval_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for approval_notifications
CREATE POLICY "Admins can manage approval notifications" 
ON public.approval_notifications 
FOR ALL 
USING (check_admin_role());

-- Create trigger for updating pending_users updated_at
CREATE TRIGGER update_pending_users_updated_at
BEFORE UPDATE ON public.pending_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle user approval
CREATE OR REPLACE FUNCTION public.approve_pending_user(
  p_pending_user_id UUID,
  p_admin_id UUID
) RETURNS JSONB AS $$
DECLARE
  pending_user RECORD;
  new_user_id UUID;
  result JSONB;
BEGIN
  -- Check if caller is admin
  IF NOT check_admin_role() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Get pending user details
  SELECT * INTO pending_user 
  FROM public.pending_users 
  WHERE id = p_pending_user_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pending user not found or already processed';
  END IF;

  -- Update pending user status
  UPDATE public.pending_users 
  SET 
    status = 'approved',
    approved_at = now(),
    approved_by = p_admin_id,
    updated_at = now()
  WHERE id = p_pending_user_id;

  -- Create notification record
  INSERT INTO public.approval_notifications (
    pending_user_id, 
    admin_id, 
    notification_type,
    metadata
  ) VALUES (
    p_pending_user_id, 
    p_admin_id, 
    'approved',
    jsonb_build_object('approved_at', now())
  );

  -- Log admin activity
  PERFORM public.log_admin_activity(
    'user_approved',
    'pending_user',
    p_pending_user_id,
    jsonb_build_object(
      'email', pending_user.email,
      'full_name', pending_user.full_name
    )
  );

  -- Return user details for edge function processing
  SELECT jsonb_build_object(
    'id', pending_user.id,
    'email', pending_user.email,
    'full_name', pending_user.full_name,
    'encrypted_password', pending_user.encrypted_password,
    'formation_tag', pending_user.formation_tag,
    'metadata', pending_user.metadata
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to handle user rejection
CREATE OR REPLACE FUNCTION public.reject_pending_user(
  p_pending_user_id UUID,
  p_admin_id UUID,
  p_rejection_reason TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  pending_user RECORD;
  result JSONB;
BEGIN
  -- Check if caller is admin
  IF NOT check_admin_role() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Get pending user details
  SELECT * INTO pending_user 
  FROM public.pending_users 
  WHERE id = p_pending_user_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pending user not found or already processed';
  END IF;

  -- Update pending user status
  UPDATE public.pending_users 
  SET 
    status = 'rejected',
    rejection_reason = p_rejection_reason,
    updated_at = now()
  WHERE id = p_pending_user_id;

  -- Create notification record
  INSERT INTO public.approval_notifications (
    pending_user_id, 
    admin_id, 
    notification_type,
    metadata
  ) VALUES (
    p_pending_user_id, 
    p_admin_id, 
    'rejected',
    jsonb_build_object(
      'rejection_reason', p_rejection_reason,
      'rejected_at', now()
    )
  );

  -- Log admin activity
  PERFORM public.log_admin_activity(
    'user_rejected',
    'pending_user',
    p_pending_user_id,
    jsonb_build_object(
      'email', pending_user.email,
      'full_name', pending_user.full_name,
      'rejection_reason', p_rejection_reason
    )
  );

  -- Return user details for notification
  SELECT jsonb_build_object(
    'id', pending_user.id,
    'email', pending_user.email,
    'full_name', pending_user.full_name,
    'rejection_reason', p_rejection_reason
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;