import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, UserPlus } from 'lucide-react';
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
import ProfessorFormDialog from './professor/ProfessorFormDialog';
import ProfessorAssignDialog from './professor/ProfessorAssignDialog';

const ProfessorManagement: React.FC = () => {
  const { professors, loading, createProfessor, updateProfessor, deleteProfessor, assignToCourse } = useProfessors();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);

  const filteredProfessors = professors.filter(prof =>
    prof.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (professor: Partial<Professor>) => {
    const success = await createProfessor(professor);
    if (success) {
      setIsCreateDialogOpen(false);
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
    </div>
  );
};

export default ProfessorManagement;