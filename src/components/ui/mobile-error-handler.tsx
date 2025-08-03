// Mobile-specific error handler component
import * as React from 'react';
import { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, Wifi, WifiOff, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { logError, logInfo } from '@/utils/logger';

interface MobileErrorHandlerProps {
  error?: Error;
  onRetry?: () => void;
}

export const MobileErrorHandler: React.FC<MobileErrorHandlerProps> = ({ error, onRetry }) => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleOnline = () => {
      setIsOnline(true);
      logInfo('Network connection restored');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      logInfo('Network connection lost');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    setRetryCount(prev => prev + 1);
    logInfo(`Mobile error retry attempt: ${retryCount + 1}`);
    
    if (onRetry) {
      onRetry();
    } else {
      try {
        // Progressive retry strategy for mobile
        if (retryCount === 0) {
          // First retry: just reload
          (window as any).location.reload();
        } else if (retryCount === 1) {
          // Second retry: clear caches and reload
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
          }
          (window as any).location.reload();
        } else {
          // Third+ retry: hard refresh
          (window as any).location.href = (window as any).location.href;
        }
      } catch (e) {
        logError('Mobile retry failed:', e);
        (window as any).location.reload();
      }
    }
  };

  const isNetworkError = error?.message?.includes('Failed to fetch') || 
                        error?.message?.includes('Loading chunk') ||
                        error?.message?.includes('dynamically imported module');

  const getErrorTitle = () => {
    if (!isOnline) return 'Connexion perdue';
    if (isNetworkError) return 'Problème de chargement';
    return 'Erreur inattendue';
  };

  const getErrorMessage = () => {
    if (!isOnline) {
      return 'Votre connexion internet semble interrompue. Vérifiez votre connexion et réessayez.';
    }
    if (isNetworkError) {
      return 'Erreur de chargement du contenu. Cela peut être dû à une connexion lente ou à un problème temporaire.';
    }
    return 'Une erreur s\'est produite. Essayez de rafraîchir la page.';
  };

  const getRetryText = () => {
    if (retryCount === 0) return 'Réessayer';
    if (retryCount < 3) return `Réessayer (${retryCount + 1})`;
    return 'Rafraîchir la page';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-4">
        <Alert className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
          <div className="flex items-center gap-2">
            {!isOnline ? (
              <WifiOff className="h-4 w-4" />
            ) : (
              <Smartphone className="h-4 w-4" />
            )}
            <AlertDescription>
              <div className="space-y-3">
                <p className="font-medium text-foreground">
                  {getErrorTitle()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {getErrorMessage()}
                </p>
                
                {!isOnline && (
                  <div className="flex items-center gap-2 text-sm">
                    <WifiOff className="h-3 w-3 text-orange-500" />
                    <span className="text-orange-600">Hors ligne</span>
                  </div>
                )}

                {process.env.NODE_ENV === 'development' && error && (
                  <details className="text-xs bg-muted p-2 rounded mt-2">
                    <summary>Détails de l'erreur (dev only)</summary>
                    <pre className="mt-2 overflow-auto text-[10px]">
                      {error.stack}
                    </pre>
                  </details>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={handleRetry} 
                    size="sm" 
                    className="flex items-center gap-2"
                    disabled={!isOnline && isNetworkError}
                  >
                    <RefreshCw className="h-3 w-3" />
                    {getRetryText()}
                  </Button>
                  
                  {retryCount >= 2 && (
                   <Button 
                     onClick={() => {
                       // Force hard refresh
                       if (typeof window !== 'undefined') {
                         window.location.href = window.location.href;
                       }
                     }} 
                     variant="outline" 
                     size="sm"
                   >
                     Actualiser
                   </Button>
                  )}
                </div>

                {!isOnline && (
                  <div className="text-xs text-muted-foreground bg-orange-50 p-2 rounded">
                    <strong>Conseil:</strong> Vérifiez votre Wi-Fi ou vos données mobiles, puis réessayez.
                  </div>
                )}
              </div>
            </AlertDescription>
          </div>
        </Alert>
      </div>
    </div>
  );
};