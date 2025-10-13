import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Eye, Edit, CreditCard, Mail, BookOpen, Award, FileText, Archive } from "lucide-react";

interface StudentQuickActionsProps {
  studentId: string;
  studentName: string;
  onViewProfile: () => void;
  onEdit: () => void;
  onRecordPayment: () => void;
  onSendEmail: () => void;
  onEnrollCourse: () => void;
  onGenerateCertificate: () => void;
  onViewDocuments: () => void;
  onArchive: () => void;
}

export const StudentQuickActions = ({
  studentId,
  studentName,
  onViewProfile,
  onEdit,
  onRecordPayment,
  onSendEmail,
  onEnrollCourse,
  onGenerateCertificate,
  onViewDocuments,
  onArchive
}: StudentQuickActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Actions pour {studentName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onSelect={onViewProfile}>
          <Eye className="mr-2 h-4 w-4" />
          Voir le Profil
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onRecordPayment}>
          <CreditCard className="mr-2 h-4 w-4" />
          Enregistrer Paiement
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onSendEmail}>
          <Mail className="mr-2 h-4 w-4" />
          Envoyer Email
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onEnrollCourse}>
          <BookOpen className="mr-2 h-4 w-4" />
          Inscrire à un Cours
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onGenerateCertificate}>
          <Award className="mr-2 h-4 w-4" />
          Générer Certificat
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onViewDocuments}>
          <FileText className="mr-2 h-4 w-4" />
          Voir Documents
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onArchive} className="text-destructive">
          <Archive className="mr-2 h-4 w-4" />
          Archiver
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};