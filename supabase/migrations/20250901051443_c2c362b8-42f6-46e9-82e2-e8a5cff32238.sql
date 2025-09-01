-- First, let's create a profile for the current user with admin role
INSERT INTO public.profiles (id, role, email, full_name, created_at, updated_at)
VALUES (
  auth.uid(),
  'admin',
  'admin@example.com',
  'Admin User',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET 
  role = 'admin',
  updated_at = now();

-- Let's also ensure the reordering function works properly
-- Drop the old function first
DROP FUNCTION IF EXISTS public.reorder_sections_atomic(text, text, integer);

-- Create a simpler, more reliable reordering function
CREATE OR REPLACE FUNCTION public.simple_reorder_section(
  p_section_key text,
  p_new_order integer
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  section_page text;
  old_order integer;
  temp_offset integer := 50000;
BEGIN
  -- Get the section's page and current order
  SELECT page_name, display_order INTO section_page, old_order
  FROM section_visibility
  WHERE section_key = p_section_key;
  
  IF section_page IS NULL THEN
    RAISE EXCEPTION 'Section not found: %', p_section_key;
  END IF;
  
  -- If no change needed, exit early
  IF old_order = p_new_order THEN
    RETURN;
  END IF;
  
  -- Use a simple approach: temporarily set target to high value
  UPDATE section_visibility 
  SET display_order = temp_offset
  WHERE section_key = p_section_key;
  
  -- Shift other sections
  IF old_order < p_new_order THEN
    -- Moving down: shift sections up
    UPDATE section_visibility 
    SET display_order = display_order - 1
    WHERE page_name = section_page 
      AND display_order > old_order 
      AND display_order <= p_new_order
      AND section_key != p_section_key;
  ELSE
    -- Moving up: shift sections down
    UPDATE section_visibility 
    SET display_order = display_order + 1
    WHERE page_name = section_page 
      AND display_order >= p_new_order 
      AND display_order < old_order
      AND section_key != p_section_key;
  END IF;
  
  -- Set final position
  UPDATE section_visibility 
  SET display_order = p_new_order
  WHERE section_key = p_section_key;
END;
$$;