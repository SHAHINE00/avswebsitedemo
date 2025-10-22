import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ChatbotAnalyticsDashboard from './ChatbotAnalyticsDashboard';
import { MessageSquare, Settings, BarChart3, Database, Download } from 'lucide-react';

const ChatbotManagement = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { count: convCount } = await supabase
        .from('chatbot_conversations')
        .select('*', { count: 'exact', head: true });

      const { count: msgCount } = await supabase
        .from('chatbot_messages')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalConversations: convCount || 0,
        totalMessages: msgCount || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('chatbot_conversations')
        .select(`
          *,
          chatbot_messages (*)
        `)
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) throw error;

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chatbot-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export réussi",
        description: "Les conversations ont été exportées"
      });
    } catch (error) {
      console.error('Error exporting:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les conversations",
        variant: "destructive"
      });
    }
  };

  const clearOldConversations = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer les conversations de plus de 90 jours ?')) {
      return;
    }

    try {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const { error } = await supabase
        .from('chatbot_conversations')
        .delete()
        .lt('updated_at', ninetyDaysAgo.toISOString());

      if (error) throw error;

      toast({
        title: "Nettoyage effectué",
        description: "Les anciennes conversations ont été supprimées"
      });

      loadStats();
    } catch (error) {
      console.error('Error cleaning:', error);
      toast({
        title: "Erreur",
        description: "Impossible de nettoyer les conversations",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestion du Chatbot</h1>
        <p className="text-muted-foreground">
          Gérez et analysez les performances de votre assistant IA
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversations totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats?.totalConversations || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Messages échangés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats?.totalMessages || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taux de réponse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              100%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytiques
          </TabsTrigger>
          <TabsTrigger value="conversations">
            <MessageSquare className="w-4 h-4 mr-2" />
            Conversations
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </TabsTrigger>
          <TabsTrigger value="data">
            <Database className="w-4 h-4 mr-2" />
            Données
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <ChatbotAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="conversations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversations récentes</CardTitle>
              <CardDescription>
                Dernières interactions avec le chatbot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Vue détaillée des conversations disponible prochainement
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration du chatbot</CardTitle>
              <CardDescription>
                Personnalisez le comportement de l'assistant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="system-prompt">Prompt système</Label>
                <Textarea
                  id="system-prompt"
                  placeholder="Tu es un assistant virtuel intelligent..."
                  rows={5}
                  defaultValue="Tu es un assistant virtuel intelligent pour AVS.ma, une plateforme éducative marocaine."
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Réponses automatiques</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer les réponses rapides
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mode multilingue</Label>
                  <p className="text-sm text-muted-foreground">
                    Supporter FR, AR, EN
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button>Sauvegarder les modifications</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des données</CardTitle>
              <CardDescription>
                Exporter, nettoyer et gérer les données du chatbot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Exporter les données</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Télécharger toutes les conversations au format JSON
                </p>
                <Button onClick={exportConversations} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter les conversations
                </Button>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label className="text-destructive">Zone dangereuse</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Supprimer les conversations de plus de 90 jours
                </p>
                <Button 
                  onClick={clearOldConversations} 
                  variant="destructive"
                >
                  Nettoyer les anciennes conversations
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatbotManagement;
