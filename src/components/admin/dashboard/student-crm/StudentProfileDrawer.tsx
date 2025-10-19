import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, DollarSign, FileText, MessageSquare, Clock, BookOpen, Key } from 'lucide-react';
import StudentFinancialProfile from './StudentFinancialProfile';
import StudentDocumentVault from './StudentDocumentVault';
import StudentTimeline from './StudentTimeline';
import StudentEnrollments from './StudentEnrollments';
import StudentNotes from './StudentNotes';
import { CertificateGenerator } from './CertificateGenerator';
import { CommunicationCenter } from './CommunicationCenter';
import { StudentOverview } from './StudentOverview';

interface StudentProfile {
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

interface StudentProfileDrawerProps {
  student: StudentProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab?: 'overview' | 'enrollments' | 'finances' | 'documents' | 'timeline' | 'notes' | 'certificates' | 'communication';
  onEditStudent?: (student: StudentProfile) => void;
  onResetPassword?: (student: StudentProfile) => void;
}

const StudentProfileDrawer: React.FC<StudentProfileDrawerProps> = ({ student, open, onOpenChange, activeTab, onEditStudent, onResetPassword }) => {
  const [currentTab, setCurrentTab] = useState<'overview' | 'enrollments' | 'finances' | 'documents' | 'timeline' | 'notes' | 'certificates' | 'communication'>(activeTab ?? 'overview');

  useEffect(() => {
    setCurrentTab(activeTab ?? 'overview');
  }, [activeTab]);

  if (!student) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {getInitials(student.full_name || student.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <SheetTitle className="text-2xl">{student.full_name || student.email}</SheetTitle>
                  <SheetDescription className="mt-1">
                    {student.email}
                  </SheetDescription>
                  {student.phone && (
                    <p className="text-sm text-muted-foreground mt-1">{student.phone}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">Étudiant</Badge>
                    <Badge variant="secondary">
                      Inscrit {new Date(student.created_at).toLocaleDateString('fr-FR')}
                    </Badge>
                  </div>
                </div>
                {onResetPassword && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onResetPassword(student)}
                    className="ml-2"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Réinitialiser
                  </Button>
                )}
              </div>
            </div>
          </div>
        </SheetHeader>

        <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as typeof currentTab)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="overview">Vue</TabsTrigger>
            <TabsTrigger value="enrollments">Cours</TabsTrigger>
            <TabsTrigger value="finances">Finance</TabsTrigger>
            <TabsTrigger value="documents">Docs</TabsTrigger>
            <TabsTrigger value="timeline">Activité</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="certificates">Certificats</TabsTrigger>
            <TabsTrigger value="communication">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <StudentOverview student={student} onEditStudent={onEditStudent} />
          </TabsContent>

          <TabsContent value="enrollments" className="space-y-4 mt-4">
            <StudentEnrollments userId={student.id} detailed />
          </TabsContent>

          <TabsContent value="finances" className="space-y-4 mt-4">
            <StudentFinancialProfile userId={student.id} />
          </TabsContent>

          <TabsContent value="documents" className="space-y-4 mt-4">
            <StudentDocumentVault userId={student.id} />
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4 mt-4">
            <StudentTimeline userId={student.id} />
          </TabsContent>

          <TabsContent value="notes" className="space-y-4 mt-4">
            <StudentNotes userId={student.id} />
          </TabsContent>

          <TabsContent value="certificates" className="space-y-4 mt-4">
            <CertificateGenerator
              studentName={student.full_name || 'Student'}
              studentEmail={student.email || ''}
            />
          </TabsContent>

          <TabsContent value="communication" className="space-y-4 mt-4">
            <CommunicationCenter selectedStudents={[student.id]} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default StudentProfileDrawer;
