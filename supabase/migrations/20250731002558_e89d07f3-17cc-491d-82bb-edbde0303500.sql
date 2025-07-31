-- Add Partners section to section visibility management
INSERT INTO public.section_visibility (
  section_key,
  section_name,
  section_description,
  page_name,
  display_order,
  is_visible
) VALUES (
  'home_partners',
  'Partners Section',
  'Academic and technology partners showcase',
  'home',
  2,
  true
);