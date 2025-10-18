import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Key, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  onGenerateLink: () => Promise<string | null>;
}

export const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({
  open,
  onOpenChange,
  userEmail,
  onGenerateLink,
}) => {
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleGenerateLink = async () => {
    setGenerating(true);
    const link = await onGenerateLink();
    if (link) {
      setResetLink(link);
    }
    setGenerating(false);
  };

  const handleCopy = async () => {
    if (resetLink) {
      await navigator.clipboard.writeText(resetLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setResetLink(null);
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Réinitialisation du mot de passe
          </DialogTitle>
          <DialogDescription>
            Générer un lien de réinitialisation pour {userEmail}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!resetLink ? (
            <Alert>
              <AlertDescription>
                Un lien de réinitialisation sécurisé sera généré. Vous pourrez le copier et l'envoyer à l'utilisateur.
                Le lien expire après 1 heure.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  ✓ Lien généré avec succès ! Copiez-le et envoyez-le à l'utilisateur.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Label htmlFor="reset-link">Lien de réinitialisation</Label>
                <div className="flex gap-2">
                  <Input
                    id="reset-link"
                    value={resetLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleCopy}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Alert variant="destructive">
                <AlertDescription className="text-sm">
                  <strong>Important :</strong> Ce lien permet de réinitialiser le mot de passe.
                  Ne le partagez qu'avec l'utilisateur concerné via un canal sécurisé.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Fermer
          </Button>
          {!resetLink && (
            <Button onClick={handleGenerateLink} disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 mr-2" />
                  Générer le lien
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
