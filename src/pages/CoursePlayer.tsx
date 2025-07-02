import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useCourses } from '@/hooks/useCourses';
import { useCourseContent } from '@/hooks/useCourseContent';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, CheckCircle, Clock, FileText, Bell, ArrowLeft, ArrowRight, Brain, StickyNote, MessageSquare } from 'lucide-react';
import QuizPlayer from '@/components/enhanced-learning/QuizPlayer';
import NotesPanel from '@/components/enhanced-learning/NotesPanel';
import DiscussionPanel from '@/components/enhanced-learning/DiscussionPanel';

const CoursePlayer = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { courses, loading: coursesLoading } = useCourses();
  const {
    lessons,
    materials,
    announcements,
    progress,
    loading,
    fetchLessons,
    fetchMaterials,
    fetchAnnouncements,
    fetchUserProgress,
    markLessonComplete,
  } = useCourseContent();

  const [selectedLessonId, setSelectedLessonId] = useState<string>('');

  // Find the course by slug
  const course = courses.find(c => {
    if (!c.link_to) return false;
    const courseSlug = c.link_to.replace('/course/', '').replace(/^\//, '');
    return courseSlug === slug;
  });

  useEffect(() => {
    if (course?.id) {
      fetchLessons(course.id);
      fetchMaterials(course.id);
      fetchAnnouncements(course.id);
      if (user) {
        fetchUserProgress(course.id);
      }
    }
  }, [course?.id, user, fetchLessons, fetchMaterials, fetchAnnouncements, fetchUserProgress]);

  useEffect(() => {
    if (lessons.length > 0 && !selectedLessonId) {
      // Select first lesson or first incomplete lesson
      const incompleteLesson = lessons.find(lesson => 
        !progress.some(p => p.lesson_id === lesson.id && p.is_completed)
      );
      setSelectedLessonId(incompleteLesson?.id || lessons[0].id);
    }
  }, [lessons, progress, selectedLessonId]);

  if (coursesLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement du cours...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return <Navigate to="/404" replace />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const selectedLesson = lessons.find(l => l.id === selectedLessonId);
  const completedLessons = progress.filter(p => p.is_completed).length;
  const progressPercentage = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;

  const isLessonCompleted = (lessonId: string) => {
    return progress.some(p => p.lesson_id === lessonId && p.is_completed);
  };

  const handleMarkComplete = async () => {
    if (selectedLessonId) {
      await markLessonComplete(selectedLessonId);
      if (course.id) {
        fetchUserProgress(course.id);
      }
    }
  };

  const goToNextLesson = () => {
    const currentIndex = lessons.findIndex(l => l.id === selectedLessonId);
    if (currentIndex < lessons.length - 1) {
      setSelectedLessonId(lessons[currentIndex + 1].id);
    }
  };

  const goToPreviousLesson = () => {
    const currentIndex = lessons.findIndex(l => l.id === selectedLessonId);
    if (currentIndex > 0) {
      setSelectedLessonId(lessons[currentIndex - 1].id);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Course Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="outline" size="sm" asChild>
                <a href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour au tableau de bord
                </a>
              </Button>
            </div>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-muted-foreground mb-4">{course.subtitle}</p>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Progression</span>
                  <span className="text-sm font-medium">{completedLessons}/{lessons.length} leçons</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <Badge variant="secondary">{Math.round(progressPercentage)}% terminé</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Course Content */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contenu du cours</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs defaultValue="lessons">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="lessons" className="text-xs">
                        <Play className="w-3 h-3 mr-1" />
                        Leçons
                      </TabsTrigger>
                      <TabsTrigger value="materials" className="text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        Fichiers
                      </TabsTrigger>
                      <TabsTrigger value="announcements" className="text-xs">
                        <Bell className="w-3 h-3 mr-1" />
                        Annonces
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="lessons" className="p-4 pt-2">
                      <div className="space-y-2">
                        {lessons.map((lesson, index) => (
                          <button
                            key={lesson.id}
                            onClick={() => setSelectedLessonId(lesson.id)}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                              selectedLessonId === lesson.id
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isLessonCompleted(lesson.id) ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                              )}
                              <span className="font-medium text-sm">{index + 1}. {lesson.title}</span>
                            </div>
                            {lesson.duration_minutes && (
                              <div className="flex items-center gap-1 mt-1 text-xs opacity-75">
                                <Clock className="w-3 h-3" />
                                {lesson.duration_minutes} min
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="materials" className="p-4 pt-2">
                      <div className="space-y-2">
                        {materials.map((material) => (
                          <div key={material.id} className="p-3 border rounded-lg">
                            <h4 className="font-medium text-sm">{material.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">{material.file_type}</Badge>
                              <a
                                href={material.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline"
                              >
                                Télécharger
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="announcements" className="p-4 pt-2">
                      <div className="space-y-2">
                        {announcements.map((announcement) => (
                          <div key={announcement.id} className="p-3 border rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm">{announcement.title}</h4>
                              {announcement.priority !== 'normal' && (
                                <Badge
                                  variant={announcement.priority === 'urgent' ? 'destructive' : 'default'}
                                  className="text-xs"
                                >
                                  {announcement.priority}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{announcement.content}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Main Content - Lesson Player */}
            <div className="lg:col-span-3">
              {selectedLesson ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {selectedLesson.title}
                          {isLessonCompleted(selectedLesson.id) && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </CardTitle>
                        {selectedLesson.description && (
                          <p className="text-muted-foreground mt-1">{selectedLesson.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!isLessonCompleted(selectedLesson.id) && (
                          <Button onClick={handleMarkComplete}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Marquer comme terminé
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedLesson.video_url && (
                      <div className="mb-6">
                        <div className="aspect-video bg-black rounded-lg overflow-hidden">
                          <iframe
                            src={selectedLesson.video_url}
                            className="w-full h-full"
                            allowFullScreen
                            title={selectedLesson.title}
                          />
                        </div>
                      </div>
                    )}

                    <div className="prose max-w-none">
                      <div
                        dangerouslySetInnerHTML={{ __html: selectedLesson.content }}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-8 pt-6 border-t">
                      <Button
                        variant="outline"
                        onClick={goToPreviousLesson}
                        disabled={lessons.findIndex(l => l.id === selectedLessonId) === 0}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Leçon précédente
                      </Button>

                      <Button
                        onClick={goToNextLesson}
                        disabled={lessons.findIndex(l => l.id === selectedLessonId) === lessons.length - 1}
                      >
                        Leçon suivante
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Play className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune leçon sélectionnée</h3>
                    <p className="text-muted-foreground">
                      Sélectionnez une leçon dans la liste pour commencer.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CoursePlayer;