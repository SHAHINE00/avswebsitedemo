-- Create tables for enhanced learning features

-- Quiz system tables
CREATE TABLE public.quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER DEFAULT 70,
  max_attempts INTEGER DEFAULT 3,
  time_limit_minutes INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice', -- multiple_choice, true_false, short_answer
  options JSONB, -- For multiple choice questions
  correct_answer TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 1,
  question_order INTEGER NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL,
  user_id UUID NOT NULL,
  score DECIMAL(5,2),
  max_score INTEGER,
  passed BOOLEAN,
  answers JSONB NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_seconds INTEGER
);

-- Notes system table
CREATE TABLE public.lesson_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  note_timestamp INTEGER, -- Timestamp in the video/lesson where note was taken
  is_private BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Discussion system table
CREATE TABLE public.lesson_discussions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID, -- For replies
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE public.quizzes 
ADD CONSTRAINT quizzes_lesson_id_fkey 
FOREIGN KEY (lesson_id) REFERENCES public.course_lessons(id) ON DELETE CASCADE;

ALTER TABLE public.quiz_questions 
ADD CONSTRAINT quiz_questions_quiz_id_fkey 
FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;

ALTER TABLE public.quiz_attempts 
ADD CONSTRAINT quiz_attempts_quiz_id_fkey 
FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;

ALTER TABLE public.lesson_notes 
ADD CONSTRAINT lesson_notes_lesson_id_fkey 
FOREIGN KEY (lesson_id) REFERENCES public.course_lessons(id) ON DELETE CASCADE;

ALTER TABLE public.lesson_discussions 
ADD CONSTRAINT lesson_discussions_lesson_id_fkey 
FOREIGN KEY (lesson_id) REFERENCES public.course_lessons(id) ON DELETE CASCADE;

ALTER TABLE public.lesson_discussions 
ADD CONSTRAINT lesson_discussions_parent_id_fkey 
FOREIGN KEY (parent_id) REFERENCES public.lesson_discussions(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_discussions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quizzes
CREATE POLICY "Anyone can view active quizzes" ON public.quizzes
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage quizzes" ON public.quizzes
FOR ALL USING (check_admin_role());

-- RLS Policies for quiz questions
CREATE POLICY "Anyone can view quiz questions" ON public.quiz_questions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.quizzes 
    WHERE quizzes.id = quiz_questions.quiz_id 
    AND quizzes.is_active = true
  )
);

CREATE POLICY "Admins can manage quiz questions" ON public.quiz_questions
FOR ALL USING (check_admin_role());

-- RLS Policies for quiz attempts
CREATE POLICY "Users can view their own quiz attempts" ON public.quiz_attempts
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz attempts" ON public.quiz_attempts
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz attempts" ON public.quiz_attempts
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all quiz attempts" ON public.quiz_attempts
FOR SELECT USING (check_admin_role());

-- RLS Policies for lesson notes
CREATE POLICY "Users can manage their own notes" ON public.lesson_notes
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all notes" ON public.lesson_notes
FOR SELECT USING (check_admin_role());

-- RLS Policies for lesson discussions
CREATE POLICY "Anyone can view lesson discussions" ON public.lesson_discussions
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create discussions" ON public.lesson_discussions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own discussions" ON public.lesson_discussions
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own discussions" ON public.lesson_discussions
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all discussions" ON public.lesson_discussions
FOR ALL USING (check_admin_role());

-- Create indexes for better performance
CREATE INDEX idx_quizzes_lesson_id ON public.quizzes(lesson_id);
CREATE INDEX idx_quiz_questions_quiz_id ON public.quiz_questions(quiz_id);
CREATE INDEX idx_quiz_questions_order ON public.quiz_questions(quiz_id, question_order);
CREATE INDEX idx_quiz_attempts_user_quiz ON public.quiz_attempts(user_id, quiz_id);
CREATE INDEX idx_lesson_notes_user_lesson ON public.lesson_notes(user_id, lesson_id);
CREATE INDEX idx_lesson_discussions_lesson_id ON public.lesson_discussions(lesson_id);
CREATE INDEX idx_lesson_discussions_parent_id ON public.lesson_discussions(parent_id);

-- Create trigger for updated_at timestamps
CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON public.quizzes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lesson_notes_updated_at
  BEFORE UPDATE ON public.lesson_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lesson_discussions_updated_at
  BEFORE UPDATE ON public.lesson_discussions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();