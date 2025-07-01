
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

-- Enable RLS on both tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for courses
CREATE POLICY "Anyone can view published courses" 
  ON public.courses 
  FOR SELECT 
  USING (status = 'published');

CREATE POLICY "Admins can manage all courses" 
  ON public.courses 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

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
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some default courses
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
);
