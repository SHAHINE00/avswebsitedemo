import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Loader2 } from 'lucide-react';
import { useStudentDocuments } from '@/hooks/useStudentDocuments';
import { useAuth } from '@/contexts/AuthContext';

interface StudentDocumentUploaderProps {
  studentId: string;
  studentName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const StudentDocumentUploader: React.FC<StudentDocumentUploaderProps> = ({
  studentId,
  studentName,
  open,
  onOpenChange,
  onSuccess
}) => {
  const { user } = useAuth();
  const { uploadDocumentAsTeacher, uploading } = useStudentDocuments(user?.id);
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>('certificate');
  const [documentName, setDocumentName] = useState<string>('');
  const [professorNote, setProfessorNote] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!documentName) {
        setDocumentName(selectedFile.name);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) return;

    const result = await uploadDocumentAsTeacher(
      studentId,
      file,
      documentType,
      documentName,
      professorNote
    );

    if (result) {
      // Reset form
      setFile(null);
      setDocumentName('');
      setProfessorNote('');
      setDocumentType('certificate');
      onOpenChange(false);
      onSuccess?.();
    }
  };

  const handleCancel = () => {
    setFile(null);
    setDocumentName('');
    setProfessorNote('');
    setDocumentType('certificate');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Envoyer un document à {studentName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Fichier *</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              required
              disabled={uploading}
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
            <Select value={documentType} onValueChange={setDocumentType} disabled={uploading}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="certificate">Certificat</SelectItem>
                <SelectItem value="assignment_correction">Correction de devoir</SelectItem>
                <SelectItem value="report">Rapport</SelectItem>
                <SelectItem value="recommendation">Recommandation</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
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
              disabled={uploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="professorNote">Note à l'étudiant (optionnel)</Label>
            <Textarea
              id="professorNote"
              value={professorNote}
              onChange={(e) => setProfessorNote(e.target.value)}
              placeholder="Ajoutez une note personnelle pour l'étudiant..."
              rows={3}
              disabled={uploading}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={uploading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={uploading || !file}>
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Envoyer à l'étudiant
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
