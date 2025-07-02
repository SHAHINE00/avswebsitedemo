import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import { LeaderboardEntry } from '@/hooks/useGamification';

interface LeaderboardCardProps {
  leaderboard: LeaderboardEntry[];
  userRank?: number | null;
  loading?: boolean;
}

const LeaderboardCard = ({
  leaderboard,
  userRank,
  loading = false
}: LeaderboardCardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Trophy className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <Award className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Classement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="flex-1">
                  <div className="w-20 h-4 bg-muted rounded mb-1" />
                  <div className="w-16 h-3 bg-muted rounded" />
                </div>
                <div className="w-12 h-6 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Classement
        </CardTitle>
        {userRank && (
          <p className="text-sm text-muted-foreground">
            Votre position : #{userRank}
          </p>
        )}
      </CardHeader>
      
      <CardContent>
        {leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune donnée de classement disponible</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.user_id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  entry.rank <= 3 ? 'bg-accent/20' : 'hover:bg-accent/10'
                }`}
              >
                {/* Rank */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankColor(entry.rank)}`}>
                  {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {entry.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm truncate">
                      {entry.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      Niveau {entry.current_level}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {entry.completed_courses} cours terminés
                    </span>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <div className="font-semibold text-sm">
                    {entry.total_points}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    points
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refresh Note */}
        <div className="text-center mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Classement mis à jour quotidiennement
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;