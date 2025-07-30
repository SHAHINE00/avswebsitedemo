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
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-academy-blue to-academy-purple text-white rounded-t-lg">
            <CardTitle className="text-xl font-bold">Informations personnelles</CardTitle>
            <CardDescription className="text-blue-100">
              Veuillez remplir vos informations de base pour créer votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">
                  Prénom <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                  className="h-12 border-2 border-gray-200 focus:border-academy-blue rounded-lg"
                  placeholder="Votre prénom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">
                  Nom <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                  className="h-12 border-2 border-gray-200 focus:border-academy-blue rounded-lg"
                  placeholder="Votre nom de famille"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="h-12 border-2 border-gray-200 focus:border-academy-blue rounded-lg"
                placeholder="votre.email@exemple.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                Téléphone
              </Label>
              <Input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="h-12 border-2 border-gray-200 focus:border-academy-blue rounded-lg"
                placeholder="+xx x xx xx xx xx"
              />
            </div>
          </CardContent>
        </Card>

        {/* Formation Selection */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-academy-purple to-academy-blue text-white rounded-t-lg">
            <CardTitle className="text-xl font-bold">Choix de Formation</CardTitle>
            <CardDescription className="text-purple-100">
              Sélectionnez votre parcours de formation personnalisé en 3 étapes simples
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-10">
            {/* Step indicators */}
            <div className="flex items-center justify-center mb-12">
              <div className="flex items-center space-x-8 relative">
                {[1, 2, 3].map((step) => {
                  const status = getStepStatus(step);
                  const stepLabels = ['Type', 'Domaine', 'Programme'];
                  return (
                    <div key={step} className="flex flex-col items-center relative">
                      <div className={`flex items-center justify-center w-14 h-14 rounded-full border-3 transition-all duration-300 ${
                        status === 'completed' ? 'bg-academy-blue border-academy-blue text-white shadow-lg' :
                        status === 'current' ? 'border-academy-blue text-academy-blue bg-blue-50 shadow-md' :
                        'border-gray-300 text-gray-400 bg-gray-50'
                      }`}>
                        {status === 'completed' ? (
                          <CheckCircle2 className="w-7 h-7" />
                        ) : (
                          <span className="text-lg font-bold">{step}</span>
                        )}
                      </div>
                      <span className={`mt-2 text-sm font-medium ${
                        status === 'completed' || status === 'current' ? 'text-academy-blue' : 'text-gray-400'
                      }`}>
                        {stepLabels[step - 1]}
                      </span>
                      {step < 3 && (
                        <div className={`absolute w-24 h-1 mt-7 left-14 ${
                          getStepStatus(step + 1) === 'completed' ? 'bg-academy-blue' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 1: Formation Type */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  getStepStatus(1) === 'completed' ? 'bg-academy-blue text-white' : 
                  getStepStatus(1) === 'current' ? 'bg-academy-blue text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-800">Type de Formation</h3>
              </div>
              
              <Select 
                value={formData.formation.formationType} 
                onValueChange={(value) => handleInputChange('formation.formationType', value)}
              >
                <SelectTrigger className="w-full h-16 border-2 border-gray-200 hover:border-academy-blue transition-colors rounded-xl">
                  <SelectValue placeholder="Sélectionnez votre type de formation" className="text-gray-500" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 shadow-xl">
                  {formationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="h-auto p-4 hover:bg-blue-50 cursor-pointer">
                      <div className="space-y-2">
                        <div className="font-semibold text-gray-800">{type.label}</div>
                        <div className="text-sm text-gray-600 leading-relaxed">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedFormationType && (
                <div className="p-6 bg-gradient-to-r from-academy-blue/5 to-academy-purple/5 rounded-xl border-2 border-academy-blue/20 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-academy-blue" />
                    <span className="font-bold text-academy-blue text-lg">{selectedFormationType.label}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{selectedFormationType.description}</p>
                </div>
              )}
            </div>

            {/* Step 2: Domain */}
            {formData.formation.formationType && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    getStepStatus(2) === 'completed' ? 'bg-academy-blue text-white' : 
                    getStepStatus(2) === 'current' ? 'bg-academy-blue text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    2
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Domaine d'Expertise</h3>
                </div>
                
                <Select 
                  value={formData.formation.domaine} 
                  onValueChange={(value) => handleInputChange('formation.domaine', value)}
                >
                  <SelectTrigger className="w-full h-16 border-2 border-gray-200 hover:border-academy-purple transition-colors rounded-xl">
                    <SelectValue placeholder="Choisissez votre domaine d'expertise" className="text-gray-500" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 shadow-xl">
                    {domaines.map((domaine) => (
                      <SelectItem key={domaine.value} value={domaine.value} className="h-auto p-4 hover:bg-purple-50 cursor-pointer">
                        <div className="space-y-2">
                          <div className="font-semibold text-gray-800">{domaine.label}</div>
                          <div className="text-sm text-gray-600 leading-relaxed">{domaine.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedDomaine && (
                  <div className="p-6 bg-gradient-to-r from-academy-purple/5 to-academy-blue/5 rounded-xl border-2 border-academy-purple/20 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="w-5 h-5 text-academy-purple" />
                      <span className="font-bold text-academy-purple text-lg">{selectedDomaine.label}</span>
                      <Badge variant="secondary" className="ml-auto bg-academy-purple/10 text-academy-purple font-semibold">
                        {availableCourses.length} programme{availableCourses.length > 1 ? 's' : ''} disponible{availableCourses.length > 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{selectedDomaine.description}</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Programme */}
            {formData.formation.domaine && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    getStepStatus(3) === 'completed' ? 'bg-academy-blue text-white' : 
                    getStepStatus(3) === 'current' ? 'bg-academy-blue text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    3
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Programme Spécifique</h3>
                </div>
                
                {coursesLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-academy-blue border-t-transparent"></div>
                    <p className="text-gray-600 mt-4 font-medium">Chargement des programmes disponibles...</p>
                  </div>
                ) : (
                  <Select 
                    value={formData.formation.programme} 
                    onValueChange={(value) => handleInputChange('formation.programme', value)}
                  >
                    <SelectTrigger className="w-full h-16 border-2 border-gray-200 hover:border-academy-blue transition-colors rounded-xl">
                      <SelectValue placeholder="Sélectionnez votre programme spécifique" className="text-gray-500" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[400px] rounded-xl border-2 shadow-xl">
                      {availableCourses.length === 0 ? (
                        <div className="py-8 px-6 text-center">
                          <div className="text-gray-500 text-lg font-medium">Aucun programme disponible</div>
                          <div className="text-gray-400 text-sm mt-2">pour ce domaine actuellement</div>
                        </div>
                      ) : (
                        availableCourses.map((course) => (
                          <SelectItem key={course.id} value={course.id} className="h-auto p-4 hover:bg-green-50 cursor-pointer">
                            <div className="space-y-2">
                              <div className="font-semibold text-gray-800">{course.title}</div>
                              {course.subtitle && (
                                <div className="text-sm text-gray-600 leading-relaxed">{course.subtitle}</div>
                              )}
                              {course.duration && (
                                <div className="text-xs text-academy-blue font-medium bg-academy-blue/10 px-2 py-1 rounded-full inline-block">
                                  {course.duration}
                                </div>
                              )}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
                
                {formData.formation.programmeDetails && (
                  <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200 shadow-sm">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <div className="space-y-3">
                        <h4 className="font-bold text-green-800 text-lg">{formData.formation.programmeDetails.title}</h4>
                        {formData.formation.programmeDetails.subtitle && (
                          <p className="text-gray-700 leading-relaxed">{formData.formation.programmeDetails.subtitle}</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {formData.formation.programmeDetails.duration && (
                            <Badge className="bg-academy-blue text-white">
                              {formData.formation.programmeDetails.duration}
                            </Badge>
                          )}
                          {formData.formation.programmeDetails.modules && (
                            <Badge variant="outline" className="border-academy-purple text-academy-purple">
                              {formData.formation.programmeDetails.modules}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Terms and Submit */}
        <Card className="shadow-lg border-0 bg-white">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 h-5 w-5 text-academy-blue border-2 border-gray-300 rounded focus:ring-academy-blue"
                />
                <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold">J'accepte les conditions générales</span> et la politique de confidentialité d'AVS Innovation Institute. 
                  Je comprends que mes données seront utilisées pour le processus d'inscription et la communication relative à ma formation.
                </label>
              </div>
              
              <Button 
                type="submit" 
                disabled={!isFormValid() || loading}
                className="w-full h-14 bg-gradient-to-r from-academy-blue to-academy-purple hover:from-academy-blue/90 hover:to-academy-purple/90 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Inscription en cours...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6" />
                    Finaliser mon inscription
                  </div>
                )}
              </Button>
              
              {!isFormValid() && (
                <div className="text-center">
                  <p className="text-red-600 text-sm font-medium">
                    Veuillez remplir tous les champs obligatoires pour continuer
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default MultiStepRegistrationForm;