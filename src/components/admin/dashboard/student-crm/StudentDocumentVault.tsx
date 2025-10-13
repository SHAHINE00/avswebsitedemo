import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, Download, Trash2, CheckCircle } from 'lucide-react';
import { useStudentDocuments } from '@/hooks/useStudentDocuments';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface StudentDocumentVaultProps {
  userId: string;
}

const StudentDocumentVault: React.FC<StudentDocumentVaultProps> = ({ userId }) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('other');
  const [documentName, setDocumentName] = useState('');

  const { getDocuments, uploadDocument, deleteDocument, verifyDocument, uploading } = useStudentDocuments();

  useEffect(() => {
    fetchDocuments();
  }, [userId]);

  const fetchDocuments = async () => {
    const docs = await getDocuments(userId);
    setDocuments(docs);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setDocumentName(e.target.files[0].name);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const success = await uploadDocument(userId, selectedFile, documentType, documentName);
    if (success) {
      setShowUploadDialog(false);
      setSelectedFile(null);
      setDocumentName('');
      setDocumentType('other');
      fetchDocuments();
    }
  };

  const handleDelete = async (documentId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      const success = await deleteDocument(documentId);
      if (success) {
        fetchDocuments();
      }
    }
  };

  const handleVerify = async (documentId: string) => {
    const success = await verifyDocument(documentId);
    if (success) {
      fetchDocuments();
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      invoice: 'Facture',
      receipt: 'Reçu',
      certificate: 'Certificat',
      contract: 'Contrat',
      id_card: 'Pièce d\'identité',
      transcript: 'Relevé de notes',
      enrollment_letter: 'Lettre d\'inscription',
      other: 'Autre'
    };
    return labels[type] || type;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Documents de l'Étudiant</CardTitle>
              <CardDescription>Gérez tous les documents</CardDescription>
            </div>
            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Télécharger un Document</DialogTitle>
                  <DialogDescription>Ajoutez un nouveau document pour l'étudiant</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Type de Document</Label>
                    <Select value={documentType} onValueChange={setDocumentType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="invoice">Facture</SelectItem>
                        <SelectItem value="receipt">Reçu</SelectItem>
                        <SelectItem value="certificate">Certificat</SelectItem>
                        <SelectItem value="contract">Contrat</SelectItem>
                        <SelectItem value="id_card">Pièce d'identité</SelectItem>
                        <SelectItem value="transcript">Relevé de notes</SelectItem>
                        <SelectItem value="enrollment_letter">Lettre d'inscription</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Nom du Document</Label>
                    <Input
                      value={documentName}
                      onChange={(e) => setDocumentName(e.target.value)}
                      placeholder="Nom du document..."
                    />
                  </div>
                  <div>
                    <Label>Fichier</Label>
                    <Input type="file" onChange={handleFileSelect} />
                  </div>
                  <Button onClick={handleUpload} disabled={!selectedFile || uploading} className="w-full">
                    {uploading ? 'Téléchargement...' : 'Télécharger'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {documents.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Aucun document</p>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">{doc.document_name}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">{getDocumentTypeLabel(doc.document_type)}</Badge>
                        <span className="text-sm text-muted-foreground">{formatFileSize(doc.file_size)}</span>
                        {doc.is_verified && (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Vérifié
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!doc.is_verified && (
                      <Button variant="outline" size="sm" onClick={() => handleVerify(doc.id)}>
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => window.open(doc.file_url, '_blank')}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(doc.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDocumentVault;
