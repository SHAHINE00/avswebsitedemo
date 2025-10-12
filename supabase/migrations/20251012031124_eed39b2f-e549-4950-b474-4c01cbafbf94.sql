-- Step 1: Security Architecture Refactoring (Final Fix)
CREATE TYPE public.app_role AS ENUM ('admin', 'instructor', 'student');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT public.has_role(_user_id, 'admin'::app_role) $$;

INSERT INTO public.user_roles (user_id, role, assigned_at)
SELECT id, CASE WHEN role = 'admin' THEN 'admin'::app_role ELSE 'student'::app_role END, created_at
FROM public.profiles WHERE role IS NOT NULL ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'student'::app_role FROM public.profiles
WHERE id NOT IN (SELECT user_id FROM public.user_roles) ON CONFLICT (user_id, role) DO NOTHING;

CREATE POLICY "Only admins can manage user roles" ON public.user_roles FOR ALL
USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Update all RLS policies
DROP POLICY IF EXISTS "admin_activity_logs_admin_insert" ON public.admin_activity_logs;
DROP POLICY IF EXISTS "admin_activity_logs_admin_select" ON public.admin_activity_logs;
CREATE POLICY "admin_activity_logs_admin_insert" ON public.admin_activity_logs FOR INSERT WITH CHECK ((auth.uid() = admin_id) AND public.is_admin(auth.uid()));
CREATE POLICY "admin_activity_logs_admin_select" ON public.admin_activity_logs FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage analytics data" ON public.analytics_data;
CREATE POLICY "Admins can manage analytics data" ON public.analytics_data FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "appointments_admin_access" ON public.appointments;
CREATE POLICY "appointments_admin_access" ON public.appointments FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage approval notifications" ON public.approval_notifications;
CREATE POLICY "Admins can manage approval notifications" ON public.approval_notifications FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage blog categories" ON public.blog_categories;
CREATE POLICY "Admins can manage blog categories" ON public.blog_categories FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all blog posts" ON public.blog_posts;
CREATE POLICY "Admins can manage all blog posts" ON public.blog_posts FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all comments" ON public.blog_comments;
CREATE POLICY "Admins can manage all comments" ON public.blog_comments FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all certificates" ON public.certificates;
CREATE POLICY "Admins can manage all certificates" ON public.certificates FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all announcements" ON public.course_announcements;
CREATE POLICY "Admins can manage all announcements" ON public.course_announcements FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all enrollments" ON public.course_enrollments;
CREATE POLICY "Admins can manage all enrollments" ON public.course_enrollments FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all lessons" ON public.course_lessons;
CREATE POLICY "Admins can manage all lessons" ON public.course_lessons FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all materials" ON public.course_materials;
CREATE POLICY "Admins can manage all materials" ON public.course_materials FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all detailed progress" ON public.course_progress_detailed;
CREATE POLICY "Admins can view all detailed progress" ON public.course_progress_detailed FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all courses" ON public.courses;
CREATE POLICY "Admins can manage all courses" ON public.courses FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admin can manage email campaigns" ON public.email_campaigns;
CREATE POLICY "Admin can manage email campaigns" ON public.email_campaigns FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "email_stats_admin_only" ON public.email_stats;
CREATE POLICY "email_stats_admin_only" ON public.email_stats FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all learning paths" ON public.learning_paths;
CREATE POLICY "Admins can view all learning paths" ON public.learning_paths FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all discussions" ON public.lesson_discussions;
CREATE POLICY "Admins can manage all discussions" ON public.lesson_discussions FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all notes" ON public.lesson_notes;
CREATE POLICY "Admins can view all notes" ON public.lesson_notes FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all progress" ON public.lesson_progress;
CREATE POLICY "Admins can view all progress" ON public.lesson_progress FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all notifications" ON public.notifications;
CREATE POLICY "Admins can manage all notifications" ON public.notifications FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "pending_users_admin_access_only" ON public.pending_users;
CREATE POLICY "pending_users_admin_access_only" ON public.pending_users FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "profiles_admin_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_update_all" ON public.profiles;
CREATE POLICY "profiles_admin_insert" ON public.profiles FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "profiles_admin_select_all" ON public.profiles FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "profiles_admin_update_all" ON public.profiles FOR UPDATE USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Admins can view all quiz attempts" ON public.quiz_attempts FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage quiz questions" ON public.quiz_questions;
CREATE POLICY "Admins can manage quiz questions" ON public.quiz_questions FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage quizzes" ON public.quizzes;
CREATE POLICY "Admins can manage quizzes" ON public.quizzes FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage report templates" ON public.report_templates;
CREATE POLICY "Admins can manage report templates" ON public.report_templates FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage section visibility" ON public.section_visibility;
CREATE POLICY "Admins can manage section visibility" ON public.section_visibility FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all study goals" ON public.study_goals;
CREATE POLICY "Admins can view all study goals" ON public.study_goals FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all study sessions" ON public.study_sessions;
CREATE POLICY "Admins can view all study sessions" ON public.study_sessions FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "subscribers_admin_access_only" ON public.subscribers;
CREATE POLICY "subscribers_admin_access_only" ON public.subscribers FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage system analytics" ON public.system_analytics;
CREATE POLICY "Admins can manage system analytics" ON public.system_analytics FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage system monitoring" ON public.system_monitoring;
CREATE POLICY "Admins can manage system monitoring" ON public.system_monitoring FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all achievements" ON public.user_achievements;
CREATE POLICY "Admins can manage all achievements" ON public.user_achievements FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

