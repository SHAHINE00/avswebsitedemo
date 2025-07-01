import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  dateFilter,
  setDateFilter,
  sortBy,
  setSortBy
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Rechercher par email ou nom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={roleFilter} onValueChange={setRoleFilter}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les rôles</SelectItem>
          <SelectItem value="admin">Administrateurs</SelectItem>
          <SelectItem value="user">Utilisateurs</SelectItem>
        </SelectContent>
      </Select>

      <Select value={dateFilter} onValueChange={setDateFilter}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Période" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les dates</SelectItem>
          <SelectItem value="today">Aujourd'hui</SelectItem>
          <SelectItem value="week">Cette semaine</SelectItem>
          <SelectItem value="month">Ce mois</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created_at">Date d'inscription</SelectItem>
          <SelectItem value="email">Email</SelectItem>
          <SelectItem value="full_name">Nom</SelectItem>
          <SelectItem value="role">Rôle</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};