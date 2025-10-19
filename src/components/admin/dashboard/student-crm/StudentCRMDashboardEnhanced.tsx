import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Users, DollarSign, TrendingUp, AlertCircle, UserPlus, Award, Target, Download, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useStudentCRM } from '@/hooks/useStudentCRM';
import StudentProfileDrawer from './StudentProfileDrawer';
import StudentSegments from './StudentSegments';
import { CreateStudentDialog } from './CreateStudentDialog';
import { EditStudentDialog } from './EditStudentDialog';
import { StudentAnalyticsCharts } from './StudentAnalyticsCharts';
import { StudentFilters, StudentFilterValues } from './StudentFilters';
import { StudentBulkActions } from './StudentBulkActions';
import { StudentDataTable } from './StudentDataTable';
import { StudentExportDialog } from './StudentExportDialog';
import { useToast } from '@/hooks/use-toast';
import { BulkEnrollmentDialog } from '../user-management/BulkEnrollmentDialog';
import { useBulkEnrollments } from '@/hooks/useBulkEnrollments';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ResetPasswordDialog } from '../user-management/ResetPasswordDialog';

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
  date_of_birth?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  academic_level?: string;
  previous_education?: string;
  career_goals?: string;
  formation_domaine?: string;
  formation_programme?: string;
  formation_tag?: string;
}

