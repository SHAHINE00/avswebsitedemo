import { useState, useEffect, useCallback, useMemo } from 'react';

interface FormProgress {
  completedSteps: number;
  totalSteps: number;
  percentage: number;
  currentStep: string;
  isComplete: boolean;
}

interface FormProgressConfig {
  steps: {
    [key: string]: {
      fields: string[];
      weight?: number;
    };
  };
}

export const useFormProgress = (
  formData: Record<string, any>,
  config: FormProgressConfig
) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Helper function to get nested property value
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => {
      return current && typeof current === 'object' ? current[key] : undefined;
    }, obj);
  };

  const progress = useMemo((): FormProgress => {
    const stepKeys = Object.keys(config.steps);
    const totalSteps = stepKeys.length;
    let completedSteps = 0;
    let currentStep = stepKeys[0];

    for (const stepKey of stepKeys) {
      const { fields } = config.steps[stepKey];
      const isStepComplete = fields.every(field => {
        const value = getNestedValue(formData, field);
        if (typeof value === 'string') return value.trim() !== '';
        if (typeof value === 'object' && value !== null) {
          return Object.keys(value).length > 0;
        }
        return value !== undefined && value !== null && value !== '';
      });

      if (isStepComplete) {
        completedSteps++;
        if (completedSteps < totalSteps) {
          currentStep = stepKeys[completedSteps] || stepKeys[totalSteps - 1];
        }
      } else {
        currentStep = stepKey;
        break;
      }
    }

    const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
    const isComplete = completedSteps === totalSteps;

    return {
      completedSteps,
      totalSteps,
      percentage,
      currentStep,
      isComplete
    };
  }, [formData, config]);

  const markSaved = useCallback(() => {
    setLastSaved(new Date());
  }, []);

  const getSavedStatus = useCallback(() => {
    if (!lastSaved) return null;
    
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastSaved.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Sauvegardé à l\'instant';
    if (diffMinutes < 60) return `Sauvegardé il y a ${diffMinutes} min`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Sauvegardé il y a ${diffHours}h`;
    
    return lastSaved.toLocaleDateString('fr-FR');
  }, [lastSaved]);

  return {
    progress,
    lastSaved,
    markSaved,
    getSavedStatus
  };
};