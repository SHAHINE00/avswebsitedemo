-- Update the features_main section display order to come after features_hero
UPDATE section_visibility 
SET display_order = 1 
WHERE section_key = 'features_main' AND page_name = 'features';