import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Crown } from 'lucide-react';
import { UserLevel } from '@/hooks/useGamification';

interface UserLevelCardProps {
  currentLevel: UserLevel;
  nextLevel?: UserLevel;
  currentPoints: number;
  rank?: number | null;
}

const UserLevelCard = ({
  currentLevel,
  nextLevel,
  currentPoints,
  rank
}: UserLevelCardProps) => {
  const progressToNext = nextLevel 
    ? ((currentPoints - currentLevel.points_required) / (nextLevel.points_required - currentLevel.points_required)) * 100
    : 100;

  const pointsToNext = nextLevel 
    ? nextLevel.points_required - currentPoints
    : 0;

  const getLevelIcon = (level: number) => {
    if (level >= 6) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (level >= 4) return <Trophy className="w-5 h-5 text-purple-500" />;
    return <Star className="w-5 h-5 text-blue-500" />;
  };

  const getLevelColor = (level: number) => {
    if (level >= 6) return 'from-yellow-400 to-orange-500';
    if (level >= 4) return 'from-purple-400 to-pink-500';
    if (level >= 3) return 'from-blue-400 to-cyan-500';
    return 'from-green-400 to-blue-500';
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getLevelIcon(currentLevel.level)}
            Niveau {currentLevel.level}
          </CardTitle>
          {rank && (
            <Badge variant="outline" className="text-xs">
              Classement #{rank}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Level Title and Points */}
        <div className="text-center">
          <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${getLevelColor(currentLevel.level)} text-white font-semibold text-lg mb-2`}>
            {currentLevel.title}
          </div>
          <p className="text-sm text-muted-foreground">
            {currentPoints} points totaux
          </p>
        </div>

        {/* Progress to Next Level */}
        {nextLevel && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Progression vers {nextLevel.title}</span>
              <span className="font-medium">
                {Math.round(progressToNext)}%
              </span>
            </div>
            <Progress value={progressToNext} className="h-3" />
            <p className="text-xs text-muted-foreground text-center">
              {pointsToNext} points restants pour le niveau suivant
            </p>
          </div>
        )}

        {/* Level Benefits */}
        <div>
          <h4 className="font-medium text-sm mb-2">Avantages débloqués :</h4>
          <div className="space-y-1">
            {currentLevel.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Level Preview */}
        {nextLevel && (
          <div className="pt-3 border-t">
            <h4 className="font-medium text-sm mb-2 text-muted-foreground">
              Prochains avantages ({nextLevel.title}) :
            </h4>
            <div className="space-y-1">
              {nextLevel.benefits.slice(currentLevel.benefits.length).map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm opacity-60">
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserLevelCard;