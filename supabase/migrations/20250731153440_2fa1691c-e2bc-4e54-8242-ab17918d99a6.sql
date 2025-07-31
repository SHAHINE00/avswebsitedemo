-- Add missing navbar and footer sections to the home page
INSERT INTO public.section_visibility (page_name, section_key, section_name, section_description, is_visible, display_order) VALUES
('home', 'global_navbar', 'Navigation Bar', 'Main navigation and branding', true, 0),
('home', 'global_footer', 'Footer', 'Footer with links and contact info', true, 9)
ON CONFLICT (page_name, section_key) DO NOTHING;