-- Add the 10 original homepage sections alongside the existing 12 optimized sections
INSERT INTO section_visibility (section_key, section_name, section_description, is_visible, page_name, display_order) VALUES 
  ('home_hero_original', 'Hero Original', 'Section hero originale avec bannière et présentation', true, 'home', 13),
  ('home_career_paths', 'Parcours de Carrière', 'Section présentant les différents parcours professionnels', true, 'home', 14),
  ('home_course_universe', 'Univers des Formations', 'Présentation complète de l''univers des formations AVS', true, 'home', 15),
  ('home_partners_original', 'Partenaires Original', 'Section partenaires avec style original', true, 'home', 16),
  ('home_features_original', 'Fonctionnalités Original', 'Section fonctionnalités avec présentation originale', true, 'home', 17),
  ('home_course_guide', 'Guide de Sélection', 'Guide interactif pour choisir sa formation', true, 'home', 18),
  ('home_instructors_original', 'Formateurs Original', 'Présentation originale de l''équipe pédagogique', true, 'home', 19),
  ('home_testimonials_original', 'Témoignages Original', 'Témoignages avec style original', true, 'home', 20),
  ('home_faq_original', 'FAQ Original', 'Section FAQ avec présentation originale', true, 'home', 21),
  ('home_cta_original', 'CTA Original', 'Call-to-action avec style original', true, 'home', 22);