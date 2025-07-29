import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, Reply, Heart, Pin, Send, Users } from 'lucide-react';
import { useEnhancedLearning, LessonDiscussion } from '@/hooks/useEnhancedLearning';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale/fr';

interface DiscussionPanelProps {
  lessonId: string;
}

const DiscussionPanel: React.FC<DiscussionPanelProps> = ({ lessonId }) => {
  const { user } = useAuth();
  const { 
    fetchLessonDiscussions, 
    fetchDiscussionReplies,
    createDiscussion 
  } = useEnhancedLearning();

  const [discussions, setDiscussions] = useState<LessonDiscussion[]>([]);
  const [replies, setReplies] = useState<Record<string, LessonDiscussion[]>>({});
  const [newDiscussionContent, setNewDiscussionContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [expandedDiscussions, setExpandedDiscussions] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadDiscussions();
  }, [lessonId]);

  const loadDiscussions = async () => {
    const discussionsData = await fetchLessonDiscussions(lessonId);
    setDiscussions(discussionsData);
  };

  const loadReplies = async (discussionId: string) => {
    const repliesData = await fetchDiscussionReplies(discussionId);
    setReplies(prev => ({
      ...prev,
      [discussionId]: repliesData
    }));
  };

  const handleCreateDiscussion = async () => {
    if (!newDiscussionContent.trim()) return;

    await createDiscussion(lessonId, newDiscussionContent.trim());
    setNewDiscussionContent('');
    setIsCreateDialogOpen(false);
    loadDiscussions();
  };

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim()) return;

    await createDiscussion(lessonId, replyContent.trim(), parentId);
    setReplyContent('');
    setReplyingTo(null);
    loadReplies(parentId);
  };

  const toggleReplies = async (discussionId: string) => {
    if (expandedDiscussions.has(discussionId)) {
      setExpandedDiscussions(prev => {
        const newSet = new Set(prev);
        newSet.delete(discussionId);
        return newSet;
      });
    } else {
      setExpandedDiscussions(prev => new Set([...prev, discussionId]));
      if (!replies[discussionId]) {
        await loadReplies(discussionId);
      }
    }
  };

  const getInitials = (email: string | null | undefined): string => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  const formatUserName = (email: string | null | undefined): string => {
    if (!email) return 'Utilisateur';
    return email.split('@')[0];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Discussions ({discussions.length})
          </CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Nouvelle discussion
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvelle discussion</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Posez une question ou partagez vos réflexions..."
                  value={newDiscussionContent}
                  onChange={(e) => setNewDiscussionContent(e.target.value)}
                  rows={4}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      setNewDiscussionContent('');
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleCreateDiscussion}
                    disabled={!newDiscussionContent.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Publier
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {discussions.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Aucune discussion pour cette leçon.</p>
              <p className="text-sm text-muted-foreground">
                Soyez le premier à poser une question ou partager vos réflexions.
              </p>
            </div>
          ) : (
            discussions.map((discussion) => (
              <Card key={discussion.id} className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(user?.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {formatUserName(user?.email)}
                          </span>
                          {discussion.is_pinned && (
                            <Badge variant="secondary" className="text-xs">
                              <Pin className="w-3 h-3 mr-1" />
                              Épinglé
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(discussion.created_at), {
                              addSuffix: true,
                              locale: fr
                            })}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{discussion.content}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-11">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-1 text-xs text-muted-foreground"
                      >
                        <Heart className="w-3 h-3 mr-1" />
                        {discussion.likes_count}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-1 text-xs text-muted-foreground"
                        onClick={() => toggleReplies(discussion.id)}
                      >
                        <Reply className="w-3 h-3 mr-1" />
                        Répondre
                      </Button>
                    </div>

                    {expandedDiscussions.has(discussion.id) && (
                      <div className="ml-11 space-y-3 pt-3 border-t">
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Écrivez votre réponse..."
                            value={replyingTo === discussion.id ? replyContent : ''}
                            onChange={(e) => {
                              setReplyContent(e.target.value);
                              setReplyingTo(discussion.id);
                            }}
                            rows={2}
                            className="text-sm"
                          />
                          {replyingTo === discussion.id && replyContent && (
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyContent('');
                                }}
                              >
                                Annuler
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleReply(discussion.id)}
                              >
                                <Send className="w-3 h-3 mr-1" />
                                Répondre
                              </Button>
                            </div>
                          )}
                        </div>

                        {replies[discussion.id]?.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {getInitials(user?.email)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium">
                                  {formatUserName(user?.email)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(reply.created_at), {
                                    addSuffix: true,
                                    locale: fr
                                  })}
                                </span>
                              </div>
                              <p className="text-xs leading-relaxed">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscussionPanel;
