import React, { useState } from 'react';
import { Save, Trash2, Archive, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface ClassSettingsTabProps {
  classId: string;
  classData: any;
  onUpdate: () => void;
}

export const ClassSettingsTab: React.FC<ClassSettingsTabProps> = ({ classId, classData, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    class_name: classData.class_name || '',
    class_code: classData.class_code || '',
    max_students: classData.max_students || 30,
    start_date: classData.start_date || '',
    end_date: classData.end_date || '',
    semester: classData.semester || '',
    academic_year: classData.academic_year || '',
    notes: classData.notes || '',
    status: classData.status || 'active'
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('course_classes')
        .update({
          class_name: formData.class_name,
          class_code: formData.class_code,
          max_students: formData.max_students,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          semester: formData.semester || null,
          academic_year: formData.academic_year || null,
          notes: formData.notes || null,
          status: formData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', classId);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Les paramètres de la classe ont été mis à jour'
      });

      onUpdate();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de mettre à jour la classe',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('course_classes')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('id', classId);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'La classe a été archivée'
      });

      onUpdate();
      navigate('/admin');
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible d\'archiver la classe',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('course_classes')
        .delete()
        .eq('id', classId);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'La classe a été supprimée'
      });

      navigate('/admin');
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de supprimer la classe',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
          <CardDescription>
            Modifiez les paramètres de base de la classe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class_name">Nom de la classe *</Label>
                <Input
                  id="class_name"
                  value={formData.class_name}
                  onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="class_code">Code de la classe</Label>
                <Input
                  id="class_code"
                  value={formData.class_code}
                  onChange={(e) => setFormData({ ...formData, class_code: e.target.value })}
                  placeholder="Ex: A-09"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_students">Capacité maximale</Label>
                <Input
                  id="max_students"
                  type="number"
                  min="1"
                  value={formData.max_students}
                  onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Terminée</SelectItem>
                    <SelectItem value="cancelled">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date">Date de début</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">Date de fin</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Semestre</Label>
                <Input
                  id="semester"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  placeholder="Ex: S1, S2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="academic_year">Année académique</Label>
                <Input
                  id="academic_year"
                  value={formData.academic_year}
                  onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                  placeholder="Ex: 2024-2025"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notes additionnelles sur la classe..."
                rows={4}
              />
            </div>

            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer les modifications
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Zone dangereuse</CardTitle>
          <CardDescription>
            Actions irréversibles sur la classe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Archiver la classe</h4>
              <p className="text-sm text-muted-foreground">
                Marquer cette classe comme terminée. Les données seront conservées.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" disabled={loading}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archiver
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Archiver la classe ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action marquera la classe comme terminée. Vous pourrez toujours consulter les données historiques.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleArchive}>Confirmer</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="flex items-center justify-between p-4 border border-destructive rounded-lg">
            <div>
              <h4 className="font-medium text-destructive">Supprimer la classe</h4>
              <p className="text-sm text-muted-foreground">
                Supprimer définitivement cette classe. Cette action est irréversible.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={loading}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Supprimer définitivement la classe ?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Toutes les données de la classe seront perdues :
                    - Présences des étudiants
                    - Notes et évaluations
                    - Planning des sessions
                    <br /><br />
                    Êtes-vous absolument sûr de vouloir continuer ?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                    Supprimer définitivement
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
