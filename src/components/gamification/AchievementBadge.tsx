import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AchievementBadgeProps {
  icon: string;
  title: string;
  description?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  achieved?: boolean;
  achievedAt?: string;
  className?: string;
}

const AchievementBadge = ({
  icon,
  title,
  description,
  rarity,
  points,
  achieved = false,
  achievedAt,
  className
}: AchievementBadgeProps) => {
  const rarityColors = {
    common: 'border-gray-300 bg-gray-50 text-gray-700',
    rare: 'border-blue-300 bg-blue-50 text-blue-700',
    epic: 'border-purple-300 bg-purple-50 text-purple-700',
    legendary: 'border-yellow-300 bg-yellow-50 text-yellow-700'
  };

  const rarityGlow = {
    common: 'shadow-gray-200',
    rare: 'shadow-blue-200',
    epic: 'shadow-purple-200',
    legendary: 'shadow-yellow-200'
  };

  return (
    <div className={cn(
      'relative p-4 rounded-lg border-2 transition-all duration-300',
      achieved 
        ? `${rarityColors[rarity]} ${rarityGlow[rarity]} shadow-lg` 
        : 'border-muted bg-muted/20 text-muted-foreground opacity-60',
      'hover:scale-105 hover:shadow-xl',
      className
    )}>
      {/* Achievement Icon */}
      <div className="text-center mb-3">
        <div className={cn(
          'w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl font-bold',
          achieved 
            ? 'bg-primary text-primary-foreground shadow-lg' 
            : 'bg-muted text-muted-foreground'
        )}>
          {icon}
        </div>
      </div>

      {/* Achievement Details */}
      <div className="text-center space-y-2">
        <h3 className="font-semibold text-sm">{title}</h3>
        {description && (
          <p className="text-xs opacity-80">{description}</p>
        )}
        
        {/* Points and Rarity */}
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className="text-xs">
            {points} pts
          </Badge>
          <Badge 
            variant="outline" 
            className={cn(
              'text-xs capitalize',
              achieved && rarityColors[rarity]
            )}
          >
            {rarity}
          </Badge>
        </div>

        {/* Achievement Date */}
        {achieved && achievedAt && (
          <p className="text-xs opacity-70 mt-1">
            Débloqué le {new Date(achievedAt).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Legendary Glow Effect */}
      {achieved && rarity === 'legendary' && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-300/20 via-orange-300/20 to-yellow-300/20 animate-pulse pointer-events-none" />
      )}

      {/* Lock Overlay for Unachieved */}
      {!achieved && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            🔒
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementBadge;