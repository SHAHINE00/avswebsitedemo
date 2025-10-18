import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRCheckInProps {
  sessionId: string;
  courseId: string;
  onClose?: () => void;
}

export const QRCheckIn: React.FC<QRCheckInProps> = ({ sessionId, courseId, onClose }) => {
  const [qrCode, setQrCode] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    generateQRCode();
  }, [sessionId]);

  const generateQRCode = () => {
    // Generate unique QR code data
    const timestamp = Date.now();
    const token = `${sessionId}-${timestamp}`;
    const qrData = btoa(JSON.stringify({
      sessionId,
      courseId,
      timestamp,
      token
    }));

    // In production, you would use a QR code library like qrcode.react
    // For now, we'll create a simple data URL representation
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;
    
    setQrCode(qrCodeUrl);
    
    // Set expiration to 15 minutes from now
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 15);
    setExpiresAt(expiry);

    toast({
      title: "QR Code généré",
      description: "Le code QR est valide pendant 15 minutes"
    });
  };

  const handleRefresh = () => {
    generateQRCode();
  };

  const timeRemaining = expiresAt ? Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000 / 60)) : 0;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code - Pointage rapide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center gap-4">
          {qrCode && (
            <div className="relative">
              <img 
                src={qrCode} 
                alt="QR Code de pointage" 
                className="w-64 h-64 border-4 border-primary rounded-lg"
              />
              {timeRemaining <= 5 && timeRemaining > 0 && (
                <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
                  Expire bientôt!
                </div>
              )}
            </div>
          )}
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Les étudiants peuvent scanner ce code pour pointer leur présence
            </p>
            {expiresAt && (
              <p className="text-sm font-medium">
                Valide encore {timeRemaining} minutes
              </p>
            )}
          </div>

          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Régénérer
            </Button>
            {onClose && (
              <Button 
                variant="secondary" 
                onClick={onClose}
                className="flex-1"
              >
                Fermer
              </Button>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2 text-sm">Instructions:</h4>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Affichez ce QR code aux étudiants</li>
            <li>Ils scannent avec leur téléphone</li>
            <li>Leur présence est automatiquement enregistrée</li>
            <li>Le code expire après 15 minutes</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};
