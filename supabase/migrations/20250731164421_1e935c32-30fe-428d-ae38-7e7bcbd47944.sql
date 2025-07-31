-- Use temporary high numbers to avoid conflicts, then reorganize
UPDATE section_visibility SET display_order = 1000 WHERE page_name = 'home' AND section_key = 'home_partners';
UPDATE section_visibility SET display_order = 1001 WHERE page_name = 'home' AND section_key = 'home_features';
UPDATE section_visibility SET display_order = 1002 WHERE page_name = 'home' AND section_key = 'home_course_guide';
UPDATE section_visibility SET display_order = 1003 WHERE page_name = 'home' AND section_key = 'home_instructors';
UPDATE section_visibility SET display_order = 1004 WHERE page_name = 'home' AND section_key = 'home_testimonials';
UPDATE section_visibility SET display_order = 1005 WHERE page_name = 'home' AND section_key = 'home_faq';
UPDATE section_visibility SET display_order = 1006 WHERE page_name = 'home' AND section_key = 'home_cta';

-- Add the new sections
INSERT INTO section_visibility (section_key, section_name, section_description, page_name, display_order, is_visible) VALUES
('home_career_paths', 'Opportunités de Carrière', 'Section présentant les opportunités de carrière dans nos spécialités', 'home', 1, true),
('home_course_universe', 'Notre Univers de Formations', 'Section présentant l''univers complet de nos formations', 'home', 2, true);

-- Now set the final order
UPDATE section_visibility SET display_order = 3 WHERE page_name = 'home' AND section_key = 'home_partners';
UPDATE section_visibility SET display_order = 4 WHERE page_name = 'home' AND section_key = 'home_features';
UPDATE section_visibility SET display_order = 5 WHERE page_name = 'home' AND section_key = 'home_course_guide';
UPDATE section_visibility SET display_order = 6 WHERE page_name = 'home' AND section_key = 'home_instructors';
UPDATE section_visibility SET display_order = 7 WHERE page_name = 'home' AND section_key = 'home_testimonials';
UPDATE section_visibility SET display_order = 8 WHERE page_name = 'home' AND section_key = 'home_faq';
UPDATE section_visibility SET display_order = 9 WHERE page_name = 'home' AND section_key = 'home_cta';