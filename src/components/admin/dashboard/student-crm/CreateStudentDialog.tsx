import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCreateStudent } from '@/hooks/useCreateStudent';
import { Eye, EyeOff, Loader2, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const createStudentSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Minimum 8 caractères"),
  full_name: z.string().min(2, "Nom complet requis"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().default("Morocco"),
  date_of_birth: z.string().optional(),
  academic_level: z.string().optional(),
  previous_education: z.string().optional(),
  career_goals: z.string().optional(),
  formation_type: z.string().optional(),
  formation_domaine: z.string().optional(),
  formation_programme: z.string().optional(),
  formation_tag: z.string().optional(),
  parent_name: z.string().optional(),
  parent_phone: z.string().optional(),
  parent_email: z.string().email("Email invalide").optional().or(z.literal("")),
  parent_relationship: z.string().optional(),
});

type CreateStudentFormData = z.infer<typeof createStudentSchema>;

interface CreateStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const CreateStudentDialog = ({ open, onOpenChange, onSuccess }: CreateStudentDialogProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { createStudent, loading } = useCreateStudent();

  const form = useForm<CreateStudentFormData>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      country: 'Morocco',
    },
  });

  const onSubmit = async (data: CreateStudentFormData) => {
    try {
      await createStudent(data as any);
      form.reset();
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un nouvel étudiant</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Authentication Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Authentification</h3>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="etudiant@example.com"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe temporaire *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 caractères"
                  {...form.register('password')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Informations personnelles</h3>
            
            <div className="space-y-2">
              <Label htmlFor="full_name">Nom complet *</Label>
              <Input
                id="full_name"
                placeholder="Prénom Nom"
                {...form.register('full_name')}
              />
              {form.formState.errors.full_name && (
                <p className="text-sm text-destructive">{form.formState.errors.full_name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  placeholder="+212 6 12 34 56 78"
                  {...form.register('phone')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date de naissance</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !form.watch('date_of_birth') && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch('date_of_birth') 
                        ? format(new Date(form.watch('date_of_birth')), 'dd MMMM yyyy', { locale: fr })
                        : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.watch('date_of_birth') ? new Date(form.watch('date_of_birth')) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          form.setValue('date_of_birth', format(date, 'yyyy-MM-dd'));
                        }
                      }}
                      disabled={(date) => date > new Date()}
                      initialFocus
                      locale={fr}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Adresse</h3>
            
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                placeholder="Rue, numéro"
                {...form.register('address')}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  placeholder="Marrakech"
                  {...form.register('city')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postal_code">Code postal</Label>
                <Input
                  id="postal_code"
                  placeholder="40000"
                  {...form.register('postal_code')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Pays</Label>
                <Input
                  id="country"
                  placeholder="Morocco"
                  {...form.register('country')}
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Informations académiques</h3>
            
            <div className="space-y-2">
              <Label htmlFor="academic_level">Niveau académique</Label>
              <Select onValueChange={(value) => form.setValue('academic_level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baccalauréat">Baccalauréat</SelectItem>
                  <SelectItem value="Licence">Licence</SelectItem>
                  <SelectItem value="Master">Master</SelectItem>
                  <SelectItem value="Doctorat">Doctorat</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="previous_education">Formation précédente</Label>
              <Textarea
                id="previous_education"
                placeholder="Décrivez votre parcours académique..."
                rows={3}
                {...form.register('previous_education')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="career_goals">Objectifs professionnels</Label>
              <Textarea
                id="career_goals"
                placeholder="Quels sont vos objectifs de carrière..."
                rows={3}
                {...form.register('career_goals')}
              />
            </div>
          </div>

          {/* Formation Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Détails de formation</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="formation_type">Type de formation</Label>
                <Input
                  id="formation_type"
                  placeholder="Ex: Diplômante"
                  {...form.register('formation_type')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="formation_domaine">Domaine</Label>
                <Input
                  id="formation_domaine"
                  placeholder="Ex: Informatique"
                  {...form.register('formation_domaine')}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="formation_programme">Programme</Label>
                <Input
                  id="formation_programme"
                  placeholder="Ex: Développement Web"
                  {...form.register('formation_programme')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="formation_tag">Tag (interne)</Label>
                <Input
                  id="formation_tag"
                  placeholder="Ex: 2024-DEV-WEB"
                  {...form.register('formation_tag')}
                />
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Informations du parent/tuteur</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parent_name">Nom du parent</Label>
                <Input
                  id="parent_name"
                  placeholder="Prénom Nom"
                  {...form.register('parent_name')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent_relationship">Relation</Label>
                <Select onValueChange={(value) => form.setValue('parent_relationship', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Père">Père</SelectItem>
                    <SelectItem value="Mère">Mère</SelectItem>
                    <SelectItem value="Tuteur">Tuteur</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parent_phone">Téléphone du parent</Label>
                <Input
                  id="parent_phone"
                  placeholder="+212 6 12 34 56 78"
                  {...form.register('parent_phone')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent_email">Email du parent</Label>
                <Input
                  id="parent_email"
                  type="email"
                  placeholder="parent@example.com"
                  {...form.register('parent_email')}
                />
                {form.formState.errors.parent_email && (
                  <p className="text-sm text-destructive">{form.formState.errors.parent_email.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer l'étudiant
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
