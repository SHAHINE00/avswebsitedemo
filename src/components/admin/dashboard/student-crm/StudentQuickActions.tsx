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
      <DropdownMenuContent align="end" className="w-56 bg-background z-50">
        <DropdownMenuItem onClick={onViewProfile} className="cursor-pointer">
          <Eye className="mr-2 h-4 w-4" />
          Voir le Profil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onRecordPayment} className="cursor-pointer">
          <CreditCard className="mr-2 h-4 w-4" />
          Enregistrer Paiement
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSendEmail} className="cursor-pointer">
          <Mail className="mr-2 h-4 w-4" />
          Envoyer Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEnrollCourse} className="cursor-pointer">
          <BookOpen className="mr-2 h-4 w-4" />
          Inscrire à un Cours
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onGenerateCertificate} className="cursor-pointer">
          <Award className="mr-2 h-4 w-4" />
          Générer Certificat
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onViewDocuments} className="cursor-pointer">
          <FileText className="mr-2 h-4 w-4" />
          Voir Documents
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onArchive} className="cursor-pointer text-destructive">
          <Archive className="mr-2 h-4 w-4" />
          Archiver
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};