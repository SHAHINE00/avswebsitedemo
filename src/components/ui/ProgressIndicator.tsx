import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check, Clock, Save } from 'lucide-react';

interface ProgressIndicatorProps {
  percentage: number;
  completedSteps: number;
  totalSteps: number;
  currentStep: string;
  lastSaved?: string | null;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  percentage,
  completedSteps,
  totalSteps,
  currentStep,
  lastSaved,
  className
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">
            Progression ({completedSteps}/{totalSteps})
          </span>
          <span className="text-academy-blue font-semibold">
            {percentage}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-academy-blue to-academy-purple transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      
      {/* Status Indicators */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>Étape: {currentStep}</span>
        </div>
        
        {lastSaved && (
          <div className="flex items-center gap-1 text-green-600">
            <Save className="w-3 h-3" />
            <span>{lastSaved}</span>
          </div>
        )}
      </div>
      
      {/* Completion Badge */}
      {percentage === 100 && (
        <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
          <Check className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">
            Formulaire complété - Prêt pour l'envoi
          </span>
        </div>
      )}
    </div>
  );
};