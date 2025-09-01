-- Create enhanced reordering function with transaction safety
CREATE OR REPLACE FUNCTION public.reorder_sections_atomic(
  p_page_name text, 
  p_section_key text, 
  p_new_order integer
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  old_order integer;
  max_order integer;
  temp_offset integer := 10000; -- Large offset for temporary values
BEGIN
  -- Start a transaction
  BEGIN
    -- Get current order of the section being moved
    SELECT display_order INTO old_order
    FROM section_visibility
    WHERE page_name = p_page_name AND section_key = p_section_key;
    
    IF old_order IS NULL THEN
      RAISE EXCEPTION 'Section not found: %', p_section_key;
    END IF;
    
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
    
    -- Step 1: Move all sections to temporary negative values to avoid constraint conflicts
    UPDATE section_visibility 
    SET display_order = -(display_order + temp_offset)
    WHERE page_name = p_page_name;
    
    -- Step 2: Now safely reorder sections
    IF old_order < p_new_order THEN
      -- Moving down: shift sections up between old and new position
      UPDATE section_visibility 
      SET display_order = ABS(display_order + temp_offset) - 1
      WHERE page_name = p_page_name 
        AND ABS(display_order + temp_offset) > old_order 
        AND ABS(display_order + temp_offset) <= p_new_order
        AND section_key != p_section_key;
    ELSE
      -- Moving up: shift sections down between new and old position
      UPDATE section_visibility 
      SET display_order = ABS(display_order + temp_offset) + 1
      WHERE page_name = p_page_name 
        AND ABS(display_order + temp_offset) >= p_new_order 
        AND ABS(display_order + temp_offset) < old_order
        AND section_key != p_section_key;
    END IF;
    
    -- Step 3: Update sections that weren't affected by the move
    UPDATE section_visibility 
    SET display_order = ABS(display_order + temp_offset)
    WHERE page_name = p_page_name 
      AND section_key != p_section_key
      AND display_order < 0
      AND (
        (old_order < p_new_order AND (ABS(display_order + temp_offset) <= old_order OR ABS(display_order + temp_offset) > p_new_order)) OR
        (old_order > p_new_order AND (ABS(display_order + temp_offset) < p_new_order OR ABS(display_order + temp_offset) >= old_order))
      );
    
    -- Step 4: Set the moved section to its new position
    UPDATE section_visibility 
    SET display_order = p_new_order
    WHERE page_name = p_page_name AND section_key = p_section_key;
    
  EXCEPTION
    WHEN OTHERS THEN
      -- If anything goes wrong, rollback and re-raise
      RAISE;
  END;
END;
$$;

-- Enhanced batch reorder function for multiple sections
CREATE OR REPLACE FUNCTION public.batch_reorder_sections(
  p_page_name text,
  p_reorders jsonb -- Array of {section_key: string, new_order: integer}
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  reorder_item jsonb;
  temp_offset integer := 20000;
BEGIN
  -- Start transaction
  BEGIN
    -- Move all sections to temporary negative values
    UPDATE section_visibility 
    SET display_order = -(display_order + temp_offset)
    WHERE page_name = p_page_name;
    
    -- Apply all new orders
    FOR reorder_item IN SELECT * FROM jsonb_array_elements(p_reorders)
    LOOP
      UPDATE section_visibility
      SET display_order = (reorder_item->>'new_order')::integer
      WHERE page_name = p_page_name 
        AND section_key = reorder_item->>'section_key';
    END LOOP;
    
    -- Update any sections that weren't explicitly reordered
    UPDATE section_visibility 
    SET display_order = ABS(display_order + temp_offset)
    WHERE page_name = p_page_name 
      AND display_order < 0;
      
  EXCEPTION
    WHEN OTHERS THEN
      RAISE;
  END;
END;
$$;