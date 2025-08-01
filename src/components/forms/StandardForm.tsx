import React from 'react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface FormFieldProps {
  label: string;
  id: string;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
  placeholder?: string;
}

interface StandardFormProps {
  fields: FormFieldProps[];
  onSubmit: (e: React.FormEvent) => void;
  submitText: string;
  loading?: boolean;
  successMessage?: React.ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  required = false,
  disabled = false,
  options = [],
  rows = 5,
  placeholder
}) => {
  const baseInputClasses = "w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1">
        {label} {required && '*'}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={onChange}
          className={baseInputClasses}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
        />
      ) : type === 'select' ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={baseInputClasses}
          required={required}
          disabled={disabled}
        >
          <option value="">Sélectionnez une option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          className={baseInputClasses}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

const StandardForm: React.FC<StandardFormProps> = ({
  fields,
  onSubmit,
  submitText,
  loading = false,
  successMessage,
  className = ""
}) => {
  if (successMessage) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        {successMessage}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
      {fields.map((field) => (
        <FormField key={field.id} {...field} />
      ))}
      
      <Button 
        type="submit" 
        disabled={loading}
        className="w-full sm:w-auto"
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Envoi en cours...
          </>
        ) : (
          submitText
        )}
      </Button>
    </form>
  );
};

export default StandardForm;