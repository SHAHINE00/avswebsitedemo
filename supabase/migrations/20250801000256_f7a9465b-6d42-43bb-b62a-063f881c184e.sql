-- Fix database relationships for blog functionality

-- Add foreign key relationships
ALTER TABLE blog_posts 
ADD CONSTRAINT fk_blog_posts_author 
FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE blog_posts 
ADD CONSTRAINT fk_blog_posts_category 
FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL;

-- Insert sample blog categories
INSERT INTO blog_categories (name, slug, description) VALUES
('Intelligence Artificielle', 'intelligence-artificielle', 'Articles sur l''IA, machine learning et technologies émergentes'),
('Programmation', 'programmation', 'Tutoriels et guides de développement'),
('Cybersécurité', 'cybersecurite', 'Sécurité informatique et protection des données'),
('Carrières Tech', 'carrieres-tech', 'Conseils carrière et opportunités dans la tech')
ON CONFLICT (slug) DO NOTHING;

-- Get the first admin user ID (if exists) or create a default author
DO $$
DECLARE 
    admin_user_id UUID;
    ai_category_id UUID;
    prog_category_id UUID;
    cyber_category_id UUID;
    career_category_id UUID;
BEGIN
    -- Get an admin user or any user
    SELECT id INTO admin_user_id FROM profiles WHERE role = 'admin' LIMIT 1;
    
    -- If no admin, get any user
    IF admin_user_id IS NULL THEN
        SELECT id INTO admin_user_id FROM profiles LIMIT 1;
    END IF;
    
    -- If still no user, create a default profile (this requires manual setup)
    -- For now, we'll skip if no users exist
    
    IF admin_user_id IS NOT NULL THEN
        -- Get category IDs
        SELECT id INTO ai_category_id FROM blog_categories WHERE slug = 'intelligence-artificielle';
        SELECT id INTO prog_category_id FROM blog_categories WHERE slug = 'programmation';
        SELECT id INTO cyber_category_id FROM blog_categories WHERE slug = 'cybersecurite';
        SELECT id INTO career_category_id FROM blog_categories WHERE slug = 'carrieres-tech';
        
        -- Insert sample blog posts
        INSERT INTO blog_posts (title, content, excerpt, slug, author_id, category_id, status, published_at) VALUES
        (
            'Introduction à l''Intelligence Artificielle',
            'L''intelligence artificielle (IA) transforme notre monde de manière spectaculaire. Cette technologie révolutionnaire...',
            'Découvrez les fondamentaux de l''IA et son impact sur notre société moderne.',
            'introduction-intelligence-artificielle',
            admin_user_id,
            ai_category_id,
            'published',
            NOW()
        ),
        (
            'Les Bases de la Programmation Web',
            'La programmation web est une compétence essentielle dans le monde numérique d''aujourd''hui...',
            'Apprenez les concepts fondamentaux du développement web moderne.',
            'bases-programmation-web',
            admin_user_id,
            prog_category_id,
            'published',
            NOW() - INTERVAL '1 day'
        ),
        (
            'Cybersécurité : Protégez vos Données',
            'La cybersécurité n''a jamais été aussi importante qu''aujourd''hui. Avec l''augmentation des cyberattaques...',
            'Guide complet pour sécuriser vos données personnelles et professionnelles.',
            'cybersecurite-protegez-donnees',
            admin_user_id,
            cyber_category_id,
            'published',
            NOW() - INTERVAL '2 days'
        ),
        (
            'Carrières dans la Tech en 2024',
            'Le secteur technologique offre de nombreuses opportunités de carrière passionnantes...',
            'Explorez les métiers d''avenir dans le domaine de la technologie.',
            'carrieres-tech-2024',
            admin_user_id,
            career_category_id,
            'published',
            NOW() - INTERVAL '3 days'
        )
        ON CONFLICT (slug) DO NOTHING;
    END IF;
END $$;