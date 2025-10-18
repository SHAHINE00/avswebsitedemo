import React, { useEffect } from 'react';
import { useAbsenceJustifications } from '@/hooks/useAbsenceJustifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, FileText, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export const AbsenceApprovalList: React.FC = () => {
  const { justifications, loading, fetchJustifications, reviewJustification } = useAbsenceJustifications();
  const [adminNotes, setAdminNotes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchJustifications();
  }, []);

  const handleApprove = async (id: string) => {
    await reviewJustification(id, 'approved', adminNotes[id]);
    setAdminNotes({ ...adminNotes, [id]: '' });
  };

  const handleReject = async (id: string) => {
    await reviewJustification(id, 'rejected', adminNotes[id]);
    setAdminNotes({ ...adminNotes, [id]: '' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">En attente</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'medical': return 'Médical';
      case 'family_emergency': return 'Urgence familiale';
      case 'official_event': return 'Événement officiel';
      case 'other': return 'Autre';
      default: return type;
    }
  };

  const pendingJustifications = justifications.filter(j => j.status === 'pending');
  const reviewedJustifications = justifications.filter(j => j.status !== 'pending');

  return (
    <div className="space-y-6">
      {pendingJustifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Justificatifs en attente</CardTitle>
            <CardDescription>{pendingJustifications.length} justificatif(s) à traiter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingJustifications.map((justification) => (
                <div key={justification.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{getTypeLabel(justification.justification_type)}</span>
                        {getStatusBadge(justification.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{justification.reason}</p>
                      {justification.document_url && (
                        <a
                          href={justification.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:underline flex items-center gap-1 mt-2"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Voir le document
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <Textarea
                      placeholder="Notes administratives (optionnel)"
                      value={adminNotes[justification.id] || ''}
                      onChange={(e) => setAdminNotes({ ...adminNotes, [justification.id]: e.target.value })}
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(justification.id)}
                        className="flex-1"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approuver
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(justification.id)}
                        className="flex-1"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Rejeter
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {reviewedJustifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique des justificatifs</CardTitle>
            <CardDescription>Justificatifs déjà traités</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reviewedJustifications.map((justification) => (
                <div key={justification.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{getTypeLabel(justification.justification_type)}</span>
                        {getStatusBadge(justification.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{justification.reason}</p>
                      {justification.admin_notes && (
                        <p className="text-sm text-muted-foreground mt-2 italic">
                          Note: {justification.admin_notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
