import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, DollarSign, FileText, MessageSquare, Clock, BookOpen } from 'lucide-react';
import StudentFinancialProfile from './StudentFinancialProfile';
import StudentDocumentVault from './StudentDocumentVault';
import StudentTimeline from './StudentTimeline';
import StudentEnrollments from './StudentEnrollments';
import StudentNotes from './StudentNotes';

interface StudentProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  created_at: string;
}

interface StudentProfileDrawerProps {
  student: StudentProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StudentProfileDrawer: React.FC<StudentProfileDrawerProps> = ({ student, open, onOpenChange }) => {
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
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="overview">
              <User className="w-4 h-4 mr-1" />
              Vue
            </TabsTrigger>
            <TabsTrigger value="enrollments">
              <BookOpen className="w-4 h-4 mr-1" />
              Cours
            </TabsTrigger>
            <TabsTrigger value="finances">
              <DollarSign className="w-4 h-4 mr-1" />
              Finance
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="w-4 h-4 mr-1" />
              Docs
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <Clock className="w-4 h-4 mr-1" />
              Activité
            </TabsTrigger>
            <TabsTrigger value="notes">
              <MessageSquare className="w-4 h-4 mr-1" />
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <StudentEnrollments userId={student.id} />
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
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default StudentProfileDrawer;
