import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Clock, CheckCircle, XCircle, Mail, Phone, Calendar, User, GraduationCap } from 'lucide-react';
import { usePendingUsers, type PendingUser } from '@/hooks/usePendingUsers';

const PendingUsersManagement: React.FC = () => {
  const { pendingUsers, loading, approving, approvePendingUser, rejectPendingUser } = usePendingUsers();
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);

  const pendingCount = pendingUsers.filter(user => user.status === 'pending').length;
  const approvedCount = pendingUsers.filter(user => user.status === 'approved').length;
  const rejectedCount = pendingUsers.filter(user => user.status === 'rejected').length;

  const handleApprove = async (userId: string) => {
    await approvePendingUser(userId);
  };

  const handleReject = async (userId: string) => {
    await rejectPendingUser(userId, rejectionReason);
    setRejectionReason('');
    setSelectedUser(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-orange-600 border-orange-200"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-200"><XCircle className="w-3 h-3 mr-1" />Rejeté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Demandes d'inscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approuvés</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejetés</p>
                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Demandes d'inscription ({pendingUsers.length})
          </CardTitle>
          <CardDescription>
            Gérez les demandes d'inscription en attente d'approbation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune demande d'inscription trouvée
            </div>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map((user) => (
                <Card key={user.id} className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{user.full_name}</h3>
                          {getStatusBadge(user.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {user.phone}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(user.submitted_at).toLocaleDateString('fr-FR')}
                          </div>
                          {user.formation_tag && (
                            <div className="flex items-center gap-1">
                              <GraduationCap className="w-4 h-4" />
                              {user.formation_tag}
                            </div>
                          )}
                        </div>

                        {user.rejection_reason && (
                          <div className="bg-red-50 p-2 rounded text-sm text-red-700">
                            <strong>Raison du rejet :</strong> {user.rejection_reason}
                          </div>
                        )}
                      </div>

                      {user.status === 'pending' && (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button 
                            onClick={() => handleApprove(user.id)}
                            disabled={approving === user.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {approving === user.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            ) : (
                              <CheckCircle className="w-4 h-4 mr-2" />
                            )}
                            Approuver
                          </Button>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                className="border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => setSelectedUser(user)}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Rejeter
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Rejeter la demande d'inscription</DialogTitle>
                                <DialogDescription>
                                  Vous êtes sur le point de rejeter la demande de {user.full_name}. 
                                  Cette action enverra un email de notification à l'utilisateur.
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">Raison du rejet (optionnel)</label>
                                  <Textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Expliquez pourquoi cette demande est rejetée..."
                                    className="mt-1"
                                  />
                                </div>
                              </div>

                              <DialogFooter>
                                <Button 
                                  variant="outline" 
                                  onClick={() => {
                                    setRejectionReason('');
                                    setSelectedUser(null);
                                  }}
                                >
                                  Annuler
                                </Button>
                                <Button 
                                  variant="destructive"
                                  onClick={() => handleReject(user.id)}
                                  disabled={approving === user.id}
                                >
                                  {approving === user.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  ) : null}
                                  Confirmer le rejet
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingUsersManagement;