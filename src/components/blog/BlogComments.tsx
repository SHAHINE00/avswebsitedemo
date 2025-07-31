import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Reply, Heart, Flag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
  isVerified?: boolean;
}

interface BlogCommentsProps {
  postId: string;
  comments?: Comment[];
}

const BlogComments: React.FC<BlogCommentsProps> = ({ postId, comments = [] }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const { toast } = useToast();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate comment submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Commentaire publié !",
        description: "Votre commentaire a été ajouté avec succès.",
      });
      
      setNewComment('');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de publier le commentaire. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (commentId: string) => {
    if (!replyText.trim()) return;

    try {
      // Simulate reply submission
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Réponse publiée !",
        description: "Votre réponse a été ajoutée.",
      });
      
      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de publier la réponse.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const mockComments: Comment[] = [
    {
      id: '1',
      author: 'Marie Dubois',
      content: 'Excellent article ! Les explications sont très claires et les exemples concrets. Merci pour ce partage de qualité.',
      createdAt: '2024-01-15T10:30:00Z',
      likes: 12,
      isVerified: true,
      replies: [
        {
          id: '1-1',
          author: 'Jean Martin',
          content: 'Je suis entièrement d\'accord ! Cet article m\'a beaucoup aidé dans mon projet.',
          createdAt: '2024-01-15T14:20:00Z',
          likes: 3
        }
      ]
    },
    {
      id: '2',
      author: 'Alex Petit',
      content: 'Très instructif. J\'aurais aimé voir plus d\'exemples pratiques, mais c\'est déjà très bien !',
      createdAt: '2024-01-14T16:45:00Z',
      likes: 8
    },
    {
      id: '3',
      author: 'Sophie Laurent',
      content: 'Cela répond exactement à mes questions. Y aura-t-il une suite à cet article ?',
      createdAt: '2024-01-14T09:15:00Z',
      likes: 5,
      isVerified: true
    }
  ];

  const allComments = comments.length > 0 ? comments : mockComments;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Commentaires ({allComments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-8">
            <Textarea
              placeholder="Partager votre avis sur cet article..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] mb-4"
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Soyez respectueux et constructif dans vos commentaires.
              </p>
              <Button 
                type="submit" 
                disabled={!newComment.trim() || isSubmitting}
                className="bg-academy-blue hover:bg-academy-purple"
              >
                {isSubmitting ? 'Publication...' : 'Publier'}
              </Button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {allComments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                <div className="flex gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-academy-blue text-white">
                      {comment.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{comment.author}</span>
                      {comment.isVerified && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          Vérifié
                        </Badge>
                      )}
                      <span className="text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      {comment.content}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                        {comment.likes}
                      </button>
                      <button 
                        onClick={() => setReplyingTo(comment.id)}
                        className="flex items-center gap-1 text-gray-500 hover:text-academy-blue transition-colors"
                      >
                        <Reply className="w-4 h-4" />
                        Répondre
                      </button>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-orange-500 transition-colors">
                        <Flag className="w-4 h-4" />
                        Signaler
                      </button>
                    </div>

                    {/* Reply Form */}
                    {replyingTo === comment.id && (
                      <div className="mt-4 pl-4 border-l-2 border-academy-blue/20">
                        <Textarea
                          placeholder={`Répondre à ${comment.author}...`}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="min-h-[80px] mb-3"
                        />
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleReply(comment.id)}
                            disabled={!replyText.trim()}
                            className="bg-academy-blue hover:bg-academy-purple"
                          >
                            Répondre
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText('');
                            }}
                          >
                            Annuler
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-academy-lightblue text-white text-sm">
                                {reply.author.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{reply.author}</span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(reply.createdAt)}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm leading-relaxed mb-2">
                                {reply.content}
                              </p>
                              <div className="flex items-center gap-3 text-xs">
                                <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
                                  <Heart className="w-3 h-3" />
                                  {reply.likes}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Comments */}
          {allComments.length > 5 && (
            <div className="text-center mt-6">
              <Button variant="outline">
                Charger plus de commentaires
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogComments;