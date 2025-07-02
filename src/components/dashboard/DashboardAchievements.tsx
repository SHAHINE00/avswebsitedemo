import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { UserAchievement } from '@/hooks/useUserProfile';

interface DashboardAchievementsProps {
  achievements: UserAchievement[];
}

const DashboardAchievements = ({ achievements }: DashboardAchievementsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Succès et Réalisations
        </CardTitle>
        <CardDescription>
          Vos accomplissements dans vos formations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {achievements.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun succès débloqué pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="p-4 rounded-lg border bg-accent/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{achievement.achievement_title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(achievement.achieved_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {achievement.achievement_description && (
                  <p className="text-sm text-muted-foreground">
                    {achievement.achievement_description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardAchievements;