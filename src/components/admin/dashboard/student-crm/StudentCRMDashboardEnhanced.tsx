import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Users, DollarSign, TrendingUp, AlertCircle, UserPlus, Award, Target, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useStudentCRM } from '@/hooks/useStudentCRM';
import StudentProfileDrawer from './StudentProfileDrawer';
import StudentSegments from './StudentSegments';
import { CreateStudentDialog } from './CreateStudentDialog';
import { StudentAnalyticsCharts } from './StudentAnalyticsCharts';
import { StudentFilters, StudentFilterValues } from './StudentFilters';
import { StudentBulkActions } from './StudentBulkActions';
import { StudentDataTable } from './StudentDataTable';
import { StudentExportDialog } from './StudentExportDialog';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  created_at: string;
  student_status?: string;
  formation_type?: string;
  total_paid?: number;
  enrollment_status?: string;
  tags?: Array<{ tag_name: string; tag_color: string }>;
}

const StudentCRMDashboardEnhanced: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<StudentFilterValues>({});
  const [analytics, setAnalytics] = useState<any>(null);
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    newThisMonth: 0,
    totalRevenue: 0,
    activeEnrollments: 0,
    pendingPayments: 0,
    completionRate: 0,
    certificatesIssued: 0,
    studentsAtRisk: 0
  });

  const { getStudentAnalytics, exportStudents } = useStudentCRM();
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
    fetchMetrics();
    fetchAnalytics();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [searchQuery, students, filters, sortColumn, sortDirection]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, phone, created_at, student_status')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch tags and payment info for each student
      const studentsWithDetails = await Promise.all(
        (data || []).map(async (student: any) => {
          const [tagsResult, paymentsResult] = await Promise.all([
            supabase.from('student_tags').select('tag_name, tag_color').eq('user_id', student.id),
            supabase.from('payment_transactions')
              .select('amount')
              .eq('user_id', student.id)
              .eq('payment_status', 'completed')
          ]);

          const total_paid = paymentsResult.data?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

          return {
            id: student.id,
            email: student.email,
            full_name: student.full_name,
            phone: student.phone,
            created_at: student.created_at,
            student_status: student.student_status,
            tags: tagsResult.data || [],
            total_paid
          };
        })
      );

      setStudents(studentsWithDetails);
      setFilteredStudents(studentsWithDetails);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const [studentsCount, newStudents, enrollmentsData, paymentsData, certificatesData] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true })
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        supabase.from('course_enrollments').select('id, status', { count: 'exact' }),
        supabase.from('payment_transactions').select('amount, payment_status'),
        supabase.from('certificates').select('id', { count: 'exact', head: true }).eq('is_active', true)
      ]);

      const totalRevenue = paymentsData.data?.filter(p => p.payment_status === 'completed')
        .reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      
      const activeEnrollments = enrollmentsData.data?.filter(e => e.status === 'active').length || 0;
      const completedEnrollments = enrollmentsData.data?.filter(e => e.status === 'completed').length || 0;
      const completionRate = enrollmentsData.count ? (completedEnrollments / enrollmentsData.count) * 100 : 0;

      setMetrics({
        totalStudents: studentsCount.count || 0,
        newThisMonth: newStudents.count || 0,
        totalRevenue,
        activeEnrollments,
        pendingPayments: paymentsData.data?.filter(p => p.payment_status === 'pending').length || 0,
        completionRate: Math.round(completionRate),
        certificatesIssued: certificatesData.count || 0,
        studentsAtRisk: 0
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const fetchAnalytics = async () => {
    const data = await getStudentAnalytics();
    setAnalytics(data);
  };

  const applyFiltersAndSearch = () => {
    let result = [...students];

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        s =>
          s.full_name?.toLowerCase().includes(query) ||
          s.email?.toLowerCase().includes(query) ||
          s.phone?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.status) {
      result = result.filter(s => s.student_status === filters.status);
    }
    if (filters.dateFrom) {
      result = result.filter(s => new Date(s.created_at) >= new Date(filters.dateFrom!));
    }
    if (filters.dateTo) {
      result = result.filter(s => new Date(s.created_at) <= new Date(filters.dateTo!));
    }
    if (filters.revenueMin !== undefined) {
      result = result.filter(s => (s.total_paid || 0) >= filters.revenueMin!);
    }
    if (filters.revenueMax !== undefined) {
      result = result.filter(s => (s.total_paid || 0) <= filters.revenueMax!);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aVal: any = a[sortColumn as keyof Student];
      let bVal: any = b[sortColumn as keyof Student];

      if (sortColumn === 'total_paid') {
        aVal = a.total_paid || 0;
        bVal = b.total_paid || 0;
      }

      if (aVal === bVal) return 0;
      
      const comparison = aVal > bVal ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    setFilteredStudents(result);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedStudents(selected ? filteredStudents.map(s => s.id) : []);
  };

  const handleExport = async (options: any) => {
    let studentsToExport: string[] = [];
    
    switch (options.scope) {
      case 'all':
        studentsToExport = students.map(s => s.id);
        break;
      case 'filtered':
        studentsToExport = filteredStudents.map(s => s.id);
        break;
      case 'selected':
        studentsToExport = selectedStudents;
        break;
    }

    const data = await exportStudents(studentsToExport, options.columns);
    
    // Convert to CSV
    const csv = [
      options.columns.join(','),
      ...data.map((row: any) => 
        options.columns.map((col: string) => row[col] || '').join(',')
      )
    ].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_export_${new Date().toISOString()}.${options.format}`;
    a.click();

    toast({
      title: "Export réussi",
      description: `${data.length} étudiant(s) exporté(s)`
    });
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Metrics Cards - 8 Total */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Étudiants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{metrics.newThisMonth} ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRevenue.toLocaleString()} MAD</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscriptions Actives</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeEnrollments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements en Attente</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingPayments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux ce Mois</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.newThisMonth}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Complétion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completionRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificats Émis</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.certificatesIssued}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Étudiants à Risque</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{metrics.studentsAtRisk}</div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <StudentAnalyticsCharts analytics={analytics} />

      {/* Student Segments */}
      <StudentSegments />

      {/* Filters */}
      <StudentFilters
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={() => setFilters({})}
      />

      {/* Bulk Actions */}
      <StudentBulkActions
        selectedCount={selectedStudents.length}
        onClearSelection={() => setSelectedStudents([])}
        onBulkEmail={() => console.log('Bulk email')}
        onBulkEnroll={() => console.log('Bulk enroll')}
        onBulkTag={() => console.log('Bulk tag')}
        onBulkExport={() => setExportDialogOpen(true)}
        onBulkArchive={() => console.log('Bulk archive')}
        onGenerateReport={() => console.log('Generate report')}
      />

      {/* Student List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des Étudiants</CardTitle>
              <CardDescription>
                {filteredStudents.length} étudiant{filteredStudents.length > 1 ? 's' : ''}
                {filteredStudents.length !== students.length && ` sur ${students.length}`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setExportDialogOpen(true)} className="gap-2">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
              <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                <UserPlus className="h-4 w-4" />
                Créer un étudiant
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email ou téléphone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <StudentDataTable
            students={filteredStudents}
            selectedStudents={selectedStudents}
            onSelectStudent={handleSelectStudent}
            onSelectAll={handleSelectAll}
            onViewProfile={(student) => {
              setSelectedStudent(student);
              setDrawerOpen(true);
            }}
            onSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
          />
        </CardContent>
      </Card>

      {/* Student Profile Drawer */}
      <StudentProfileDrawer
        student={selectedStudent}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />

      {/* Create Student Dialog */}
      <CreateStudentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={fetchStudents}
      />

      {/* Export Dialog */}
      <StudentExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        totalStudents={students.length}
        filteredStudents={filteredStudents.length}
        selectedStudents={selectedStudents.length}
        onExport={handleExport}
      />
    </div>
  );
};

export default StudentCRMDashboardEnhanced;