import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AllStudent {
  id: string;
  full_name: string;
  email: string;
  enrolled_in_course: boolean;
  in_current_class: boolean;
  current_class_id?: string;
}

export const useAllStudents = () => {
  const [allStudents, setAllStudents] = useState<AllStudent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllStudents = async (courseId: string, currentClassId: string) => {
    try {
      setLoading(true);

      // Fetch all profiles with student_status = 'active'
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('student_status', 'active')
        .order('full_name');

      if (profilesError) throw profilesError;

      // Fetch enrollments for this course
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('course_enrollments')
        .select('user_id, class_id')
        .eq('course_id', courseId);

      if (enrollmentsError) throw enrollmentsError;

      // Create a map for quick lookup
      const enrollmentMap = new Map(
        enrollments?.map(e => [e.user_id, e.class_id]) || []
      );

      // Merge data
      const studentsWithStatus: AllStudent[] = (profiles || []).map(profile => ({
        id: profile.id,
        full_name: profile.full_name || 'Sans nom',
        email: profile.email || '',
        enrolled_in_course: enrollmentMap.has(profile.id),
        in_current_class: enrollmentMap.get(profile.id) === currentClassId,
        current_class_id: enrollmentMap.get(profile.id) || undefined,
      }));

      setAllStudents(studentsWithStatus);
    } catch (error: any) {
      console.error('Error fetching all students:', error);
      toast.error('Erreur lors du chargement des étudiants');
    } finally {
      setLoading(false);
    }
  };

  const bulkEnrollAndAssign = async (
    courseId: string,
    classId: string,
    studentIds: string[],
    allStudentsList: AllStudent[]
  ) => {
    try {
      setLoading(true);

      // Separate students into those who need enrollment vs. just assignment
      const needEnrollment = studentIds.filter(id => {
        const student = allStudentsList.find(s => s.id === id);
        return student && !student.enrolled_in_course;
      });

      const needAssignment = studentIds.filter(id => {
        const student = allStudentsList.find(s => s.id === id);
        return student && student.enrolled_in_course && !student.in_current_class;
      });

      // Step 1: Enroll students who aren't enrolled in the course
      if (needEnrollment.length > 0) {
        const enrollmentRecords = needEnrollment.map(userId => ({
          user_id: userId,
          course_id: courseId,
          class_id: classId,
          status: 'active',
          progress_percentage: 0,
        }));

        const { error: enrollError } = await supabase
          .from('course_enrollments')
          .insert(enrollmentRecords);

        if (enrollError) throw enrollError;
      }

      // Step 2: Update class assignment for already-enrolled students
      if (needAssignment.length > 0) {
        for (const userId of needAssignment) {
          const { error } = await supabase
            .from('course_enrollments')
            .update({ class_id: classId })
            .eq('user_id', userId)
            .eq('course_id', courseId);

          if (error) throw error;
        }
      }

      // Step 3: Update class current_students count
      const { data: classData } = await supabase
        .from('course_classes')
        .select('current_students')
        .eq('id', classId)
        .single();

      if (classData) {
        await supabase
          .from('course_classes')
          .update({ current_students: (classData.current_students || 0) + studentIds.length })
          .eq('id', classId);
      }

      const enrolledCount = needEnrollment.length;
      const assignedCount = needAssignment.length;

      let message = `${studentIds.length} étudiant(s) ajouté(s) avec succès`;
      if (enrolledCount > 0) {
        message += ` (${enrolledCount} inscrit(s) au cours)`;
      }
      
      toast.success(message);
      return true;
    } catch (error: any) {
      console.error('Error in bulk enroll and assign:', error);
      toast.error('Erreur lors de l\'ajout des étudiants');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    allStudents,
    loading,
    fetchAllStudents,
    bulkEnrollAndAssign,
  };
};
