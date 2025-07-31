-- Enable realtime for section_visibility table
ALTER TABLE section_visibility REPLICA IDENTITY FULL;

-- Add table to realtime publication (if not already added)
BEGIN;
  -- Check if table is already in publication, if not add it
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND tablename = 'section_visibility'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE section_visibility;
    END IF;
  END $$;
COMMIT;