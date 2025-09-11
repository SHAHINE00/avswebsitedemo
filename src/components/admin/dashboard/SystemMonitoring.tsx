
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Server, 
  Database, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  HardDrive,
  Users,
  RefreshCw,
  Shield,
  Mail,
  Send,
  Key
} from 'lucide-react';
import { useSystemHealth } from '@/hooks/useSystemHealth';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const SystemMonitoring = () => {
  const { health, loading, error, refetch } = useSystemHealth();
  const { toast } = useToast();
  const { user } = useAuth();
  const [sendingTest, setSendingTest] = React.useState(false);
  const [sendingMagicLink, setSendingMagicLink] = React.useState(false);
  const [sendingResetEmail, setSendingResetEmail] = React.useState(false);
  const [sendingSMTPReset, setSendingSMTPReset] = React.useState(false);
  const [customTestEmail, setCustomTestEmail] = React.useState('');

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getConnectionStatus = (connections: number) => {
    if (connections < 10) return { status: 'good', color: 'text-green-600', icon: CheckCircle };
    if (connections < 20) return { status: 'warning', color: 'text-yellow-600', icon: AlertTriangle };
    return { status: 'critical', color: 'text-red-600', icon: XCircle };
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleSendTestEmail = async () => {
    if (!user?.email) {
      toast({
        title: "Impossible d'envoyer",
        description: "Aucun email administrateur détecté. Veuillez vous connecter.",
        variant: "destructive",
      });
      return;
    }

    setSendingTest(true);
    try {
      const { error } = await supabase.functions.invoke('send-hostinger-email', {
        body: {
          type: 'custom',
          to: [user.email],
          subject: '[Test SMTP] AVS INSTITUTE',
          html: `<div style="font-family: Arial, sans-serif;">
                   <h2>Test SMTP réussi ✅</h2>
                   <p>Ceci est un email de test envoyé via Hostinger SMTP.</p>
                   <p>Date: ${new Date().toLocaleString('fr-FR')}</p>
                 </div>`
        }
      });

      if (error) throw error;

      toast({
        title: 'Email de test envoyé',
        description: `Vérifiez votre boîte mail: ${user.email}`,
      });
    } catch (err) {
      console.error('Test email error:', err);
      toast({
        title: "Erreur d'envoi",
        description: "Consultez les logs de la fonction 'send-hostinger-email'.",
        variant: 'destructive',
      });
    } finally {
      setSendingTest(false);
    }
  };

  const handleSendMagicLink = async () => {
    const emailToTest = customTestEmail || user?.email;
    if (!emailToTest) {
      toast({
        title: "Email requis",
        description: "Veuillez entrer un email ou vous connecter.",
        variant: "destructive",
      });
      return;
    }

    setSendingMagicLink(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: emailToTest,
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        if (error.message.includes('rate_limit')) {
          toast({
            title: "Limite de débit atteinte",
            description: "Attendez 60 secondes avant de renvoyer un lien magique.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: 'Lien magique envoyé ✅',
          description: `Vérifiez votre boîte mail: ${emailToTest}`,
        });
      }
    } catch (err) {
      console.error('Magic link error:', err);
      toast({
        title: "Erreur d'envoi",
        description: "Vérifiez la configuration SMTP dans Supabase Auth.",
        variant: 'destructive',
      });
    } finally {
      setSendingMagicLink(false);
    }
  };

  const handleSendResetEmail = async () => {
    const emailToTest = (customTestEmail || user?.email || '').trim();
    if (!emailToTest) {
      toast({
        title: "Email requis",
        description: "Veuillez entrer un email ou vous connecter.",
        variant: "destructive",
      });
      return;
    }

    const key = `pw_reset_cooldown:${emailToTest.toLowerCase()}`;
    const now = Date.now();
    const until = Number(localStorage.getItem(key) || 0);
    const remaining = Math.max(0, Math.ceil((until - now) / 1000));
    if (remaining > 0) {
      toast({
        title: "Veuillez patienter",
        description: `Vous pourrez renvoyer un email dans ${remaining}s.`,
        variant: "destructive",
      });
      return;
    }

    setSendingResetEmail(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(emailToTest, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        const msg = (error as any)?.message || '';
        const codeText = msg.toLowerCase();
        if (codeText.includes('rate') || codeText.includes('429') || codeText.includes('over_email_send_rate_limit')) {
          localStorage.setItem(key, String(now + 60_000));

          try {
            const { data: fnData, error: fnError } = await supabase.functions.invoke('send-password-reset-link', {
              body: { email: emailToTest, redirectTo: `${window.location.origin}/reset-password` }
            });

            if (fnError || (fnData as any)?.error) {
              toast({
                title: "Limite de débit atteinte",
                description: "Attendez 60 secondes avant de renvoyer un email de réinitialisation.",
                variant: "destructive",
              });
              return;
            }

            toast({
              title: 'Email (secours) envoyé ✅',
              description: `Lien envoyé via SMTP: ${emailToTest}`,
            });
            return;
          } catch (_) {
            toast({
              title: "Limite de débit atteinte",
              description: "Attendez 60 secondes avant de renvoyer un email de réinitialisation.",
              variant: "destructive",
            });
            return;
          }
        }
        if (codeText.includes('invalid') || codeText.includes('not found')) {
          toast({
            title: "Email introuvable",
            description: "Aucun utilisateur associé à cet email.",
            variant: "destructive",
          });
          return;
        }
        if (codeText.includes('timeout') || (error as any)?.status === 504) {
          toast({
            title: "Temps dépassé",
            description: "Le serveur a mis trop de temps à répondre. Réessayez dans un instant.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      localStorage.setItem(key, String(Date.now() + 60_000));
      toast({
        title: 'Email de réinitialisation envoyé ✅',
        description: `Vérifiez votre boîte mail: ${emailToTest}`,
      });
    } catch (err) {
      console.error('Reset email error:', err);
      toast({
        title: "Erreur d'envoi",
        description: "Vérifiez la configuration SMTP dans Supabase Auth.",
        variant: 'destructive',
      });
    } finally {
      setSendingResetEmail(false);
    }
  };

  const handleSendSMTPResetEmail = async () => {
    const emailToTest = (customTestEmail || user?.email || '').trim();
    if (!emailToTest) {
      toast({
        title: "Email requis",
        description: "Veuillez entrer un email ou vous connecter.",
        variant: "destructive",
      });
      return;
    }
    setSendingSMTPReset(true);
    console.info('[SystemMonitoring] Invoking SMTP reset for', emailToTest);
    try {
      const { data: fnData, error: fnError } = await supabase.functions.invoke('send-password-reset-link', {
        body: { email: emailToTest, redirectTo: `${window.location.origin}/reset-password` }
      });
      if (fnError || (fnData as any)?.error) {
        console.error('[SystemMonitoring] SMTP reset failed', fnError || (fnData as any)?.error);
        toast({
          title: "Échec de l'envoi (secours)",
          description: "Consultez les logs de la fonction 'send-password-reset-link'.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: 'Email (secours) envoyé ✅',
        description: `Lien envoyé via SMTP: ${emailToTest}`,
      });
    } catch (e) {
      console.error('[SystemMonitoring] SMTP reset threw', e);
      toast({
        title: "Erreur d'envoi (secours)",
        description: "Veuillez réessayer dans quelques instants.",
        variant: "destructive",
      });
    } finally {
      setSendingSMTPReset(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Chargement des métriques système...</span>
        </div>
      </div>
    );
  }

  // Check for authentication errors specifically
  const isAuthError = error && error.includes('Admin access required');
  const hasError = error || (health?.error);

  if (isAuthError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Server className="w-6 h-6" />
              Surveillance Système
            </h2>
          </div>
        </div>

        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Accès administrateur requis pour consulter les métriques système. 
            Veuillez vous connecter avec un compte administrateur.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const connectionStatus = getConnectionStatus(health?.active_connections || 0);
  const StatusIcon = connectionStatus.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Server className="w-6 h-6" />
            Surveillance Système
          </h2>
          {health?.last_updated && (
            <p className="text-muted-foreground">
              Dernière mise à jour: {formatDistanceToNow(new Date(health.last_updated), { 
                addSuffix: true, 
                locale: fr 
              })}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Actualiser
          </Button>
          <Badge variant={hasError ? 'destructive' : connectionStatus.status === 'good' ? 'default' : connectionStatus.status === 'warning' ? 'secondary' : 'destructive'}>
            <StatusIcon className="w-4 h-4 mr-1" />
            {hasError ? 'Erreur' : connectionStatus.status === 'good' ? 'Système Sain' : 
             connectionStatus.status === 'warning' ? 'Attention' : 'Critique'}
          </Badge>
        </div>
      </div>

      {hasError && !isAuthError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error || health?.error || 'Une erreur est survenue lors du chargement des métriques'}
          </AlertDescription>
        </Alert>
      )}

      {/* Email Testing Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Tests SMTP & Auth
          </CardTitle>
          <CardDescription>
            Testez la configuration email de Supabase Auth et Hostinger SMTP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test-email">Email de test (optionnel)</Label>
            <Input
              id="test-email"
              type="email"
              placeholder={user?.email || "admin@exemple.com"}
              value={customTestEmail}
              onChange={(e) => setCustomTestEmail(e.target.value)}
              className="max-w-md"
            />
            <p className="text-sm text-muted-foreground">
              Laissez vide pour utiliser votre email: {user?.email}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSendMagicLink}
              disabled={sendingMagicLink}
            >
              <Send className="w-4 h-4 mr-1" />
              {sendingMagicLink ? 'Envoi...' : 'Lien magique (Auth)'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleSendResetEmail}
              disabled={sendingResetEmail}
            >
              <Key className="w-4 h-4 mr-1" />
              {sendingResetEmail ? 'Envoi...' : 'Réinitialisation (Auth)'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSendSMTPResetEmail}
              disabled={sendingSMTPReset}
            >
              <Mail className="w-4 h-4 mr-1" />
              {sendingSMTPReset ? 'Envoi...' : 'Réinitialisation (SMTP secours)'}
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={handleSendTestEmail}
              disabled={sendingTest || !user?.email}
              title={!user?.email ? "Connectez-vous pour envoyer un email de test" : undefined}
            >
              <Mail className="w-4 h-4 mr-1" />
              {sendingTest ? 'Envoi...' : 'Test Edge Function'}
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
            <p><strong>Lien magique:</strong> Test Supabase Auth → connexion automatique</p>
            <p><strong>Réinitialisation:</strong> Test Supabase Auth → lien vers /reset-password</p>
            <p><strong>Edge Function:</strong> Test direct Hostinger SMTP</p>
            <p className="mt-1 text-amber-600">⚠️ Limite: 1 email/60s par type et par adresse</p>
          </div>
        </CardContent>
      </Card>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium truncate">Taille Base de Données</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold truncate">
              {health?.database_size ? formatBytes(health.database_size) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Espace utilisé total
            </p>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium truncate">Connexions Actives</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent>
            <div className={`text-xl sm:text-2xl font-bold ${connectionStatus.color}`}>
              {health?.active_connections ?? 'N/A'}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <StatusIcon className="w-3 h-3" />
              <span className="truncate">État: {connectionStatus.status}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0 sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium truncate">Performance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {hasError ? 'Dégradée' : 'Optimal'}
            </div>
            <Progress value={hasError ? 60 : 85} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {hasError ? '60%' : '85%'} de performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Database Tables Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <HardDrive className="w-5 h-5" />
            <span className="hidden sm:inline">Statistiques des Tables</span>
            <span className="sm:hidden">Tables DB</span>
          </CardTitle>
          <CardDescription className="hidden sm:block">
            Utilisation et performance des tables principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {health?.table_stats && Object.keys(health.table_stats).length > 0 ? (
              <div className="overflow-x-auto">
                <div className="space-y-3 min-w-[300px]">
                  {Object.entries(health.table_stats).map(([tableName, stats]) => (
                    <div key={tableName} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{tableName}</h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground">
                          <span>{stats.rows} opérations</span>
                          <span>{formatBytes(stats.size)}</span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <div className="text-sm font-medium">
                          {health.database_size ? 
                            ((stats.size / health.database_size) * 100).toFixed(1) : '0'}%
                        </div>
                        <div className="text-xs text-muted-foreground">de la DB</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <HardDrive className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm sm:text-base">Aucune statistique de table disponible</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Alertes Système
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {hasError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Erreur de surveillance système détectée. Certaines métriques peuvent être indisponibles.
                </AlertDescription>
              </Alert>
            )}

            {health?.active_connections && health.active_connections > 15 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Nombre élevé de connexions actives ({health.active_connections}). 
                  Surveillez les performances.
                </AlertDescription>
              </Alert>
            )}
            
            {health?.database_size && health.database_size > 1000000000 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  La base de données approche 1GB. Considérez l'archivage des anciennes données.
                </AlertDescription>
              </Alert>
            )}

            {!hasError && health?.active_connections && health.active_connections <= 15 && 
             (!health.database_size || health.database_size <= 1000000000) && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Tous les systèmes fonctionnent normalement.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMonitoring;