CREATE OR REPLACE FUNCTION public.promote_user_to_admin(p_target_user_id uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN RAISE EXCEPTION 'Access denied. Admin role required.'; END IF;
  INSERT INTO public.user_roles (user_id, role, assigned_by) VALUES (p_target_user_id, 'admin'::app_role, auth.uid()) ON CONFLICT (user_id, role) DO NOTHING;
  PERFORM public.log_admin_activity('user_promoted', 'user', p_target_user_id, jsonb_build_object('new_role','admin'));
END; $function$;

CREATE OR REPLACE FUNCTION public.demote_user_to_user(p_target_user_id uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN RAISE EXCEPTION 'Access denied. Admin role required.'; END IF;
  DELETE FROM public.user_roles WHERE user_id = p_target_user_id AND role = 'admin'::app_role;
  INSERT INTO public.user_roles (user_id, role, assigned_by) VALUES (p_target_user_id, 'student'::app_role, auth.uid()) ON CONFLICT (user_id, role) DO NOTHING;
  PERFORM public.log_admin_activity('user_demoted', 'user', p_target_user_id, jsonb_build_object('new_role','student'));
END; $function$;

CREATE OR REPLACE FUNCTION public.get_dashboard_metrics() RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
DECLARE result JSONB;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN RAISE EXCEPTION 'Access denied. Admin role required.'; END IF;
  SELECT jsonb_build_object(
    'total_courses', (SELECT COUNT(*) FROM courses),
    'published_courses', (SELECT COUNT(*) FROM courses WHERE status = 'published'),
    'draft_courses', (SELECT COUNT(*) FROM courses WHERE status = 'draft'),
    'archived_courses', (SELECT COUNT(*) FROM courses WHERE status = 'archived'),
    'total_users', (SELECT COUNT(*) FROM profiles),
    'total_admins', (SELECT COUNT(DISTINCT user_id) FROM user_roles WHERE role = 'admin'::app_role),
    'recent_users', (SELECT COUNT(*) FROM profiles WHERE created_at >= NOW() - INTERVAL '30 days'),
    'recent_courses', (SELECT COUNT(*) FROM courses WHERE created_at >= NOW() - INTERVAL '30 days'),
    'total_subscribers', (SELECT COUNT(*) FROM subscribers),
    'recent_subscribers', (SELECT COUNT(*) FROM subscribers WHERE created_at >= NOW() - INTERVAL '30 days')
  ) INTO result;
  RETURN result;
END; $function$;