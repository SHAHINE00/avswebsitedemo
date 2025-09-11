import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Settings, 
  Moon, 
  Sun, 
  Globe,
  Volume2,
  Shield,
  Eye
} from 'lucide-react';
import { useUserProfile, UserPreferences } from '@/hooks/useUserProfile';

interface PreferencesSectionProps {
  preferences: UserPreferences | null;
}

const PreferencesSection = ({ preferences }: PreferencesSectionProps) => {
  const { updateUserPreferences } = useUserProfile();

  const handlePreferenceChange = (key: keyof UserPreferences, value: boolean) => {
    if (preferences) {
      updateUserPreferences({ [key]: value });
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Préférences de notification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications" className="text-base">
                  Notifications par email
                </Label>
                <div className="text-sm text-muted-foreground">
                  Recevez les mises à jour importantes par email
                </div>
              </div>
              <Switch
                id="email-notifications"
                checked={preferences?.email_notifications ?? true}
                onCheckedChange={(checked) => handlePreferenceChange('email_notifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications" className="text-base">
                  Notifications push
                </Label>
                <div className="text-sm text-muted-foreground">
                  Notifications instantanées sur votre navigateur
                </div>
              </div>
              <Switch
                id="push-notifications"
                checked={preferences?.push_notifications ?? true}
                onCheckedChange={(checked) => handlePreferenceChange('push_notifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="course-reminders" className="text-base">
                  Rappels de formation
                </Label>
                <div className="text-sm text-muted-foreground">
                  Rappels pour continuer vos formations en cours
                </div>
              </div>
              <Switch
                id="course-reminders"
                checked={preferences?.course_reminders ?? true}
                onCheckedChange={(checked) => handlePreferenceChange('course_reminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="appointment-reminders" className="text-base">
                  Rappels de rendez-vous
                </Label>
                <div className="text-sm text-muted-foreground">
                  Rappels pour vos rendez-vous programmés
                </div>
              </div>
              <Switch
                id="appointment-reminders"
                checked={preferences?.appointment_reminders ?? true}
                onCheckedChange={(checked) => handlePreferenceChange('appointment_reminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="achievement-notifications" className="text-base">
                  Notifications de succès
                </Label>
                <div className="text-sm text-muted-foreground">
                  Notifications lors de nouveaux succès débloqués
                </div>
              </div>
              <Switch
                id="achievement-notifications"
                checked={preferences?.achievement_notifications ?? true}
                onCheckedChange={(checked) => handlePreferenceChange('achievement_notifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="newsletter-subscription" className="text-base">
                  Newsletter
                </Label>
                <div className="text-sm text-muted-foreground">
                  Recevez notre newsletter avec les dernières actualités
                </div>
              </div>
              <Switch
                id="newsletter-subscription"
                checked={preferences?.newsletter_subscription ?? false}
                onCheckedChange={(checked) => handlePreferenceChange('newsletter_subscription', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Préférences d'apprentissage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="learning-style">Style d'apprentissage préféré</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visual">Visuel</SelectItem>
                  <SelectItem value="audio">Auditif</SelectItem>
                  <SelectItem value="kinesthetic">Kinesthésique</SelectItem>
                  <SelectItem value="reading">Lecture/Écriture</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="study-pace">Rythme d'étude</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rythme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fast">Intensif (rapide)</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="slow">Progressif (lent)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferred-time">Créneaux préférés</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un créneau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Matin (8h-12h)</SelectItem>
                  <SelectItem value="afternoon">Après-midi (12h-18h)</SelectItem>
                  <SelectItem value="evening">Soirée (18h-22h)</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="session-duration">Durée de session préférée</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une durée" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 heure</SelectItem>
                  <SelectItem value="120">2 heures</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interface Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Préférences d'interface
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="theme">Thème</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un thème" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Clair
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Sombre
                    </div>
                  </SelectItem>
                  <SelectItem value="system">Système</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Langue</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Français
                    </div>
                  </SelectItem>
                  <SelectItem value="en">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      English
                    </div>
                  </SelectItem>
                  <SelectItem value="ar">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      العربية
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="font-size">Taille de police</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une taille" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Petite</SelectItem>
                  <SelectItem value="medium">Normale</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                  <SelectItem value="extra-large">Très grande</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reduced-motion">Animations réduites</Label>
              <div className="flex items-center space-x-2">
                <Switch id="reduced-motion" />
                <Label htmlFor="reduced-motion" className="text-sm text-muted-foreground">
                  Réduire les animations pour une meilleure accessibilité
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Confidentialité et sécurité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Profil public</Label>
              <div className="text-sm text-muted-foreground">
                Permettre aux autres étudiants de voir votre profil
              </div>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Afficher les succès</Label>
              <div className="text-sm text-muted-foreground">
                Afficher vos succès sur votre profil public
              </div>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Données d'usage</Label>
              <div className="text-sm text-muted-foreground">
                Permettre la collecte de données pour améliorer l'expérience
              </div>
            </div>
            <Switch />
          </div>

          <div className="pt-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Exporter mes données
              </Button>
              <Button variant="outline" size="sm">
                Supprimer mon compte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreferencesSection;