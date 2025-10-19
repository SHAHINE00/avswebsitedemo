import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown, Key } from "lucide-react";
import { StudentQuickActions } from "./StudentQuickActions";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

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

interface StudentDataTableProps {
  students: Student[];
  selectedStudents: string[];
  onSelectStudent: (studentId: string) => void;
  onSelectAll: (selected: boolean) => void;
  onViewProfile: (student: Student) => void;
  onSort: (column: string) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onEdit?: (student: Student) => void;
  onRecordPayment?: (student: Student) => void;
  onSendEmail?: (student: Student) => void;
  onEnrollCourse?: (student: Student) => void;
  onGenerateCertificate?: (student: Student) => void;
  onViewDocuments?: (student: Student) => void;
  onArchive?: (student: Student) => void;
  onResetPassword?: (student: Student) => void;
}

const getStatusBadgeVariant = (status?: string) => {
  switch (status) {
    case 'active': return 'default';
    case 'on_hold': return 'secondary';
    case 'suspended': return 'destructive';
    case 'graduated': return 'outline';
    case 'inactive': return 'secondary';
    default: return 'default';
  }
};

const getStatusLabel = (status?: string) => {
  switch (status) {
    case 'active': return '🟢 Actif';
    case 'on_hold': return '🟡 En Pause';
    case 'suspended': return '🔴 Suspendu';
    case 'graduated': return '✅ Diplômé';
    case 'inactive': return '⚪ Inactif';
    default: return 'Actif';
  }
};

export const StudentDataTable = ({
  students,
  selectedStudents,
  onSelectStudent,
  onSelectAll,
  onViewProfile,
  onSort,
  sortColumn,
  sortDirection,
  onEdit,
  onRecordPayment,
  onSendEmail,
  onEnrollCourse,
  onGenerateCertificate,
  onViewDocuments,
  onArchive,
  onResetPassword,
}: StudentDataTableProps) => {
  const allSelected = students.length > 0 && selectedStudents.length === students.length;
  const someSelected = selectedStudents.length > 0 && !allSelected;

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onSelectAll}
                aria-label="Sélectionner tous"
                className={someSelected ? "data-[state=checked]:bg-primary/50" : ""}
              />
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => onSort('full_name')} className="gap-2 p-0 h-auto font-semibold">
                Nom
                {getSortIcon('full_name')}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => onSort('email')} className="gap-2 p-0 h-auto font-semibold">
                Email
                {getSortIcon('email')}
              </Button>
            </TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Formation</TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => onSort('total_paid')} className="gap-2 p-0 h-auto font-semibold">
                Total Payé
                {getSortIcon('total_paid')}
              </Button>
            </TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => onSort('created_at')} className="gap-2 p-0 h-auto font-semibold">
                Inscription
                {getSortIcon('created_at')}
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                Aucun étudiant trouvé
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow key={student.id} className="hover:bg-muted/50">
                <TableCell>
                  <Checkbox
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => onSelectStudent(student.id)}
                    aria-label={`Sélectionner ${student.full_name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {student.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{student.full_name || 'N/A'}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{student.email}</TableCell>
                <TableCell className="text-sm">{student.phone || 'N/A'}</TableCell>
                <TableCell>
                  {student.formation_type && (
                    <Badge variant="outline">{student.formation_type}</Badge>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {student.total_paid ? `${student.total_paid.toLocaleString()} MAD` : '0 MAD'}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(student.student_status)}>
                    {getStatusLabel(student.student_status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {student.tags?.slice(0, 2).map((tag, idx) => (
                      <Badge 
                        key={idx} 
                        variant="secondary" 
                        className="text-xs"
                        style={{ backgroundColor: `${tag.tag_color}20`, color: tag.tag_color }}
                      >
                        {tag.tag_name}
                      </Badge>
                    ))}
                    {(student.tags?.length || 0) > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{(student.tags?.length || 0) - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(student.created_at), { addSuffix: true, locale: fr })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {onResetPassword && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onResetPassword(student)}
                        title="Réinitialiser le mot de passe"
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                    )}
                    <StudentQuickActions
                      studentId={student.id}
                      studentName={student.full_name || 'N/A'}
                      onViewProfile={() => onViewProfile(student)}
                      onEdit={() => onEdit ? onEdit(student) : onViewProfile(student)}
                      onRecordPayment={() => onRecordPayment && onRecordPayment(student)}
                      onSendEmail={() => onSendEmail && onSendEmail(student)}
                      onEnrollCourse={() => onEnrollCourse && onEnrollCourse(student)}
                      onGenerateCertificate={() => onGenerateCertificate && onGenerateCertificate(student)}
                      onViewDocuments={() => onViewDocuments && onViewDocuments(student)}
                      onArchive={() => onArchive && onArchive(student)}
                      onResetPassword={() => onResetPassword && onResetPassword(student)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};