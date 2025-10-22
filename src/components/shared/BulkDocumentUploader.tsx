import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Loader2 } from 'lucide-react';
import { useBulkDocumentUpload } from '@/hooks/useBulkDocumentUpload';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';

interface BulkDocumentUploaderProps {
  studentIds: string[];
  studentNames: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  role: 'professor' | 'admin';
}

const DOCUMENT_TYPES = {
  // Academic
  certificate: 'Certificat',
  assignment_correction: 'Correction de devoir',
  report: 'Rapport',
  transcript: 'Relevé de notes',
  recommendation: 'Recommandation',
  
  // Administrative (for both roles)
  invoice: 'Facture',
  receipt: 'Reçu',
  contract: 'Contrat',
  enrollment_letter: "Lettre d'inscription",
  id_card: "Pièce d'identité",
  
  // General
  other: 'Autre'
};

export const BulkDocumentUploader: React.FC<BulkDocumentUploaderProps> = ({
  studentIds,
  studentNames,
  open,
  onOpenChange,
  onSuccess,
  role
}) => {
  const { user } = useAuth();
  const { uploadDocumentToMultipleStudents, loading, progress } = useBulkDocumentUpload(user?.id);
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>('certificate');
  const [documentName, setDocumentName] = useState<string>('');
  const [note, setNote] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!documentName) {
        setDocumentName(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) return;

    const result = await uploadDocumentToMultipleStudents(
      studentIds,
      file,
      documentType,
      documentName,
      note,
      role
    );

    if (result.successCount > 0) {
      // Reset form
      setFile(null);
      setDocumentName('');
      setNote('');
      setDocumentType('certificate');
      onOpenChange(false);
      onSuccess?.();
    }
  };

  const handleCancel = () => {
    setFile(null);
    setDocumentName('');
    setNote('');
    setDocumentType('certificate');
    onOpenChange(false);
  };

  const progressPercentage = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Envoyer un document à {studentIds.length} étudiant(s)</DialogTitle>
          <DialogDescription>
            Le même document sera envoyé à tous les étudiants sélectionnés
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-muted/50 p-3 rounded-lg max-h-32 overflow-y-auto">
            <p className="text-sm font-medium mb-2">Étudiants sélectionnés:</p>
            <div className="flex flex-wrap gap-2">
              {studentNames.slice(0, 10).map((name, idx) => (
                <span key={idx} className="text-xs bg-background px-2 py-1 rounded">
                  {name}
                </span>
              ))}
              {studentNames.length > 10 && (
                <span className="text-xs text-muted-foreground px-2 py-1">
                  +{studentNames.length - 10} autre(s)
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Fichier *</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              required
              disabled={loading}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            {file && (
              <p className="text-sm text-muted-foreground">
                Fichier sélectionné: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentType">Type de document *</Label>
            <Select value={documentType} onValueChange={setDocumentType} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DOCUMENT_TYPES).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentName">Nom du document *</Label>
            <Input
              id="documentName"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Ex: Certificat de réussite"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">
              {role === 'professor' ? "Note pour les étudiants (optionnel)" : "Note administrative (optionnel)"}
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={role === 'professor' 
                ? "Ajoutez une note personnelle pour les étudiants..." 
                : "Ajoutez une note administrative..."}
              rows={3}
              disabled={loading}
            />
          </div>

          {loading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Envoi en cours...</span>
                <span>{progress.current} / {progress.total}</span>
              </div>
              <Progress value={progressPercentage} className="w-full" />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !file}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Envoyer à tous
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
