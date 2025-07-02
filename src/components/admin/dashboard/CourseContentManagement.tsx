import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, FileText, Bell, Brain } from 'lucide-react';
import { useCourseContent, CourseLesson } from '@/hooks/useCourseContent';
import { useAdminCourses } from '@/hooks/useAdminCourses';
import { useEnhancedLearning, Quiz } from '@/hooks/useEnhancedLearning';
import CourseSelector from './course-content/CourseSelector';
import LessonsTab from './course-content/LessonsTab';
import QuizzesTab from './course-content/QuizzesTab';
import MaterialsTab from './course-content/MaterialsTab';
import AnnouncementsTab from './course-content/AnnouncementsTab';
import CourseContentDialogs from './course-content/CourseContentDialogs';

const CourseContentManagement = () => {
  const { courses } = useAdminCourses();
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
    }
  }, [selectedCourseId, fetchLessons, fetchMaterials, fetchAnnouncements]);

  // Load quizzes after lessons are loaded
  useEffect(() => {
    if (selectedCourseId && lessons.length > 0) {
      loadQuizzes();
    }
  }, [selectedCourseId, lessons]);

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


  const handleCreateLesson = () => {
    setEditingLesson(null);
    setLessonDialogOpen(true);
  };

  const handleCreateQuiz = () => {
    if (lessons.length > 0) {
      setSelectedLessonForQuiz(lessons[0].id);
      setEditingQuiz(null);
      setQuizDialogOpen(true);
    }
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setSelectedLessonForQuiz(quiz.lesson_id);
    setQuizDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <CourseSelector
        courses={courses}
        selectedCourseId={selectedCourseId}
        onCourseChange={setSelectedCourseId}
        selectedCourse={selectedCourse}
      />

      {selectedCourse && (
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

          <TabsContent value="lessons">
            <LessonsTab
              lessons={lessons}
              onEditLesson={handleEditLesson}
              onDeleteLesson={handleDeleteLesson}
              onCreateLesson={handleCreateLesson}
              onReorderLessons={() => setReorderDialogOpen(true)}
            />
          </TabsContent>

          <TabsContent value="quizzes">
            <QuizzesTab
              quizzes={quizzes}
              lessons={lessons}
              onCreateQuiz={handleCreateQuiz}
              onEditQuiz={handleEditQuiz}
              onRefreshContent={refreshContent}
            />
          </TabsContent>

          <TabsContent value="materials">
            <MaterialsTab
              materials={materials}
              onCreateMaterial={() => setMaterialDialogOpen(true)}
            />
          </TabsContent>

          <TabsContent value="announcements">
            <AnnouncementsTab
              announcements={announcements}
              onCreateAnnouncement={() => setAnnouncementDialogOpen(true)}
            />
          </TabsContent>
        </Tabs>
      )}

      <CourseContentDialogs
        lessonDialogOpen={lessonDialogOpen}
        setLessonDialogOpen={setLessonDialogOpen}
        editingLesson={editingLesson}
        setEditingLesson={setEditingLesson}
        materialDialogOpen={materialDialogOpen}
        setMaterialDialogOpen={setMaterialDialogOpen}
        announcementDialogOpen={announcementDialogOpen}
        setAnnouncementDialogOpen={setAnnouncementDialogOpen}
        reorderDialogOpen={reorderDialogOpen}
        setReorderDialogOpen={setReorderDialogOpen}
        lessons={lessons}
        quizDialogOpen={quizDialogOpen}
        setQuizDialogOpen={setQuizDialogOpen}
        editingQuiz={editingQuiz}
        setEditingQuiz={setEditingQuiz}
        selectedLessonForQuiz={selectedLessonForQuiz}
        selectedCourseId={selectedCourseId}
        onRefreshContent={refreshContent}
      />
    </div>
  );
};

export default CourseContentManagement;