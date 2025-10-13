import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter, Save } from "lucide-react";

interface SegmentFilter {
  field: string;
  operator: string;
  value: string;
}

export const SegmentBuilder = () => {
  const [filters, setFilters] = useState<SegmentFilter[]>([
    { field: 'enrollment_status', operator: 'equals', value: '' }
  ]);
  const [segmentName, setSegmentName] = useState("");

  const addFilter = () => {
    setFilters([...filters, { field: '', operator: 'equals', value: '' }]);
  };

  const updateFilter = (index: number, updates: Partial<SegmentFilter>) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], ...updates };
    setFilters(newFilters);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleSaveSegment = () => {
    console.log('Saving segment:', { name: segmentName, filters });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Créateur de Segments
        </CardTitle>
        <CardDescription>
          Créez des segments personnalisés pour filtrer les étudiants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Nom du Segment</Label>
          <Input
            value={segmentName}
            onChange={(e) => setSegmentName(e.target.value)}
            placeholder="Ex: Étudiants Actifs"
          />
        </div>

        <div className="space-y-3">
          <Label>Filtres</Label>
          {filters.map((filter, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1">
                <Select
                  value={filter.field}
                  onValueChange={(value) => updateFilter(index, { field: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Champ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enrollment_status">Statut d'inscription</SelectItem>
                    <SelectItem value="payment_status">Statut de paiement</SelectItem>
                    <SelectItem value="course_enrolled">Formation inscrite</SelectItem>
                    <SelectItem value="registration_date">Date d'inscription</SelectItem>
                    <SelectItem value="last_login">Dernière connexion</SelectItem>
                    <SelectItem value="engagement_level">Niveau d'engagement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-32">
                <Select
                  value={filter.operator}
                  onValueChange={(value) => updateFilter(index, { operator: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Opérateur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Est égal à</SelectItem>
                    <SelectItem value="not_equals">N'est pas égal à</SelectItem>
                    <SelectItem value="contains">Contient</SelectItem>
                    <SelectItem value="greater_than">Supérieur à</SelectItem>
                    <SelectItem value="less_than">Inférieur à</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Input
                  value={filter.value}
                  onChange={(e) => updateFilter(index, { value: e.target.value })}
                  placeholder="Valeur"
                />
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => removeFilter(index)}
                disabled={filters.length === 1}
              >
                ×
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={addFilter}>
            + Ajouter Filtre
          </Button>
          <Button onClick={handleSaveSegment}>
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder Segment
          </Button>
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-1">Aperçu</p>
          <p className="text-xs text-muted-foreground">
            Ce segment inclura les étudiants qui correspondent à tous les filtres ci-dessus
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
