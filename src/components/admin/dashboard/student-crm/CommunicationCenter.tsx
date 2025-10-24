import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEmailTemplates, EmailTemplate } from '@/hooks/useEmailTemplates';
import { useHostingerEmail } from '@/hooks/useHostingerEmail';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/ui/LoadingStates';

interface CommunicationCenterProps {
  selectedStudents?: string[];
}

interface StudentProfile {
  id: string;
  email: string;
  full_name: string;
}

export const CommunicationCenter = ({ selectedStudents = [] }: CommunicationCenterProps) => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const { toast } = useToast();
  const { getTemplates, createTemplate, loading } = useEmailTemplates();
  const { sendCustomEmail, loading: sendingEmail } = useHostingerEmail();

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (selectedStudents.length > 0) {
      fetchStudentProfiles();
    }
  }, [selectedStudents]);

  const loadTemplates = async () => {
    const fetchedTemplates = await getTemplates();
    setTemplates(fetchedTemplates);
  };

  const fetchStudentProfiles = async () => {
    if (selectedStudents.length === 0) return;
    
    setLoadingStudents(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', selectedStudents);

      if (error) throw error;

      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching student profiles:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les profils des étudiants.",
        variant: "destructive",
      });
    } finally {
      setLoadingStudents(false);
    }
  };

  const replaceTemplateVariables = (text: string, student: StudentProfile): string => {
    return text
      .replace(/\{\{student_name\}\}/g, student.full_name || 'Étudiant')
      .replace(/\{\{student_email\}\}/g, student.email || '')
      .replace(/\{\{date\}\}/g, new Date().toLocaleDateString('fr-FR'));
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setBody(template.body);
    }
  };

  const handleSendEmail = async () => {
    if (!subject || !body) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    if (students.length === 0) {
      toast({
        title: "Erreur",
        description: "Aucun étudiant sélectionné ou emails introuvables",
        variant: "destructive",
      });
      return;
    }

    try {
      // Build HTML email content
      const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">{{subject}}</h2>
            </div>
            <div class="content">
              {{body}}
            </div>
            <div class="footer">
              <p>Cet email a été envoyé depuis le système de gestion des étudiants.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Send email to each student with personalized content
      const studentEmails = students.map(s => s.email).filter(Boolean);
      
      if (studentEmails.length === 0) {
        toast({
          title: "Erreur",
          description: "Aucune adresse email valide trouvée",
          variant: "destructive",
        });
        return;
      }

      // For personalization, we'll use the first student's data for variables if sending to multiple
      const firstStudent = students[0];
      const personalizedSubject = replaceTemplateVariables(subject, firstStudent);
      const personalizedBody = body
        .split('\n')
        .map(line => `<p>${line}</p>`)
        .join('');
      
      const finalHtml = htmlTemplate
        .replace('{{subject}}', personalizedSubject)
        .replace('{{body}}', replaceTemplateVariables(personalizedBody, firstStudent));

      const success = await sendCustomEmail({
        to: studentEmails,
        subject: personalizedSubject,
        html: finalHtml,
        text: body,
      });

      if (success) {
        setSubject('');
        setBody('');
        setSelectedTemplate('');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi",
        variant: "destructive",
      });
    }
  };

  const handleCreateTemplate = async () => {
    if (!subject || !body) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir le sujet et le message",
        variant: "destructive",
      });
      return;
    }

    const result = await createTemplate({
      name: subject,
      subject,
      body,
      template_type: 'custom',
      variables: []
    });

    if (result) {
      setShowNewTemplate(false);
      await loadTemplates();
      toast({
        title: "Succès",
        description: "Template créé et ajouté à la liste",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Centre de Communication</CardTitle>
          <CardDescription>
            Envoyer des emails aux étudiants sélectionnés
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Student Selection Info */}
          {selectedStudents.length > 0 && (
            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {selectedStudents.length} étudiant(s) sélectionné(s)
                  </p>
                  {loadingStudents ? (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      Chargement des profils...
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {students.map(s => s.full_name).join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Template Email</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner un template" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    {templates.length === 0 ? (
                      <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                        Aucun template disponible
                      </div>
                    ) : (
                      templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowNewTemplate(!showNewTemplate)}
                title="Créer un nouveau template"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {showNewTemplate && (
            <div className="p-4 border rounded-lg space-y-3 bg-muted/50">
              <h4 className="font-medium">Créer un Nouveau Template</h4>
              <div>
                <Label>Nom du Template (Sujet)</Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex: Bienvenue - Rappel de cours"
                  disabled={loading}
                />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Contenu de l'email...&#10;&#10;Variables: {{student_name}}, {{student_email}}, {{date}}"
                  rows={5}
                  disabled={loading}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateTemplate} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Création...
                    </>
                  ) : (
                    'Créer Template'
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowNewTemplate(false)} disabled={loading}>
                  Annuler
                </Button>
              </div>
            </div>
          )}

          {!showNewTemplate && (
            <>
              <div>
                <Label htmlFor="subject">Sujet</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Sujet de l'email (utilisez {{student_name}} pour personnaliser)"
                  disabled={sendingEmail}
                />
              </div>

              <div>
                <Label htmlFor="body">Message</Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Contenu de l'email&#10;&#10;Variables disponibles:&#10;{{student_name}} - Nom de l'étudiant&#10;{{student_email}} - Email de l'étudiant&#10;{{date}} - Date du jour"
                  rows={8}
                  disabled={sendingEmail}
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  Prêt à envoyer à {students.length} étudiant(s)
                </p>
                <Button 
                  onClick={handleSendEmail} 
                  className="gap-2"
                  disabled={sendingEmail || students.length === 0 || !subject || !body}
                >
                  {sendingEmail ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Envoyer
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
