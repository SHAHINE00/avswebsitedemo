import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Award, 
  Download, 
  Share2, 
  Eye, 
  Calendar,
  CheckCircle,
  Star,
  Trophy,
  FileText,
  Globe,
  Linkedin,
  Mail
} from 'lucide-react';

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

const DigitalCertificateSystem = () => {
  const [activeTab, setActiveTab] = useState('certificates');
  
  // Mock data - replace with real data from hooks
  const [certificates] = useState<Certificate[]>([
    {
      id: '1',
      courseTitle: 'Intelligence Artificielle Fondamentale',
      courseDuration: '40 heures',
      completionDate: new Date('2024-01-15'),
      grade: 92,
      certificateNumber: 'AVS-AI-2024-001',
      issuer: 'AVS Institute',
      skills: ['Machine Learning', 'Deep Learning', 'Python', 'TensorFlow'],
      type: 'excellence',
      verified: true,
      blockchainHash: '0x1234567890abcdef'
    },
    {
      id: '2',
      courseTitle: 'Programmation Python Avancée',
      courseDuration: '60 heures',
      completionDate: new Date('2024-02-20'),
      grade: 88,
      certificateNumber: 'AVS-PY-2024-002',
      issuer: 'AVS Institute',
      skills: ['Python', 'Django', 'FastAPI', 'Bases de données'],
      type: 'completion',
      verified: true
    },
    {
      id: '3',
      courseTitle: 'Cybersécurité Avancée',
      courseDuration: '80 heures',
      completionDate: new Date('2024-03-10'),
      grade: 96,
      certificateNumber: 'AVS-CY-2024-003',
      issuer: 'AVS Institute',
      skills: ['Sécurité réseau', 'Cryptographie', 'Audit sécurité', 'ISO 27001'],
      type: 'mastery',
      verified: true,
      blockchainHash: '0xabcdef1234567890'
    }
  ]);

  const [transcript] = useState<Transcript>({
    id: 'TR-2024-001',
    studentName: 'Mohamed Gozi',
    studentId: 'STU-2024-001',
    enrollmentDate: new Date('2023-09-01'),
    courses: [
      {
        title: 'Intelligence Artificielle Fondamentale',
        completionDate: new Date('2024-01-15'),
        grade: 92,
        credits: 6,
        duration: '40h'
      },
      {
        title: 'Programmation Python Avancée',
        completionDate: new Date('2024-02-20'),
        grade: 88,
        credits: 8,
        duration: '60h'
      },
      {
        title: 'Cybersécurité Avancée',
        completionDate: new Date('2024-03-10'),
        grade: 96,
        credits: 10,
        duration: '80h'
      }
    ],
    totalCredits: 24,
    gpa: 92
  });

  const getCertificateTypeColor = (type: Certificate['type']) => {
    switch (type) {
      case 'mastery': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'excellence': return 'bg-gradient-to-r from-blue-500 to-purple-600';
      case 'completion': return 'bg-gradient-to-r from-green-500 to-teal-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const getCertificateTypeIcon = (type: Certificate['type']) => {
    switch (type) {
      case 'mastery': return <Trophy className="h-6 w-6" />;
      case 'excellence': return <Star className="h-6 w-6" />;
      case 'completion': return <Award className="h-6 w-6" />;
      default: return <Award className="h-6 w-6" />;
    }
  };

  const getCertificateTypeName = (type: Certificate['type']) => {
    switch (type) {
      case 'mastery': return 'Maîtrise';
      case 'excellence': return 'Excellence';
      case 'completion': return 'Completion';
      default: return 'Certificat';
    }
  };

  const downloadCertificate = (certificate: Certificate) => {
    // Implementation for PDF generation and download
    console.log('Downloading certificate:', certificate.id);
  };

  const shareCertificate = (certificate: Certificate, platform: 'linkedin' | 'email' | 'copy') => {
    const certificateUrl = `https://avsinstitute.com/verify/${certificate.certificateNumber}`;
    
    switch (platform) {
      case 'linkedin':
        const linkedinUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(certificate.courseTitle)}&organizationName=${encodeURIComponent(certificate.issuer)}&issueYear=${certificate.completionDate.getFullYear()}&issueMonth=${certificate.completionDate.getMonth() + 1}&certUrl=${encodeURIComponent(certificateUrl)}`;
        window.open(linkedinUrl, '_blank');
        break;
      case 'email':
        const subject = `Certificat: ${certificate.courseTitle}`;
        const body = `Je viens de terminer avec succès le cours "${certificate.courseTitle}" avec une note de ${certificate.grade}%. Vous pouvez vérifier mon certificat ici: ${certificateUrl}`;
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(certificateUrl);
        break;
    }
  };

  const verifyCertificate = (certificateNumber: string) => {
    window.open(`https://avsinstitute.com/verify/${certificateNumber}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Certificats & Diplômes</h2>
          <p className="text-muted-foreground">
            Vos certificats numériques vérifiés et votre relevé de notes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Relevé complet
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="certificates">Certificats</TabsTrigger>
          <TabsTrigger value="transcript">Relevé de Notes</TabsTrigger>
          <TabsTrigger value="verification">Vérification</TabsTrigger>
        </TabsList>

        <TabsContent value="certificates" className="space-y-4">
          <div className="grid gap-6">
            {certificates.map((certificate) => (
              <Card key={certificate.id} className="overflow-hidden">
                <div className={`h-2 ${getCertificateTypeColor(certificate.type)}`} />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg text-white ${getCertificateTypeColor(certificate.type)}`}>
                        {getCertificateTypeIcon(certificate.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{certificate.courseTitle}</CardTitle>
                        <CardDescription>
                          Certificat de {getCertificateTypeName(certificate.type)} • {certificate.courseDuration}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {certificate.verified && (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Vérifié
                        </Badge>
                      )}
                      <Badge variant="outline">
                        Note: {certificate.grade}%
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Compétences acquises</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {certificate.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Détails du certificat</p>
                        <div className="space-y-1 mt-1">
                          <p className="text-xs">N° {certificate.certificateNumber}</p>
                          <p className="text-xs">Délivré le {certificate.completionDate.toLocaleDateString()}</p>
                          <p className="text-xs">Émetteur: {certificate.issuer}</p>
                          {certificate.blockchainHash && (
                            <p className="text-xs text-green-600">Sécurisé sur blockchain</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t">
                      <Button 
                        onClick={() => downloadCertificate(certificate)}
                        variant="default"
                        size="sm"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger PDF
                      </Button>
                      <Button 
                        onClick={() => verifyCertificate(certificate.certificateNumber)}
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir en ligne
                      </Button>
                      <Button 
                        onClick={() => shareCertificate(certificate, 'linkedin')}
                        variant="outline"
                        size="sm"
                      >
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                      <Button 
                        onClick={() => shareCertificate(certificate, 'email')}
                        variant="outline"
                        size="sm"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Partager
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transcript" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Relevé de Notes Officiel
              </CardTitle>
              <CardDescription>
                Transcript académique complet de votre parcours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Student Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Étudiant</p>
                    <p className="text-lg font-bold">{transcript.studentName}</p>
                    <p className="text-sm text-muted-foreground">ID: {transcript.studentId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Période d'études</p>
                    <p className="text-sm">
                      Du {transcript.enrollmentDate.toLocaleDateString()} à aujourd'hui
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transcript.totalCredits} crédits • Moyenne: {transcript.gpa}%
                    </p>
                  </div>
                </div>

                {/* Course List */}
                <div>
                  <h4 className="font-medium mb-4">Formations Complétées</h4>
                  <div className="space-y-2">
                    {transcript.courses.map((course, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Terminé le {course.completionDate.toLocaleDateString()} • {course.duration}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{course.grade}%</p>
                          <p className="text-sm text-muted-foreground">{course.credits} crédits</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-primary/5 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{transcript.courses.length}</p>
                    <p className="text-sm text-muted-foreground">Formations terminées</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{transcript.totalCredits}</p>
                    <p className="text-sm text-muted-foreground">Crédits obtenus</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{transcript.gpa}%</p>
                    <p className="text-sm text-muted-foreground">Moyenne générale</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Vérification de Certificats
              </CardTitle>
              <CardDescription>
                Vérifiez l'authenticité des certificats AVS Institute
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-6 border-2 border-dashed border-muted rounded-lg text-center">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Portail de Vérification Public</h3>
                  <p className="text-muted-foreground mb-4">
                    Permettez aux employeurs et institutions de vérifier l'authenticité de vos certificats
                  </p>
                  <Button>
                    <Globe className="h-4 w-4 mr-2" />
                    Accéder au portail public
                  </Button>
                </div>

                <div className="grid gap-4">
                  <h4 className="font-medium">Vos Certificats Vérifiables</h4>
                  {certificates.filter(cert => cert.verified).map((certificate) => (
                    <div key={certificate.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{certificate.courseTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {certificate.certificateNumber}
                        </p>
                        {certificate.blockchainHash && (
                          <p className="text-xs text-green-600">
                            Hash blockchain: {certificate.blockchainHash}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Vérifié
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => verifyCertificate(certificate.certificateNumber)}
                        >
                          Vérifier
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DigitalCertificateSystem;