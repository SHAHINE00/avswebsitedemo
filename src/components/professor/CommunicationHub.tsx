import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Send, Users } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface CommunicationHubProps {
  courseId?: string;
}

const CommunicationHub: React.FC<CommunicationHubProps> = ({ courseId }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState<'all' | 'course' | 'individual'>('all');
  const [selectedCourseId, setSelectedCourseId] = useState(courseId || '');
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('normal');
  const [sendEmail, setSendEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Erreur",
        description: "Le sujet et le message sont requis",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await (supabase.rpc as any)('send_bulk_notification', {
        p_title: subject,
        p_message: message,
        p_recipient_type: recipientType,
        p_course_id: recipientType === 'course' ? selectedCourseId : null,
        p_notification_type: 'communication',
        p_priority: priority,
        p_send_email: sendEmail
      });

      if (error) throw error;

      toast({
        title: "Message envoyé",
        description: `Message envoyé à ${data || 0} destinataire(s)`,
      });

      // Reset form
      setSubject('');
      setMessage('');
      setPriority('normal');
      setSendEmail(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          <CardTitle>Hub de Communication</CardTitle>
        </div>
        <CardDescription>
          Envoyer des messages et notifications aux étudiants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipient-type">Destinataires</Label>
          <Select value={recipientType} onValueChange={(value: any) => setRecipientType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Tous les étudiants</span>
                </div>
              </SelectItem>
              <SelectItem value="course">Étudiants d'un cours</SelectItem>
              <SelectItem value="individual">Étudiant individuel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priorité</Label>
          <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">Élevée</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Sujet</Label>
          <Input
            id="subject"
            placeholder="Sujet du message"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Votre message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="send-email"
            checked={sendEmail}
            onCheckedChange={(checked) => setSendEmail(checked as boolean)}
          />
          <Label htmlFor="send-email" className="text-sm font-normal">
            Envoyer également par email
          </Label>
        </div>

        <Button onClick={handleSendMessage} disabled={loading} className="w-full">
          <Send className="h-4 w-4 mr-2" />
          {loading ? 'Envoi en cours...' : 'Envoyer le message'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CommunicationHub;
