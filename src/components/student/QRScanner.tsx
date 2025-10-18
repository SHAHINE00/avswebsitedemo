import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { QrCode, CheckCircle2, XCircle } from 'lucide-react';

interface QRScannerProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ open, onClose, onSuccess }) => {
  const [qrToken, setQrToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();

  const handleScan = async () => {
    if (!qrToken.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez scanner ou saisir le code QR",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('validate-qr-checkin', {
        body: { token: qrToken }
      });

      if (error) throw error;

      if (data.success) {
        setResult({ success: true, message: data.message });
        toast({
          title: "Succès",
          description: data.message,
        });
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 2000);
      } else {
        throw new Error(data.error || 'Erreur lors de la validation');
      }
    } catch (error: any) {
      console.error('QR scan error:', error);
      const errorMessage = error.message || 'Impossible de valider le code QR';
      setResult({ success: false, message: errorMessage });
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setQrToken('');
    setResult(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Scanner le QR Code
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Scannez le code QR affiché par votre professeur ou saisissez le code manuellement.
            </p>
            
            <Input
              placeholder="Code QR"
              value={qrToken}
              onChange={(e) => setQrToken(e.target.value)}
              disabled={loading}
            />
          </div>

          {result && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              result.success ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'
            }`}>
              {result.success ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <p className="text-sm">{result.message}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleScan}
              disabled={loading || !qrToken.trim()}
              className="flex-1"
            >
              {loading ? 'Validation...' : 'Valider'}
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};