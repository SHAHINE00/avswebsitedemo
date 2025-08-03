import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { cn } from '@/lib/utils';
import { Check, AlertTriangle, Wifi, WifiOff } from 'lucide-react';

interface EnhancedFormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | null;
  suggestion?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
  isValidating?: boolean;
  isValid?: boolean;
  showValidationIcon?: boolean;
  networkStatus?: {
    isOnline: boolean;
    isSlowConnection: boolean;
  };
}

export const EnhancedFormField: React.FC<EnhancedFormFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  suggestion,
  required = false,
  placeholder,
  autoComplete,
  className,
  isValidating = false,
  isValid,
  showValidationIcon = false,
  networkStatus
}) => {
  const hasError = !!error;
  const hasValue = value.trim() !== '';
  const showSuccess = showValidationIcon && hasValue && !hasError && !isValidating && isValid;
  const showWarning = showValidationIcon && hasValue && !hasError && !isValidating && isValid === false;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        
        {/* Network status indicator */}
        {networkStatus && !networkStatus.isOnline && (
          <div className="flex items-center gap-1 text-xs text-red-500">
            <WifiOff className="w-3 h-3" />
            <span>Hors ligne</span>
          </div>
        )}
        
        {networkStatus?.isSlowConnection && networkStatus.isOnline && (
          <div className="flex items-center gap-1 text-xs text-amber-500">
            <Wifi className="w-3 h-3" />
            <span>Connexion lente</span>
          </div>
        )}
      </div>
      
      <div className="relative">
        <Input
          type={type}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          autoComplete={autoComplete}
          className={cn(
            'h-12 border-2 transition-all duration-200 pr-10',
            hasError && 'border-red-500 focus:border-red-500',
            showSuccess && 'border-green-500 focus:border-green-500',
            showWarning && 'border-amber-500 focus:border-amber-500',
            !hasError && !showSuccess && !showWarning && 'border-gray-200 focus:border-academy-blue'
          )}
          placeholder={placeholder}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${id}-error` : suggestion ? `${id}-suggestion` : undefined
          }
        />
        
        {/* Validation status icon */}
        {showValidationIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValidating && <LoadingSpinner size="sm" />}
            {!isValidating && showSuccess && (
              <Check className="w-4 h-4 text-green-500" />
            )}
            {!isValidating && showWarning && (
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            )}
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600 font-medium flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          {error}
        </p>
      )}
      
      {/* Suggestion message */}
      {suggestion && !error && (
        <p id={`${id}-suggestion`} className="text-sm text-amber-600 font-medium flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          {suggestion}
        </p>
      )}
    </div>
  );
};