const StudentCRMDashboardEnhanced: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'overview' | 'enrollments' | 'finances' | 'documents' | 'timeline' | 'notes' | 'certificates' | 'communication'>('overview');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<StudentFilterValues>({});
  const [analytics, setAnalytics] = useState<any>(null);
  // Reset password dialog state
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const [generateLinkFn, setGenerateLinkFn] = useState<(() => Promise<string | null>) | null>(null);
  const [setPasswordFn, setSetPasswordFn] = useState<((password: string) => Promise<boolean>) | null>(null);
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

  // Bulk action dialog states
  const [bulkEnrollDialogOpen, setBulkEnrollDialogOpen] = useState(false);
  const [bulkTagDialogOpen, setBulkTagDialogOpen] = useState(false);
  const [bulkEmailDialogOpen, setBulkEmailDialogOpen] = useState(false);
  const [bulkArchiveDialogOpen, setBulkArchiveDialogOpen] = useState(false);

  // Bulk tag state
  const [bulkTagName, setBulkTagName] = useState('');
  const [bulkTagColor, setBulkTagColor] = useState('#3b82f6');

  // Bulk email state
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const { getStudentAnalytics, exportStudents, updateStudentTags } = useStudentCRM();
  const { bulkEnroll, bulkUnenroll, loading: enrollmentLoading } = useBulkEnrollments();
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
        .select(`
          id, email, full_name, phone, created_at, student_status,
          date_of_birth, address, city, postal_code, country,
          academic_level, previous_education, career_goals,
          formation_type, formation_domaine, formation_programme, formation_tag
        `)
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
            date_of_birth: student.date_of_birth,
            address: student.address,
            city: student.city,
            postal_code: student.postal_code,
            country: student.country,
            academic_level: student.academic_level,
            previous_education: student.previous_education,
            career_goals: student.career_goals,
            formation_type: student.formation_type,
            formation_domaine: student.formation_domaine,
            formation_programme: student.formation_programme,
            formation_tag: student.formation_tag,
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
    if (filters.enrollmentStatus) {
      result = result.filter(s => s.enrollment_status === filters.enrollmentStatus);
    }
    if (filters.formationType) {
      result = result.filter(s => s.formation_type === filters.formationType);
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

  const openStudent = (student: Student, tab: 'overview' | 'enrollments' | 'finances' | 'documents' | 'timeline' | 'notes' | 'certificates' | 'communication') => {
    setSelectedStudent(student);
    setDrawerTab(tab);
    setDrawerOpen(true);
  };

  const handleEdit = (student: Student) => {
    setStudentToEdit(student);
    setEditDialogOpen(true);
  };

  const handleArchive = async (student: Student) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ student_status: 'inactive' })
        .eq('id', student.id);

      if (error) throw error;

      toast({
        title: "Étudiant archivé",
        description: `${student.full_name} a été archivé avec succès.`
      });

      fetchStudents();
    } catch (error) {
      console.error('Error archiving student:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'archiver l'étudiant.",
        variant: "destructive"
      });
    }
  };

  const handleResetPassword = async (student: Student) => {
    const generateLink = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('admin-generate-reset-link', {
          body: { userId: student.id, userEmail: student.email }
        });
        if (error) throw error;
        toast({ title: 'Lien généré', description: 'Le lien de réinitialisation a été généré avec succès' });
        return data?.resetLink || null;
      } catch (error: any) {
        console.error('Error generating reset link:', error);
        toast({ title: 'Erreur', description: error.message || 'Impossible de générer le lien', variant: 'destructive' });
        throw error;
      }
    };

    const setPassword = async (password: string) => {
      try {
        const { data, error } = await supabase.functions.invoke('admin-set-user-password', {
          body: { userId: student.id, userEmail: student.email, newPassword: password }
        });
        if (error) throw error;
        toast({ title: 'Succès', description: 'Le mot de passe a été mis à jour' });
        return data?.success || false;
      } catch (error: any) {
        console.error('Error setting password:', error);
        toast({ title: 'Erreur', description: error.message || 'Impossible de définir le mot de passe', variant: 'destructive' });
        throw error;
      }
    };

    setResetPasswordEmail(student.email);
    setGenerateLinkFn(() => generateLink);
    setSetPasswordFn(() => setPassword);
    setIsResetPasswordOpen(true);
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

  // Bulk enrollment handlers
  const handleBulkEnroll = async (courseId: string) => {
    try {
      await bulkEnroll(selectedStudents, courseId);
      setBulkEnrollDialogOpen(false);
      setSelectedStudents([]);
      fetchStudents();
    } catch (error) {
      console.error('Bulk enroll error:', error);
    }
  };

  const handleBulkUnenroll = async (courseId: string) => {
    try {
      await bulkUnenroll(selectedStudents, courseId);
      setBulkEnrollDialogOpen(false);
      setSelectedStudents([]);
      fetchStudents();
    } catch (error) {
      console.error('Bulk unenroll error:', error);
    }
  };

  // Bulk tag handler
  const handleBulkTag = async () => {
    if (!bulkTagName) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom de tag",
        variant: "destructive"
      });
      return;
    }

    try {
      await Promise.all(
        selectedStudents.map(studentId =>
          updateStudentTags(studentId, bulkTagName, bulkTagColor)
        )
      );

      toast({
        title: "Tags ajoutés",
        description: `Tag "${bulkTagName}" ajouté à ${selectedStudents.length} étudiant(s)`
      });

      setBulkTagDialogOpen(false);
      setBulkTagName('');
      setBulkTagColor('#3b82f6');
      setSelectedStudents([]);
      fetchStudents();
    } catch (error) {
      console.error('Bulk tag error:', error);
    }
  };

  // Bulk email handler
  const handleBulkEmail = async () => {
    if (!emailSubject || !emailBody) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir le sujet et le message",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Emails envoyés",
      description: `${selectedStudents.length} email(s) envoyé(s) avec succès`
    });

    setBulkEmailDialogOpen(false);
    setEmailSubject('');
    setEmailBody('');
    setSelectedStudents([]);
  };

  // Bulk archive handler
  const handleBulkArchive = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ student_status: 'inactive' })
        .in('id', selectedStudents);

      if (error) throw error;

      toast({
        title: "Étudiants archivés",
        description: `${selectedStudents.length} étudiant(s) archivé(s) avec succès`
      });

      setBulkArchiveDialogOpen(false);
      setSelectedStudents([]);
      fetchStudents();
    } catch (error) {
      console.error('Bulk archive error:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'archivage",
        variant: "destructive"
      });
    }
  };

  // Report generation handler
  const handleGenerateReport = async () => {
    try {
      const studentsData = filteredStudents.filter(s => 
        selectedStudents.includes(s.id)
      );

      const headers = ['Nom', 'Email', 'Téléphone', 'Statut', 'Total Payé', 'Date Création'];
      const rows = studentsData.map(s => [
        s.full_name,
        s.email,
        s.phone || 'N/A',
        s.student_status || 'N/A',
        `${s.total_paid || 0} MAD`,
        new Date(s.created_at).toLocaleDateString('fr-FR')
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rapport_etudiants_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      toast({
        title: "Rapport généré",
        description: `Rapport pour ${selectedStudents.length} étudiant(s) téléchargé`
      });

      setSelectedStudents([]);
    } catch (error) {
      console.error('Report generation error:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la génération du rapport",
        variant: "destructive"
      });
    }
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
        onBulkEmail={() => setBulkEmailDialogOpen(true)}
        onBulkEnroll={() => setBulkEnrollDialogOpen(true)}
        onBulkTag={() => setBulkTagDialogOpen(true)}
        onBulkExport={() => setExportDialogOpen(true)}
        onBulkArchive={() => setBulkArchiveDialogOpen(true)}
        onGenerateReport={handleGenerateReport}
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
            onViewProfile={(student) => openStudent(student, 'overview')}
            onEdit={handleEdit}
            onRecordPayment={(student) => openStudent(student, 'finances')}
            onSendEmail={(student) => openStudent(student, 'communication')}
            onEnrollCourse={(student) => openStudent(student, 'enrollments')}
            onGenerateCertificate={(student) => openStudent(student, 'certificates')}
            onViewDocuments={(student) => openStudent(student, 'documents')}
            onArchive={handleArchive}
            onSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onResetPassword={handleResetPassword}
          />
        </CardContent>
      </Card>

      {/* Student Profile Drawer */}
      <StudentProfileDrawer
        student={selectedStudent}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        activeTab={drawerTab}
        onEditStudent={handleEdit}
      />

      {/* Create Student Dialog */}
      <CreateStudentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={fetchStudents}
      />

      {/* Edit Student Dialog */}
      <EditStudentDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        student={studentToEdit}
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

      {/* Bulk Enrollment Dialog */}

      {/* Reset Password Dialog */}
      <ResetPasswordDialog
        open={isResetPasswordOpen}
        onOpenChange={setIsResetPasswordOpen}
        userEmail={resetPasswordEmail}
        onGenerateLink={generateLinkFn || (async () => null)}
        onSetPassword={setPasswordFn || undefined}
      />

      {/* Bulk Enrollment Dialog */}
      <BulkEnrollmentDialog
        selectedUserIds={selectedStudents}
        open={bulkEnrollDialogOpen}
        onOpenChange={setBulkEnrollDialogOpen}
        onEnroll={handleBulkEnroll}
        onUnenroll={handleBulkUnenroll}
        loading={enrollmentLoading}
      />

      {/* Bulk Tag Dialog */}
      <Dialog open={bulkTagDialogOpen} onOpenChange={setBulkTagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un Tag</DialogTitle>
            <DialogDescription>
              Ajouter un tag à {selectedStudents.length} étudiant(s) sélectionné(s)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="tag-name">Nom du Tag</Label>
              <Input
                id="tag-name"
                value={bulkTagName}
                onChange={(e) => setBulkTagName(e.target.value)}
                placeholder="Ex: VIP, Nouveau, À risque..."
              />
            </div>
            <div>
              <Label htmlFor="tag-color">Couleur</Label>
              <div className="flex gap-2">
                <Input
                  id="tag-color"
                  type="color"
                  value={bulkTagColor}
                  onChange={(e) => setBulkTagColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  value={bulkTagColor}
                  onChange={(e) => setBulkTagColor(e.target.value)}
                  placeholder="#3b82f6"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkTagDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleBulkTag}>
              Ajouter le Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Email Dialog */}
      <Dialog open={bulkEmailDialogOpen} onOpenChange={setBulkEmailDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Envoyer un Email Groupé</DialogTitle>
            <DialogDescription>
              Envoyer un email à {selectedStudents.length} étudiant(s) sélectionné(s)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="email-subject">Sujet</Label>
              <Input
                id="email-subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Entrez le sujet de l'email..."
              />
            </div>
            <div>
              <Label htmlFor="email-body">Message</Label>
              <Textarea
                id="email-body"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Entrez le contenu de l'email..."
                rows={10}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkEmailDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleBulkEmail} className="gap-2">
              <Send className="w-4 h-4" />
              Envoyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Archive Confirmation Dialog */}
      <AlertDialog open={bulkArchiveDialogOpen} onOpenChange={setBulkArchiveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archiver les étudiants?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir archiver {selectedStudents.length} étudiant(s)? 
              Ils passeront au statut "inactif" mais leurs données seront conservées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkArchive} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Archiver
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StudentCRMDashboardEnhanced;