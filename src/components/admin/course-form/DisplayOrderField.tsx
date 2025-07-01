
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CourseFormData } from './types';

interface DisplayOrderFieldProps {
  register: UseFormRegister<CourseFormData>;
}

const DisplayOrderField: React.FC<DisplayOrderFieldProps> = ({ register }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="display_order">Ordre d'affichage</Label>
      <Input
        id="display_order"
        type="number"
        {...register('display_order', { valueAsNumber: true })}
        placeholder="0"
      />
    </div>
  );
};

export default DisplayOrderField;
