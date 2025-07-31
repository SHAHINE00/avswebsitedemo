-- Add the missing features_hero section to the database
INSERT INTO section_visibility (
  section_key, 
  page_name, 
  section_name, 
  section_description, 
  is_visible, 
  display_order
) VALUES (
  'features_hero',
  'features',
  'Features Hero',
  'Hero section for the features page',
  true,
  0
) ON CONFLICT (section_key) DO NOTHING;