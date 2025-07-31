-- Clean up duplicate display_order values and ensure sequential ordering

-- First, let's check for any constraint issues and clean up the section_visibility table
-- Update all sections to have proper sequential ordering within each page

-- Home page sections
WITH home_sections AS (
  SELECT id, section_key, ROW_NUMBER() OVER (ORDER BY display_order, section_key) - 1 as new_order
  FROM section_visibility 
  WHERE page_name = 'home'
)
UPDATE section_visibility 
SET display_order = home_sections.new_order
FROM home_sections
WHERE section_visibility.id = home_sections.id;

-- About page sections  
WITH about_sections AS (
  SELECT id, section_key, ROW_NUMBER() OVER (ORDER BY display_order, section_key) - 1 as new_order
  FROM section_visibility 
  WHERE page_name = 'about'
)
UPDATE section_visibility 
SET display_order = about_sections.new_order
FROM about_sections
WHERE section_visibility.id = about_sections.id;

-- Features page sections
WITH features_sections AS (
  SELECT id, section_key, ROW_NUMBER() OVER (ORDER BY display_order, section_key) - 1 as new_order
  FROM section_visibility 
  WHERE page_name = 'features'
)
UPDATE section_visibility 
SET display_order = features_sections.new_order
FROM features_sections
WHERE section_visibility.id = features_sections.id;

-- Global sections
WITH global_sections AS (
  SELECT id, section_key, ROW_NUMBER() OVER (ORDER BY display_order, section_key) - 1 as new_order
  FROM section_visibility 
  WHERE page_name = 'global'
)
UPDATE section_visibility 
SET display_order = global_sections.new_order
FROM global_sections
WHERE section_visibility.id = global_sections.id;

-- Add a unique constraint to prevent duplicate display orders within the same page
ALTER TABLE section_visibility 
ADD CONSTRAINT unique_page_display_order 
UNIQUE (page_name, display_order);

-- Create function to automatically reorder sections when moving
CREATE OR REPLACE FUNCTION reorder_sections_on_page(
  p_page_name text,
  p_section_key text,
  p_new_order integer
) RETURNS void AS $$
DECLARE
  old_order integer;
  max_order integer;
BEGIN
  -- Get current order of the section being moved
  SELECT display_order INTO old_order
  FROM section_visibility
  WHERE page_name = p_page_name AND section_key = p_section_key;
  
  -- Get max order for the page
  SELECT COALESCE(MAX(display_order), -1) INTO max_order
  FROM section_visibility
  WHERE page_name = p_page_name;
  
  -- Ensure new order is within bounds
  p_new_order := GREATEST(0, LEAST(p_new_order, max_order));
  
  -- If moving to same position, do nothing
  IF old_order = p_new_order THEN
    RETURN;
  END IF;
  
  -- Temporarily set the moving section to a high number to avoid constraint conflicts
  UPDATE section_visibility 
  SET display_order = 9999
  WHERE page_name = p_page_name AND section_key = p_section_key;
  
  -- Shift other sections
  IF old_order < p_new_order THEN
    -- Moving down: shift sections up between old and new position
    UPDATE section_visibility 
    SET display_order = display_order - 1
    WHERE page_name = p_page_name 
      AND display_order > old_order 
      AND display_order <= p_new_order
      AND section_key != p_section_key;
  ELSE
    -- Moving up: shift sections down between new and old position
    UPDATE section_visibility 
    SET display_order = display_order + 1
    WHERE page_name = p_page_name 
      AND display_order >= p_new_order 
      AND display_order < old_order
      AND section_key != p_section_key;
  END IF;
  
  -- Set the moved section to its new position
  UPDATE section_visibility 
  SET display_order = p_new_order
  WHERE page_name = p_page_name AND section_key = p_section_key;
  
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;