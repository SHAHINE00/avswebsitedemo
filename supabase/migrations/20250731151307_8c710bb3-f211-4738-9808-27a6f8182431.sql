-- Fix display_order conflicts by updating sections to have unique sequential order within each page
-- First, let's update the home page sections to have proper sequential order

-- Update Partners Section to order 1
UPDATE section_visibility 
SET display_order = 1, updated_at = now()
WHERE page_name = 'home' AND section_key = 'partners-section';

-- Update Features Section to order 2  
UPDATE section_visibility 
SET display_order = 2, updated_at = now()
WHERE page_name = 'home' AND section_key = 'features-section';

-- Update Hero Section to order 3
UPDATE section_visibility 
SET display_order = 3, updated_at = now()
WHERE page_name = 'home' AND section_key = 'hero-section';

-- Update Testimonials Section to order 4
UPDATE section_visibility 
SET display_order = 4, updated_at = now()
WHERE page_name = 'home' AND section_key = 'testimonials-section';

-- Update CTA Section to order 5
UPDATE section_visibility 
SET display_order = 5, updated_at = now()
WHERE page_name = 'home' AND section_key = 'cta-section';

-- Update FAQ Section to order 6
UPDATE section_visibility 
SET display_order = 6, updated_at = now()
WHERE page_name = 'home' AND section_key = 'faq-section';

-- Update Instructors Section to order 7
UPDATE section_visibility 
SET display_order = 7, updated_at = now()
WHERE page_name = 'home' AND section_key = 'instructors-section';

-- Also fix any other pages that might have conflicts
-- Ensure all sections have unique display_order within their page
WITH ordered_sections AS (
  SELECT 
    id,
    page_name,
    section_key,
    ROW_NUMBER() OVER (PARTITION BY page_name ORDER BY display_order, created_at) as new_order
  FROM section_visibility
  WHERE page_name != 'home' -- Skip home since we manually set it above
)
UPDATE section_visibility 
SET display_order = ordered_sections.new_order, updated_at = now()
FROM ordered_sections
WHERE section_visibility.id = ordered_sections.id;