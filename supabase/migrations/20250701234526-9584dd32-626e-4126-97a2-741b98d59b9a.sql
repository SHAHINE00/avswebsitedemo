
-- Create appointments table for booking system
CREATE TABLE public.appointments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  appointment_type text NOT NULL CHECK (appointment_type IN ('phone', 'video', 'office')),
  subject text,
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create course enrollments table
CREATE TABLE public.course_enrollments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  last_accessed_at timestamp with time zone,
  completion_date timestamp with time zone,
  UNIQUE(user_id, course_id)
);

-- Enable RLS on appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Users can view and manage their own appointments
CREATE POLICY "Users can view their own appointments" 
  ON public.appointments 
  FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can create appointments" 
  ON public.appointments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can update their own appointments" 
  ON public.appointments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Admins can manage all appointments
CREATE POLICY "Admins can manage all appointments" 
  ON public.appointments 
  FOR ALL 
  USING (check_admin_role());

-- Enable RLS on course enrollments
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

-- Users can view and manage their own enrollments
CREATE POLICY "Users can view their own enrollments" 
  ON public.course_enrollments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own enrollments" 
  ON public.course_enrollments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments" 
  ON public.course_enrollments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Admins can manage all enrollments
CREATE POLICY "Admins can manage all enrollments" 
  ON public.course_enrollments 
  FOR ALL 
  USING (check_admin_role());

-- Create function to update appointment status
CREATE OR REPLACE FUNCTION public.update_appointment_status(
  appointment_id uuid,
  new_status text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is admin or appointment owner
  IF NOT (check_admin_role() OR EXISTS (
    SELECT 1 FROM public.appointments 
    WHERE id = appointment_id AND user_id = auth.uid()
  )) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  UPDATE public.appointments 
  SET status = new_status, updated_at = now() 
  WHERE id = appointment_id;
END;
$$;

-- Create function to enroll user in course
CREATE OR REPLACE FUNCTION public.enroll_in_course(
  p_course_id uuid
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  enrollment_id uuid;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Insert enrollment (will fail if already enrolled due to unique constraint)
  INSERT INTO public.course_enrollments (user_id, course_id)
  VALUES (auth.uid(), p_course_id)
  RETURNING id INTO enrollment_id;

  -- Log enrollment activity
  INSERT INTO public.user_activity_logs (user_id, action, details)
  VALUES (auth.uid(), 'course_enrolled', jsonb_build_object('course_id', p_course_id));

  RETURN enrollment_id;
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Already enrolled in this course';
END;
$$;
