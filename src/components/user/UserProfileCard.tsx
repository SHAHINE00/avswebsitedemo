import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Trophy, BookOpen, Calendar, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';

const UserProfileCard = () => {
  const { user, isStudent, isAdmin, isProfessor } = useAuth();
  const { achievements, statistics } = useUserProfile();

  if (!user || !statistics) {
    return null;
  }

  const initials = user.email?.charAt(0).toUpperCase() || 'U';
  const recentAchievements = achievements.slice(0, 3);
  
  const profileLabel = isStudent ? "Profil Étudiant" : 
                       isAdmin ? "Profil Administrateur" : 
                       isProfessor ? "Profil Professeur" :
                       "Profil Utilisateur";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {profileLabel}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {user.email}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-accent/20">
            <div className="flex items-center justify-center gap-2 mb-1">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{statistics.total_enrollments}</span>
            </div>
            <p className="text-xs text-muted-foreground">Formations inscrites</p>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-accent/20">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{statistics.completed_courses}</span>
            </div>
            <p className="text-xs text-muted-foreground">Formations complétées</p>
          </div>
        </div>

        {/* Progress Overview */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progression moyenne</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(statistics.avg_progress)}%
            </span>
          </div>
          <Progress value={statistics.avg_progress} className="h-2" />
        </div>

        {/* Recent Achievements */}
        {recentAchievements.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Succès récents
            </h4>
            <div className="space-y-2">
              {recentAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-accent/10"
                >
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {achievement.achievement_title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(achievement.achieved_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-lg font-semibold">{statistics.total_achievements}</p>
            <p className="text-xs text-muted-foreground">Succès</p>
          </div>
          <div>
            <p className="text-lg font-semibold">{statistics.active_courses}</p>
            <p className="text-xs text-muted-foreground">En cours</p>
          </div>
          <div>
            <p className="text-lg font-semibold">{statistics.bookmarked_courses}</p>
            <p className="text-xs text-muted-foreground">Favoris</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;