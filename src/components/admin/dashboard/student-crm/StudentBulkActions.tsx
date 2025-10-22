import { Button } from "@/components/ui/button";
import { Mail, BookOpen, Tag, Download, Archive, FileText, X, FileUp } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StudentBulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkEmail: () => void;
  onBulkEnroll: () => void;
  onBulkTag: () => void;
  onBulkExport: () => void;
  onBulkArchive: () => void;
  onGenerateReport: () => void;
  onBulkDocument?: () => void;
}

export const StudentBulkActions = ({
  selectedCount,
  onClearSelection,
  onBulkEmail,
  onBulkEnroll,
  onBulkTag,
  onBulkExport,
  onBulkArchive,
  onGenerateReport,
  onBulkDocument
}: StudentBulkActionsProps) => {
  if (selectedCount === 0) return null;

  return (
    <Card className="mb-4 p-4 bg-primary/5 border-primary/20">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {selectedCount} étudiant{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}
          </span>
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={onBulkEmail} className="gap-2">
            <Mail className="h-4 w-4" />
            Envoyer Email
          </Button>
          <Button variant="outline" size="sm" onClick={onBulkEnroll} className="gap-2">
            <BookOpen className="h-4 w-4" />
            Inscrire à un Cours
          </Button>
          <Button variant="outline" size="sm" onClick={onBulkTag} className="gap-2">
            <Tag className="h-4 w-4" />
            Ajouter Tag
          </Button>
          {onBulkDocument && (
            <Button variant="outline" size="sm" onClick={onBulkDocument} className="gap-2">
              <FileUp className="h-4 w-4" />
              Envoyer Document
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onBulkExport} className="gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button variant="outline" size="sm" onClick={onGenerateReport} className="gap-2">
            <FileText className="h-4 w-4" />
            Rapport
          </Button>
          <Button variant="outline" size="sm" onClick={onBulkArchive} className="gap-2 text-destructive">
            <Archive className="h-4 w-4" />
            Archiver
          </Button>
        </div>
      </div>
    </Card>
  );
};