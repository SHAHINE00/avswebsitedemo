import * as React from 'react';
import { Settings, Palette, Type, Layout, Globe, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { usePersonalization } from '@/hooks/usePersonalization';
import { useAccessibility } from '@/hooks/useAccessibility';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const accentColors = [
  { name: 'Bleu Académie', value: 'hsl(var(--academy-blue))' },
  { name: 'Violet Académie', value: 'hsl(var(--academy-purple))' },
  { name: 'Bleu Clair', value: 'hsl(var(--academy-lightblue))' },
  { name: 'Primaire', value: 'hsl(var(--primary))' },
  { name: 'Secondaire', value: 'hsl(var(--secondary))' }
];

export const PersonalizationPanel: React.FC = () => {
  const { 
    preferences, 
    updatePreference, 
    resetPreferences,
    getLayoutClasses,
    getFontSizeClasses
  } = usePersonalization();
  
  const { announceToScreenReader } = useAccessibility();

  const handlePreferenceChange = React.useCallback(<K extends keyof typeof preferences>(
    key: K,
    value: typeof preferences[K]
  ) => {
    updatePreference(key, value);
    announceToScreenReader(`Préférence ${key} mise à jour`);
  }, [updatePreference, announceToScreenReader]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-4 right-4 z-50 shadow-lg">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Ouvrir les paramètres de personnalisation</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Personnalisation</SheetTitle>
          <SheetDescription>
            Personnalisez votre expérience d'apprentissage selon vos préférences.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Theme Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Thème et Apparence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme-select">Thème</Label>
                <Select
                  value={preferences.theme}
                  onValueChange={(value: 'light' | 'dark' | 'auto') => 
                    handlePreferenceChange('theme', value)
                  }
                >
                  <SelectTrigger id="theme-select">
                    <SelectValue placeholder="Choisir un thème" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Automatique</SelectItem>
                    <SelectItem value="light">Clair</SelectItem>
                    <SelectItem value="dark">Sombre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Couleur d'accent</Label>
                <div className="grid grid-cols-2 gap-2">
                  {accentColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => handlePreferenceChange('accentColor', color.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        preferences.accentColor === color.value
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50'
                      }`}
                      style={{ backgroundColor: color.value }}
                      aria-label={`Sélectionner la couleur ${color.name}`}
                    >
                      <span className="text-white text-xs font-medium">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Typographie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="font-size-select">Taille de police</Label>
                <Select
                  value={preferences.fontSize}
                  onValueChange={(value: 'sm' | 'md' | 'lg' | 'xl') => 
                    handlePreferenceChange('fontSize', value)
                  }
                >
                  <SelectTrigger id="font-size-select">
                    <SelectValue placeholder="Choisir une taille" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Petite</SelectItem>
                    <SelectItem value="md">Moyenne</SelectItem>
                    <SelectItem value="lg">Grande</SelectItem>
                    <SelectItem value="xl">Très grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Layout Density */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                Mise en page
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="density-select">Densité de l'interface</Label>
                <Select
                  value={preferences.layoutDensity}
                  onValueChange={(value: 'compact' | 'comfortable' | 'spacious') => 
                    handlePreferenceChange('layoutDensity', value)
                  }
                >
                  <SelectTrigger id="density-select">
                    <SelectValue placeholder="Choisir une densité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compacte</SelectItem>
                    <SelectItem value="comfortable">Confortable</SelectItem>
                    <SelectItem value="spacious">Spacieuse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Accessibility */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Accessibilité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="reduce-motion">Réduire les animations</Label>
                <Switch
                  id="reduce-motion"
                  checked={preferences.reduceMotion}
                  onCheckedChange={(checked) => 
                    handlePreferenceChange('reduceMotion', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Language */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Langue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="language-select">Langue de l'interface</Label>
                <Select
                  value={preferences.language}
                  onValueChange={(value: 'fr' | 'en') => 
                    handlePreferenceChange('language', value)
                  }
                >
                  <SelectTrigger id="language-select">
                    <SelectValue placeholder="Choisir une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reset Button */}
          <Button 
            variant="outline" 
            onClick={resetPreferences}
            className="w-full"
          >
            Réinitialiser les préférences
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};