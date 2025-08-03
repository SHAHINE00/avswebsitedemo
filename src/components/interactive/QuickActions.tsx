import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  Share2, 
  Bookmark, 
  Download, 
  Calendar,
  MessageCircle,
  Star,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useButtonFeedback } from '@/hooks/useTouchFeedback';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  courseId: string;
  courseTitle: string;
  onEnroll?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
  className?: string;
}

const QuickActions = ({ 
  courseId, 
  courseTitle, 
  onEnroll, 
  onBookmark, 
  onShare,
  className 
}: QuickActionsProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();
  const buttonFeedback = useButtonFeedback();

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.();
    toast({
      title: isBookmarked ? "Retiré des favoris" : "Ajouté aux favoris",
      description: `${courseTitle} ${isBookmarked ? 'retiré de' : 'ajouté à'} vos favoris.`,
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "J'aime retiré" : "Formation likée",
      description: `Merci pour votre retour sur ${courseTitle}!`,
    });
  };

  const handleShare = async () => {
    onShare?.();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: courseTitle,
          text: `Découvrez cette formation : ${courseTitle}`,
          url: window.location.href
        });
      } catch (error) {
        // User cancelled share or error occurred
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié",
        description: "Le lien de la formation a été copié dans le presse-papiers.",
      });
    }
  };

  const handleScheduleDemo = () => {
    toast({
      title: "Démo programmée",
      description: "Nous vous contacterons pour programmer une démonstration.",
    });
  };

  const handleDownloadBrochure = () => {
    toast({
      title: "Brochure en cours de téléchargement",
      description: "La brochure de la formation va être téléchargée.",
    });
  };

  const handleContactInstructor = () => {
    toast({
      title: "Message envoyé",
      description: "Votre message a été envoyé à l'instructeur.",
    });
  };

  return (
    <Card className={cn("border-border/50", className)}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Primary Actions */}
          <div className="flex gap-2">
            <Button 
              className="flex-1" 
              onClick={onEnroll}
              {...buttonFeedback.buttonProps}
            >
              S'inscrire maintenant
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleScheduleDemo}
              {...buttonFeedback.buttonProps}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Démo gratuite
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownloadBrochure}
              {...buttonFeedback.buttonProps}
            >
              <Download className="h-4 w-4 mr-1" />
              Brochure
            </Button>
          </div>

          {/* Social Actions */}
          <div className="flex justify-between items-center pt-2 border-t">
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={cn(
                  "p-2",
                  isLiked && "text-red-500"
                )}
                {...buttonFeedback.buttonProps}
              >
                <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={cn(
                  "p-2",
                  isBookmarked && "text-primary"
                )}
                {...buttonFeedback.buttonProps}
              >
                <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="p-2"
                {...buttonFeedback.buttonProps}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleContactInstructor}
              className="text-xs"
              {...buttonFeedback.buttonProps}
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              Contacter
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex gap-2 pt-2 border-t">
            <Badge variant="secondary" className="text-xs">
              <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
              4.8/5 (234 avis)
            </Badge>
            <Badge variant="secondary" className="text-xs">
              🏆 Certifiant
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;