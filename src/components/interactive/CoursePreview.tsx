import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Users, 
  Star, 
  Play, 
  BookOpen, 
  Award,
  ChevronRight,
  Heart,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCardFeedback } from '@/hooks/useTouchFeedback';

interface CoursePreviewProps {
  course: {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    duration: string;
    level: string;
    instructor?: string;
    rating?: number;
    students?: number;
    features?: string[];
    lessons?: number;
    completionRate?: number;
    price?: string;
    image?: string;
  };
  onEnroll?: (courseId: string) => void;
  onBookmark?: (courseId: string) => void;
  onShare?: (courseId: string) => void;
  className?: string;
}

const CoursePreview = ({ 
  course, 
  onEnroll, 
  onBookmark, 
  onShare, 
  className 
}: CoursePreviewProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const cardFeedback = useCardFeedback();

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onBookmark?.(course.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(course.id);
  };

  const handleEnroll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEnroll?.(course.id);
  };

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-lg border-border/50",
        isExpanded && "shadow-xl border-primary/20",
        className
      )}
      {...cardFeedback.cardProps}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardContent className="p-0">
        {/* Course Image/Header */}
        <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleBookmark}
              className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
            >
              <Heart className={cn("h-4 w-4", isBookmarked && "fill-red-500 text-red-500")} />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleShare}
              className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Course Level Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              {course.level}
            </Badge>
          </div>

          {/* Play Preview Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="secondary" size="sm" className="bg-background/90 backdrop-blur-sm">
              <Play className="h-4 w-4 mr-1" />
              Aperçu
            </Button>
          </div>
        </div>

        <div className="p-4">
          {/* Course Title & Description */}
          <div className="mb-3">
            <h3 className="font-semibold text-lg mb-1 line-clamp-2">
              {course.title}
            </h3>
            {course.subtitle && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {course.subtitle}
              </p>
            )}
          </div>

          {/* Course Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {course.duration}
            </div>
            {course.lessons && (
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {course.lessons} leçons
              </div>
            )}
            {course.students && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {course.students}
              </div>
            )}
          </div>

          {/* Rating & Instructor */}
          <div className="flex items-center justify-between mb-3">
            {course.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{course.rating}</span>
              </div>
            )}
            {course.instructor && (
              <span className="text-sm text-muted-foreground">
                {course.instructor}
              </span>
            )}
          </div>

          {/* Expandable Content */}
          <div className={cn(
            "transition-all duration-300 overflow-hidden",
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}>
            {/* Course Description */}
            {course.description && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  {course.description}
                </p>
              </div>
            )}

            {/* Course Features */}
            {course.features && course.features.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Ce que vous apprendrez :</h4>
                <div className="grid grid-cols-1 gap-1">
                  {course.features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Award className="h-3 w-3 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completion Rate */}
            {course.completionRate && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Taux de réussite</span>
                  <span className="font-medium">{course.completionRate}%</span>
                </div>
                <Progress value={course.completionRate} className="h-2" />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t">
            {course.price && (
              <div className="text-lg font-bold text-primary">
                {course.price}
              </div>
            )}
            <div className="flex gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/curriculum#${course.id}`;
                }}
              >
                Voir plus
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              <Button size="sm" onClick={handleEnroll}>
                S'inscrire
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoursePreview;