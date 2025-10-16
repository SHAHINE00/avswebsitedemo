-- Phase 1: Add formation columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS formation_type TEXT,
ADD COLUMN IF NOT EXISTS formation_domaine TEXT,
ADD COLUMN IF NOT EXISTS formation_programme TEXT,
ADD COLUMN IF NOT EXISTS formation_tag TEXT;

-- Create student_parents table
CREATE TABLE IF NOT EXISTS public.student_parents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  parent_name TEXT,
  parent_phone TEXT,
  parent_email TEXT,
  parent_relationship TEXT CHECK (parent_relationship IN ('Père', 'Mère', 'Tuteur', 'Autre')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on student_parents
ALTER TABLE public.student_parents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for student_parents
CREATE POLICY "Admins can manage all parent records"
ON public.student_parents
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Students can view their own parent records"
ON public.student_parents
FOR SELECT
TO authenticated
USING (auth.uid() = student_id);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_student_parents_student_id ON public.student_parents(student_id);