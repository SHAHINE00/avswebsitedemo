
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CourseFormData } from './types';

interface CourseDetailsFieldsProps {
  register: UseFormRegister<CourseFormData>;
}

const CourseDetailsFields: React.FC<CourseDetailsFieldsProps> = ({ register }) => {
  return (
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
  );
};

export default CourseDetailsFields;
