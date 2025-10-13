-- Add student_tags table for tagging functionality
CREATE TABLE IF NOT EXISTS public.student_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  tag_name text NOT NULL,
  tag_color text DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES public.profiles(id)
);

-- Add student_status to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS student_status text DEFAULT 'active';

-- Add last_activity tracking
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_activity_at timestamptz;

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_profiles_student_status 
  ON public.profiles(student_status);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at_desc 
  ON public.profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_student_tags_user_id 
  ON public.student_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_student_tags_tag_name 
  ON public.student_tags(tag_name);

-- Enable RLS on student_tags
ALTER TABLE public.student_tags ENABLE ROW LEVEL SECURITY;

-- RLS policies for student_tags
CREATE POLICY "Admins can manage all tags"
  ON public.student_tags FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their own tags"
  ON public.student_tags FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Add function to get student analytics
CREATE OR REPLACE FUNCTION public.get_student_analytics(
  p_start_date date DEFAULT (CURRENT_DATE - INTERVAL '30 days'),
  p_end_date date DEFAULT CURRENT_DATE
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Check if caller is admin
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  SELECT jsonb_build_object(
    'total_students', (SELECT COUNT(*) FROM profiles),
    'new_this_month', (SELECT COUNT(*) FROM profiles WHERE created_at >= date_trunc('month', CURRENT_DATE)),
    'active_students', (SELECT COUNT(*) FROM profiles WHERE student_status = 'active'),
    'total_revenue', COALESCE((SELECT SUM(amount) FROM payment_transactions WHERE payment_status = 'completed'), 0),
    'monthly_revenue', (
      SELECT jsonb_agg(jsonb_build_object(
        'month', to_char(date_trunc('month', paid_at), 'Mon YYYY'),
        'revenue', COALESCE(SUM(amount), 0)
      ))
      FROM payment_transactions
      WHERE paid_at BETWEEN p_start_date AND p_end_date
        AND payment_status = 'completed'
      GROUP BY date_trunc('month', paid_at)
      ORDER BY date_trunc('month', paid_at)
    ),
    'enrollments_by_program', (
      SELECT jsonb_agg(jsonb_build_object(
        'program', COALESCE(p.formation_type, 'Unknown'),
        'count', COUNT(*)
      ))
      FROM profiles p
      WHERE p.formation_type IS NOT NULL
      GROUP BY p.formation_type
    ),
    'completion_rate', (
      SELECT CASE 
        WHEN COUNT(*) > 0 
        THEN ROUND((COUNT(*) FILTER (WHERE status = 'completed')::numeric / COUNT(*) * 100), 2)
        ELSE 0 
      END
      FROM course_enrollments
    ),
    'certificates_issued', (SELECT COUNT(*) FROM certificates WHERE is_active = true),
    'payment_status_distribution', (
      SELECT jsonb_agg(jsonb_build_object(
        'status', payment_status,
        'count', COUNT(*),
        'amount', COALESCE(SUM(amount), 0)
      ))
      FROM payment_transactions
      GROUP BY payment_status
    )
  ) INTO result;

  RETURN result;
END;
$$;