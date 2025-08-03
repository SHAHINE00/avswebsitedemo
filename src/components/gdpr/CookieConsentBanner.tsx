import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useGDPRConsent, ConsentPreferences } from '@/hooks/useGDPRConsent';
import { useGDPRMonitoring } from '@/hooks/useGDPRMonitoring';
import { Shield, Cookie, BarChart3, Target, Settings } from 'lucide-react';

const CookieConsentBanner: React.FC = () => {
  const { consent, showBanner, updateConsent, acceptAll, rejectOptional } = useGDPRConsent();
  const { logGDPRError } = useGDPRMonitoring();
  const [showDetails, setShowDetails] = useState(false);
  const [tempConsent, setTempConsent] = useState<ConsentPreferences>(consent);

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4">
      <Card className="w-full max-w-2xl bg-background border-border shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Cookie className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">Gestion des Cookies</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez gérer vos préférences ci-dessous.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {showDetails && (
            <div className="space-y-4">
              {cookieCategories.map(({ key, icon: Icon, title, description, required }) => (
                <div key={key} className="flex items-start justify-between p-4 rounded-lg border bg-card/50">
                  <div className="flex items-start gap-3 flex-1">
                    <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{title}</span>
                        {required && <Badge variant="secondary" className="text-xs">Requis</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={tempConsent[key]}
                    onCheckedChange={(checked) => 
                      setTempConsent(prev => ({ ...prev, [key]: checked }))
                    }
                    disabled={required}
                    className="ml-4"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={acceptAll} className="flex-1">
              Accepter Tout
            </Button>
            <Button onClick={rejectOptional} variant="outline" className="flex-1">
              Rejeter Optionnels
            </Button>
            <Button 
              onClick={() => setShowDetails(!showDetails)}
              variant="ghost"
              className="flex-1"
            >
              {showDetails ? 'Masquer' : 'Personnaliser'}
            </Button>
          </div>

          {showDetails && (
            <Button onClick={handleSavePreferences} className="w-full">
              Sauvegarder les Préférences
            </Button>
          )}

          <p className="text-xs text-muted-foreground text-center">
            En continuant, vous acceptez notre{' '}
            <a href="/privacy-policy" className="text-primary hover:underline">
              Politique de Confidentialité
            </a>{' '}
            et nos{' '}
            <a href="/cookies-policy" className="text-primary hover:underline">
              Conditions d'Utilisation
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsentBanner;