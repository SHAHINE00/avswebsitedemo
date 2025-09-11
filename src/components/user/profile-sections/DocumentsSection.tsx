import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Eye, 
  Award, 
  BookOpen, 
  Calendar,
  ExternalLink,
  FileCheck,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Document {
  id: string;
  title: string;
  type: 'certificate' | 'transcript' | 'completion' | 'attendance';
  course_title?: string;
  issue_date: string;
  file_url?: string;
  status: 'available' | 'pending' | 'processing';
}

interface CompletedCourse {
  id: string;
  course_title: string;
  completion_date: string;
  final_grade?: number;
  certificate_available: boolean;
}

const DocumentsSection = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [completedCourses, setCompletedCourses] = useState<CompletedCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
    fetchCompletedCourses();
  }, [user]);

  const fetchDocuments = async () => {
    // Simulated documents data - in real app, this would come from your documents table
    const mockDocuments: Document[] = [
      {
        id: '1',
        title: 'Relevé de notes général',
        type: 'transcript',
        issue_date: '2024-01-15',
        status: 'available'
      },
      {
        id: '2',
        title: 'Certificat de fin de formation - IA & Machine Learning',
        type: 'certificate',
        course_title: 'Formation IA & Machine Learning',
        issue_date: '2024-01-10',
        status: 'available'
      },
      {
        id: '3',
        title: 'Attestation de présence - Cybersécurité',
        type: 'attendance',
        course_title: 'Formation Cybersécurité',
        issue_date: '2024-01-05',
        status: 'pending'
      }
    ];

    setDocuments(mockDocuments);
  };

  const fetchCompletedCourses = async () => {
    if (!user) return;

    try {
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select(`
          id,
          completion_date,
          courses (
            title
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .not('completion_date', 'is', null);

      if (enrollments) {
        const completed = enrollments.map(enrollment => ({
          id: enrollment.id,
          course_title: (enrollment.courses as any)?.title || 'Formation inconnue',
          completion_date: enrollment.completion_date!,
          certificate_available: true,
          final_grade: Math.floor(Math.random() * 20) + 80 // Mock grade
        }));
        setCompletedCourses(completed);
      }
    } catch (error) {
      console.error('Error fetching completed courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'certificate':
        return <Award className="h-5 w-5 text-yellow-600" />;
      case 'transcript':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'completion':
        return <FileCheck className="h-5 w-5 text-green-600" />;
      case 'attendance':
        return <Calendar className="h-5 w-5 text-purple-600" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">En traitement</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleDownload = (documentId: string) => {
    // Mock download functionality
    console.log('Downloading document:', documentId);
    // In a real app, you would generate or fetch the actual document
  };

  const handleGenerateCertificate = (courseId: string) => {
    // Mock certificate generation
    console.log('Generating certificate for course:', courseId);
    // In a real app, this would trigger certificate generation
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Documents Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Award className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Certificats</div>
                <div className="font-semibold">{documents.filter(d => d.type === 'certificate').length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Relevés</div>
                <div className="font-semibold">{documents.filter(d => d.type === 'transcript').length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <GraduationCap className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Formations complétées</div>
                <div className="font-semibold">{completedCourses.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun document disponible</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((document) => (
                <div key={document.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getDocumentIcon(document.type)}
                      <div className="flex-1">
                        <h4 className="font-semibold">{document.title}</h4>
                        {document.course_title && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Formation: {document.course_title}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Émis le {new Date(document.issue_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(document.status)}
                      {document.status === 'available' && (
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(document.id)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            Voir
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDownload(document.id)}
                            className="flex items-center gap-1"
                          >
                            <Download className="h-4 w-4" />
                            Télécharger
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Courses - Certificate Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Formations complétées
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedCourses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune formation complétée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedCourses.map((course) => (
                <div key={course.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{course.course_title}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Complétée le {new Date(course.completion_date).toLocaleDateString()}
                        </div>
                        {course.final_grade && (
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4" />
                            Note: {course.final_grade}/100
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {course.certificate_available ? (
                        <Badge className="bg-green-100 text-green-800">Certificat disponible</Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">Certificat en préparation</Badge>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateCertificate(course.id)}
                        className="flex items-center gap-1"
                        disabled={!course.certificate_available}
                      >
                        <Award className="h-4 w-4" />
                        Générer le certificat
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Aide et informations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-1">📋 Relevés de notes</h5>
            <p className="text-sm text-blue-800">
              Vos relevés de notes sont générés automatiquement et incluent toutes vos formations complétées avec les notes obtenues.
            </p>
          </div>
          
          <div className="p-3 bg-yellow-50 rounded-lg">
            <h5 className="font-medium text-yellow-900 mb-1">🏆 Certificats</h5>
            <p className="text-sm text-yellow-800">
              Les certificats sont disponibles immédiatement après la validation finale de votre formation.
            </p>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg">
            <h5 className="font-medium text-green-900 mb-1">✅ Attestations</h5>
            <p className="text-sm text-green-800">
              Les attestations de présence sont générées pour toutes les sessions auxquelles vous avez participé.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsSection;