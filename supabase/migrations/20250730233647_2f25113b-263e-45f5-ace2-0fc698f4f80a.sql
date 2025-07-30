-- Create table for section visibility settings
CREATE TABLE public.section_visibility (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key text NOT NULL UNIQUE,
  section_name text NOT NULL,
  section_description text,
  is_visible boolean NOT NULL DEFAULT true,
  page_name text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

-- Enable RLS
ALTER TABLE public.section_visibility ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage section visibility" 
ON public.section_visibility 
FOR ALL 
USING (check_admin_role());

CREATE POLICY "Anyone can view section visibility" 
ON public.section_visibility 
FOR SELECT 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_section_visibility_updated_at
BEFORE UPDATE ON public.section_visibility
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default sections for the website
INSERT INTO public.section_visibility (section_key, section_name, section_description, page_name, display_order) VALUES
  ('home_hero', 'Hero Section', 'Main hero section with call-to-action', 'home', 1),
  ('home_features', 'Features Section', 'Showcase of key features and benefits', 'home', 2),
  ('home_course_guide', 'Course Selection Guide', 'Enhanced course selection guide', 'home', 3),
  ('home_instructors', 'Instructors Section', 'Meet our expert instructors', 'home', 4),
  ('home_testimonials', 'Testimonials Section', 'Student testimonials and reviews', 'home', 5),
  ('home_faq', 'FAQ Section', 'Frequently asked questions', 'home', 6),
  ('home_cta', 'Call to Action', 'Final call-to-action section', 'home', 7),
  ('about_hero', 'About Hero', 'About page hero section', 'about', 1),
  ('about_mission', 'Mission Section', 'Our mission and vision', 'about', 2),
  ('about_values', 'Values Section', 'Company values and principles', 'about', 3),
  ('about_stats', 'Statistics Section', 'Key achievements and numbers', 'about', 4),
  ('about_history', 'History Section', 'Company timeline and milestones', 'about', 5),
  ('about_cta', 'About CTA', 'Call-to-action on about page', 'about', 6),
  ('features_main', 'Features Content', 'Main features content section', 'features', 1),
  ('global_navbar', 'Navigation Bar', 'Main website navigation', 'global', 1),
  ('global_footer', 'Footer', 'Website footer with links and info', 'global', 2);