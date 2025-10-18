-- Fix existing professors without the professor role
-- This migration ensures all active professors have the professor role assigned

INSERT INTO public.user_roles (user_id, role, assigned_by)
SELECT 
  p.user_id, 
  'professor'::app_role,
  (SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1) -- Use first admin as assigner, or NULL if none
FROM public.professors p
WHERE p.status = 'active'
  AND NOT EXISTS (
    SELECT 1 
    FROM public.user_roles ur 
    WHERE ur.user_id = p.user_id 
      AND ur.role = 'professor'::app_role
  )
ON CONFLICT (user_id, role) DO NOTHING;

-- Log this fix for audit purposes
INSERT INTO public.admin_activity_logs (admin_id, action, entity_type, details)
SELECT 
  (SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1),
  'professor_role_fix',
  'user_roles',
  jsonb_build_object(
    'description', 'Fixed missing professor roles for existing professors',
    'affected_count', (
      SELECT COUNT(*) 
      FROM public.professors p
      WHERE p.status = 'active'
        AND NOT EXISTS (
          SELECT 1 
          FROM public.user_roles ur 
          WHERE ur.user_id = p.user_id 
            AND ur.role = 'professor'::app_role
        )
    )
  )
WHERE EXISTS (SELECT 1 FROM auth.users WHERE email LIKE '%admin%' LIMIT 1);