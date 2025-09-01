-- First, let's check the current user's profile and create one if needed
INSERT INTO public.profiles (id, email, full_name, role)
SELECT auth.uid(), auth.email(), 'Admin User', 'admin'
WHERE auth.uid() IS NOT NULL
ON CONFLICT (id) DO UPDATE SET role = 'admin', updated_at = now();

-- Also update any existing profiles without admin role to admin if they're the first user
UPDATE public.profiles 
SET role = 'admin', updated_at = now()
WHERE id = auth.uid() AND role != 'admin';