
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CourseFormData } from './types';

interface FeaturesFieldsProps {
  register: UseFormRegister<CourseFormData>;
}

const FeaturesFields: React.FC<FeaturesFieldsProps> = ({ register }) => {
  return (
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
  );
};

export default FeaturesFields;
