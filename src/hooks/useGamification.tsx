import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: {
    type: string;
    value: number;
  };
}

export interface UserLevel {
  level: number;
  title: string;
  points_required: number;
  benefits: string[];
}

export interface LeaderboardEntry {
  user_id: string;
  email: string;
  total_points: number;
  total_achievements: number;
  completed_courses: number;
  current_level: number;
  rank: number;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_enrollment',
    type: 'enrollment',
    title: 'Premier Pas',
    description: 'Inscription à votre première formation',
    icon: '🎯',
    points: 10,
    rarity: 'common',
    condition: { type: 'enrollments', value: 1 }
  },
  {
    id: 'course_collector',
    type: 'enrollment',
    title: 'Collectionneur',
    description: 'Inscription à 5 formations',
    icon: '📚',
    points: 50,
    rarity: 'rare',
    condition: { type: 'enrollments', value: 5 }
  },
  {
    id: 'first_completion',
    type: 'completion',
    title: 'Finisseur',
    description: 'Première formation terminée',
    icon: '🏆',
    points: 25,
    rarity: 'common',
    condition: { type: 'completions', value: 1 }
  },
  {
    id: 'course_master',
    type: 'completion',
    title: 'Maître des Cours',
    description: '10 formations terminées',
    icon: '👑',
    points: 200,
    rarity: 'epic',
    condition: { type: 'completions', value: 10 }
  },
  {
    id: 'quiz_ace',
    type: 'quiz',
    title: 'As du Quiz',
    description: '10 quiz réussis avec 90%+',
    icon: '🧠',
    points: 75,
    rarity: 'rare',
    condition: { type: 'quiz_perfect', value: 10 }
  },
  {
    id: 'knowledge_seeker',
    type: 'quiz',
    title: 'Chercheur de Savoir',
    description: '50 quiz terminés',
    icon: '🔍',
    points: 100,
    rarity: 'rare',
    condition: { type: 'quiz_completed', value: 50 }
  },
  {
    id: 'discussion_starter',
    type: 'social',
    title: 'Initiateur de Discussion',
    description: '25 messages dans les discussions',
    icon: '💬',
    points: 40,
    rarity: 'common',
    condition: { type: 'discussions', value: 25 }
  },
  {
    id: 'note_taker',
    type: 'engagement',
    title: 'Preneur de Notes',
    description: '100 notes créées',
    icon: '📝',
    points: 60,
    rarity: 'rare',
    condition: { type: 'notes', value: 100 }
  },
  {
    id: 'streak_master',
    type: 'consistency',
    title: 'Maître de la Régularité',
    description: '30 jours consécutifs d\'activité',
    icon: '🔥',
    points: 150,
    rarity: 'epic',
    condition: { type: 'streak_days', value: 30 }
  },
  {
    id: 'perfectionist',
    type: 'achievement',
    title: 'Perfectionniste',
    description: 'Toutes les leçons d\'un cours terminées à 100%',
    icon: '💎',
    points: 300,
    rarity: 'legendary',
    condition: { type: 'perfect_course', value: 1 }
  }
];

const USER_LEVELS: UserLevel[] = [
  { level: 1, title: 'Débutant', points_required: 0, benefits: ['Accès aux forums'] },
  { level: 2, title: 'Apprenant', points_required: 50, benefits: ['Badge spécial', 'Accès prioritaire'] },
  { level: 3, title: 'Étudiant', points_required: 150, benefits: ['Certificats personnalisés'] },
  { level: 4, title: 'Expert', points_required: 300, benefits: ['Contenu exclusif'] },
  { level: 5, title: 'Maître', points_required: 600, benefits: ['Mentorat d\'autres utilisateurs'] },
  { level: 6, title: 'Légende', points_required: 1000, benefits: ['Tous les avantages'] }
];

