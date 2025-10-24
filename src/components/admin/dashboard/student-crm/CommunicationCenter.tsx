import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmailTemplates, EmailTemplate } from "@/hooks/useEmailTemplates";
import { Mail, Plus, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CommunicationCenterProps {
  selectedStudents?: string[];
}

export const CommunicationCenter = ({ selectedStudents = [] }: CommunicationCenterProps) => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const { getTemplates, createTemplate, loading } = useEmailTemplates();
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const data = await getTemplates();
    setTemplates(data);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setBody(template.body);
    }
  };

  const handleSendEmail = () => {
    if (!subject || !body) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Email envoyé",
      description: `Email envoyé à ${selectedStudents.length || 1} étudiant(s)`
    });

    setSubject("");
    setBody("");
    setSelectedTemplate("");
  };

  const handleCreateTemplate = async () => {
    if (!subject || !body) return;

    await createTemplate({
      name: subject,
      subject,
      body,
      template_type: 'custom',
      variables: []
    });

    loadTemplates();
    setShowNewTemplate(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Centre de Communication
          </CardTitle>
          <CardDescription>
            Envoyer des emails aux étudiants
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                onClick={() => setShowNewTemplate(true)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {showNewTemplate && (
            <div className="p-4 border rounded-lg space-y-3">
              <h4 className="font-medium">Nouveau Template</h4>
              <div>
                <Label>Nom du Template</Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex: Bienvenue"
                />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Contenu de l'email..."
                  rows={5}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateTemplate} disabled={loading}>
                  Créer Template
                </Button>
                <Button variant="outline" onClick={() => setShowNewTemplate(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          )}

          {!showNewTemplate && (
            <>
              <div>
                <Label>Sujet</Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Sujet de l'email"
                />
              </div>

              <div>
                <Label>Message</Label>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Votre message..."
                  rows={8}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Variables: {"{{student_name}}, {{course_name}}"}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {selectedStudents.length > 0
                    ? `${selectedStudents.length} destinataire(s) sélectionné(s)`
                    : "Envoyer à l'étudiant actuel"}
                </p>
                <Button onClick={handleSendEmail}>
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
