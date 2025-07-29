
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logError } from '@/utils/logger';
import type { Course } from '@/hooks/useCourses';
import { courseSchema, CourseFormData } from './course-form/types';
import { generateSlug, validateAndFormatLink } from './course-form/utils';
import BasicInfoFields from './course-form/BasicInfoFields';
import CourseDetailsFields from './course-form/CourseDetailsFields';
import FeaturesFields from './course-form/FeaturesFields';
import LinkField from './course-form/LinkField';
import StyleFields from './course-form/StyleFields';
import DisplayOrderField from './course-form/DisplayOrderField';
import CourseFormActions from './course-form/CourseFormActions';

interface CourseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: Course | null;
  onSuccess: () => void;
}

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

  const watchedTitle = watch('title');
  const watchedLinkTo = watch('link_to');

  // Auto-generate link when title changes (only for new courses)
  React.useEffect(() => {
    if (!isEditing && watchedTitle && !watchedLinkTo) {
      const slug = generateSlug(watchedTitle);
      setValue('link_to', `/course/${slug}`);
    }
  }, [watchedTitle, watchedLinkTo, isEditing, setValue]);

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
      // Validate and format the link
      const formattedLink = data.link_to ? validateAndFormatLink(data.link_to) : '';
      
      if (data.link_to && !formattedLink) {
        toast({
          title: 'Erreur',
          description: 'Le lien fourni n\'est pas valide',
          variant: 'destructive',
        });
        return;
      }

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
        link_to: formattedLink || null,
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
      logError('Error saving course:', error);
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
          <BasicInfoFields register={register} errors={errors} />
          <CourseDetailsFields register={register} />
          <FeaturesFields register={register} />
          <LinkField register={register} watch={watch} />
          <StyleFields watch={watch} setValue={setValue} />
          <DisplayOrderField register={register} />
          <CourseFormActions 
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
            isEditing={isEditing}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseFormDialog;
