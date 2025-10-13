import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudentExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalStudents: number;
  filteredStudents: number;
  selectedStudents: number;
  onExport: (options: ExportOptions) => void;
}

interface ExportOptions {
  format: 'csv' | 'excel';
  scope: 'all' | 'filtered' | 'selected';
  columns: string[];
}

const AVAILABLE_COLUMNS = [
  { id: 'full_name', label: 'Nom Complet' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Téléphone' },
  { id: 'formation_type', label: 'Type de Formation' },
  { id: 'student_status', label: 'Statut' },
  { id: 'created_at', label: 'Date d\'Inscription' },
  { id: 'address', label: 'Adresse' },
  { id: 'city', label: 'Ville' },
  { id: 'postal_code', label: 'Code Postal' },
  { id: 'country', label: 'Pays' },
  { id: 'total_paid', label: 'Total Payé' },
  { id: 'enrollment_count', label: 'Nombre d\'Inscriptions' },
];

export const StudentExportDialog = ({
  open,
  onOpenChange,
  totalStudents,
  filteredStudents,
  selectedStudents,
  onExport
}: StudentExportDialogProps) => {
  const [format, setFormat] = useState<'csv' | 'excel'>('csv');
  const [scope, setScope] = useState<'all' | 'filtered' | 'selected'>('filtered');
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    AVAILABLE_COLUMNS.slice(0, 6).map(c => c.id)
  );
  const { toast } = useToast();

  const toggleColumn = (columnId: string) => {
    setSelectedColumns(prev =>
      prev.includes(columnId)
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleExport = () => {
    if (selectedColumns.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins une colonne",
        variant: "destructive"
      });
      return;
    }

    onExport({ format, scope, columns: selectedColumns });
    onOpenChange(false);
  };

  const getStudentCount = () => {
    switch (scope) {
      case 'all': return totalStudents;
      case 'filtered': return filteredStudents;
      case 'selected': return selectedStudents;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Exporter les Étudiants</DialogTitle>
          <DialogDescription>
            Configurez les options d'export pour les données étudiants
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <Label>Format d'Export</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Button
                type="button"
                variant={format === 'csv' ? 'default' : 'outline'}
                onClick={() => setFormat('csv')}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                CSV
              </Button>
              <Button
                type="button"
                variant={format === 'excel' ? 'default' : 'outline'}
                onClick={() => setFormat('excel')}
                className="gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Excel
              </Button>
            </div>
          </div>

          {/* Scope Selection */}
          <div>
            <Label htmlFor="scope">Étudiants à Exporter</Label>
            <Select value={scope} onValueChange={(v: any) => setScope(v)}>
              <SelectTrigger id="scope">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les étudiants ({totalStudents})</SelectItem>
                <SelectItem value="filtered">Résultats filtrés ({filteredStudents})</SelectItem>
                <SelectItem value="selected" disabled={selectedStudents === 0}>
                  Sélection ({selectedStudents})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Column Selection */}
          <div>
            <Label>Colonnes à Inclure</Label>
            <div className="grid grid-cols-2 gap-3 mt-2 max-h-60 overflow-y-auto p-2 border rounded-lg">
              {AVAILABLE_COLUMNS.map((column) => (
                <div key={column.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={column.id}
                    checked={selectedColumns.includes(column.id)}
                    onCheckedChange={() => toggleColumn(column.id)}
                  />
                  <Label htmlFor={column.id} className="text-sm font-normal cursor-pointer">
                    {column.label}
                  </Label>
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {selectedColumns.length} colonne{selectedColumns.length > 1 ? 's' : ''} sélectionnée{selectedColumns.length > 1 ? 's' : ''}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {getStudentCount()} étudiant{getStudentCount() > 1 ? 's' : ''} sera exporté{getStudentCount() > 1 ? 's' : ''}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button onClick={handleExport} className="gap-2">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};