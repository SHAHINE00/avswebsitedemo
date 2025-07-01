
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Brain, Code, Database, Cloud, Target } from 'lucide-react';
import type { Course } from '@/hooks/useCourses';

const courseSchema = z.object({
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

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: Course | null;
  onSuccess: () => void;
}

const iconOptions = [
  { value: 'brain', label: 'Cerveau', icon: Brain },
  { value: 'code', label: 'Code', icon: Code },
  { value: 'database', label: 'Base de données', icon: Database },
  { value: 'cloud', label: 'Cloud', icon: Cloud },
  { value: 'target', label: 'Cible', icon: Target },
];

const gradientOptions = [
  { value: 'from-academy-blue', label: 'Bleu Academy' },
  { value: 'from-academy-purple', label: 'Violet Academy' },
  { value: 'from-blue-500', label: 'Bleu' },
  { value: 'from-purple-500', label: 'Violet' },
  { value: 'from-green-500', label: 'Vert' },
  { value: 'from-red-500', label: 'Rouge' },
];

const CourseFormDialog: React.FC<CourseFormDialogProps> = ({
  open,
  onOpenChange,
  course,
  onSuccess,
}) => {
  const { toast } = useToast();
  const isEditing = !!course;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: course || {
      title: '',
      subtitle: '',
      modules: '',
      duration: '',
      diploma: '',
      feature1: '',
      feature2: '',
      icon: 'brain',
      gradient_from: 'from-academy-blue',
      gradient_to: 'to-academy-purple',
      button_text_color: 'text-academy-blue',
      floating_color1: 'bg-academy-lightblue/20',
      floating_color2: 'bg-white/10',
      link_to: '',
      status: 'draft',
      display_order: 0,
    },
  });

  React.useEffect(() => {
    if (course) {
      Object.entries(course).forEach(([key, value]) => {
        setValue(key as keyof CourseFormData, value);
      });
    } else {
      reset();
    }
  }, [course, setValue, reset]);

  const onSubmit = async (data: CourseFormData) => {
    try {
      // Prepare the data for database insertion/update
      const courseData = {
        title: data.title,
        subtitle: data.subtitle || null,
        modules: data.modules || null,
        duration: data.duration || null,
        diploma: data.diploma || null,
        feature1: data.feature1 || null,
        feature2: data.feature2 || null,
        icon: data.icon,
        gradient_from: data.gradient_from,
        gradient_to: data.gradient_to,
        button_text_color: data.button_text_color,
        floating_color1: data.floating_color1,
        floating_color2: data.floating_color2,
        link_to: data.link_to || null,
        status: data.status,
        display_order: data.display_order,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', course.id);

        if (error) throw error;

        toast({
          title: 'Succès',
          description: 'Cours mis à jour avec succès',
        });
      } else {
        const { error } = await supabase
          .from('courses')
          .insert([courseData]);

        if (error) throw error;

        toast({
          title: 'Succès',
          description: 'Cours créé avec succès',
        });
      }

      onSuccess();
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error('Error saving course:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder le cours',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier le cours' : 'Créer un nouveau cours'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Titre du cours"
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Sous-titre</Label>
              <Input
                id="subtitle"
                {...register('subtitle')}
                placeholder="Sous-titre du cours"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="modules">Modules</Label>
              <Input
                id="modules"
                {...register('modules')}
                placeholder="ex: 27 modules"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Durée</Label>
              <Input
                id="duration"
                {...register('duration')}
                placeholder="ex: 18 mois"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diploma">Diplôme</Label>
              <Input
                id="diploma"
                {...register('diploma')}
                placeholder="ex: Diplôme certifié"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="feature1">Caractéristique 1</Label>
              <Input
                id="feature1"
                {...register('feature1')}
                placeholder="ex: Machine Learning"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="feature2">Caractéristique 2</Label>
              <Input
                id="feature2"
                {...register('feature2')}
                placeholder="ex: Big Data"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="link_to">Lien vers</Label>
            <Input
              id="link_to"
              {...register('link_to')}
              placeholder="ex: /ai-course"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Icône</Label>
              <Select value={watch('icon')} onValueChange={(value) => setValue('icon', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={watch('status')} onValueChange={(value) => setValue('status', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                  <SelectItem value="archived">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Gradient de départ</Label>
              <Select value={watch('gradient_from')} onValueChange={(value) => setValue('gradient_from', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {gradientOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Gradient de fin</Label>
              <Select value={watch('gradient_to')} onValueChange={(value) => setValue('gradient_to', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {gradientOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.replace('from-', 'to-')}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_order">Ordre d'affichage</Label>
            <Input
              id="display_order"
              type="number"
              {...register('display_order', { valueAsNumber: true })}
              placeholder="0"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sauvegarde...' : isEditing ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseFormDialog;
