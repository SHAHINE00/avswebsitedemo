
import React from 'react';
import { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CourseFormData } from './types';
import { validateAndFormatLink } from './utils';

interface LinkFieldProps {
  register: UseFormRegister<CourseFormData>;
  watch: UseFormWatch<CourseFormData>;
}

const LinkField: React.FC<LinkFieldProps> = ({ register, watch }) => {
  const watchedLinkTo = watch('link_to');

  return (
    <div className="space-y-2">
      <Label htmlFor="link_to">Lien vers le cours</Label>
      <Input
        id="link_to"
        {...register('link_to')}
        placeholder="Le lien sera auto-généré à partir du titre"
      />
      <p className="text-sm text-gray-500">
        Format automatique: /course/nom-du-cours (laissez vide pour auto-génération)
      </p>
      {watchedLinkTo && (
        <p className="text-sm text-blue-600">
          Aperçu: {validateAndFormatLink(watchedLinkTo) || 'Lien invalide'}
        </p>
      )}
    </div>
  );
};

export default LinkField;