export const useGamification = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userPoints, setUserPoints] = useState(0);
  const [userLevel, setUserLevel] = useState<UserLevel>(USER_LEVELS[0]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateUserLevel = useCallback((points: number): UserLevel => {
    for (let i = USER_LEVELS.length - 1; i >= 0; i--) {
      if (points >= USER_LEVELS[i].points_required) {
        return USER_LEVELS[i];
      }
    }
    return USER_LEVELS[0];
  }, []);

  const checkAndAwardAchievements = useCallback(async () => {
    if (!user) return;

    try {
      // Get user statistics
      const { data: stats } = await supabase.rpc('get_user_statistics', {
        p_user_id: user.id
      });

      if (!stats) return;

      // Get existing achievements
      const { data: existingAchievements } = await supabase
        .from('user_achievements')
        .select('achievement_type')
        .eq('user_id', user.id);

      const existingTypes = new Set(existingAchievements?.map(a => a.achievement_type) || []);

      // Check each achievement condition
      for (const achievement of ACHIEVEMENTS) {
        if (existingTypes.has(achievement.id)) continue;

        let shouldAward = false;

        switch (achievement.condition.type) {
          case 'enrollments':
            shouldAward = (stats as any).total_enrollments >= achievement.condition.value;
            break;
          case 'completions':
            shouldAward = (stats as any).completed_courses >= achievement.condition.value;
            break;
          case 'quiz_completed':
            // This would need additional data from quiz_attempts table
            const { data: quizAttempts } = await supabase
              .from('quiz_attempts')
              .select('id')
              .eq('user_id', user.id)
              .not('completed_at', 'is', null);
            shouldAward = (quizAttempts?.length || 0) >= achievement.condition.value;
            break;
          case 'quiz_perfect':
            // Quiz attempts with score >= 90%
            const { data: perfectQuizzes } = await supabase
              .from('quiz_attempts')
              .select('score, max_score')
              .eq('user_id', user.id)
              .not('completed_at', 'is', null);
            const perfectCount = perfectQuizzes?.filter(q => 
              q.score && q.max_score && (q.score / q.max_score) >= 0.9
            ).length || 0;
            shouldAward = perfectCount >= achievement.condition.value;
            break;
          case 'discussions':
            const { data: discussions } = await supabase
              .from('lesson_discussions')
              .select('id')
              .eq('user_id', user.id);
            shouldAward = (discussions?.length || 0) >= achievement.condition.value;
            break;
          case 'notes':
            const { data: notes } = await supabase
              .from('lesson_notes')
              .select('id')
              .eq('user_id', user.id);
            shouldAward = (notes?.length || 0) >= achievement.condition.value;
            break;
        }

        if (shouldAward) {
          await awardAchievement(achievement);
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }, [user]);

  const awardAchievement = async (achievement: Achievement) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_type: achievement.id,
          achievement_title: achievement.title,
          achievement_description: achievement.description,
          metadata: {
            icon: achievement.icon,
            points: achievement.points,
            rarity: achievement.rarity
          }
        });

      if (error) throw error;

      // Create notification
      await supabase.rpc('create_notification', {
        p_user_id: user.id,
        p_title: `🎉 Succès débloqué: ${achievement.title}`,
        p_message: `${achievement.description} (+${achievement.points} points)`,
        p_type: 'achievement'
      });

      // Update user points
      setUserPoints(prev => {
        const newPoints = prev + achievement.points;
        const newLevel = calculateUserLevel(newPoints);
        
        // Check for level up
        if (newLevel.level > userLevel.level) {
          setUserLevel(newLevel);
          toast({
            title: "🚀 Niveau supérieur !",
            description: `Vous êtes maintenant ${newLevel.title}`,
          });
        }
        
        return newPoints;
      });

      toast({
        title: `${achievement.icon} ${achievement.title}`,
        description: `${achievement.description} (+${achievement.points} points)`,
      });

    } catch (error) {
      console.error('Error awarding achievement:', error);
    }
  };

  const fetchUserPoints = async () => {
    if (!user) return;

    try {
      const { data: achievements } = await supabase
        .from('user_achievements')
        .select('metadata')
        .eq('user_id', user.id);

      const totalPoints = achievements?.reduce((sum, achievement) => {
        return sum + ((achievement.metadata as any)?.points || 0);
      }, 0) || 0;

      setUserPoints(totalPoints);
      setUserLevel(calculateUserLevel(totalPoints));
    } catch (error) {
      console.error('Error fetching user points:', error);
    }
  };

  const fetchLeaderboard = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // This would be better implemented as a database function for performance
      const { data: leaderboardData, error } = await supabase
        .from('user_achievements')
        .select(`
          user_id,
          metadata
        `);

      if (error) throw error;

      // Group by user and calculate points
      const userPoints = new Map();
      leaderboardData?.forEach(achievement => {
        const userId = achievement.user_id;
        const points = (achievement.metadata as any)?.points || 0;
        userPoints.set(userId, (userPoints.get(userId) || 0) + points);
      });

      // Get user statistics for each user
      const { data: userStats } = await supabase.rpc('get_user_statistics', {
        p_user_id: user.id
      });

      // For now, create a simplified leaderboard
      // In a real implementation, this would be a more efficient database query
      const leaderboardEntries: LeaderboardEntry[] = Array.from(userPoints.entries())
        .map(([userId, points]) => ({
          user_id: userId,
          email: `user-${userId.slice(0, 8)}`, // Placeholder for privacy
          total_points: points,
          total_achievements: 0,
          completed_courses: 0,
          current_level: calculateUserLevel(points).level,
          rank: 0
        }))
        .sort((a, b) => b.total_points - a.total_points)
        .map((entry, index) => ({ ...entry, rank: index + 1 }))
        .slice(0, 10);

      setLeaderboard(leaderboardEntries);
      
      // Find user's rank
      const userRankIndex = leaderboardEntries.findIndex(entry => entry.user_id === user.id);
      setUserRank(userRankIndex >= 0 ? userRankIndex + 1 : null);

    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserPoints();
      fetchLeaderboard();
      checkAndAwardAchievements();

      // Listen for course/lesson completion events
      const handleLessonCompleted = () => {
        setTimeout(() => checkAndAwardAchievements(), 1000);
      };

      const handleQuizCompleted = () => {
        setTimeout(() => checkAndAwardAchievements(), 1000);
      };

      window.addEventListener('lesson-completed', handleLessonCompleted);
      window.addEventListener('quiz-completed', handleQuizCompleted);

      return () => {
        window.removeEventListener('lesson-completed', handleLessonCompleted);
        window.removeEventListener('quiz-completed', handleQuizCompleted);
      };
    }
  }, [user, checkAndAwardAchievements]);

  return {
    userPoints,
    userLevel,
    leaderboard,
    userRank,
    loading,
    achievements: ACHIEVEMENTS,
    userLevels: USER_LEVELS,
    checkAndAwardAchievements,
    fetchLeaderboard,
    awardAchievement,
  };
};