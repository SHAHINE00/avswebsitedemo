import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const editStudentSchema = z.object({
  full_name: z.string().trim().min(1, 'Le nom est requis').max(100, 'Le nom est trop long'),
  email: z.string().trim().email('Email invalide').max(255, 'Email trop long'),
  phone: z.string().trim().max(20, 'Numéro trop long').optional().or(z.literal('')),
  student_status: z.string().min(1, 'Le statut est requis')
});

type EditStudentFormData = z.infer<typeof editStudentSchema>;

interface Student {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  student_status?: string;
}

interface EditStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onSuccess: () => void;
}

export const EditStudentDialog: React.FC<EditStudentDialogProps> = ({ 
  open, 
  onOpenChange, 
  student,
  onSuccess 
}) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm<EditStudentFormData>({
    resolver: zodResolver(editStudentSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      student_status: 'active'
    }
  });

  // Reset form when student changes
  useEffect(() => {
    if (student) {
      reset({
        full_name: student.full_name || '',
        email: student.email || '',
        phone: student.phone || '',
        student_status: student.student_status || 'active'
      });
    }
  }, [student, reset]);

  const onSubmit = async (data: EditStudentFormData) => {
    if (!student) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          email: data.email,
          phone: data.phone || null,
          student_status: data.student_status,
          updated_at: new Date().toISOString()
        })
        .eq('id', student.id);

      if (error) throw error;

      toast({
        title: 'Profil mis à jour',
        description: 'Les informations de l\'étudiant ont été mises à jour avec succès.'
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error('Error updating student:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de mettre à jour le profil.',
        variant: 'destructive'
      });
    }
  };

  const studentStatus = watch('student_status');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier l'étudiant</DialogTitle>
          <DialogDescription>
            Mettre à jour les informations de base de l'étudiant
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nom complet *</Label>
            <Input
              id="full_name"
              {...register('full_name')}
              placeholder="Jean Dupont"
            />
            {errors.full_name && (
              <p className="text-sm text-destructive">{errors.full_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="jean.dupont@example.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder="+212 6 12 34 56 78"
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="student_status">Statut *</Label>
            <Select 
              value={studentStatus} 
              onValueChange={(value) => setValue('student_status', value)}
            >
              <SelectTrigger id="student_status">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="on_hold">En pause</SelectItem>
                <SelectItem value="suspended">Suspendu</SelectItem>
                <SelectItem value="graduated">Diplômé</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
              </SelectContent>
            </Select>
            {errors.student_status && (
              <p className="text-sm text-destructive">{errors.student_status.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
