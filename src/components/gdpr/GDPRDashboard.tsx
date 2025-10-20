import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGDPRConsent } from '@/hooks/useGDPRConsent';
import DataExportDialog from './DataExportDialog';
import DataDeletionDialog from './DataDeletionDialog';
import { 
  Shield, 
  Download, 
  Trash2, 
  Settings, 
  Eye, 
  Cookie,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

const GDPRDashboard: React.FC = () => {
  const { consent, revokeConsent } = useGDPRConsent();

  const userRights = [
    {
      title: 'Droit d\'Accès',
      description: 'Consultez quelles données nous détenons sur vous',
      icon: Eye,
      status: 'available',
      action: 'Voir mes données',
    },
    {
      title: 'Droit à la Portabilité',
      description: 'Téléchargez vos données dans un format standard',
      icon: Download,
      status: 'available',
      action: 'Exporter',
    },
    {
      title: 'Droit à l\'Effacement',
      description: 'Demandez la suppression de vos données personnelles',
      icon: Trash2,
      status: 'request',
      action: 'Supprimer',
    },
    {
      title: 'Droit de Rectification',
      description: 'Modifiez vos informations personnelles',
      icon: Settings,
      status: 'available',
      action: 'Modifier',
    },
  ];

  const consentStatus = [
    { name: 'Cookies Nécessaires', key: 'necessary', required: true },
    { name: 'Cookies Analytiques', key: 'analytics', required: false },
    { name: 'Cookies Marketing', key: 'marketing', required: false },
    { name: 'Cookies Fonctionnels', key: 'functional', required: false },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'request':
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="secondary" className="text-green-700 bg-green-100">Disponible</Badge>;
      case 'request':
        return <Badge variant="secondary" className="text-orange-700 bg-orange-100">Sur demande</Badge>;
      default:
        return <Badge variant="outline">Non disponible</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          Confidentialité et Données
        </h2>
        <p className="text-muted-foreground">
          Gérez vos données personnelles et vos préférences de confidentialité selon le RGPD.
        </p>
      </div>

      {/* Consent Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5" />
            Gestion des Cookies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {consentStatus.map(({ name, key, required }) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                <span className="font-medium">{name}</span>
                <div className="flex items-center gap-2">
                  {required && <Badge variant="secondary" className="text-xs">Requis</Badge>}
                  {consent[key as keyof typeof consent] ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <Button onClick={revokeConsent} variant="outline" className="w-full">
            Modifier les Préférences de Cookies
          </Button>
        </CardContent>
      </Card>

      {/* Data Rights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Vos Droits RGPD
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {userRights.map(({ title, description, icon: Icon, status, action }) => (
              <div key={title} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{title}</span>
                      {getStatusIcon(status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(status)}
                  {title === 'Droit à la Portabilité' ? (
                    <DataExportDialog>
                      <Button variant="outline" size="sm">
                        {action}
                      </Button>
                    </DataExportDialog>
                  ) : title === 'Droit à l\'Effacement' ? (
                    <DataDeletionDialog>
                      <Button variant="outline" size="sm">
                        {action}
                      </Button>
                    </DataDeletionDialog>
                  ) : (
                    <Button variant="outline" size="sm" disabled={status !== 'available'}>
                      {action}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informations Légales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2">
            <Button variant="ghost" className="justify-start h-auto p-3" asChild>
              <Link to="/privacy-policy" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Politique de Confidentialité</span>
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start h-auto p-3" asChild>
              <Link to="/terms-of-use" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Conditions d'Utilisation</span>
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start h-auto p-3" asChild>
              <Link to="/cookies-policy" className="flex items-center gap-2">
                <Cookie className="h-4 w-4" />
                <span>Politique des Cookies</span>
              </Link>
            </Button>
          </div>
          
          <div className="pt-4 border-t text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>Responsable de traitement :</strong> AVS Institut
            </p>
            <p>
              Pour toute question concernant vos données personnelles, contactez-nous à{' '}
              <a href="mailto:privacy@avsinstitut.com" className="text-primary hover:underline">
                privacy@avsinstitut.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GDPRDashboard;