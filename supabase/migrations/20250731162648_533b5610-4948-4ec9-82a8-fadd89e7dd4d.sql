-- Fix the search_path security warning for the new function
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
$$ LANGUAGE plpgsql SECURITY DEFINER 
SET search_path = public;