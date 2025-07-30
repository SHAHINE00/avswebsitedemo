import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Users, Calendar } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import type { Course } from '@/hooks/useCourses';

interface FormationData {
  formationType: string;
  domaine: string;
  programme: string;
  programmeDetails?: Course;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  formation: FormationData;
}

interface MultiStepRegistrationFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  loading: boolean;
}

const MultiStepRegistrationForm: React.FC<MultiStepRegistrationFormProps> = ({ onSubmit, loading }) => {
  const { courses, loading: coursesLoading } = useCourses();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    formation: {
      formationType: '',
      domaine: '',
      programme: '',
      programmeDetails: undefined
    }
  });

  // Formation type options
  const formationTypes = [
    {
      value: 'complete',
      label: 'Formation Professionnelle Complète (2 ans)',
      description: 'Programme intensif avec certification internationale'
    },
    {
      value: 'certificate',
      label: 'Certificat International (Courte durée)',
      description: 'Formation spécialisée de 6 à 12 mois'
    }
  ];

  // Domain options
  const domaines = [
    {
      value: 'ai-data',
      label: 'Intelligence Artificielle & Data Science',
      description: 'IA, Machine Learning, Data Science, Business Intelligence'
    },
    {
      value: 'programming',
      label: 'Programmation & Infrastructure',
      description: 'Développement, Cloud, Cybersécurité, DevOps'
    },
    {
      value: 'marketing',
      label: 'Marketing Digital & Créatif',
      description: 'Marketing Digital, E-commerce, Design, Réseaux Sociaux'
    }
  ];

  // Filter courses based on selected domain
  const getCoursesForDomain = (domainValue: string): Course[] => {
    if (!courses.length) return [];

    const allCourses = courses.filter(course => course.status === 'published');
    console.log('Available courses:', allCourses.map(c => c.title));

    switch (domainValue) {
      case 'ai-data':
        const aiCourses = allCourses.filter(course => {
          const title = course.title.toLowerCase();
          const subtitle = course.subtitle?.toLowerCase() || '';
          
          // AI & Data Science keywords
          const aiKeywords = [
            'ia', 'ai', 'intelligence artificielle', 'artificial intelligence',
            'machine learning', 'deep learning', 'data science', 'data analysis',
            'business intelligence', 'computer vision', 'opencv', 'python',
            'scikit-learn', 'tensorflow', 'neural network', 'algorithm',
            'statistics', 'analytics', 'prediction', 'modeling'
          ];
          
          return aiKeywords.some(keyword => 
            title.includes(keyword) || subtitle.includes(keyword)
          );
        });
        console.log('AI courses filtered:', aiCourses.map(c => c.title));
        return aiCourses;

      case 'programming':
        const programmingCourses = allCourses.filter(course => {
          const title = course.title.toLowerCase();
          const subtitle = course.subtitle?.toLowerCase() || '';
          
          // Programming & Infrastructure keywords
          const progKeywords = [
            'programmation', 'programming', 'développement', 'development',
            'web', 'mobile', 'app', 'database', 'cloud', 'devops',
            'cybersécurité', 'cybersecurity', 'blockchain', 'iot',
            'html', 'css', 'javascript', 'python', 'java', 'react',
            'node', 'sql', 'aws', 'azure', 'docker', 'kubernetes'
          ];
          
          return progKeywords.some(keyword => 
            title.includes(keyword) || subtitle.includes(keyword)
          );
        });
        console.log('Programming courses filtered:', programmingCourses.map(c => c.title));
        return programmingCourses;

      case 'marketing':
        const marketingCourses = allCourses.filter(course => {
          const title = course.title.toLowerCase();
          const subtitle = course.subtitle?.toLowerCase() || '';
          
          // Marketing & Creative keywords
          const marketingKeywords = [
            'marketing', 'digital', 'e-commerce', 'social media',
            'content', 'design', 'créatif', 'creative', 'video',
            'photoshop', 'illustrator', 'excel', 'analytics',
            'seo', 'sem', 'advertising', 'brand', 'communication'
          ];
          
          return marketingKeywords.some(keyword => 
            title.includes(keyword) || subtitle.includes(keyword)
          );
        });
        console.log('Marketing courses filtered:', marketingCourses.map(c => c.title));
        return marketingCourses;

      default:
        return [];
    }
  };

  const availableCourses = getCoursesForDomain(formData.formation.domaine);

  // Reset downstream selections when upstream changes
  useEffect(() => {
    if (formData.formation.domaine) {
      setFormData(prev => ({
        ...prev,
        formation: {
          ...prev.formation,
          programme: '',
          programmeDetails: undefined
        }
      }));
    }
  }, [formData.formation.domaine]);

  useEffect(() => {
    if (formData.formation.programme) {
      const selectedCourse = availableCourses.find(course => course.id === formData.formation.programme);
      setFormData(prev => ({
        ...prev,
        formation: {
          ...prev.formation,
          programmeDetails: selectedCourse
        }
      }));
    }
  }, [formData.formation.programme, availableCourses]);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('formation.')) {
      const formationField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        formation: {
          ...prev.formation,
          [formationField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const isFormValid = () => {
    return formData.firstName &&
           formData.lastName &&
           formData.email &&
           formData.password &&
           formData.formation.formationType &&
           formData.formation.domaine &&
           formData.formation.programme;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      await onSubmit(formData);
    }
  };

  const getStepStatus = (step: number): 'completed' | 'current' | 'pending' => {
    switch (step) {
      case 1:
        return formData.formation.formationType ? 'completed' : 'current';
      case 2:
        if (!formData.formation.formationType) return 'pending';
        return formData.formation.domaine ? 'completed' : 'current';
      case 3:
        if (!formData.formation.domaine) return 'pending';
        return formData.formation.programme ? 'completed' : 'current';
      default:
        return 'pending';
    }
  };

  const selectedFormationType = formationTypes.find(type => type.value === formData.formation.formationType);
  const selectedDomaine = domaines.find(domain => domain.value === formData.formation.domaine);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>Veuillez remplir vos informations de base</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">Mot de passe *</Label>
            <Input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              minLength={6}
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Formation Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choix de Formation</CardTitle>
          <CardDescription>Sélectionnez votre parcours de formation en 3 étapes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Step indicators */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((step) => {
              const status = getStepStatus(step);
              return (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    status === 'completed' ? 'bg-academy-blue border-academy-blue text-white' :
                    status === 'current' ? 'border-academy-blue text-academy-blue' :
                    'border-gray-300 text-gray-300'
                  }`}>
                    {status === 'completed' ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </div>
                  {step < 3 && (
                    <div className={`w-20 h-0.5 mx-4 ${
                      getStepStatus(step + 1) === 'completed' ? 'bg-academy-blue' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step 1: Formation Type */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                getStepStatus(1) === 'completed' ? 'bg-academy-blue text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <Label className="text-lg font-semibold">Type de Formation</Label>
            </div>
            
            <Select 
              value={formData.formation.formationType} 
              onValueChange={(value) => handleInputChange('formation.formationType', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisissez votre type de formation" />
              </SelectTrigger>
              <SelectContent>
                {formationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="py-2">
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-gray-500">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedFormationType && (
              <div className="p-4 bg-academy-blue/5 rounded-lg border border-academy-blue/20">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-academy-blue" />
                  <span className="font-medium text-academy-blue">{selectedFormationType.label}</span>
                </div>
                <p className="text-sm text-gray-600">{selectedFormationType.description}</p>
              </div>
            )}
          </div>

          {/* Step 2: Domain */}
          {formData.formation.formationType && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                  getStepStatus(2) === 'completed' ? 'bg-academy-blue text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <Label className="text-lg font-semibold">Domaine</Label>
              </div>
              
              <Select 
                value={formData.formation.domaine} 
                onValueChange={(value) => handleInputChange('formation.domaine', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisissez votre domaine d'expertise" />
                </SelectTrigger>
                <SelectContent>
                  {domaines.map((domaine) => (
                    <SelectItem key={domaine.value} value={domaine.value}>
                      <div className="py-2">
                        <div className="font-medium">{domaine.label}</div>
                        <div className="text-sm text-gray-500">{domaine.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
               {selectedDomaine && (
                 <div className="p-4 bg-academy-purple/5 rounded-lg border border-academy-purple/20">
                   <div className="flex items-center gap-2 mb-2">
                     <Users className="w-4 h-4 text-academy-purple" />
                     <span className="font-medium text-academy-purple">{selectedDomaine.label}</span>
                     <Badge variant="secondary" className="ml-auto">
                       {availableCourses.length} programme{availableCourses.length > 1 ? 's' : ''}
                     </Badge>
                   </div>
                   <p className="text-sm text-gray-600">{selectedDomaine.description}</p>
                 </div>
               )}
            </div>
          )}

          {/* Step 3: Programme */}
          {formData.formation.domaine && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                  getStepStatus(3) === 'completed' ? 'bg-academy-blue text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  3
                </div>
                <Label className="text-lg font-semibold">Programme Spécifique</Label>
              </div>
              
              {coursesLoading ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-academy-blue"></div>
                  <p className="text-sm text-gray-500 mt-2">Chargement des programmes...</p>
                </div>
              ) : (
                <Select 
                  value={formData.formation.programme} 
                  onValueChange={(value) => handleInputChange('formation.programme', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choisissez votre programme spécifique" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {availableCourses.length === 0 ? (
                      <div className="py-4 px-3 text-center text-sm text-muted-foreground">
                        Aucun programme disponible pour ce domaine
                      </div>
                    ) : (
                      availableCourses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          <div className="py-2">
                            <div className="font-medium">{course.title}</div>
                            {course.subtitle && (
                              <div className="text-sm text-muted-foreground">{course.subtitle}</div>
                            )}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
              
              {formData.formation.programmeDetails && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-green-800">{formData.formation.programmeDetails.title}</h4>
                      {formData.formation.programmeDetails.subtitle && (
                        <p className="text-sm text-green-600">{formData.formation.programmeDetails.subtitle}</p>
                      )}
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Sélectionné
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {formData.formation.programmeDetails.duration && (
                      <div>
                        <span className="text-green-600">Durée:</span>
                        <span className="ml-1 text-green-800">{formData.formation.programmeDetails.duration}</span>
                      </div>
                    )}
                    {formData.formation.programmeDetails.diploma && (
                      <div>
                        <span className="text-green-600">Diplôme:</span>
                        <span className="ml-1 text-green-800">{formData.formation.programmeDetails.diploma}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Terms and Submit */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1"
              required
            />
            <span className="text-sm text-gray-700">
              J'accepte les conditions générales et la politique de confidentialité d'AVS Innovation Institute
            </span>
          </label>
          
          <Button 
            type="submit" 
            disabled={loading || !isFormValid()}
            className="w-full bg-academy-blue hover:bg-academy-purple text-white font-semibold py-3"
          >
            {loading ? 'Inscription en cours...' : 'Finaliser mon inscription'}
          </Button>
          
          {!isFormValid() && (
            <p className="text-sm text-red-600 text-center">
              Veuillez remplir tous les champs obligatoires et sélectionner un programme complet.
            </p>
          )}
        </CardContent>
      </Card>
    </form>
  );
};

export default MultiStepRegistrationForm;