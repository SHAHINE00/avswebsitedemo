-- Insert new homepage sections for visibility management
INSERT INTO section_visibility (section_key, section_name, section_description, is_visible, page_name, display_order) VALUES 
  ('home_hero', 'Section Hero', 'Bannière principale avec titre et call-to-action', true, 'home', 1),
  ('home_tldr', 'Section TL;DR', 'Résumé rapide des points clés d''AVS INSTITUTE', true, 'home', 2),
  ('home_features', 'Section Fonctionnalités', 'Présentation des avantages et points forts', true, 'home', 3),
  ('home_comparisons', 'Section Comparaisons', 'Tableaux comparatifs formations et salaires', true, 'home', 4),
  ('home_curriculum', 'Section Programmes', 'Présentation des 3 piliers de formation', true, 'home', 5),
  ('home_testimonials_enhanced', 'Section Témoignages Enrichie', 'Témoignages avec statistiques de succès', true, 'home', 6),
  ('home_success_stats', 'Statistiques de Succès', 'Chiffres clés : taux de réussite, insertion, alumni', true, 'home', 7),
  ('home_testimonials', 'Témoignages Simples', 'Témoignages étudiants sans statistiques', true, 'home', 8),
  ('home_instructors', 'Section Formateurs', 'Présentation de l''équipe pédagogique', true, 'home', 9),
  ('home_partners', 'Section Partenaires', 'Logos et partenariats institutionnels', true, 'home', 10),
  ('home_faq', 'Section FAQ', 'Questions fréquemment posées', true, 'home', 11),
  ('home_cta', 'Section Call-to-Action', 'Appel à l''action final pour inscription', true, 'home', 12)
ON CONFLICT (section_key) DO UPDATE SET
  section_name = EXCLUDED.section_name,
  section_description = EXCLUDED.section_description,
  page_name = EXCLUDED.page_name,
  display_order = EXCLUDED.display_order;