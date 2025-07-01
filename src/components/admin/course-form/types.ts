
import { z } from 'zod';

export const courseSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  subtitle: z.string().optional(),
  modules: z.string().optional(),
  duration: z.string().optional(),
  diploma: z.string().optional(),
  feature1: z.string().optional(),
  feature2: z.string().optional(),
  icon: z.string().default('brain'),
  gradient_from: z.string().default('from-academy-blue'),
  gradient_to: z.string().default('to-academy-purple'),
  button_text_color: z.string().default('text-academy-blue'),
  floating_color1: z.string().default('bg-academy-lightblue/20'),
  floating_color2: z.string().default('bg-white/10'),
  link_to: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  display_order: z.number().default(0),
});

export type CourseFormData = z.infer<typeof courseSchema>;
