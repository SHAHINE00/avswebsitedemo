
import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DownloadGuidePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const DownloadGuidePopup: React.FC<DownloadGuidePopupProps> = ({ isOpen, onClose }) => {
  const downloadGuide = (lang: string) => {
    const links = {
      fr: "https://yourdomain.com/guides/guide-ia-fr.pdf",
      en: "https://yourdomain.com/guides/guide-ia-en.pdf",
      ar: "https://yourdomain.com/guides/guide-ia-ar.pdf",
    };
    
    window.open(links[lang as keyof typeof links], "_blank");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Téléchargement du Guide IA</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Choisissez votre langue pour télécharger le guide :
          </p>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => downloadGuide('fr')} 
              variant="outline" 
              className="justify-start"
            >
              🇫🇷 Français
            </Button>
            <Button 
              onClick={() => downloadGuide('en')} 
              variant="outline" 
              className="justify-start"
            >
              🇬🇧 English
            </Button>
            <Button 
              onClick={() => downloadGuide('ar')} 
              variant="outline" 
              className="justify-start"
            >
              🇲🇦 العربية
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadGuidePopup;
