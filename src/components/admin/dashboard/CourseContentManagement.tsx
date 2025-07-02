import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BookOpen, FileText, Bell, Play, Edit, Trash2, ArrowUpDown, Brain } from 'lucide-react';
import { useCourseContent, CourseLesson, CourseMaterial, CourseAnnouncement } from '@/hooks/useCourseContent';
import { useAdminCourses } from '@/hooks/useAdminCourses';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LessonFormDialog from './course-content/LessonFormDialog';
import MaterialFormDialog from './course-content/MaterialFormDialog';
import AnnouncementFormDialog from './course-content/AnnouncementFormDialog';
import LessonReorderDialog from './course-content/LessonReorderDialog';
import QuizFormDialog from './course-content/QuizFormDialog';
import { useEnhancedLearning, Quiz } from '@/hooks/useEnhancedLearning';

const CourseContentManagement = () => {
  const { courses } = useAdminCourses();
  const { toast } = useToast();
  const {
    lessons,
    materials,
    announcements,
    loading,
    fetchLessons,
    fetchMaterials,
    fetchAnnouncements,
    deleteLesson,
  } = useCourseContent();
  
  const { fetchQuizzes } = useEnhancedLearning();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<CourseLesson | null>(null);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [selectedLessonForQuiz, setSelectedLessonForQuiz] = useState<string>('');

  useEffect(() => {
    if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  useEffect(() => {
    if (selectedCourseId) {
      fetchLessons(selectedCourseId);
      fetchMaterials(selectedCourseId);
      fetchAnnouncements(selectedCourseId);
      loadQuizzes();
    }
  }, [selectedCourseId, fetchLessons, fetchMaterials, fetchAnnouncements]);

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  const handleEditLesson = (lesson: CourseLesson) => {
    setEditingLesson(lesson);
    setLessonDialogOpen(true);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette leçon ?')) {
      await deleteLesson(lessonId);
      if (selectedCourseId) {
        fetchLessons(selectedCourseId);
      }
    }
  };

  const loadQuizzes = async () => {
    if (!selectedCourseId) return;
    
    // Get all lesson IDs for this course
    const lessonIds = lessons.map(lesson => lesson.id);
    if (lessonIds.length === 0) return;

    try {
      const allQuizzes: Quiz[] = [];
      for (const lessonId of lessonIds) {
        const lessonQuizzes = await fetchQuizzes(lessonId);
        allQuizzes.push(...lessonQuizzes);
      }
      setQuizzes(allQuizzes);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    }
  };

  const refreshContent = () => {
    if (selectedCourseId) {
      fetchLessons(selectedCourseId);
      fetchMaterials(selectedCourseId);
      fetchAnnouncements(selectedCourseId);
      loadQuizzes();
    }
  };

  if (courses.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun cours disponible</h3>
          <p className="text-muted-foreground">
            Créez d'abord des cours pour gérer leur contenu.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion du contenu des cours</h2>
          <p className="text-muted-foreground">
            Gérez les leçons, matériaux et annonces de vos cours
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedCourse && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {selectedCourse.title}
            </CardTitle>
            <CardDescription>{selectedCourse.subtitle}</CardDescription>
          </CardHeader>
        </Card>
      )}

      <Tabs defaultValue="lessons" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lessons" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Leçons
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Quiz
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Matériaux
          </TabsTrigger>
          <TabsTrigger value="announcements" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Annonces
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Leçons du cours</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setReorderDialogOpen(true)}
                className="flex items-center gap-2"
                disabled={lessons.length < 2}
              >
                <ArrowUpDown className="w-4 h-4" />
                Réorganiser
              </Button>
              <Button
                onClick={() => {
                  setEditingLesson(null);
                  setLessonDialogOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouvelle leçon
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {lessons.map((lesson) => (
              <Card key={lesson.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{lesson.title}</h4>
                        <Badge variant={lesson.status === 'published' ? 'default' : 'secondary'}>
                          {lesson.status}
                        </Badge>
                        {lesson.is_preview && (
                          <Badge variant="outline">Aperçu</Badge>
                        )}
                      </div>
                      {lesson.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {lesson.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Ordre: {lesson.lesson_order}</span>
                        {lesson.duration_minutes && (
                          <span>Durée: {lesson.duration_minutes} min</span>
                        )}
                        {lesson.video_url && (
                          <Badge variant="outline">Vidéo</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditLesson(lesson)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteLesson(lesson.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {lessons.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Play className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune leçon</h3>
                  <p className="text-muted-foreground mb-4">
                    Commencez par créer la première leçon de ce cours.
                  </p>
                  <Button
                    onClick={() => {
                      setEditingLesson(null);
                      setLessonDialogOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer une leçon
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Quiz du cours</h3>
            <Button
              onClick={() => {
                if (lessons.length > 0) {
                  setSelectedLessonForQuiz(lessons[0].id);
                  setEditingQuiz(null);
                  setQuizDialogOpen(true);
                } else {
                  toast({
                    title: "Aucune leçon disponible",
                    description: "Créez d'abord des leçons avant d'ajouter des quiz",
                    variant: "destructive",
                  });
                }
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouveau quiz
            </Button>
          </div>

          <div className="grid gap-4">
            {quizzes.map((quiz) => {
              const lesson = lessons.find(l => l.id === quiz.lesson_id);
              return (
                <Card key={quiz.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{quiz.title}</h4>
                          <Badge variant={quiz.is_active ? 'default' : 'secondary'}>
                            {quiz.is_active ? 'Actif' : 'Inactif'}
                          </Badge>
                        </div>
                        {quiz.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {quiz.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Leçon: {lesson?.title}</span>
                          <span>Score requis: {quiz.passing_score}%</span>
                          <span>Tentatives: {quiz.max_attempts}</span>
                          {quiz.time_limit_minutes && (
                            <span>Temps: {quiz.time_limit_minutes} min</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingQuiz(quiz);
                            setSelectedLessonForQuiz(quiz.lesson_id);
                            setQuizDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            if (confirm('Êtes-vous sûr de vouloir supprimer ce quiz ?')) {
                              try {
                                const { error } = await supabase
                                  .from('quizzes')
                                  .delete()
                                  .eq('id', quiz.id);
                                if (error) throw error;
                                refreshContent();
                                toast({
                                  title: "Quiz supprimé",
                                  description: "Le quiz a été supprimé avec succès",
                                });
                              } catch (error) {
                                console.error('Error deleting quiz:', error);
                                toast({
                                  title: "Erreur",
                                  description: "Impossible de supprimer le quiz",
                                  variant: "destructive",
                                });
                              }
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {quizzes.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun quiz</h3>
                  <p className="text-muted-foreground mb-4">
                    Créez des quiz pour évaluer vos étudiants.
                  </p>
                  <Button
                    onClick={() => {
                      if (lessons.length > 0) {
                        setSelectedLessonForQuiz(lessons[0].id);
                        setEditingQuiz(null);
                        setQuizDialogOpen(true);
                      }
                    }}
                    disabled={lessons.length === 0}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer un quiz
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Matériaux du cours</h3>
            <Button
              onClick={() => setMaterialDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouveau matériau
            </Button>
          </div>

          <div className="grid gap-4">
            {materials.map((material) => (
              <Card key={material.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{material.title}</h4>
                      {material.description && (
                        <p className="text-sm text-muted-foreground">
                          {material.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{material.file_type}</Badge>
                        {material.is_public && (
                          <Badge variant="secondary">Public</Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {material.download_count} téléchargements
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {materials.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun matériau</h3>
                  <p className="text-muted-foreground mb-4">
                    Ajoutez des fichiers et ressources pour ce cours.
                  </p>
                  <Button onClick={() => setMaterialDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un matériau
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Annonces du cours</h3>
            <Button
              onClick={() => setAnnouncementDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouvelle annonce
            </Button>
          </div>

          <div className="grid gap-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{announcement.title}</h4>
                        <Badge variant={
                          announcement.priority === 'urgent' ? 'destructive' :
                          announcement.priority === 'high' ? 'default' : 'secondary'
                        }>
                          {announcement.priority}
                        </Badge>
                        {announcement.is_pinned && (
                          <Badge variant="outline">Épinglé</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {announcement.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(announcement.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {announcements.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune annonce</h3>
                  <p className="text-muted-foreground mb-4">
                    Créez des annonces pour informer vos étudiants.
                  </p>
                  <Button onClick={() => setAnnouncementDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Créer une annonce
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <LessonFormDialog
        open={lessonDialogOpen}
        onOpenChange={setLessonDialogOpen}
        courseId={selectedCourseId}
        lesson={editingLesson}
        onSuccess={() => {
          refreshContent();
          setLessonDialogOpen(false);
          setEditingLesson(null);
        }}
      />

      <MaterialFormDialog
        open={materialDialogOpen}
        onOpenChange={setMaterialDialogOpen}
        courseId={selectedCourseId}
        onSuccess={() => {
          refreshContent();
          setMaterialDialogOpen(false);
        }}
      />

      <AnnouncementFormDialog
        open={announcementDialogOpen}
        onOpenChange={setAnnouncementDialogOpen}
        courseId={selectedCourseId}
        onSuccess={() => {
          refreshContent();
          setAnnouncementDialogOpen(false);
        }}
      />

      <LessonReorderDialog
        open={reorderDialogOpen}
        onOpenChange={setReorderDialogOpen}
        courseId={selectedCourseId}
        lessons={lessons}
        onSuccess={() => {
          refreshContent();
          setReorderDialogOpen(false);
        }}
      />

      <QuizFormDialog
        open={quizDialogOpen}
        onOpenChange={setQuizDialogOpen}
        lessonId={selectedLessonForQuiz}
        quiz={editingQuiz}
        onSuccess={() => {
          refreshContent();
          setQuizDialogOpen(false);
          setEditingQuiz(null);
        }}
      />
    </div>
  );
};

export default CourseContentManagement;