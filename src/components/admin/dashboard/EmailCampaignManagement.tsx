import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Send, Users, TrendingUp, Calendar, Plus, Eye, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useHostingerEmail } from '@/hooks/useHostingerEmail';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  template_type: string;
  status: string;
  scheduled_at?: string;
  sent_at?: string;
  total_recipients: number;
  total_sent: number;
  total_opened: number;
  total_clicked: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  full_name: string;
  status: string;
  interests?: string[];
  phone?: string;
}

const EMAIL_TEMPLATES = {
  newsletter: {
    name: 'Newsletter',
    subject: 'Actualités AVS INSTITUTE',
    content: `
      <h1>Actualités de la semaine</h1>
      <p>Découvrez nos dernières formations et actualités...</p>
    `
  },
  course_announcement: {
    name: 'Annonce de Formation',
    subject: 'Nouvelle formation disponible!',
    content: `
      <h1>Nouvelle Formation Disponible</h1>
      <p>Nous sommes ravis de vous annoncer le lancement de notre nouvelle formation...</p>
    `
  },
  welcome: {
    name: 'Email de Bienvenue',
    subject: 'Bienvenue chez AVS INSTITUTE',
    content: `
      <h1>Bienvenue dans la famille AVS INSTITUTE!</h1>
      <p>Nous sommes ravis de vous compter parmi nos apprenants...</p>
    `
  }
};

export const EmailCampaignManagement: React.FC = () => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();
  const { sendBulkEmail, loading: emailLoading } = useHostingerEmail();

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    template_type: 'newsletter',
    scheduled_at: ''
  });

  useEffect(() => {
    fetchCampaigns();
    fetchSubscribers();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les campagnes",
        variant: "destructive"
      });
    }
  };

  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*');

      if (error) throw error;
      setSubscribers(data?.map(sub => ({
        id: sub.id,
        email: sub.email,
        full_name: sub.full_name,
        status: 'active',
        phone: sub.phone || undefined
      })) || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    }
  };

  const handleCreateCampaign = async () => {
    if (!newCampaign.name || !newCampaign.subject || !newCampaign.content) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('email_campaigns')
        .insert({
          ...newCampaign,
          total_recipients: subscribers.length,
          scheduled_at: newCampaign.scheduled_at || null
        });

      if (error) throw error;

      toast({
        title: "Campagne créée",
        description: "La campagne email a été créée avec succès"
      });

      setShowCreateDialog(false);
      setNewCampaign({
        name: '',
        subject: '',
        content: '',
        template_type: 'newsletter',
        scheduled_at: ''
      });
      fetchCampaigns();
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la campagne",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendCampaign = async (campaign: EmailCampaign) => {
    if (subscribers.length === 0) {
      toast({
        title: "Aucun destinataire",
        description: "Aucun abonné actif trouvé",
        variant: "destructive"
      });
      return;
    }

    const emailList = subscribers.map(sub => sub.email);
    
    // Update campaign status to sending
    await supabase
      .from('email_campaigns')
      .update({ 
        status: 'sending',
        total_recipients: emailList.length 
      })
      .eq('id', campaign.id);

    const result = await sendBulkEmail(
      emailList,
      campaign.subject,
      campaign.content,
      campaign.id
    );

    // Update final status
    await supabase
      .from('email_campaigns')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString(),
        total_sent: result.sent
      })
      .eq('id', campaign.id);

    fetchCampaigns();
  };

  const loadTemplate = (templateKey: string) => {
    const template = EMAIL_TEMPLATES[templateKey as keyof typeof EMAIL_TEMPLATES];
    if (template) {
      setNewCampaign(prev => ({
        ...prev,
        name: template.name,
        subject: template.subject,
        content: template.content,
        template_type: templateKey
      }));
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'secondary',
      scheduled: 'outline',
      sending: 'default',
      sent: 'default',
      cancelled: 'destructive'
    };
    
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      sending: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Campagnes Email</h2>
          <p className="text-muted-foreground">
            Créez et gérez vos campagnes email pour vos abonnés
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Campagne
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer une Nouvelle Campagne</DialogTitle>
              <DialogDescription>
                Créez une campagne email pour vos abonnés
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nom de la campagne</label>
                  <Input
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Newsletter Janvier 2024"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Type de template</label>
                  <Select
                    value={newCampaign.template_type}
                    onValueChange={(value) => {
                      setNewCampaign(prev => ({ ...prev, template_type: value }));
                      loadTemplate(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newsletter">Newsletter</SelectItem>
                      <SelectItem value="course_announcement">Annonce de Formation</SelectItem>
                      <SelectItem value="welcome">Email de Bienvenue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Sujet de l'email</label>
                <Input
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Sujet de votre email"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Contenu HTML</label>
                <Textarea
                  value={newCampaign.content}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Contenu HTML de votre email"
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Programmation (optionnel)</label>
                <Input
                  type="datetime-local"
                  value={newCampaign.scheduled_at}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, scheduled_at: e.target.value }))}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateCampaign} disabled={loading}>
                  {loading ? "Création..." : "Créer la Campagne"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{campaigns.length}</p>
                <p className="text-sm text-muted-foreground">Campagnes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{subscribers.length}</p>
                <p className="text-sm text-muted-foreground">Abonnés Actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Send className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  {campaigns.reduce((sum, c) => sum + c.total_sent, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Emails Envoyés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {campaigns.filter(c => c.status === 'sent').length}
                </p>
                <p className="text-sm text-muted-foreground">Campagnes Envoyées</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campagnes Email</CardTitle>
          <CardDescription>
            Liste de toutes vos campagnes email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold">{campaign.name}</h3>
                    {getStatusBadge(campaign.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {campaign.subject}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>Destinataires: {campaign.total_recipients}</span>
                    <span>Envoyés: {campaign.total_sent}</span>
                    {campaign.sent_at && (
                      <span>
                        Envoyé le: {new Date(campaign.sent_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCampaign(campaign)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {campaign.status === 'draft' && (
                    <Button
                      size="sm"
                      onClick={() => handleSendCampaign(campaign)}
                      disabled={emailLoading}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      {emailLoading ? "Envoi..." : "Envoyer"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};