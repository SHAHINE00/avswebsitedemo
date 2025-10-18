import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, UserPlus, Copy, Check, Key } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useProfessors, Professor } from '@/hooks/useProfessors';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import ProfessorFormDialog from './professor/ProfessorFormDialog';
import ProfessorAssignDialog from './professor/ProfessorAssignDialog';
import { ResetPasswordDialog } from './dashboard/user-management/ResetPasswordDialog';

const ProfessorManagement: React.FC = () => {
  const { professors, loading, createProfessor, updateProfessor, deleteProfessor, assignToCourse } = useProfessors();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [isResetLinkDialogOpen, setIsResetLinkDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const [generateLinkFn, setGenerateLinkFn] = useState<(() => Promise<string | null>) | null>(null);
  const [setPasswordFn, setSetPasswordFn] = useState<((password: string) => Promise<boolean>) | null>(null);

  const filteredProfessors = professors.filter(prof =>
    prof.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (professor: Partial<Professor>) => {
    const result = await createProfessor(professor);
    if (result && typeof result === 'object' && 'resetLink' in result && result.resetLink) {
      setIsCreateDialogOpen(false);
      setResetLink(result.resetLink as string);
      setIsResetLinkDialogOpen(true);
    } else if (result) {
      setIsCreateDialogOpen(false);
    }
  };

  const copyResetLink = async () => {
    if (resetLink) {
      await navigator.clipboard.writeText(resetLink);
      setCopied(true);
      toast({
        title: "Lien copié!",
        description: "Le lien de réinitialisation a été copié dans le presse-papier.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEdit = (professor: Professor) => {
    setSelectedProfessor(professor);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (updates: Partial<Professor>) => {
    if (!selectedProfessor) return;
    const success = await updateProfessor(selectedProfessor.id, updates);
    if (success) {
      setIsEditDialogOpen(false);
      setSelectedProfessor(null);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteProfessor(id);
  };

  const handleAssign = (professor: Professor) => {
    setSelectedProfessor(professor);
    setIsAssignDialogOpen(true);
  };

  const handleAssignCourse = async (courseId: string) => {
    if (!selectedProfessor) return;
    const success = await assignToCourse(selectedProfessor.id, courseId);
    if (success) {
      setIsAssignDialogOpen(false);
      setSelectedProfessor(null);
    }
  };

  const handleResetPassword = async (professor: Professor) => {
    const generateLink = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('send-professor-reset', {
          body: { professorId: professor.id }
        });

        if (error) throw error;

        if (data?.resetLink) {
          toast({
            title: "Succès",
            description: "Lien de réinitialisation généré avec succès",
          });
          return data.resetLink;
        }
        
        throw new Error("Aucun lien généré");
      } catch (error: any) {
        console.error('Error generating reset link:', error);
        toast({
          title: "Erreur",
          description: error.message || "Impossible de générer le lien de réinitialisation",
          variant: "destructive",
        });
        return null;
      }
    };

    const setPassword = async (password: string) => {
      try {
        const { data, error } = await supabase.functions.invoke('admin-set-professor-password', {
          body: { 
            professorId: professor.id,
            professorEmail: professor.email,
            newPassword: password
          }
        });

        if (error) throw error;

        // Handle soft-fail responses from the function (e.g., weak password)
        if (data && data.success === false) {
          throw new Error(data.error || 'Mot de passe refusé. Utilisez un mot de passe plus fort (12+ caractères, chiffres et symboles).');
        }

        if (data?.success) {
          toast({
            title: "Succès",
            description: "Mot de passe défini avec succès",
          });
          return true;
        }
        
        throw new Error("Impossible de définir le mot de passe");
      } catch (error: any) {
        console.error('Error setting password:', error);
        toast({
          title: "Erreur",
          description: error?.message || "Impossible de définir le mot de passe. Essayez un mot de passe plus fort (12+ caractères, chiffres et symboles).",
          variant: "destructive",
        });
        return false;
      }
    };

    setResetPasswordEmail(professor.email);
    setGenerateLinkFn(() => generateLink);
    setSetPasswordFn(() => setPassword);
    setIsResetPasswordOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestion des Professeurs</CardTitle>
              <CardDescription>
                Gérez les professeurs et leurs assignations de cours
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau professeur
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            {loading ? (
              <div>Chargement...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Spécialisation</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfessors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Aucun professeur trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProfessors.map((professor) => (
                      <TableRow key={professor.id}>
                        <TableCell className="font-medium">{professor.full_name}</TableCell>
                        <TableCell>{professor.email}</TableCell>
                        <TableCell>{professor.specialization || '-'}</TableCell>
                        <TableCell>{professor.phone || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={professor.status === 'active' ? 'default' : 'secondary'}>
                            {professor.status === 'active' ? 'Actif' : 'Inactif'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleResetPassword(professor)}
                              title="Réinitialiser le mot de passe"
                            >
                              <Key className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleAssign(professor)}
                              title="Assigner des cours"
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(professor)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(professor.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      <ProfessorFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreate}
        title="Nouveau professeur"
      />

      <ProfessorFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdate}
        professor={selectedProfessor || undefined}
        title="Modifier le professeur"
      />

      <ProfessorAssignDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        professor={selectedProfessor}
        onAssign={handleAssignCourse}
      />

      <Dialog open={isResetLinkDialogOpen} onOpenChange={setIsResetLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Lien de réinitialisation généré</DialogTitle>
            <DialogDescription>
              Partagez ce lien avec le professeur pour qu'il puisse définir son mot de passe.
              Ce lien expire dans 24 heures.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                readOnly
                value={resetLink || ''}
                className="flex-1"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={copyResetLink}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Le professeur devra cliquer sur ce lien pour définir son mot de passe initial.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <ResetPasswordDialog
        open={isResetPasswordOpen}
        onOpenChange={setIsResetPasswordOpen}
        userEmail={resetPasswordEmail}
        onGenerateLink={generateLinkFn || (async () => null)}
        onSetPassword={setPasswordFn || undefined}
      />
    </div>
  );
};

export default ProfessorManagement;