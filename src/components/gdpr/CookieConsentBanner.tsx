import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useGDPRConsent, ConsentPreferences } from '@/hooks/useGDPRConsent';
import { useGDPRMonitoring } from '@/hooks/useGDPRMonitoring';
import { Shield, Cookie, BarChart3, Target, Settings } from 'lucide-react';

const CookieConsentBanner: React.FC = () => {
  // Add React null safety
  if (!React || !React.useState || !React.useEffect) {
    console.warn('CookieConsentBanner: React hooks not available');
    return null;
  }

  let consent, showBanner, updateConsent, acceptAll, rejectOptional;
  let logGDPRError;
  let showDetails, setShowDetails;
  let tempConsent, setTempConsent;

  try {
    ({ consent, showBanner, updateConsent, acceptAll, rejectOptional } = useGDPRConsent());
  } catch (error) {
    console.warn('CookieConsentBanner: useGDPRConsent failed:', error);
    return null;
  }

  try {
    ({ logGDPRError } = useGDPRMonitoring());
  } catch (error) {
    console.warn('CookieConsentBanner: useGDPRMonitoring failed:', error);
    logGDPRError = () => {};
  }

  try {
    [showDetails, setShowDetails] = useState(false);
    [tempConsent, setTempConsent] = useState<ConsentPreferences>(consent);
  } catch (error) {
    console.warn('CookieConsentBanner: useState failed:', error);
    return null;
  }

  // Enhanced error handling for component rendering
  React.useEffect(() => {
    try {
      setTempConsent(consent);
    } catch (error) {
      logGDPRError('component_render', 'Failed to sync consent state', error);
    }
  }, [consent, logGDPRError]);

  if (!showBanner) return null;

  const cookieCategories = [
    {
      key: 'necessary' as const,
      icon: Shield,
      title: 'Nécessaires',
      description: 'Ces cookies sont essentiels au fonctionnement du site web.',
      required: true,
    },
    {
      key: 'analytics' as const,
      icon: BarChart3,
      title: 'Analytiques',
      description: 'Nous aident à comprendre comment vous utilisez notre site.',
      required: false,
    },
    {
      key: 'marketing' as const,
      icon: Target,
      title: 'Marketing',
      description: 'Utilisés pour personnaliser la publicité et mesurer son efficacité.',
      required: false,
    },
    {
      key: 'functional' as const,
      icon: Settings,
      title: 'Fonctionnels',
      description: 'Permettent des fonctionnalités améliorées comme les préférences.',
      required: false,
    },
  ];

  const handleSavePreferences = () => {
    try {
      updateConsent(tempConsent);
    } catch (error) {
      logGDPRError('component_render', 'Failed to save consent preferences', error);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full z-[9999] bg-gray-800 text-white border-t border-gray-700 shadow-lg animate-in slide-in-from-bottom duration-300">
      <div className="container mx-auto px-4 py-4">
        {/* Main banner content */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left: Icon and title */}
          <div className="flex items-center gap-3">
            <Cookie className="h-5 w-5 text-white" />
            <div className="text-sm lg:text-base">
              <span className="font-medium">Gestion des Cookies</span>
              <p className="text-gray-300 text-xs lg:text-sm mt-1">
                Nous utilisons des cookies pour améliorer votre expérience.
              </p>
            </div>
          </div>

          {/* Right: Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 min-w-fit">
            <Button onClick={acceptAll} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Accepter Tout
            </Button>
            <Button onClick={rejectOptional} variant="outline" size="sm" className="border-gray-600 text-white hover:bg-gray-700">
              Rejeter Optionnels
            </Button>
            <Button 
              onClick={() => setShowDetails(!showDetails)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-700"
            >
              {showDetails ? 'Masquer' : 'Personnaliser'}
            </Button>
          </div>
        </div>

        {/* Expandable detailed options */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {cookieCategories.map(({ key, icon: Icon, title, description, required }) => (
                <div key={key} className="flex items-start justify-between p-3 rounded-lg bg-gray-700 border border-gray-600">
                  <div className="flex items-start gap-2 flex-1">
                    <Icon className="h-4 w-4 text-gray-300 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-white">{title}</span>
                        {required && <Badge variant="secondary" className="text-xs bg-gray-600 text-gray-200">Requis</Badge>}
                      </div>
                      <p className="text-xs text-gray-300 line-clamp-2">{description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={tempConsent[key]}
                    onCheckedChange={(checked) => 
                      setTempConsent(prev => ({ ...prev, [key]: checked }))
                    }
                    disabled={required}
                    className="ml-2 flex-shrink-0"
                  />
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleSavePreferences} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                Sauvegarder les Préférences
              </Button>
            </div>
          </div>
        )}

        {/* Footer links */}
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-400 text-center">
            En continuant, vous acceptez notre{' '}
            <a href="/privacy-policy" className="text-white hover:underline">
              Politique de Confidentialité
            </a>{' '}
            et nos{' '}
            <a href="/cookies-policy" className="text-white hover:underline">
              Conditions d'Utilisation
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;