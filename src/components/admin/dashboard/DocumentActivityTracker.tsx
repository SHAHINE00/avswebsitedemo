import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileText, Download, Search, Filter, Calendar, User, FileUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface DocumentActivity {
  id: string;
  document_name: string;
  document_type: string;
  uploaded_by_name: string;
  uploaded_by_role: string;
  recipient_name: string;
  recipient_email: string;
  file_size: number;
  created_at: string;
  note: string;
}

export const DocumentActivityTracker: React.FC = () => {
  const [activities, setActivities] = useState<DocumentActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<DocumentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchDocumentActivities();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, roleFilter, typeFilter, activities]);

  const fetchDocumentActivities = async () => {
    try {
      setLoading(true);
      
      // Fetch all student documents with uploader and recipient info
      const { data, error } = await supabase
        .from('student_documents')
        .select(`
          id,
          document_name,
          document_type,
          uploaded_by,
          uploaded_by_role,
          user_id,
          file_size,
          created_at,
          professor_note,
          admin_notes,
          profiles!student_documents_user_id_fkey(full_name, email),
          uploader:profiles!student_documents_uploaded_by_fkey(full_name, email)
        `)
        .not('uploaded_by', 'is', null)
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) throw error;

      const formattedActivities: DocumentActivity[] = (data || []).map((doc: any) => ({
        id: doc.id,
        document_name: doc.document_name,
        document_type: doc.document_type,
        uploaded_by_name: doc.uploader?.full_name || doc.uploader?.email || 'Inconnu',
        uploaded_by_role: doc.uploaded_by_role || 'unknown',
        recipient_name: doc.profiles?.full_name || doc.profiles?.email || 'Inconnu',
        recipient_email: doc.profiles?.email || '',
        file_size: doc.file_size || 0,
        created_at: doc.created_at,
        note: doc.professor_note || doc.admin_notes || ''
      }));

      setActivities(formattedActivities);
      setFilteredActivities(formattedActivities);
    } catch (error: any) {
      console.error('Error fetching document activities:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les activités de documents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...activities];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        activity =>
          activity.document_name.toLowerCase().includes(query) ||
          activity.uploaded_by_name.toLowerCase().includes(query) ||
          activity.recipient_name.toLowerCase().includes(query) ||
          activity.recipient_email.toLowerCase().includes(query)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(activity => activity.uploaded_by_role === roleFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(activity => activity.document_type === typeFilter);
    }

    setFilteredActivities(filtered);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Document', 'Type', 'Envoyé par', 'Rôle', 'Destinataire', 'Email', 'Taille (KB)'];
    const rows = filteredActivities.map(activity => [
      format(new Date(activity.created_at), 'dd/MM/yyyy HH:mm', { locale: fr }),
      activity.document_name,
      activity.document_type,
      activity.uploaded_by_name,
      activity.uploaded_by_role,
      activity.recipient_name,
      activity.recipient_email,
      (activity.file_size / 1024).toFixed(2)
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `document_activities_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "Export réussi",
      description: `${filteredActivities.length} activités exportées`
    });
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      certificate: 'Certificat',
      assignment_correction: 'Correction',
      report: 'Rapport',
      transcript: 'Relevé',
      recommendation: 'Recommandation',
      invoice: 'Facture',
      receipt: 'Reçu',
      contract: 'Contrat',
      enrollment_letter: 'Lettre d\'inscription',
      id_card: 'Pièce d\'identité',
      other: 'Autre'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Suivi des Documents
              </CardTitle>
              <CardDescription>
                Historique complet de tous les documents envoyés aux étudiants
              </CardDescription>
            </div>
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">Tous les rôles</option>
              <option value="professor">Professeurs</option>
              <option value="admin">Administrateurs</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">Tous les types</option>
              <option value="certificate">Certificat</option>
              <option value="assignment_correction">Correction</option>
              <option value="report">Rapport</option>
              <option value="invoice">Facture</option>
              <option value="other">Autre</option>
            </select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{filteredActivities.length}</div>
                <div className="text-sm text-muted-foreground">Documents envoyés</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {filteredActivities.filter(a => a.uploaded_by_role === 'professor').length}
                </div>
                <div className="text-sm text-muted-foreground">Par professeurs</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {filteredActivities.filter(a => a.uploaded_by_role === 'admin').length}
                </div>
                <div className="text-sm text-muted-foreground">Par admins</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {(filteredActivities.reduce((sum, a) => sum + a.file_size, 0) / (1024 * 1024)).toFixed(2)} MB
                </div>
                <div className="text-sm text-muted-foreground">Volume total</div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Envoyé par</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Destinataire</TableHead>
                  <TableHead>Taille</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucune activité trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredActivities.slice(0, 100).map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="text-sm">
                        {format(new Date(activity.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                      </TableCell>
                      <TableCell className="font-medium">{activity.document_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getDocumentTypeLabel(activity.document_type)}
                        </Badge>
                      </TableCell>
                      <TableCell>{activity.uploaded_by_name}</TableCell>
                      <TableCell>
                        <Badge variant={activity.uploaded_by_role === 'admin' ? 'default' : 'secondary'}>
                          {activity.uploaded_by_role === 'admin' ? 'Admin' : 'Professeur'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{activity.recipient_name}</span>
                          <span className="text-xs text-muted-foreground">{activity.recipient_email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {(activity.file_size / 1024).toFixed(2)} KB
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredActivities.length > 100 && (
            <p className="text-sm text-muted-foreground text-center">
              Affichage de 100 activités sur {filteredActivities.length}. Utilisez les filtres pour affiner.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
