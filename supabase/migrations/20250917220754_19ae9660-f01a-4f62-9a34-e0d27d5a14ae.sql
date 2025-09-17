-- Create system user for public appointments and fix RLS
INSERT INTO auth.users (
  id,
  email,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'system@appointments.local',
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Create profile for system user
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'system@appointments.local',
  'System User (Public Appointments)',
  'system',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Update existing appointments with null user_id
UPDATE public.appointments 
SET user_id = '00000000-0000-0000-0000-000000000000' 
WHERE user_id IS NULL;