-- Remove duplicate foreign key constraint
ALTER TABLE public.blog_posts DROP CONSTRAINT IF EXISTS fk_blog_posts_category;