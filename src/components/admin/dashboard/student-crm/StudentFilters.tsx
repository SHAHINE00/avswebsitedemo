import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface StudentFilterValues {
  formationType?: string;
  enrollmentStatus?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  revenueMin?: number;
  revenueMax?: number;
  status?: string;
}

interface StudentFiltersProps {
  filters: StudentFilterValues;
  onFilterChange: (filters: StudentFilterValues) => void;
  onClearFilters: () => void;
}

export const StudentFilters = ({ filters, onFilterChange, onClearFilters }: StudentFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof StudentFilterValues, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="mb-6">
        <div className="p-4 flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtres {hasActiveFilters && `(${Object.values(filters).filter(v => v).length})`}
            </Button>
          </CollapsibleTrigger>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="gap-2">
              <X className="h-4 w-4" />
              Réinitialiser
            </Button>
          )}
        </div>

        <CollapsibleContent>
          <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Formation Type */}
            <div>
              <Label htmlFor="formationType">Type de Formation</Label>
              <Select value={filters.formationType || ''} onValueChange={(v) => handleFilterChange('formationType', v)}>
                <SelectTrigger id="formationType">
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous</SelectItem>
                  <SelectItem value="IA">Intelligence Artificielle</SelectItem>
                  <SelectItem value="Programmation">Programmation</SelectItem>
                  <SelectItem value="Data">Data Science</SelectItem>
                  <SelectItem value="Web">Développement Web</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Student Status */}
            <div>
              <Label htmlFor="status">Statut Étudiant</Label>
              <Select value={filters.status || ''} onValueChange={(v) => handleFilterChange('status', v)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="on_hold">En Pause</SelectItem>
                  <SelectItem value="suspended">Suspendu</SelectItem>
                  <SelectItem value="graduated">Diplômé</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Enrollment Status */}
            <div>
              <Label htmlFor="enrollmentStatus">Statut Inscription</Label>
              <Select value={filters.enrollmentStatus || ''} onValueChange={(v) => handleFilterChange('enrollmentStatus', v)}>
                <SelectTrigger id="enrollmentStatus">
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="completed">Complété</SelectItem>
                  <SelectItem value="dropped">Abandonné</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Status */}
            <div>
              <Label htmlFor="paymentStatus">Statut Paiement</Label>
              <Select value={filters.paymentStatus || ''} onValueChange={(v) => handleFilterChange('paymentStatus', v)}>
                <SelectTrigger id="paymentStatus">
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous</SelectItem>
                  <SelectItem value="completed">Payé</SelectItem>
                  <SelectItem value="pending">En Attente</SelectItem>
                  <SelectItem value="failed">Échoué</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div>
              <Label htmlFor="dateFrom">Date de début</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>

            {/* Date To */}
            <div>
              <Label htmlFor="dateTo">Date de fin</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>

            {/* Revenue Min */}
            <div>
              <Label htmlFor="revenueMin">Revenus Min (MAD)</Label>
              <Input
                id="revenueMin"
                type="number"
                placeholder="0"
                value={filters.revenueMin || ''}
                onChange={(e) => handleFilterChange('revenueMin', parseFloat(e.target.value) || undefined)}
              />
            </div>

            {/* Revenue Max */}
            <div>
              <Label htmlFor="revenueMax">Revenus Max (MAD)</Label>
              <Input
                id="revenueMax"
                type="number"
                placeholder="100000"
                value={filters.revenueMax || ''}
                onChange={(e) => handleFilterChange('revenueMax', parseFloat(e.target.value) || undefined)}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};