-- Seed data for testing the complete system

-- First, let's create some test professors (will need admin to execute this via edge function)
-- Note: These need to be created via the admin interface or create-professor edge function

-- Create test courses
INSERT INTO public.courses (title, subtitle, status, icon, duration, modules, diploma, gradient_from, gradient_to, display_order) VALUES
('Intelligence Artificielle Avancée', 'Maîtrisez le deep learning et les réseaux de neurones', 'published', 'brain', '6 mois', '12', 'Certificat IA Avancé', 'from-blue-500', 'to-purple-600', 1),
('Cybersécurité Professionnelle', 'Protégez les systèmes et les données', 'published', 'shield', '4 mois', '10', 'Certificat Cybersécurité', 'from-red-500', 'to-orange-600', 2),
('Développement Full Stack', 'React, Node.js et bases de données', 'published', 'code', '5 mois', '15', 'Certificat Full Stack', 'from-green-500', 'to-teal-600', 3);

-- Get course IDs for later use
DO $$
DECLARE
  ai_course_id UUID;
  cyber_course_id UUID;
  fullstack_course_id UUID;
  admin_user_id UUID;
BEGIN
  -- Get first admin user
  SELECT user_id INTO admin_user_id FROM public.user_roles WHERE role = 'admin' LIMIT 1;

  -- Get course IDs
  SELECT id INTO ai_course_id FROM public.courses WHERE title = 'Intelligence Artificielle Avancée' LIMIT 1;
  SELECT id INTO cyber_course_id FROM public.courses WHERE title = 'Cybersécurité Professionnelle' LIMIT 1;
  SELECT id INTO fullstack_course_id FROM public.courses WHERE title = 'Développement Full Stack' LIMIT 1;

  -- Create lessons for AI course
  INSERT INTO public.course_lessons (course_id, title, description, content, lesson_order, duration_minutes, status) VALUES
  (ai_course_id, 'Introduction au Machine Learning', 'Concepts fondamentaux du ML', 'Contenu détaillé du cours...', 1, 60, 'published'),
  (ai_course_id, 'Réseaux de neurones', 'Architecture et entraînement', 'Contenu détaillé du cours...', 2, 90, 'published'),
  (ai_course_id, 'Deep Learning avec TensorFlow', 'Implémentation pratique', 'Contenu détaillé du cours...', 3, 120, 'published');

  -- Create lessons for Cyber course
  INSERT INTO public.course_lessons (course_id, title, description, content, lesson_order, duration_minutes, status) VALUES
  (cyber_course_id, 'Fondamentaux de la sécurité', 'Principes de base', 'Contenu détaillé du cours...', 1, 60, 'published'),
  (cyber_course_id, 'Tests de pénétration', 'Techniques d''audit', 'Contenu détaillé du cours...', 2, 90, 'published'),
  (cyber_course_id, 'Sécurité des applications web', 'OWASP Top 10', 'Contenu détaillé du cours...', 3, 120, 'published');

  -- Create lessons for Full Stack course
  INSERT INTO public.course_lessons (course_id, title, description, content, lesson_order, duration_minutes, status) VALUES
  (fullstack_course_id, 'React Fundamentals', 'Composants et hooks', 'Contenu détaillé du cours...', 1, 90, 'published'),
  (fullstack_course_id, 'Node.js et Express', 'Backend avec Node', 'Contenu détaillé du cours...', 2, 90, 'published'),
  (fullstack_course_id, 'Bases de données', 'PostgreSQL et MongoDB', 'Contenu détaillé du cours...', 3, 120, 'published');

END $$;

-- Create some blog posts
INSERT INTO public.blog_categories (name, slug, description) VALUES
('Actualités IA', 'actualites-ia', 'Dernières nouvelles sur l''intelligence artificielle'),
('Tutoriels', 'tutoriels', 'Guides et tutoriels pratiques'),
('Carrières Tech', 'carrieres-tech', 'Conseils pour votre carrière dans la tech');

DO $$
DECLARE
  category_id UUID;
  admin_user_id UUID;
BEGIN
  SELECT user_id INTO admin_user_id FROM public.user_roles WHERE role = 'admin' LIMIT 1;
  SELECT id INTO category_id FROM public.blog_categories WHERE slug = 'actualites-ia' LIMIT 1;

  INSERT INTO public.blog_posts (
    title,
    slug,
    excerpt,
    content,
    author_id,
    category_id,
    status,
    published_at
  ) VALUES
  (
    'L''IA transforme le monde du travail en 2025',
    'ia-transforme-monde-travail-2025',
    'Découvrez comment l''intelligence artificielle révolutionne les métiers et crée de nouvelles opportunités',
    '# L''IA transforme le monde du travail\n\nL''intelligence artificielle est en train de redéfinir...',
    admin_user_id,
    category_id,
    'published',
    NOW()
  );

  SELECT id INTO category_id FROM public.blog_categories WHERE slug = 'tutoriels' LIMIT 1;

  INSERT INTO public.blog_posts (
    title,
    slug,
    excerpt,
    content,
    author_id,
    category_id,
    status,
    published_at
  ) VALUES
  (
    'Débuter avec React en 2025 : Guide complet',
    'debuter-react-2025-guide',
    'Un guide complet pour maîtriser React, de zéro à héros',
    '# Débuter avec React\n\nReact est la bibliothèque JavaScript la plus populaire...',
    admin_user_id,
    category_id,
    'published',
    NOW()
  );
END $$;

-- Create email templates
INSERT INTO public.email_templates (name, template_type, subject, body, variables) VALUES
('Bienvenue', 'welcome', 'Bienvenue à {school_name}', 
'<h1>Bienvenue {student_name}!</h1><p>Nous sommes ravis de vous accueillir à {school_name}.</p>',
'["student_name", "school_name"]'::jsonb),

('Nouveau cours', 'course_notification', 'Nouveau cours disponible: {course_name}',
'<h1>Nouveau cours!</h1><p>Le cours {course_name} est maintenant disponible.</p>',
'["course_name", "course_url"]'::jsonb),

('Certificat obtenu', 'certificate', 'Félicitations! Certificat obtenu',
'<h1>Félicitations {student_name}!</h1><p>Vous avez obtenu votre certificat pour {course_name}.</p>',
'["student_name", "course_name", "certificate_url"]'::jsonb);

-- Note: To complete the seed data setup, you need to:
-- 1. Create professors via the admin interface using the create-professor edge function
-- 2. Assign professors to courses via the admin interface
-- 3. Create student accounts via the registration flow
-- 4. Enroll students in courses via the student dashboard
-- 5. Create grades, attendance records, and announcements as needed

-- This gives you a complete foundation for testing all features!
