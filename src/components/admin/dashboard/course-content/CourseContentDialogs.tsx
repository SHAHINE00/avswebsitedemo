import React from 'react';
import LessonFormDialog from './LessonFormDialog';
import MaterialFormDialog from './MaterialFormDialog';
import AnnouncementFormDialog from './AnnouncementFormDialog';
import LessonReorderDialog from './LessonReorderDialog';
import QuizFormDialog from './QuizFormDialog';
import { CourseLesson } from '@/hooks/useCourseContent';
import { Quiz } from '@/hooks/useEnhancedLearning';

interface CourseContentDialogsProps {
  // Lesson dialog
  lessonDialogOpen: boolean;
  setLessonDialogOpen: (open: boolean) => void;
  editingLesson: CourseLesson | null;
  setEditingLesson: (lesson: CourseLesson | null) => void;
  
  // Material dialog
  materialDialogOpen: boolean;
  setMaterialDialogOpen: (open: boolean) => void;
  
  // Announcement dialog
  announcementDialogOpen: boolean;
  setAnnouncementDialogOpen: (open: boolean) => void;
  
  // Reorder dialog
  reorderDialogOpen: boolean;
  setReorderDialogOpen: (open: boolean) => void;
  lessons: CourseLesson[];
  
  // Quiz dialog
  quizDialogOpen: boolean;
  setQuizDialogOpen: (open: boolean) => void;
  editingQuiz: Quiz | null;
  setEditingQuiz: (quiz: Quiz | null) => void;
  selectedLessonForQuiz: string;
  
  // Common props
  selectedCourseId: string;
  onRefreshContent: () => void;
}

const CourseContentDialogs = ({
  lessonDialogOpen,
  setLessonDialogOpen,
  editingLesson,
  setEditingLesson,
  materialDialogOpen,
  setMaterialDialogOpen,
  announcementDialogOpen,
  setAnnouncementDialogOpen,
  reorderDialogOpen,
  setReorderDialogOpen,
  lessons,
  quizDialogOpen,
  setQuizDialogOpen,
  editingQuiz,
  setEditingQuiz,
  selectedLessonForQuiz,
  selectedCourseId,
  onRefreshContent
}: CourseContentDialogsProps) => {
  return (
    <>
      <LessonFormDialog
        open={lessonDialogOpen}
        onOpenChange={setLessonDialogOpen}
        courseId={selectedCourseId}
        lesson={editingLesson}
        onSuccess={() => {
          onRefreshContent();
          setLessonDialogOpen(false);
          setEditingLesson(null);
        }}
      />

      <MaterialFormDialog
        open={materialDialogOpen}
        onOpenChange={setMaterialDialogOpen}
        courseId={selectedCourseId}
        onSuccess={() => {
          onRefreshContent();
          setMaterialDialogOpen(false);
        }}
      />

      <AnnouncementFormDialog
        open={announcementDialogOpen}
        onOpenChange={setAnnouncementDialogOpen}
        courseId={selectedCourseId}
        onSuccess={() => {
          onRefreshContent();
          setAnnouncementDialogOpen(false);
        }}
      />

      <LessonReorderDialog
        open={reorderDialogOpen}
        onOpenChange={setReorderDialogOpen}
        courseId={selectedCourseId}
        lessons={lessons}
        onSuccess={() => {
          onRefreshContent();
          setReorderDialogOpen(false);
        }}
      />

      <QuizFormDialog
        open={quizDialogOpen}
        onOpenChange={setQuizDialogOpen}
        lessonId={selectedLessonForQuiz}
        quiz={editingQuiz}
        onSuccess={() => {
          onRefreshContent();
          setQuizDialogOpen(false);
          setEditingQuiz(null);
        }}
      />
    </>
  );
};

export default CourseContentDialogs;