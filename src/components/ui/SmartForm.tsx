import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Mic, MicOff } from 'lucide-react';
import { useTouchFeedback } from '@/hooks/useTouchFeedback';

interface SmartFormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'password';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  suggestions?: string[];
  realTimeValidation?: boolean;
  voiceInput?: boolean;
  className?: string;
}

export const SmartFormField: React.FC<SmartFormFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  suggestions = [],
  realTimeValidation = true,
  voiceInput = false,
  className
}) => {
  const [focused, setFocused] = useState(false);
  const [validationState, setValidationState] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [validationMessage, setValidationMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const micFeedback = useTouchFeedback({ intensity: 'medium' });

  // Validation logic
  const validateField = (inputValue: string) => {
    if (!realTimeValidation) return;

    if (required && !inputValue.trim()) {
      setValidationState('invalid');
      setValidationMessage('Ce champ est requis');
      return;
    }

    if (type === 'email' && inputValue) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inputValue)) {
        setValidationState('invalid');
        setValidationMessage('Adresse email invalide');
        return;
      }
    }

    if (type === 'tel' && inputValue) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
      if (!phoneRegex.test(inputValue)) {
        setValidationState('invalid');
        setValidationMessage('Numéro de téléphone invalide');
        return;
      }
    }

    setValidationState(inputValue ? 'valid' : 'idle');
    setValidationMessage('');
  };

  // Filter suggestions based on input
  useEffect(() => {
    if (value && suggestions.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0 && focused);
    } else {
      setShowSuggestions(false);
    }
  }, [value, suggestions, focused]);

  // Real-time validation
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      validateField(value);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [value, type, required, realTimeValidation]);

  // Voice input setup
  useEffect(() => {
    if (!voiceInput) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onChange(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [voiceInput, onChange]);

  const handleVoiceInput = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const getValidationIcon = () => {
    switch (validationState) {
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'invalid':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cn(
            "transition-all duration-200",
            focused && "ring-2 ring-primary/20",
            validationState === 'valid' && "border-green-500",
            validationState === 'invalid' && "border-destructive",
            voiceInput && "pr-16"
          )}
        />

        {/* Validation icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          {getValidationIcon()}
          
          {/* Voice input button */}
          {voiceInput && (
            <button
              type="button"
              {...micFeedback.touchHandlers}
              onClick={handleVoiceInput}
              className={cn(
                "p-1 rounded-full transition-colors",
                isListening ? "bg-red-100 text-red-600" : "hover:bg-muted",
                micFeedback.pressedClasses
              )}
              aria-label={isListening ? "Arrêter l'enregistrement" : "Commencer l'enregistrement vocal"}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionSelect(suggestion)}
                className="w-full text-left px-3 py-2 hover:bg-muted transition-colors text-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Validation message */}
      {validationMessage && (
        <Alert variant={validationState === 'invalid' ? 'destructive' : 'default'} className="py-2">
          <AlertDescription className="text-xs">
            {validationMessage}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

// Form progress indicator
export const FormProgress: React.FC<{
  currentStep: number;
  totalSteps: number;
  stepTitles?: string[];
  className?: string;
}> = ({ currentStep, totalSteps, stepTitles, className }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step indicators */}
      {stepTitles && (
        <div className="flex justify-between text-xs text-muted-foreground">
          {stepTitles.map((title, index) => (
            <span
              key={index}
              className={cn(
                "transition-colors",
                index < currentStep && "text-primary font-medium"
              )}
            >
              {title}
            </span>
          ))}
        </div>
      )}

      {/* Current step indicator */}
      <div className="text-center text-sm text-muted-foreground">
        Étape {currentStep} sur {totalSteps}
      </div>
    </div>
  );
};