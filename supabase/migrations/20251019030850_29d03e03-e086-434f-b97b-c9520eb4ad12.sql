-- Remove professor role from movierecapslovers@gmail.com (make it student-only)
DELETE FROM public.user_roles
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'movierecapslovers@gmail.com'
)
AND role = 'professor';