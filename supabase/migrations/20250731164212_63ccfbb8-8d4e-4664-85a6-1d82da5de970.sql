-- First, update all existing sections (except hero) to make room
UPDATE section_visibility 
SET display_order = display_order + 2 
WHERE page_name = 'home' 
  AND section_key != 'home_hero' 
  AND section_key != 'global_navbar' 
  AND section_key != 'global_footer';

-- Then add the new sections
INSERT INTO section_visibility (section_key, section_name, section_description, page_name, display_order, is_visible) VALUES
('home_career_paths', 'Opportunités de Carrière', 'Section présentant les opportunités de carrière dans nos spécialités', 'home', 1, true),
('home_course_universe', 'Notre Univers de Formations', 'Section présentant l''univers complet de nos formations', 'home', 2, true);