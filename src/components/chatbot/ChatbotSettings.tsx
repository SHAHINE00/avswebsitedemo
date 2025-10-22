import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { SupportedLanguage } from '@/hooks/useChatbotLanguage';

interface ChatbotSettingsProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  soundEnabled: boolean;
  onSoundToggle: (enabled: boolean) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

const ChatbotSettings: React.FC<ChatbotSettingsProps> = ({
  language,
  onLanguageChange,
  soundEnabled,
  onSoundToggle,
  fontSize,
  onFontSizeChange
}) => {
  return (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Paramètres du chatbot</h3>
      </div>

      {/* Language Selection */}
      <div className="space-y-2">
        <Label htmlFor="language-select">Langue</Label>
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger id="language-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fr">
              <div className="flex items-center gap-2">
                <span>🇫🇷</span>
                <span>Français</span>
              </div>
            </SelectItem>
            <SelectItem value="ar">
              <div className="flex items-center gap-2">
                <span>🇲🇦</span>
                <span>العربية</span>
              </div>
            </SelectItem>
            <SelectItem value="en">
              <div className="flex items-center gap-2">
                <span>🇬🇧</span>
                <span>English</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sound Notifications */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="sound-toggle">Notifications sonores</Label>
          <p className="text-sm text-muted-foreground">
            Émettre un son lors de nouveaux messages
          </p>
        </div>
        <Switch
          id="sound-toggle"
          checked={soundEnabled}
          onCheckedChange={onSoundToggle}
        />
      </div>

      {/* Font Size */}
      <div className="space-y-2">
        <Label htmlFor="font-size">Taille du texte</Label>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">A</span>
          <Slider
            id="font-size"
            value={[fontSize]}
            onValueChange={(value) => onFontSizeChange(value[0])}
            min={12}
            max={18}
            step={1}
            className="flex-1"
          />
          <span className="text-lg text-muted-foreground">A</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Taille actuelle: {fontSize}px
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          🔒 Vos conversations sont chiffrées et sécurisées. 
          Nous ne partageons jamais vos données avec des tiers.
        </p>
      </div>
    </div>
  );
};

export default ChatbotSettings;
