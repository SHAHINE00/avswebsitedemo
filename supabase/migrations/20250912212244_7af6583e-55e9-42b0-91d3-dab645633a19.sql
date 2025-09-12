-- Remove the anonymous appointment creation policy to fix security vulnerability
-- This policy allowed anyone to create appointments, which the security scanner flagged
DROP POLICY IF EXISTS "anonymous_create_appointments" ON public.appointments;

-- The secure anonymous booking functionality is now handled by the book-appointment edge function
-- which uses the service role key to bypass RLS and safely insert appointments with user_id = NULL