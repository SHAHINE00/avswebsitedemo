-- Create subscribers table for non-authenticated registrations
CREATE TABLE public.subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  formation_type TEXT,
  formation_domaine TEXT,
  formation_programme TEXT,
  formation_programme_title TEXT,
  formation_tag TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for subscriber access
CREATE POLICY "Anyone can create subscriber records" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all subscribers" 
ON public.subscribers 
FOR SELECT 
USING (check_admin_role());

CREATE POLICY "Admins can manage all subscribers" 
ON public.subscribers 
FOR ALL 
USING (check_admin_role());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_subscribers_updated_at
BEFORE UPDATE ON public.subscribers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();