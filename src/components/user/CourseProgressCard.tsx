import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Calendar, ExternalLink, Heart } from 'lucide-react';
import { useCourseInteractions } from '@/hooks/useCourseInteractions';

interface CourseProgressCardProps {
  enrollment: {
    id: string;
    course_id: string;
    enrolled_at: string;
    status: string;
    progress_percentage: number;
    courses: {
      title: string;
      subtitle: string;
      duration: string;
    };
  };
}

const CourseProgressCard: React.FC<CourseProgressCardProps> = ({ enrollment }) => {
  const { isBookmarked, toggleBookmark } = useCourseInteractions();
  const isCourseFavorited = isBookmarked(enrollment.course_id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'paused':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      case 'paused':
        return 'En pause';
      default:
        return status;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'hsl(var(--success))';
    if (progress >= 75) return 'hsl(var(--warning))';
    if (progress >= 50) return 'hsl(var(--info))';
    return 'hsl(var(--primary))';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{enrollment.courses.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {enrollment.courses.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleBookmark(enrollment.course_id)}
              className="p-2"
            >
              <Heart 
                className={`h-4 w-4 ${isCourseFavorited ? 'fill-current text-red-500' : ''}`} 
              />
            </Button>
            <Badge variant={getStatusColor(enrollment.status)}>
              {getStatusText(enrollment.status)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progression</span>
            <span className="text-sm font-semibold">
              {enrollment.progress_percentage}%
            </span>
          </div>
          <Progress 
            value={enrollment.progress_percentage} 
            className="h-2"
            style={{
              '--progress-background': getProgressColor(enrollment.progress_percentage)
            } as React.CSSProperties}
          />
        </div>

        {/* Course Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{enrollment.courses.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              Inscrit le {new Date(enrollment.enrolled_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            className="flex-1"
            disabled={enrollment.status === 'completed'}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            {enrollment.status === 'completed' ? 'Terminé' : 'Continuer'}
          </Button>
          
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        {/* Completion Achievement */}
        {enrollment.status === 'completed' && (
          <div className="bg-accent/20 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🏆</div>
            <p className="text-sm font-medium text-primary">
              Formation terminée !
            </p>
            <p className="text-xs text-muted-foreground">
              Vous avez complété cette formation avec succès
            </p>
          </div>
        )}

        {/* Next Milestone */}
        {enrollment.status === 'active' && enrollment.progress_percentage < 100 && (
          <div className="bg-accent/10 rounded-lg p-3">
            <p className="text-sm font-medium mb-1">Prochaine étape</p>
            <p className="text-xs text-muted-foreground">
              {enrollment.progress_percentage < 25 
                ? "Continuer les premiers modules"
                : enrollment.progress_percentage < 50
                ? "Vous êtes à mi-parcours !"
                : enrollment.progress_percentage < 75
                ? "Plus que quelques modules"
                : "Vous touchez au but !"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseProgressCard;