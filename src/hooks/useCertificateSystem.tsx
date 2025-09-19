import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Certificate {
  id: string;
  courseTitle: string;
  courseDuration: string;
  completionDate: Date;
  grade: number;
  certificateNumber: string;
  issuer: string;
  skills: string[];
  type: 'completion' | 'excellence' | 'mastery';
  verified: boolean;
  blockchainHash?: string;
  verification_code: string;
  description?: string;
  certificate_data: any;
}

interface Transcript {
  id: string;
  studentName: string;
  studentId: string;
  enrollmentDate: Date;
  courses: {
    title: string;
    completionDate: Date;
    grade: number;
    credits: number;
    duration: string;
  }[];
  totalCredits: number;
  gpa: number;
}

export const useCertificateSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user certificates
  const fetchCertificates = async () => {
    if (!user) return;

    try {
      const { data: certs, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('issued_date', { ascending: false });

      if (error) throw error;

      // Convert backend certificates to frontend format
      const convertedCerts: Certificate[] = (certs || []).map(cert => {
        const certData = (cert.certificate_data as any) || {};
        
        return {
          id: cert.id,
          courseTitle: cert.title,
          courseDuration: '40 heures',
          completionDate: new Date(cert.issued_date),
          grade: (certData as any)?.grade || 85,
          certificateNumber: cert.verification_code,
          issuer: 'AVS Institute',
          skills: (certData as any)?.skills || [],
          type: getCertificateTypeFromData(cert.certificate_type, (certData as any)?.grade),
          verified: true,
          blockchainHash: (certData as any)?.blockchain_hash,
          verification_code: cert.verification_code,
          description: cert.description,
          certificate_data: cert.certificate_data
        };
      });

      setCertificates(convertedCerts);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les certificats",
        variant: "destructive"
      });
    }
  };

  // Generate transcript from user data
  const generateTranscript = async () => {
    if (!user) return;

    try {
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Get completed course enrollments
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (title, duration)
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed');

      if (!profile || !enrollments) return;

      // Calculate grades and credits from certificates
      const transcriptCourses = await Promise.all(
        enrollments.map(async (enrollment) => {
          // Find corresponding certificate
          const cert = certificates.find(c => 
            c.courseTitle === enrollment.courses?.title
          );

          return {
            title: enrollment.courses?.title || 'Formation',
            completionDate: enrollment.completion_date ? new Date(enrollment.completion_date) : new Date(),
            grade: cert?.grade || 85,
            credits: calculateCreditsFromDuration(enrollment.courses?.duration),
            duration: enrollment.courses?.duration || '40h'
          };
        })
      );

      const totalCredits = transcriptCourses.reduce((sum, course) => sum + course.credits, 0);
      const gpa = transcriptCourses.length > 0 
        ? Math.round(transcriptCourses.reduce((sum, course) => sum + course.grade, 0) / transcriptCourses.length)
        : 0;

      const generatedTranscript: Transcript = {
        id: `TR-${new Date().getFullYear()}-${user.id.slice(0, 8)}`,
        studentName: profile.full_name || 'Étudiant',
        studentId: `STU-${user.id.slice(0, 8)}`,
        enrollmentDate: new Date(profile.created_at),
        courses: transcriptCourses,
        totalCredits,
        gpa
      };

      setTranscript(generatedTranscript);
    } catch (error) {
      console.error('Error generating transcript:', error);
    }
  };

  // Generate certificate for course completion
  const generateCertificate = async (courseId: string, certificateType: string = 'course_completion') => {
    if (!user) return;

    try {
      const { data: certificateId, error } = await supabase.rpc('generate_certificate', {
        p_course_id: courseId,
        p_certificate_type: certificateType
      });

      if (error) throw error;

      toast({
        title: "Certificat généré",
        description: "Votre certificat a été créé avec succès"
      });

      // Refresh certificates
      await fetchCertificates();
      
      return certificateId;
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le certificat",
        variant: "destructive"
      });
    }
  };

  // Verify certificate by code
  const verifyCertificateByCode = async (verificationCode: string) => {
    try {
      const { data: cert, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('verification_code', verificationCode)
        .eq('is_active', true)
        .single();

      if (error || !cert) {
        return null;
      }

      // Get user profile separately
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', cert.user_id)
        .single();

      return {
        valid: true,
        certificate: cert,
        studentName: profile?.full_name || 'Étudiant',
        courseTitle: cert.title,
        issueDate: cert.issued_date,
        verificationCode: cert.verification_code
      };
    } catch (error) {
      console.error('Error verifying certificate:', error);
      return null;
    }
  };

  // Helper function to determine certificate type from grade
  const getCertificateTypeFromData = (type: string, grade?: number): Certificate['type'] => {
    if (type === 'mastery' || (grade && grade >= 95)) return 'mastery';
    if (type === 'excellence' || (grade && grade >= 90)) return 'excellence';
    return 'completion';
  };

  // Helper function to calculate credits from duration
  const calculateCreditsFromDuration = (duration?: string): number => {
    if (!duration) return 4;
    
    const hours = parseInt(duration.match(/\d+/)?.[0] || '40');
    return Math.round(hours / 10); // 10 hours = 1 credit
  };

  // Initialize data
  const initializeData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await fetchCertificates();
      // Generate transcript after certificates are loaded
      setTimeout(generateTranscript, 100);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      initializeData();
    }
  }, [user]);

  return {
    certificates,
    transcript,
    loading,
    generateCertificate,
    verifyCertificate: verifyCertificateByCode,
    refreshData: initializeData
  };
};