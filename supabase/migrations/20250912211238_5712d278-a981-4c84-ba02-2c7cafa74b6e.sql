-- Fix appointments table RLS policies to prevent any unauthorized access
-- Drop existing policies that might have gaps
DROP POLICY IF EXISTS "Public cannot access appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can manage all appointments" ON public.appointments;

-- Create bulletproof RLS policies with explicit restrictions

-- 1. Admins can manage all appointments (most permissive, so evaluated first)
CREATE POLICY "admins_full_access_appointments" 
ON public.appointments 
FOR ALL 
TO authenticated
USING (check_admin_role_strict())
WITH CHECK (check_admin_role_strict());

-- 2. Authenticated users can only view their own appointments
CREATE POLICY "users_view_own_appointments" 
ON public.appointments 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- 3. Authenticated users can create appointments for themselves
CREATE POLICY "users_create_own_appointments" 
ON public.appointments 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- 4. Allow anonymous users to create appointments (for public booking form)
CREATE POLICY "anonymous_create_appointments" 
ON public.appointments 
FOR INSERT 
TO anon
WITH CHECK (user_id IS NULL);

-- 5. Authenticated users can update only their own appointments
CREATE POLICY "users_update_own_appointments" 
ON public.appointments 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- 6. Explicitly deny all other access (catch-all deny policy)
CREATE POLICY "deny_all_other_access_appointments" 
ON public.appointments 
FOR ALL 
TO public
USING (false)
WITH CHECK (false);

-- Ensure RLS is enabled
ALTER TABLE public.appointments FORCE ROW LEVEL SECURITY;