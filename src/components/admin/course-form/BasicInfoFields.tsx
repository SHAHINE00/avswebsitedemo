
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CourseFormData } from './types';

interface BasicInfoFieldsProps {
  register: UseFormRegister<CourseFormData>;
  errors: FieldErrors<CourseFormData>;
}

const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({ register, errors }) => {
  return (
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
  );
};

export default BasicInfoFields;
