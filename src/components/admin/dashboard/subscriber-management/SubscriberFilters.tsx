import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';

interface SubscriberFilters {
  search: string;
  formation_type?: string;
  formation_domaine?: string;
  date_from?: string;
  date_to?: string;
}

interface SubscriberFiltersProps {
  filters: SubscriberFilters;
  onFiltersChange: (filters: SubscriberFilters) => void;
}

const SubscriberFilters: React.FC<SubscriberFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleFormationTypeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      formation_type: value === 'all' ? undefined : value
    });
  };

  const handleDomainChange = (value: string) => {
    onFiltersChange({
      ...filters,
      formation_domaine: value === 'all' ? undefined : value
    });
  };

  const handleDateFromChange = (value: string) => {
    onFiltersChange({ ...filters, date_from: value || undefined });
  };

  const handleDateToChange = (value: string) => {
    onFiltersChange({ ...filters, date_to: value || undefined });
  };

  const clearFilters = () => {
    onFiltersChange({ search: '' });
  };

  const hasActiveFilters = filters.search || filters.formation_type || 
    filters.formation_domaine || filters.date_from || filters.date_to;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtres
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Rechercher</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Nom, email, téléphone..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Formation Type */}
          <div className="space-y-2">
            <Label htmlFor="formation-type">Type de Formation</Label>
            <Select
              value={filters.formation_type || 'all'}
              onValueChange={handleFormationTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="complete">Formation Complète</SelectItem>
                <SelectItem value="certificate">Certificat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Domain */}
          <div className="space-y-2">
            <Label htmlFor="domain">Domaine</Label>
            <Select
              value={filters.formation_domaine || 'all'}
              onValueChange={handleDomainChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="ai">Intelligence Artificielle</SelectItem>
                <SelectItem value="programming">Programmation</SelectItem>
                <SelectItem value="marketing">Marketing Digital</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date From */}
          <div className="space-y-2">
            <Label htmlFor="date-from">Date de début</Label>
            <Input
              id="date-from"
              type="date"
              value={filters.date_from || ''}
              onChange={(e) => handleDateFromChange(e.target.value)}
            />
          </div>

          {/* Date To */}
          <div className="space-y-2">
            <Label htmlFor="date-to">Date de fin</Label>
            <Input
              id="date-to"
              type="date"
              value={filters.date_to || ''}
              onChange={(e) => handleDateToChange(e.target.value)}
            />
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Effacer les filtres
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriberFilters;