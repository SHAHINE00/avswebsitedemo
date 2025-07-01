
-- Insert cybersecurity course
INSERT INTO public.courses (
  title, 
  subtitle, 
  modules, 
  duration, 
  diploma, 
  feature1, 
  feature2, 
  icon, 
  gradient_from, 
  gradient_to, 
  button_text_color, 
  floating_color1, 
  floating_color2, 
  link_to, 
  status, 
  display_order
) VALUES (
  'Formation Cybersécurité',
  'Protection et Sécurité Informatique',
  '20 modules',
  '15 mois',
  'Diplôme certifié',
  'Ethical Hacking',
  'Sécurité Réseau',
  'shield',
  'from-red-500',
  'to-orange-600',
  'text-red-600',
  'bg-red-100/20',
  'bg-orange-100/10',
  '/cybersecurity-course',
  'published',
  3
);
