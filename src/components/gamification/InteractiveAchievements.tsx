import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Award, 
  Star, 
  Target, 
  Trophy, 
  Zap, 
  Clock,
  CheckCircle,
  Lock,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCardFeedback } from '@/hooks/useTouchFeedback';
import { useToast } from '@/hooks/use-toast';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  category: 'learning' | 'engagement' | 'social' | 'milestone';
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedAt?: string;
  requirements?: string[];
  tips?: string[];
}

interface InteractiveAchievementsProps {
  achievements: Achievement[];
  onClaimReward?: (achievementId: string) => void;
}

const InteractiveAchievements = ({ achievements, onClaimReward }: InteractiveAchievementsProps) => {
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null);
  const { toast } = useToast();
  const cardFeedback = useCardFeedback();

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      Award, Star, Target, Trophy, Zap, Clock, CheckCircle
    };
    return icons[iconName] || Award;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'engagement':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'social':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'milestone':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'learning':
        return 'Apprentissage';
      case 'engagement':
        return 'Engagement';
      case 'social':
        return 'Social';
      case 'milestone':
        return 'Étape clé';
      default:
        return 'Autre';
    }
  };

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(
      selectedAchievement === achievement.id ? null : achievement.id
    );
  };

  const handleClaimReward = (achievement: Achievement) => {
    onClaimReward?.(achievement.id);
    toast({
      title: "Récompense réclamée !",
      description: `Vous avez gagné ${achievement.points} points pour "${achievement.title}"`,
    });
  };

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const lockedAchievements = achievements.filter(a => !a.isUnlocked);

  return (
    <div className="space-y-6">
      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Succès débloqués ({unlockedAchievements.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.map((achievement) => {
              const IconComponent = getIconComponent(achievement.icon);
              const isSelected = selectedAchievement === achievement.id;
              
              return (
                <Card
                  key={achievement.id}
                  className={cn(
                    "cursor-pointer transition-all duration-300 border-2",
                    isSelected 
                      ? "border-primary shadow-lg transform scale-105" 
                      : "border-border/50 hover:border-primary/50 hover:shadow-md"
                  )}
                  {...cardFeedback.cardProps}
                  onClick={() => handleAchievementClick(achievement)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm truncate">
                            {achievement.title}
                          </h4>
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {achievement.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs", getCategoryColor(achievement.category))}
                          >
                            {getCategoryLabel(achievement.category)}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-primary font-medium">
                            <Star className="h-3 w-3" />
                            {achievement.points}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isSelected && (
                      <div className="mt-4 pt-4 border-t animate-fade-in">
                        {achievement.unlockedAt && (
                          <p className="text-xs text-muted-foreground mb-3">
                            Débloqué le {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        )}
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClaimReward(achievement);
                          }}
                        >
                          <Award className="h-4 w-4 mr-1" />
                          Réclamer la récompense
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-muted-foreground" />
            Objectifs à atteindre ({lockedAchievements.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedAchievements.map((achievement) => {
              const IconComponent = getIconComponent(achievement.icon);
              const isSelected = selectedAchievement === achievement.id;
              const progressPercentage = achievement.progress && achievement.maxProgress 
                ? (achievement.progress / achievement.maxProgress) * 100 
                : 0;
              
              return (
                <Card
                  key={achievement.id}
                  className={cn(
                    "cursor-pointer transition-all duration-300 border-2 opacity-75",
                    isSelected 
                      ? "border-muted-foreground shadow-lg" 
                      : "border-border/30 hover:border-muted-foreground/50 hover:shadow-md"
                  )}
                  {...cardFeedback.cardProps}
                  onClick={() => handleAchievementClick(achievement)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted/10 flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-muted-foreground" />
                        <Lock className="h-3 w-3 absolute translate-x-2 translate-y-2 bg-background rounded-full p-0.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate mb-1">
                          {achievement.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {achievement.description}
                        </p>
                        
                        {/* Progress Bar */}
                        {achievement.progress !== undefined && achievement.maxProgress && (
                          <div className="mb-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>Progression</span>
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                            </div>
                            <Progress value={progressPercentage} className="h-1.5" />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs opacity-75">
                            {getCategoryLabel(achievement.category)}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3" />
                            {achievement.points}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Requirements */}
                    {isSelected && (
                      <div className="mt-4 pt-4 border-t animate-fade-in">
                        {achievement.requirements && (
                          <div className="mb-3">
                            <h5 className="text-xs font-medium mb-2 flex items-center gap-1">
                              <Info className="h-3 w-3" />
                              Conditions requises :
                            </h5>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {achievement.requirements.map((req, index) => (
                                <li key={index} className="flex items-start gap-1">
                                  <span className="text-muted-foreground">•</span>
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {achievement.tips && (
                          <div>
                            <h5 className="text-xs font-medium mb-2 flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              Conseils :
                            </h5>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {achievement.tips.map((tip, index) => (
                                <li key={index} className="flex items-start gap-1">
                                  <span className="text-primary">💡</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveAchievements;