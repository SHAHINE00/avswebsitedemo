-- ============================================
-- CREATE STORAGE BUCKET FOR STUDENT DOCUMENTS
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'student-documents',
  'student-documents',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES FOR STUDENT DOCUMENTS
-- ============================================

-- Admins can upload any documents
CREATE POLICY "Admins can upload student documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'student-documents' AND
  public.is_admin(auth.uid())
);

-- Admins can view all documents
CREATE POLICY "Admins can view all student documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'student-documents' AND
  public.is_admin(auth.uid())
);

-- Students can view their own documents
CREATE POLICY "Students can view own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'student-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Admins can delete documents
CREATE POLICY "Admins can delete student documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'student-documents' AND
  public.is_admin(auth.uid())
);

-- ============================================
-- FIX SECURITY WARNING: Set search_path on existing functions
-- ============================================

-- Fix generate_invoice_number function
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  year_month TEXT;
  sequence_num INTEGER;
  invoice_num TEXT;
BEGIN
  year_month := TO_CHAR(CURRENT_DATE, 'YYYYMM');
  
  SELECT COUNT(*) + 1 INTO sequence_num
  FROM public.invoices
  WHERE invoice_number LIKE 'INV-' || year_month || '%';
  
  invoice_num := 'INV-' || year_month || '-' || LPAD(sequence_num::TEXT, 4, '0');
  
  RETURN invoice_num;
END;
$$;