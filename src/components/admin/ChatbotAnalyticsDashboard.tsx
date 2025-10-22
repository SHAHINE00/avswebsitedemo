import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Users, TrendingUp, Clock } from 'lucide-react';

interface ChatbotStats {
  totalConversations: number;
  totalMessages: number;
  activeUsers: number;
  avgMessagesPerConversation: number;
  topEvents: Array<{ event_type: string; count: number }>;
}

const ChatbotAnalyticsDashboard = () => {
  const [stats, setStats] = useState<ChatbotStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get total conversations
      const { count: convCount } = await supabase
        .from('chatbot_conversations')
        .select('*', { count: 'exact', head: true });

      // Get total messages
      const { count: msgCount } = await supabase
        .from('chatbot_messages')
        .select('*', { count: 'exact', head: true });

      // Get active users (conversations in last 7 days)
      const { data: activeConvs } = await supabase
        .from('chatbot_conversations')
        .select('user_id')
        .gte('updated_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .not('user_id', 'is', null);

      const uniqueUsers = new Set(activeConvs?.map(c => c.user_id)).size;

      // Get top events
      const { data: analytics } = await supabase
        .from('chatbot_analytics')
        .select('event_type')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const eventCounts = (analytics || []).reduce((acc, item) => {
        acc[item.event_type] = (acc[item.event_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topEvents = Object.entries(eventCounts)
        .map(([event_type, count]) => ({ event_type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        totalConversations: convCount || 0,
        totalMessages: msgCount || 0,
        activeUsers: uniqueUsers,
        avgMessagesPerConversation: convCount ? (msgCount || 0) / convCount : 0,
        topEvents
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Chargement des statistiques...</div>;
  }

  if (!stats) {
    return <div>Impossible de charger les statistiques</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Statistiques du Chatbot</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <MessageSquare className="w-8 h-8 text-academy-blue" />
            <div>
              <p className="text-sm text-muted-foreground">Conversations</p>
              <p className="text-2xl font-bold">{stats.totalConversations}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <TrendingUp className="w-8 h-8 text-academy-purple" />
            <div>
              <p className="text-sm text-muted-foreground">Messages totaux</p>
              <p className="text-2xl font-bold">{stats.totalMessages}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Users className="w-8 h-8 text-academy-lightblue" />
            <div>
              <p className="text-sm text-muted-foreground">Utilisateurs actifs (7j)</p>
              <p className="text-2xl font-bold">{stats.activeUsers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Clock className="w-8 h-8 text-academy-blue" />
            <div>
              <p className="text-sm text-muted-foreground">Moy. messages/conv</p>
              <p className="text-2xl font-bold">{stats.avgMessagesPerConversation.toFixed(1)}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Événements les plus fréquents (7 derniers jours)</h3>
        <div className="space-y-2">
          {stats.topEvents.map((event, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">{event.event_type}</span>
              <span className="text-muted-foreground">{event.count} fois</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ChatbotAnalyticsDashboard;
