
-- Create analytics aggregation tables
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

-- Create system monitoring table
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

-- Create report templates table
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

-- Add RLS policies
ALTER TABLE public.analytics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_templates ENABLE ROW LEVEL SECURITY;

-- Analytics data policies
CREATE POLICY "Admins can manage analytics data" 
  ON public.analytics_data 
  FOR ALL 
  USING (check_admin_role());

-- System monitoring policies
CREATE POLICY "Admins can manage system monitoring" 
  ON public.system_monitoring 
  FOR ALL 
  USING (check_admin_role());

-- Report templates policies
CREATE POLICY "Admins can manage report templates" 
  ON public.report_templates 
  FOR ALL 
  USING (check_admin_role());

-- Create function to get advanced analytics data
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

-- Create function to get system health metrics
CREATE OR REPLACE FUNCTION public.get_system_health()
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
    'database_size', pg_database_size(current_database()),
    'active_connections', (SELECT count(*) FROM pg_stat_activity WHERE state = 'active'),
    'table_stats', (
      SELECT jsonb_object_agg(tablename, stats)
      FROM (
        SELECT 
          schemaname||'.'||tablename as tablename,
          jsonb_build_object(
            'rows', n_tup_ins + n_tup_upd + n_tup_del,
            'size', pg_total_relation_size(schemaname||'.'||tablename)
          ) as stats
        FROM pg_stat_user_tables
        WHERE schemaname = 'public'
        LIMIT 10
      ) t
    ),
    'last_updated', now()
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Create indexes for better performance
CREATE INDEX idx_analytics_data_date_type ON analytics_data(date, metric_type);
CREATE INDEX idx_analytics_data_created_at ON analytics_data(created_at);
CREATE INDEX idx_system_monitoring_created_at ON system_monitoring(created_at);
CREATE INDEX idx_system_monitoring_metric_name ON system_monitoring(metric_name);
