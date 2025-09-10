import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logError } from '@/utils/logger';

interface Subscriber {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  formation_type?: string;
  formation_domaine?: string;
  formation_programme?: string;
  formation_programme_title?: string;
  formation_tag?: string;
  created_at: string;
  updated_at: string;
}

interface SubscriberFilters {
  search: string;
  formation_type?: string;
  formation_domaine?: string;
  date_from?: string;
  date_to?: string;
}

interface SubscriberAnalytics {
  total_subscribers: number;
  recent_subscribers: number;
  popular_programs: Array<{program: string, count: number}>;
  formation_type_split: {complete: number, certificate: number};
  domain_distribution: {ai: number, programming: number, marketing: number};
  monthly_growth: Array<{month: string, count: number}>;
}

export const useSubscriberManagement = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [analytics, setAnalytics] = useState<SubscriberAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SubscriberFilters>({ search: '' });

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
      }
      
      if (filters.formation_type) {
        query = query.eq('formation_type', filters.formation_type);
      }
      
      if (filters.formation_domaine) {
        query = query.eq('formation_domaine', filters.formation_domaine);
      }
      
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }
      
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      setSubscribers(data || []);
    } catch (err) {
      logError('Error fetching subscribers:', err);
      setError('Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const { data: allSubscribers, error } = await supabase
        .from('subscribers')
        .select('*');

      if (error) throw error;

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const recentSubscribers = allSubscribers?.filter(sub => 
        new Date(sub.created_at) >= thirtyDaysAgo
      ) || [];

      // Calculate popular programs
      const programCounts: Record<string, number> = {};
      allSubscribers?.forEach(sub => {
        if (sub.formation_programme) {
          programCounts[sub.formation_programme] = (programCounts[sub.formation_programme] || 0) + 1;
        }
      });

      const popularPrograms = Object.entries(programCounts)
        .map(([program, count]) => ({ program, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Calculate formation type split
      const complete = allSubscribers?.filter(sub => sub.formation_type === 'complete').length || 0;
      const certificate = allSubscribers?.filter(sub => sub.formation_type === 'certificate').length || 0;

      // Calculate domain distribution
      const ai = allSubscribers?.filter(sub => sub.formation_domaine === 'ai').length || 0;
      const programming = allSubscribers?.filter(sub => sub.formation_domaine === 'programming').length || 0;
      const marketing = allSubscribers?.filter(sub => sub.formation_domaine === 'marketing').length || 0;

      // Calculate monthly growth (last 6 months)
      const monthlyGrowth = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        
        const count = allSubscribers?.filter(sub => {
          const subDate = new Date(sub.created_at);
          return subDate >= monthDate && subDate < nextMonthDate;
        }).length || 0;

        monthlyGrowth.push({
          month: monthDate.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
          count
        });
      }

      setAnalytics({
        total_subscribers: allSubscribers?.length || 0,
        recent_subscribers: recentSubscribers.length,
        popular_programs: popularPrograms,
        formation_type_split: { complete, certificate },
        domain_distribution: { ai, programming, marketing },
        monthly_growth: monthlyGrowth
      });
    } catch (err) {
      logError('Error fetching subscriber analytics:', err);
    }
  };

  const deleteSubscriber = async (subscriberId: string) => {
    try {
      const { error } = await supabase
        .from('subscribers')
        .delete()
        .eq('id', subscriberId);

      if (error) throw error;

      setSubscribers(prev => prev.filter(sub => sub.id !== subscriberId));
      await fetchAnalytics(); // Refresh analytics
    } catch (err) {
      logError('Error deleting subscriber:', err);
      throw new Error('Failed to delete subscriber');
    }
  };

  const exportSubscribers = async (format: 'csv' | 'json' = 'csv') => {
    try {
      const dataToExport = subscribers.map(sub => ({
        'Nom Complet': sub.full_name,
        'Email': sub.email,
        'Téléphone': sub.phone || '',
        'Type de Formation': sub.formation_type || '',
        'Domaine': sub.formation_domaine || '',
        'Programme': sub.formation_programme || '',
        'Titre du Programme': sub.formation_programme_title || '',
        'Tag': sub.formation_tag || '',
        'Date d\'inscription': new Date(sub.created_at).toLocaleDateString('fr-FR')
      }));

      if (format === 'csv') {
        const headers = Object.keys(dataToExport[0] || {});
        const csvContent = [
          headers.join(','),
          ...dataToExport.map(row => 
            headers.map(header => `"${(row as any)[header] || ''}"`).join(',')
          )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
      } else {
        const jsonContent = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `subscribers_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
      }
    } catch (err) {
      logError('Error exporting subscribers:', err);
      throw new Error('Failed to export subscribers');
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, [filters]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const convertToPendingUser = async (subscriberId: string) => {
    try {
      // Use direct fetch to get proper error responses
      const session = await supabase.auth.getSession();
      const response = await fetch(`https://nkkalmyhxtuisjdjmdew.supabase.co/functions/v1/convert-subscriber-to-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session?.access_token}`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ra2FsbXloeHR1aXNqZGptZGV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzODgwMTAsImV4cCI6MjA2Njk2NDAxMH0.JRISrJH9AqdbIh_G4wFNHbqK7v-LQJJPsBEnVWOKIWo'
        },
        body: JSON.stringify({ subscriberId })
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Edge function returned error:', responseData);
        
        let errorCode = 'UNKNOWN_ERROR';
        let errorMessage = 'Impossible de convertir l\'abonné';
        
        if (responseData.error) {
          errorCode = responseData.error.code;
          errorMessage = responseData.error.message;
        }

        const finalError: any = new Error(errorMessage);
        finalError.code = errorCode;
        throw finalError;
      }

      // Remove subscriber from local state since it's been converted
      setSubscribers(prev => prev.filter(sub => sub.id !== subscriberId));
      await fetchAnalytics(); // Refresh analytics

      return { success: true, message: responseData?.message || 'Converted successfully' };
    } catch (err) {
      logError('Error converting subscriber to pending user:', err);
      throw err;
    }
  };

  return {
    subscribers,
    analytics,
    loading,
    error,
    filters,
    setFilters,
    deleteSubscriber,
    exportSubscribers,
    convertToPendingUser,
    refetch: fetchSubscribers
  };
};