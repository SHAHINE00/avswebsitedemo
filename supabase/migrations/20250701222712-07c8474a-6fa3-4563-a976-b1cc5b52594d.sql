-- Insert sample courses (the tables should already exist)
INSERT INTO public.courses (
  title, subtitle, modules, duration, diploma, feature1, feature2, 
  icon, gradient_from, gradient_to, button_text_color, 
  floating_color1, floating_color2, link_to, status, display_order
) VALUES 
(
  'Formation IA', 'Intelligence Artificielle', '27 modules', '18 mois', 
  'Diplôme certifié', 'Machine Learning', 'Big Data', 'brain',
  'from-academy-blue', 'to-academy-purple', 'text-academy-blue',
  'bg-academy-lightblue/20', 'bg-white/10', '/ai-course', 'published', 1
),
(
  'Formation Programmation', 'Développement Web & Mobile', '4 modules', '24 semaines',
  'Diplôme certifié', 'Full Stack', 'DevOps', 'code',
  'from-academy-purple', 'to-academy-lightblue', 'text-academy-purple',
  'bg-academy-blue/20', 'bg-white/10', '/programming-course', 'published', 2
),
(
  'Formation Cybersécurité', 'Sécurité Informatique', '6 modules', '12 mois',
  'Diplôme certifié', 'Ethical Hacking', 'Network Security', 'shield',
  'from-red-500', 'to-red-700', 'text-red-600',
  'bg-red-100/20', 'bg-white/10', '/cybersecurity-course', 'published', 3
);