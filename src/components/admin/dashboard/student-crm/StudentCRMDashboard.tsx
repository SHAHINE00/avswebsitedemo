import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Users, DollarSign, TrendingUp, AlertCircle, UserPlus, Key, Edit2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useStudentCRM } from '@/hooks/useStudentCRM';
import { useStudentFinancials } from '@/hooks/useStudentFinancials';
import { useToast } from '@/hooks/use-toast';
import StudentProfileDrawer from './StudentProfileDrawer';
import StudentSegments from './StudentSegments';
import { CreateStudentDialog } from './CreateStudentDialog';
import { ResetPasswordDialog } from '../user-management/ResetPasswordDialog';

interface Student {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  created_at: string;
  student_status?: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  academic_level?: string;
  previous_education?: string;
  career_goals?: string;
  formation_type?: string;
  formation_domaine?: string;
  formation_programme?: string;
  formation_tag?: string;
}

const StudentCRMDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const [generateLinkFn, setGenerateLinkFn] = useState<(() => Promise<string | null>) | null>(null);
  const [setPasswordFn, setSetPasswordFn] = useState<((password: string) => Promise<boolean>) | null>(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    totalRevenue: 0,
    activeEnrollments: 0,
    pendingPayments: 0
  });

  const { getStudentSegments } = useStudentCRM();
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
    fetchMetrics();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredStudents(
        students.filter(
          s =>
            s.full_name?.toLowerCase().includes(query) ||
            s.email?.toLowerCase().includes(query) ||
            s.phone?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, students]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, 
          email, 
          full_name, 
          phone, 
          created_at,
          student_status,
          date_of_birth,
          address,
          city,
          postal_code,
          country,
          academic_level,
          previous_education,
          career_goals,
          formation_type,
          formation_domaine,
          formation_programme,
          formation_tag
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
      setFilteredStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const [studentsCount, enrollmentsData, paymentsData] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('course_enrollments').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('payment_transactions').select('amount').eq('payment_status', 'completed')
      ]);

      const totalRevenue = paymentsData.data?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      setMetrics({
        totalStudents: studentsCount.count || 0,
        totalRevenue,
        activeEnrollments: enrollmentsData.count || 0,
        pendingPayments: 0
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setDrawerOpen(true);
  };

  const handleResetPassword = async (student: Student) => {
    // Generate Link Function
    const generateLink = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('admin-generate-reset-link', {
          body: { userId: student.id, userEmail: student.email }
        });
        
        if (error) throw error;
        
        toast({
          title: "Lien généré",
          description: "Le lien de réinitialisation a été généré avec succès"
        });
        
        return data?.resetLink || null;
      } catch (error: any) {
        console.error('Error generating reset link:', error);
        toast({
          title: "Erreur",
          description: error.message || "Impossible de générer le lien",
          variant: "destructive"
        });
        throw error;
      }
    };

    // Set Password Function
    const setPassword = async (password: string) => {
      try {
        const { data, error } = await supabase.functions.invoke('admin-set-user-password', {
          body: { userId: student.id, userEmail: student.email, newPassword: password }
        });
        
        if (error) throw error;
        
        toast({
          title: "Succès",
          description: "Le mot de passe a été mis à jour"
        });
        
        return data?.success || false;
      } catch (error: any) {
        console.error('Error setting password:', error);
        toast({
          title: "Erreur",
          description: error.message || "Impossible de définir le mot de passe",
          variant: "destructive"
        });
        throw error;
      }
    };

    // Setup and open dialog
    setResetPasswordEmail(student.email);
    setGenerateLinkFn(() => generateLink);
    setSetPasswordFn(() => setPassword);
    setIsResetPasswordOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Étudiants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRevenue.toFixed(2)} MAD</div>
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
      </div>

      {/* Student Segments */}
      <StudentSegments />

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Étudiants</CardTitle>
          <CardDescription>Recherchez et gérez vos étudiants</CardDescription>
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email ou téléphone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Créer un étudiant
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Chargement...</p>
            ) : filteredStudents.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Aucun étudiant trouvé</p>
            ) : (
              filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors group"
                >
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => handleStudentClick(student)}
                  >
                    <p className="font-medium">{student.full_name || student.email}</p>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                    {student.phone && (
                      <p className="text-sm text-muted-foreground">{student.phone}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {new Date(student.created_at).toLocaleDateString('fr-FR')}
                    </Badge>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStudentClick(student);
                        }}
                        title="Voir le profil"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResetPassword(student);
                        }}
                        title="Réinitialiser le mot de passe"
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Student Profile Drawer */}
      <StudentProfileDrawer
        student={selectedStudent}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onResetPassword={handleResetPassword}
      />

      {/* Create Student Dialog */}
      <CreateStudentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={fetchStudents}
      />

      {/* Reset Password Dialog */}
      <ResetPasswordDialog
        open={isResetPasswordOpen}
        onOpenChange={setIsResetPasswordOpen}
        userEmail={resetPasswordEmail}
        onGenerateLink={generateLinkFn || undefined}
        onSetPassword={setPasswordFn || undefined}
      />
    </div>
  );
};

export default StudentCRMDashboard;
