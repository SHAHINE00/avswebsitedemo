-- Create enum for course status
CREATE TYPE course_status AS ENUM ('draft', 'published', 'archived');

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  modules TEXT,
  duration TEXT,
  diploma TEXT,
  feature1 TEXT,
  feature2 TEXT,
  icon TEXT DEFAULT 'brain',
  gradient_from TEXT DEFAULT 'from-academy-blue',
  gradient_to TEXT DEFAULT 'to-academy-purple',
  button_text_color TEXT DEFAULT 'text-academy-blue',
  floating_color1 TEXT DEFAULT 'bg-academy-lightblue/20',
  floating_color2 TEXT DEFAULT 'bg-white/10',
  link_to TEXT,
  status course_status DEFAULT 'draft',
  display_order INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Create analytics and monitoring tables
CREATE TABLE public.analytics_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  metadata JSONB,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  hour INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.system_monitoring (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  status TEXT DEFAULT 'normal',
  threshold_warning NUMERIC,
  threshold_critical NUMERIC,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.system_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value INTEGER NOT NULL,
  metric_data JSONB,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.user_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.report_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  config JSONB NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_templates ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.check_admin_role()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- RLS policies for courses
CREATE POLICY "Anyone can view published courses" 
  ON public.courses 
  FOR SELECT 
  USING (status = 'published');

CREATE POLICY "Admins can manage all courses" 
  ON public.courses 
  FOR ALL 
  USING (check_admin_role());

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (check_admin_role());

-- Admin activity logs policies
CREATE POLICY "Admins can view all activity logs" 
  ON public.admin_activity_logs 
  FOR SELECT 
  USING (check_admin_role());

CREATE POLICY "Admins can create activity logs" 
  ON public.admin_activity_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = admin_id AND check_admin_role());

-- Analytics and monitoring policies
CREATE POLICY "Admins can manage analytics data" 
  ON public.analytics_data 
  FOR ALL 
  USING (check_admin_role());

CREATE POLICY "Admins can manage system monitoring" 
  ON public.system_monitoring 
  FOR ALL 
  USING (check_admin_role());

CREATE POLICY "Admins can manage system analytics" 
  ON public.system_analytics 
  FOR ALL 
  USING (check_admin_role());

CREATE POLICY "Admins can view user activity logs" 
  ON public.user_activity_logs 
  FOR SELECT 
  USING (check_admin_role());

CREATE POLICY "Admins can manage report templates" 
  ON public.report_templates 
  FOR ALL 
  USING (check_admin_role());

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  -- Log user registration activity
  INSERT INTO public.user_activity_logs (user_id, action, details)
  VALUES (NEW.id, 'user_registered', jsonb_build_object('email', NEW.email));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to log admin activities
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

-- Function to get dashboard metrics
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

-- Function to get system health metrics
CREATE OR REPLACE FUNCTION public.get_system_health()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  table_stats JSONB;
BEGIN
  -- Check if user is admin
  IF NOT check_admin_role() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Get table stats with proper column names
  SELECT jsonb_object_agg(table_name, stats) INTO table_stats
  FROM (
    SELECT 
      (schemaname||'.'||relname) as table_name,
      jsonb_build_object(
        'rows', COALESCE(n_tup_ins + n_tup_upd + n_tup_del, 0),
        'size', COALESCE(pg_total_relation_size(schemaname||'.'||relname), 0)
      ) as stats
    FROM pg_stat_user_tables
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname||'.'||relname) DESC NULLS LAST
    LIMIT 10
  ) t;

  -- Build the final result with error handling
  SELECT jsonb_build_object(
    'database_size', COALESCE(pg_database_size(current_database()), 0),
    'active_connections', COALESCE((SELECT count(*) FROM pg_stat_activity WHERE state = 'active'), 0),
    'table_stats', COALESCE(table_stats, '{}'::jsonb),
    'last_updated', now()
  ) INTO result;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    -- Return fallback data if there's an error
    RETURN jsonb_build_object(
      'database_size', 0,
      'active_connections', 0,
      'table_stats', '{}'::jsonb,
      'last_updated', now(),
      'error', SQLERRM
    );
END;
$$;

-- Function for advanced analytics
CREATE OR REPLACE FUNCTION public.get_advanced_analytics(
  p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  p_end_date DATE DEFAULT CURRENT_DATE,
  p_metric_types TEXT[] DEFAULT NULL
)
RETURNS TABLE(
  date DATE,
  metric_type TEXT,
  metric_name TEXT,
  value NUMERIC,
  metadata JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is admin
  IF NOT check_admin_role() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT 
    a.date,
    a.metric_type,
    a.metric_name,
    a.value,
    a.metadata
  FROM analytics_data a
  WHERE a.date BETWEEN p_start_date AND p_end_date
    AND (p_metric_types IS NULL OR a.metric_type = ANY(p_metric_types))
  ORDER BY a.date DESC, a.created_at DESC;
END;
$$;

-- Insert sample courses
INSERT INTO public.courses (
  title, subtitle, modules, duration, diploma, feature1, feature2, 
  icon, gradient_from, gradient_to, button_text_color, 
  floating_color1, floating_color2, link_to, status, display_order
) VALUES 
(
  'Formation IA', 'Intelligence Artificielle', '27 modules', '18 mois', 
  'Diplôme certifié', 'Machine Learning', 'Big Data', 'brain',
  'from-academy-blue', 'to-academy-purple', 'text-academy-blue',
  'bg-academy-lightblue/20', 'bg-white/10', '/ai-course', 'published', 1
),
(
  'Formation Programmation', 'Développement Web & Mobile', '4 modules', '24 semaines',
  'Diplôme certifié', 'Full Stack', 'DevOps', 'code',
  'from-academy-purple', 'to-academy-lightblue', 'text-academy-purple',
  'bg-academy-blue/20', 'bg-white/10', '/programming-course', 'published', 2
),
(
  'Formation Cybersécurité', 'Sécurité Informatique', '6 modules', '12 mois',
  'Diplôme certifié', 'Ethical Hacking', 'Network Security', 'shield',
  'from-red-500', 'to-red-700', 'text-red-600',
  'bg-red-100/20', 'bg-white/10', '/cybersecurity-course', 'published', 3
);

-- Create indexes for better performance
CREATE INDEX idx_analytics_data_date_type ON analytics_data(date, metric_type);
CREATE INDEX idx_analytics_data_created_at ON analytics_data(created_at);
CREATE INDEX idx_system_monitoring_created_at ON system_monitoring(created_at);
CREATE INDEX idx_system_monitoring_metric_name ON system_monitoring(metric_name);
CREATE INDEX idx_courses_status_display ON courses(status, display_order);
CREATE INDEX idx_profiles_role ON profiles(role);