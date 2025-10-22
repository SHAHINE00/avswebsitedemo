-- Create storage bucket for chatbot uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chatbot-uploads',
  'chatbot-uploads',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for chatbot uploads
CREATE POLICY "Anyone can upload files to chatbot-uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'chatbot-uploads');

CREATE POLICY "Anyone can view chatbot uploads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'chatbot-uploads');

CREATE POLICY "Users can delete their own uploads"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'chatbot-uploads');