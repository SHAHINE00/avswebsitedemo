-- ============================================
-- PHASE 6: FINANCIAL MANAGEMENT TABLES
-- ============================================

-- Payment transactions table
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'MAD',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('card', 'bank_transfer', 'cash', 'installment', 'stripe')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
  transaction_ref TEXT UNIQUE,
  stripe_payment_id TEXT,
  stripe_session_id TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES public.payment_transactions(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  pdf_url TEXT,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Payment plans table
CREATE TABLE IF NOT EXISTS public.payment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (paid_amount >= 0),
  remaining_amount DECIMAL(10,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
  installments JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'defaulted', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Refunds table
CREATE TABLE IF NOT EXISTS public.refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES public.payment_transactions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processed')),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID REFERENCES public.profiles(id),
  stripe_refund_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- PHASE 7: DOCUMENT MANAGEMENT TABLES
-- ============================================

-- Student documents table
CREATE TABLE IF NOT EXISTS public.student_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('invoice', 'receipt', 'certificate', 'contract', 'id_card', 'transcript', 'enrollment_letter', 'other')),
  document_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES public.profiles(id),
  is_verified BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- PHASE 1-2: STUDENT NOTES & COMMUNICATION
-- ============================================

-- Student notes table
CREATE TABLE IF NOT EXISTS public.student_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  note_type TEXT NOT NULL DEFAULT 'general' CHECK (note_type IN ('general', 'academic', 'financial', 'behavioral', 'administrative')),
  is_private BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Communication log table
CREATE TABLE IF NOT EXISTS public.communication_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  communication_type TEXT NOT NULL CHECK (communication_type IN ('email', 'sms', 'phone', 'in_person', 'system')),
  subject TEXT,
  message TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  status TEXT DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'delivered', 'failed', 'read')),
  sent_by UUID REFERENCES public.profiles(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_log ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - ADMIN FULL ACCESS
-- ============================================

CREATE POLICY "Admins full access to payment_transactions" ON public.payment_transactions FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins full access to invoices" ON public.invoices FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins full access to payment_plans" ON public.payment_plans FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins full access to refunds" ON public.refunds FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins full access to student_documents" ON public.student_documents FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins full access to student_notes" ON public.student_notes FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins full access to communication_log" ON public.communication_log FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ============================================
-- RLS POLICIES - STUDENT ACCESS
-- ============================================

CREATE POLICY "Students view own payment_transactions" ON public.payment_transactions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Students view own invoices" ON public.invoices FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Students view own payment_plans" ON public.payment_plans FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Students can request refunds" ON public.refunds FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Students view own refunds" ON public.refunds FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Students view own documents" ON public.student_documents FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Students view own communication_log" ON public.communication_log FOR SELECT TO authenticated USING (user_id = auth.uid());

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_status ON public.payment_transactions(payment_status);
CREATE INDEX idx_payment_transactions_created_at ON public.payment_transactions(created_at DESC);
CREATE INDEX idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_invoice_number ON public.invoices(invoice_number);
CREATE INDEX idx_payment_plans_user_id ON public.payment_plans(user_id);
CREATE INDEX idx_payment_plans_status ON public.payment_plans(status);
CREATE INDEX idx_refunds_user_id ON public.refunds(user_id);
CREATE INDEX idx_refunds_status ON public.refunds(status);
CREATE INDEX idx_student_documents_user_id ON public.student_documents(user_id);
CREATE INDEX idx_student_documents_type ON public.student_documents(document_type);
CREATE INDEX idx_student_notes_user_id ON public.student_notes(user_id);
CREATE INDEX idx_communication_log_user_id ON public.communication_log(user_id);
CREATE INDEX idx_communication_log_created_at ON public.communication_log(created_at DESC);

-- ============================================
-- UPDATE TRIGGERS
-- ============================================

CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON public.payment_transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payment_plans_updated_at BEFORE UPDATE ON public.payment_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_student_documents_updated_at BEFORE UPDATE ON public.student_documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_student_notes_updated_at BEFORE UPDATE ON public.student_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- DATABASE FUNCTIONS
-- ============================================

-- Function: Get student financial summary
CREATE OR REPLACE FUNCTION public.get_student_financial_summary(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  IF NOT public.is_admin(auth.uid()) AND auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT jsonb_build_object(
    'total_paid', COALESCE(SUM(amount) FILTER (WHERE payment_status = 'completed'), 0),
    'total_pending', COALESCE(SUM(amount) FILTER (WHERE payment_status = 'pending'), 0),
    'total_refunded', COALESCE(SUM(amount) FILTER (WHERE payment_status = 'refunded'), 0),
    'payment_count', COUNT(*),
    'last_payment_date', MAX(paid_at),
    'has_payment_plan', EXISTS(SELECT 1 FROM public.payment_plans WHERE user_id = p_user_id AND status = 'active'),
    'payment_methods', jsonb_agg(DISTINCT payment_method) FILTER (WHERE payment_status = 'completed')
  ) INTO result
  FROM public.payment_transactions
  WHERE user_id = p_user_id;
  
  RETURN result;
END;
$$;

-- Function: Get student timeline
CREATE OR REPLACE FUNCTION public.get_student_timeline(p_user_id UUID, p_limit INTEGER DEFAULT 50)
RETURNS TABLE(
  event_id UUID,
  event_type TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  title TEXT,
  description TEXT,
  metadata JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) AND auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT * FROM (
    -- Enrollments
    SELECT 
      ce.id,
      'enrollment'::TEXT,
      ce.enrolled_at,
      'Enrolled in ' || c.title,
      'Student enrolled in course',
      jsonb_build_object('course_id', ce.course_id, 'status', ce.status)
    FROM public.course_enrollments ce
    JOIN public.courses c ON c.id = ce.course_id
    WHERE ce.user_id = p_user_id
    
    UNION ALL
    
    -- Payments
    SELECT 
      pt.id,
      'payment'::TEXT,
      COALESCE(pt.paid_at, pt.created_at),
      'Payment ' || pt.payment_status || ' - ' || pt.amount || ' ' || pt.currency,
      'Payment via ' || pt.payment_method,
      jsonb_build_object('amount', pt.amount, 'status', pt.payment_status, 'method', pt.payment_method)
    FROM public.payment_transactions pt
    WHERE pt.user_id = p_user_id
    
    UNION ALL
    
    -- Certificates
    SELECT 
      cert.id,
      'certificate'::TEXT,
      cert.created_at,
      'Certificate Issued: ' || cert.title,
      cert.description,
      jsonb_build_object('certificate_type', cert.certificate_type, 'verification_code', cert.verification_code)
    FROM public.certificates cert
    WHERE cert.user_id = p_user_id
    
    UNION ALL
    
    -- Communications
    SELECT 
      cl.id,
      'communication'::TEXT,
      cl.created_at,
      COALESCE(cl.subject, 'Communication - ' || cl.communication_type),
      cl.message,
      jsonb_build_object('type', cl.communication_type, 'direction', cl.direction, 'status', cl.status)
    FROM public.communication_log cl
    WHERE cl.user_id = p_user_id
    
    UNION ALL
    
    -- Notes
    SELECT 
      sn.id,
      'note'::TEXT,
      sn.created_at,
      'Note Added - ' || sn.note_type,
      sn.note_text,
      jsonb_build_object('note_type', sn.note_type, 'is_private', sn.is_private)
    FROM public.student_notes sn
    WHERE sn.user_id = p_user_id AND (NOT sn.is_private OR public.is_admin(auth.uid()))
  ) timeline
  ORDER BY event_date DESC
  LIMIT p_limit;
END;
$$;

-- Function: Get student segments
CREATE OR REPLACE FUNCTION public.get_student_segments()
RETURNS TABLE(
  segment_name TEXT,
  segment_count BIGINT,
  student_ids UUID[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  -- Active students (enrolled in courses)
  SELECT 
    'Active Students'::TEXT,
    COUNT(DISTINCT ce.user_id),
    ARRAY_AGG(DISTINCT ce.user_id)
  FROM public.course_enrollments ce
  WHERE ce.status = 'active'
  
  UNION ALL
  
  -- Students with overdue payments
  SELECT 
    'Overdue Payments'::TEXT,
    COUNT(DISTINCT pp.user_id),
    ARRAY_AGG(DISTINCT pp.user_id)
  FROM public.payment_plans pp
  WHERE pp.status = 'active' AND pp.remaining_amount > 0
  
  UNION ALL
  
  -- High performers (completed courses)
  SELECT 
    'Completed Courses'::TEXT,
    COUNT(DISTINCT ce.user_id),
    ARRAY_AGG(DISTINCT ce.user_id)
  FROM public.course_enrollments ce
  WHERE ce.status = 'completed'
  
  UNION ALL
  
  -- At-risk students (enrolled but never accessed)
  SELECT 
    'At-Risk (Never Accessed)'::TEXT,
    COUNT(DISTINCT ce.user_id),
    ARRAY_AGG(DISTINCT ce.user_id)
  FROM public.course_enrollments ce
  WHERE ce.last_accessed_at IS NULL AND ce.enrolled_at < NOW() - INTERVAL '7 days'
  
  UNION ALL
  
  -- Recent enrollments
  SELECT 
    'Recent Enrollments (7 days)'::TEXT,
    COUNT(DISTINCT ce.user_id),
    ARRAY_AGG(DISTINCT ce.user_id)
  FROM public.course_enrollments ce
  WHERE ce.enrolled_at >= NOW() - INTERVAL '7 days';
END;
$$;

-- Function: Generate invoice number
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
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