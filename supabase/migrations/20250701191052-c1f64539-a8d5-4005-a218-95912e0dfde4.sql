
-- Create admin activity logs table
CREATE TABLE public.admin_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create system analytics table for storing metrics
CREATE TABLE public.system_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value INTEGER NOT NULL,
  metric_data JSONB,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user activity logs table
CREATE TABLE public.user_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for admin activity logs
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all activity logs" 
  ON public.admin_activity_logs 
  FOR SELECT 
  USING (check_admin_role());

CREATE POLICY "Admins can create activity logs" 
  ON public.admin_activity_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = admin_id AND check_admin_role());

-- Add RLS policies for system analytics
ALTER TABLE public.system_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage system analytics" 
  ON public.system_analytics 
  FOR ALL 
  USING (check_admin_role());

-- Add RLS policies for user activity logs
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view user activity logs" 
  ON public.user_activity_logs 
  FOR SELECT 
  USING (check_admin_role());

-- Add analytics fields to courses table
ALTER TABLE public.courses 
ADD COLUMN view_count INTEGER DEFAULT 0,
ADD COLUMN last_viewed_at TIMESTAMP WITH TIME ZONE;

-- Create function to log admin activities
CREATE OR REPLACE FUNCTION public.log_admin_activity(
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.admin_activity_logs (admin_id, action, entity_type, entity_id, details)
  VALUES (auth.uid(), p_action, p_entity_type, p_entity_id, p_details);
END;
$$;

-- Create function to get dashboard metrics
CREATE OR REPLACE FUNCTION public.get_dashboard_metrics()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Check if user is admin
  IF NOT check_admin_role() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  SELECT jsonb_build_object(
    'total_courses', (SELECT COUNT(*) FROM courses),
    'published_courses', (SELECT COUNT(*) FROM courses WHERE status = 'published'),
    'draft_courses', (SELECT COUNT(*) FROM courses WHERE status = 'draft'),
    'archived_courses', (SELECT COUNT(*) FROM courses WHERE status = 'archived'),
    'total_users', (SELECT COUNT(*) FROM profiles),
    'total_admins', (SELECT COUNT(*) FROM profiles WHERE role = 'admin'),
    'recent_users', (SELECT COUNT(*) FROM profiles WHERE created_at >= NOW() - INTERVAL '30 days'),
    'recent_courses', (SELECT COUNT(*) FROM courses WHERE created_at >= NOW() - INTERVAL '30 days')
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Update the handle_new_user function to log user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  -- Log user registration activity
  INSERT INTO public.user_activity_logs (user_id, action, details)
  VALUES (NEW.id, 'user_registered', jsonb_build_object('email', NEW.email));
  
  RETURN NEW;
END;
$$;
