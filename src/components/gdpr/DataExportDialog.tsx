import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Download, FileText, Clock, CheckCircle2 } from 'lucide-react';

interface DataExportDialogProps {
  children: React.ReactNode;
}

const DataExportDialog: React.FC<DataExportDialogProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const dataCategories = [
    {
      key: 'profile',
      title: 'Données de Profil',
      description: 'Nom, email, préférences de compte',
      icon: FileText,
    },
    {
      key: 'enrollments',
      title: 'Inscriptions aux Cours',
      description: 'Historique des cours suivis et progrès',
      icon: FileText,
    },
    {
      key: 'activity',
      title: 'Activité d\'Apprentissage',
      description: 'Notes, discussions, résultats de quiz',
      icon: FileText,
    },
    {
      key: 'preferences',
      title: 'Préférences',
      description: 'Paramètres de notification et de confidentialité',
      icon: FileText,
    },
  ];

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Collect all user data
      const userData: any = { exportDate: new Date().toISOString() };

      // Profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      userData.profile = profile;

      // Enrollments
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (title, subtitle)
        `)
        .eq('user_id', user.id);
      userData.enrollments = enrollments;

      // Lesson progress
      const { data: progress } = await supabase
        .from('lesson_progress')
        .select(`
          *,
          course_lessons (title, course_id)
        `)
        .eq('user_id', user.id);
      userData.progress = progress;

      // Notes
      const { data: notes } = await supabase
        .from('lesson_notes')
        .select(`
          *,
          course_lessons (title, course_id)
        `)
        .eq('user_id', user.id);
      userData.notes = notes;

      // Quiz attempts
      const { data: quizAttempts } = await supabase
        .from('quiz_attempts')
        .select(`
          *,
          quizzes (title, lesson_id)
        `)
        .eq('user_id', user.id);
      userData.quizAttempts = quizAttempts;

      // User preferences
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id);
      userData.preferences = preferences;

      // Achievements
      const { data: achievements } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);
      userData.achievements = achievements;

      // Create and download file
      const blob = new Blob([JSON.stringify(userData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mes-donnees-avs-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Export Réussi',
        description: 'Vos données ont été téléchargées avec succès.',
      });

      setIsOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Erreur d\'Export',
        description: 'Une erreur est survenue lors de l\'export de vos données.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exporter Mes Données
          </DialogTitle>
          <DialogDescription>
            Téléchargez toutes vos données personnelles stockées dans notre système.
            L'export inclut toutes les informations associées à votre compte.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-3">
            {dataCategories.map(({ key, title, description, icon: Icon }) => (
              <Card key={key} className="border-muted">
                <CardContent className="flex items-center gap-3 p-4">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <h4 className="font-medium">{title}</h4>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Inclus
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Format et Délai</p>
                <p className="text-muted-foreground">
                  Les données seront exportées au format JSON. Le téléchargement commence immédiatement.
                  Vous pouvez demander un export une fois par mois.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => setIsOpen(false)} variant="outline" className="flex-1">
              Annuler
            </Button>
            <Button 
              onClick={handleExportData} 
              disabled={isExporting}
              className="flex-1"
            >
              {isExporting ? 'Export en cours...' : 'Télécharger Mes Données'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataExportDialog;