import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, Calendar, Tag, BookOpen, Award } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  formation_type?: string;
  formation_domaine?: string;
  formation_programme?: string;
  formation_programme_title?: string;
  formation_tag?: string;
  created_at: string;
  updated_at: string;
}

interface SubscriberCardProps {
  subscriber: Subscriber;
}

const SubscriberCard: React.FC<SubscriberCardProps> = ({ subscriber }) => {
  const getFormationTypeDisplay = (type?: string) => {
    switch (type) {
      case 'complete':
        return { text: 'Formation Complète', variant: 'default' as const };
      case 'certificate':
        return { text: 'Certificat', variant: 'secondary' as const };
      default:
        return { text: 'Non spécifié', variant: 'outline' as const };
    }
  };

  const getDomainDisplay = (domain?: string) => {
    switch (domain) {
      case 'ai':
        return { text: 'Intelligence Artificielle', color: 'bg-blue-100 text-blue-800' };
      case 'programming':
        return { text: 'Programmation', color: 'bg-green-100 text-green-800' };
      case 'marketing':
        return { text: 'Marketing Digital', color: 'bg-purple-100 text-purple-800' };
      default:
        return { text: 'Non spécifié', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const handleEmailClick = () => {
    window.open(`mailto:${subscriber.email}`, '_blank');
  };

  const handlePhoneClick = () => {
    if (subscriber.phone) {
      window.open(`tel:${subscriber.phone}`, '_blank');
    }
  };

  const formationType = getFormationTypeDisplay(subscriber.formation_type);
  const domain = getDomainDisplay(subscriber.formation_domaine);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{subscriber.full_name}</h2>
            <p className="text-sm text-muted-foreground">ID: {subscriber.id.slice(0, 8)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleEmailClick}>
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          {subscriber.phone && (
            <Button variant="outline" size="sm" onClick={handlePhoneClick}>
              <Phone className="h-4 w-4 mr-2" />
              Appeler
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Informations de Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{subscriber.email}</span>
          </div>
          {subscriber.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{subscriber.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Inscrit le {new Date(subscriber.created_at).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Formation Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Préférences de Formation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Type de Formation</p>
              <Badge variant={formationType.variant}>{formationType.text}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Domaine</p>
              <Badge className={domain.color}>{domain.text}</Badge>
            </div>
          </div>

          {subscriber.formation_programme && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Programme Sélectionné</p>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{subscriber.formation_programme}</span>
              </div>
              {subscriber.formation_programme_title && (
                <p className="text-sm text-muted-foreground mt-1">
                  {subscriber.formation_programme_title}
                </p>
              )}
            </div>
          )}

          {subscriber.formation_tag && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Tag</p>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline">{subscriber.formation_tag}</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-muted-foreground">
              Inscription:{' '}
              {new Date(subscriber.created_at).toLocaleString('fr-FR')}
            </span>
          </div>
          {subscriber.updated_at !== subscriber.created_at && (
            <div className="flex items-center gap-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span className="text-muted-foreground">
                Dernière modification:{' '}
                {new Date(subscriber.updated_at).toLocaleString('fr-FR')}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriberCard;