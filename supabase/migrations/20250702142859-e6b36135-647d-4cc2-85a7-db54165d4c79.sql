-- Create course lessons table
CREATE TABLE public.course_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  video_url TEXT,
  duration_minutes INTEGER,
  lesson_order INTEGER NOT NULL,
  is_preview BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course materials table
CREATE TABLE public.course_materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  download_count INTEGER NOT NULL DEFAULT 0,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course announcements table
CREATE TABLE public.course_announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lesson progress tracking table
CREATE TABLE public.lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completion_date TIMESTAMP WITH TIME ZONE,
  time_spent_minutes INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enable Row Level Security
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course_lessons
CREATE POLICY "Anyone can view published lessons" 
ON public.course_lessons 
FOR SELECT 
USING (status = 'published');

CREATE POLICY "Admins can manage all lessons" 
ON public.course_lessons 
FOR ALL 
USING (check_admin_role());

-- RLS Policies for course_materials
CREATE POLICY "Enrolled users can view course materials" 
ON public.course_materials 
FOR SELECT 
USING (
  is_public = true OR 
  EXISTS (
    SELECT 1 FROM course_enrollments 
    WHERE user_id = auth.uid() AND course_id = course_materials.course_id
  )
);

CREATE POLICY "Admins can manage all materials" 
ON public.course_materials 
FOR ALL 
USING (check_admin_role());

-- RLS Policies for course_announcements
CREATE POLICY "Enrolled users can view course announcements" 
ON public.course_announcements 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM course_enrollments 
    WHERE user_id = auth.uid() AND course_id = course_announcements.course_id
  )
);

CREATE POLICY "Admins can manage all announcements" 
ON public.course_announcements 
FOR ALL 
USING (check_admin_role());

-- RLS Policies for lesson_progress
CREATE POLICY "Users can manage their own progress" 
ON public.lesson_progress 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress" 
ON public.lesson_progress 
FOR SELECT 
USING (check_admin_role());

-- Create indexes for better performance
CREATE INDEX idx_course_lessons_course_id ON public.course_lessons(course_id);
CREATE INDEX idx_course_lessons_order ON public.course_lessons(course_id, lesson_order);
CREATE INDEX idx_course_materials_course_id ON public.course_materials(course_id);
CREATE INDEX idx_course_materials_lesson_id ON public.course_materials(lesson_id);
CREATE INDEX idx_course_announcements_course_id ON public.course_announcements(course_id);
CREATE INDEX idx_lesson_progress_user_lesson ON public.lesson_progress(user_id, lesson_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_course_lessons_updated_at
BEFORE UPDATE ON public.course_lessons
FOR EACH ROW
EXECUTE FUNCTION public.update_blog_updated_at_column();

CREATE TRIGGER update_course_announcements_updated_at
BEFORE UPDATE ON public.course_announcements
FOR EACH ROW
EXECUTE FUNCTION public.update_blog_updated_at_column();