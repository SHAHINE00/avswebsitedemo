-- Remove the old duplicate foreign key constraint that's causing the conflict
ALTER TABLE public.blog_posts DROP CONSTRAINT IF EXISTS fk_blog_posts_category;