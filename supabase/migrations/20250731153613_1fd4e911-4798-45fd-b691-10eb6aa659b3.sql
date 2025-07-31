-- Add missing navbar and footer sections to the home page (using INSERT without ON CONFLICT)
INSERT INTO public.section_visibility (page_name, section_key, section_name, section_description, is_visible, display_order) 
SELECT 'home', 'global_navbar', 'Navigation Bar', 'Main navigation and branding', true, 0
WHERE NOT EXISTS (SELECT 1 FROM section_visibility WHERE page_name = 'home' AND section_key = 'global_navbar');

INSERT INTO public.section_visibility (page_name, section_key, section_name, section_description, is_visible, display_order) 
SELECT 'home', 'global_footer', 'Footer', 'Footer with links and contact info', true, 9
WHERE NOT EXISTS (SELECT 1 FROM section_visibility WHERE page_name = 'home' AND section_key = 'global_footer');