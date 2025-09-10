import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Mail, Phone, Eye, UserPlus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import SubscriberCard from './SubscriberCard';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

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

interface SubscriberTableProps {
  subscribers: Subscriber[];
  loading: boolean;
  onDelete: (subscriberId: string) => void;
  onConvertToUser: (subscriberId: string) => void;
  pendingEmails?: Set<string>;
}

const SubscriberTable: React.FC<SubscriberTableProps> = ({
  subscribers,
  loading,
  onDelete,
  onConvertToUser,
  pendingEmails
}) => {
  const getFormationTypeBadge = (type?: string) => {
    switch (type) {
      case 'complete':
        return <Badge variant="default">Formation Complète</Badge>;
      case 'certificate':
        return <Badge variant="secondary">Certificat</Badge>;
      default:
        return <Badge variant="outline">Non spécifié</Badge>;
    }
  };

  const getDomainBadge = (domain?: string) => {
    switch (domain) {
      case 'ai':
        return <Badge className="bg-blue-100 text-blue-800">IA</Badge>;
      case 'programming':
        return <Badge className="bg-green-100 text-green-800">Programmation</Badge>;
      case 'marketing':
        return <Badge className="bg-purple-100 text-purple-800">Marketing</Badge>;
      default:
        return <Badge variant="outline">Non spécifié</Badge>;
    }
  };

  const handleEmailClick = (email: string) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const handlePhoneClick = (phone: string) => {
    window.open(`tel:${phone}`, '_blank');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Abonnés ({subscribers.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Domaine</TableHead>
                <TableHead>Programme</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Aucun abonné trouvé
                  </TableCell>
                </TableRow>
              ) : (
                subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium">
                      {subscriber.full_name}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => handleEmailClick(subscriber.email)}
                        className="h-auto p-0 text-primary"
                      >
                        {subscriber.email}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {subscriber.phone ? (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => handlePhoneClick(subscriber.phone!)}
                          className="h-auto p-0 text-primary"
                        >
                          {subscriber.phone}
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getFormationTypeBadge(subscriber.formation_type)}
                    </TableCell>
                    <TableCell>
                      {getDomainBadge(subscriber.formation_domaine)}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {subscriber.formation_programme_title || subscriber.formation_programme || '-'}
                    </TableCell>
                    <TableCell>
                      {new Date(subscriber.created_at).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <SubscriberCard subscriber={subscriber} />
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEmailClick(subscriber.email)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>

                        {subscriber.phone && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePhoneClick(subscriber.phone!)}
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        )}

                        {pendingEmails?.has(subscriber.email) ? (
                          <Button variant="ghost" size="sm" disabled title="Déjà en demande d'inscription">
                            <UserPlus className="h-4 w-4 opacity-50" />
                            <span className="sr-only">Déjà en demande</span>
                          </Button>
                        ) : (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700" title="Créer un compte utilisateur">
                                <UserPlus className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Créer un compte utilisateur</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Voulez-vous convertir {subscriber.full_name} ({subscriber.email}) en compte utilisateur en attente d'approbation ?
                                  <br /><br />
                                  Cette action va :
                                  <br />• Créer une demande d'inscription en attente
                                  <br />• Permettre l'approbation manuelle du compte
                                  <br />• Supprimer l'abonné de cette liste
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onConvertToUser(subscriber.id)}
                                  className="bg-green-600 text-white hover:bg-green-700"
                                >
                                  Créer Compte
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer l'abonné</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer {subscriber.full_name} ?
                                Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDelete(subscriber.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriberTable;