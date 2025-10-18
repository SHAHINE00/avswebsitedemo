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
import { Copy, Check, Key, Loader2, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  onGenerateLink: () => Promise<string | null>;
  onSetPassword?: (password: string) => Promise<boolean>;
}

export const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({
  open,
  onOpenChange,
  userEmail,
  onGenerateLink,
  onSetPassword,
}) => {
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [mode, setMode] = useState<'choose' | 'link' | 'password'>('choose');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [settingPassword, setSettingPassword] = useState(false);
  const [passwordSet, setPasswordSet] = useState(false);

  const handleGenerateLink = async () => {
    setGenerating(true);
    setMode('link');
    const link = await onGenerateLink();
    if (link) {
      setResetLink(link);
    }
    setGenerating(false);
  };

  const handleSetPassword = async () => {
    if (!onSetPassword || !newPassword) return;
    
    setSettingPassword(true);
    const success = await onSetPassword(newPassword);
    if (success) {
      setPasswordSet(true);
      setNewPassword('');
    }
    setSettingPassword(false);
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
    setMode('choose');
    setNewPassword('');
    setPasswordSet(false);
    setShowPassword(false);
    onOpenChange(false);
  };

  const getPasswordStrength = (password: string): { strength: string; color: string; isStrong: boolean } => {
    if (password.length === 0) return { strength: '', color: '', isStrong: false };
    if (password.length < 8) return { strength: 'Trop court (min 8)', color: 'text-red-600', isStrong: false };
    
    // Simplified: just need 8+ characters
    return { strength: 'Bon', color: 'text-green-600', isStrong: true };
  };

  const passwordStrength = getPasswordStrength(newPassword);
  
  // Generate a strong password suggestion
  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*';
    let password = '';
    // Make it longer and more random to avoid pwned databases
    for (let i = 0; i < 20; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(password);
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
          {mode === 'choose' && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Choisissez comment réinitialiser le mot de passe pour {userEmail}
                </AlertDescription>
              </Alert>
              
              <div className="grid gap-3">
                {onSetPassword && (
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto py-4"
                    onClick={() => setMode('password')}
                  >
                    <Key className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Définir un mot de passe</div>
                      <div className="text-sm text-muted-foreground">
                        Définissez directement un nouveau mot de passe
                      </div>
                    </div>
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-4"
                  onClick={handleGenerateLink}
                  disabled={generating}
                >
                  {generating ? (
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  ) : (
                    <Copy className="w-5 h-5 mr-3" />
                  )}
                  <div className="text-left">
                    <div className="font-semibold">Générer un lien de réinitialisation</div>
                    <div className="text-sm text-muted-foreground">
                      Créer un lien que l'utilisateur pourra utiliser (expire après 1h)
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          )}

          {mode === 'password' && !passwordSet && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Définissez un nouveau mot de passe pour {userEmail}
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={generateStrongPassword}
                    className="text-xs"
                  >
                    Générer un mot de passe fort
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 caractères"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {newPassword && (
                  <div className="text-sm">
                    Force du mot de passe: <span className={passwordStrength.color + ' font-semibold'}>{passwordStrength.strength}</span>
                  </div>
                )}

                <Alert className="text-xs">
                  <AlertDescription>
                    <strong>Exigence :</strong>
                    <ul className="list-disc list-inside mt-2">
                      <li className={newPassword.length >= 8 ? 'text-green-600 font-semibold' : ''}>
                        Au moins 8 caractères
                      </li>
                      <li className="text-yellow-600 font-semibold">
                        ⚠️ Certains mots de passe simples sont refusés même s'ils respectent la longueur minimum
                      </li>
                      <li className="text-blue-600">
                        💡 Utilisez le bouton "Générer un mot de passe fort" pour éviter les refus
                      </li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}

          {passwordSet && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                ✓ Mot de passe défini avec succès ! L'utilisateur peut maintenant se connecter avec ce nouveau mot de passe.
              </AlertDescription>
            </Alert>
          )}

          {mode === 'link' && !resetLink && generating && (
            <Alert>
              <AlertDescription>
                <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                Génération du lien en cours...
              </AlertDescription>
            </Alert>
          )}

          {mode === 'link' && resetLink && (
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
          {mode === 'choose' && (
            <Button variant="outline" onClick={handleClose}>
              Annuler
            </Button>
          )}
          
          {mode === 'password' && !passwordSet && (
            <>
              <Button variant="outline" onClick={() => setMode('choose')}>
                Retour
              </Button>
              <Button 
                onClick={handleSetPassword} 
                disabled={settingPassword || !passwordStrength.isStrong}
              >
                {settingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Définition...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-2" />
                    Définir le mot de passe
                  </>
                )}
              </Button>
            </>
          )}

          {(mode === 'link' || passwordSet) && (
            <Button onClick={handleClose}>
              Fermer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
