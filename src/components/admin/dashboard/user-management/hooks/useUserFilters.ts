import { useState, useEffect } from 'react';

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useUserFilters = (users: UserProfile[]) => {
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [dateFilter, setDateFilter] = useState('all');

  const filterAndSortUsers = () => {
    let filtered = users.filter(user => {
      const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      let matchesDate = true;
      if (dateFilter !== 'all' && user.created_at) {
        const userDate = new Date(user.created_at);
        const now = new Date();
        switch (dateFilter) {
          case 'today':
            matchesDate = userDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = userDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = userDate >= monthAgo;
            break;
        }
      }

      return matchesSearch && matchesRole && matchesDate;
    });

    // Sort users
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'email':
          return (a.email || '').localeCompare(b.email || '');
        case 'full_name':
          return (a.full_name || '').localeCompare(b.full_name || '');
        case 'role':
          return (a.role || '').localeCompare(b.role || '');
        case 'created_at':
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });

    setFilteredUsers(filtered);
  };

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, roleFilter, sortBy, dateFilter]);

  return {
    filteredUsers,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    sortBy,
    setSortBy,
    dateFilter,
    setDateFilter
  };
};