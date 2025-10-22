import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { AlertCircle } from 'lucide-react';

interface RateLimitIndicatorProps {
  remainingRequests: number;
  maxRequests: number;
}

const RateLimitIndicator: React.FC<RateLimitIndicatorProps> = ({ 
  remainingRequests, 
  maxRequests 
}) => {
  const [show, setShow] = useState(false);
  const percentage = (remainingRequests / maxRequests) * 100;
  const isLow = percentage < 20;

  useEffect(() => {
    setShow(isLow);
  }, [isLow]);

  if (!show) return null;

  return (
    <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800">
      <div className="flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
        <div className="flex-1 space-y-2">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            Limite de requêtes: {remainingRequests}/{maxRequests} restantes
          </p>
          <Progress value={percentage} className="h-1" />
          <p className="text-xs text-yellow-600 dark:text-yellow-400">
            Patientez quelques minutes si vous atteignez la limite
          </p>
        </div>
      </div>
    </div>
  );
};

export default RateLimitIndicator;
