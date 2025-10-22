import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface SuggestedResponsesProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

const SuggestedResponses: React.FC<SuggestedResponsesProps> = ({ suggestions, onSelect }) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="w-3 h-3" />
        <span>Suggestions</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSelect(suggestion)}
            className="text-xs h-7 px-3"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedResponses;
