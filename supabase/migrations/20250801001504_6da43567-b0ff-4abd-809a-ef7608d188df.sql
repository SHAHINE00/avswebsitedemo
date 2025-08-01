-- Add missing foreign key constraints for blog_posts
ALTER TABLE public.blog_posts 
ADD CONSTRAINT blog_posts_category_id_fkey 
FOREIGN KEY (category_id) REFERENCES public.blog_categories(id);

ALTER TABLE public.blog_posts 
ADD CONSTRAINT blog_posts_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(id);