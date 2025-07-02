import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Target, Users, Award } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import { useUserProfile } from '@/hooks/useUserProfile';
import UserLevelCard from './UserLevelCard';
import LeaderboardCard from './LeaderboardCard';
import AchievementBadge from './AchievementBadge';

const GamificationDashboard = () => {
  const {
    userPoints,
    userLevel,
    leaderboard,
    userRank,
    loading,
    achievements: allAchievements,
    userLevels
  } = useGamification();
  
  const { achievements: userAchievements } = useUserProfile();

  const nextLevel = userLevels.find(level => level.level === userLevel.level + 1);

  // Map user achievements to check which ones are earned
  const userAchievementTypes = new Set(userAchievements.map(a => a.achievement_type));

  const earnedAchievements = allAchievements.filter(a => userAchievementTypes.has(a.id));
  const availableAchievements = allAchievements.filter(a => !userAchievementTypes.has(a.id));

  return (
    <div className="space-y-6">
      {/* User Level Overview */}
      <UserLevelCard
        currentLevel={userLevel}
        nextLevel={nextLevel}
        currentPoints={userPoints}
        rank={userRank}
      />

      {/* Gamification Tabs */}
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Succès
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Objectifs
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Classement
          </TabsTrigger>
        </TabsList>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          {/* Earned Achievements */}
          {earnedAchievements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Succès débloqués ({earnedAchievements.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {earnedAchievements.map((achievement) => {
                  const userAchievement = userAchievements.find(
                    ua => ua.achievement_type === achievement.id
                  );
                  return (
                    <AchievementBadge
                      key={achievement.id}
                      icon={achievement.icon}
                      title={achievement.title}
                      description={achievement.description}
                      rarity={achievement.rarity}
                      points={achievement.points}
                      achieved={true}
                      achievedAt={userAchievement?.achieved_at}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Available Achievements */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-muted-foreground" />
              Succès disponibles ({availableAchievements.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableAchievements.map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  icon={achievement.icon}
                  title={achievement.title}
                  description={achievement.description}
                  rarity={achievement.rarity}
                  points={achievement.points}
                  achieved={false}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Prochains objectifs</h3>
            <div className="space-y-4">
              {availableAchievements.slice(0, 5).map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-medium text-primary">
                        +{achievement.points} points
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        • {achievement.rarity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard">
          <LeaderboardCard
            leaderboard={leaderboard}
            userRank={userRank}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationDashboard;