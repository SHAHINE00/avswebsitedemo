import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Calendar, Users } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import type { Course } from '@/hooks/useCourses';
import { logInfo } from '@/utils/logger';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { FormField } from '@/components/ui/FormField';
import { LoadingButton, FieldLoading } from '@/components/ui/LoadingStates';

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

// Move initial data outside component to prevent recreation
const INITIAL_FORM_DATA: FormData = {
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
};

const MultiStepRegistrationForm: React.FC<MultiStepRegistrationFormProps> = ({ onSubmit, loading }) => {
  // Render cycle protection
  const renderCountRef = React.useRef(0);
  renderCountRef.current += 1;
  
  if (renderCountRef.current > 50) {
    console.error('Too many renders detected, breaking cycle');
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center text-red-600">
          Erreur technique détectée. Veuillez rafraîchir la page.
        </div>
      </div>
    );
  }

  const { courses, loading: coursesLoading } = useCourses();
  
  // Form persistence with stable initial data
  const { data: formData, updateData: setFormData, clearData } = useFormPersistence<FormData>('registration-form', INITIAL_FORM_DATA);

  // Form validation
  const { errors, touched, validate, validateAll, touch, hasError, getError } = useFormValidation({
    firstName: { required: true, minLength: 2 },
    lastName: { required: true, minLength: 2 },
    email: { 
      required: true, 
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      custom: (value) => {
        const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
        const domain = value.split('@')[1];
        if (domain && !commonDomains.includes(domain) && !domain.includes('.')) {
          return 'Vérifiez le domaine de votre email';
        }
        return null;
      }
    },
    phone: { 
      pattern: /^(\+\d{1,3}[- ]?)?\d{8,15}$/,
      custom: (value) => {
        if (value && value.length < 8) {
          return 'Numéro de téléphone trop court';
        }
        return null;
      }
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

  // Memoize available courses to prevent recalculation on every render
  const availableCourses = React.useMemo(() => {
    if (!courses.length || !formData.formation.domaine) return [];
    
    const allCourses = courses.filter(course => course.status === 'published');
    
    const getCoursesForDomain = (domainValue: string): Course[] => {
      switch (domainValue) {
        case 'ai-data':
          return allCourses.filter(course => {
            const title = course.title.toLowerCase();
            const subtitle = course.subtitle?.toLowerCase() || '';
            
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

        case 'programming':
          return allCourses.filter(course => {
            const title = course.title.toLowerCase();
            const subtitle = course.subtitle?.toLowerCase() || '';
            
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

        case 'marketing':
          return allCourses.filter(course => {
            const title = course.title.toLowerCase();
            const subtitle = course.subtitle?.toLowerCase() || '';
            
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

        default:
          return [];
      }
    };

    return getCoursesForDomain(formData.formation.domaine);
  }, [courses, formData.formation.domaine]);

  // Memoize course count to prevent re-renders during Badge rendering
  const courseCount = React.useMemo(() => availableCourses.length, [availableCourses.length]);

  // Memoize course count text to prevent string recalculation during render
  const courseCountText = React.useMemo(() => 
    `${courseCount} programme${courseCount > 1 ? 's' : ''} disponible${courseCount > 1 ? 's' : ''}`,
    [courseCount]
  );

  // Prevent re-render loops by using stable references for effects
  const formationDomaineRef = React.useRef(formData.formation.domaine);
  const formationProgrammeRef = React.useRef(formData.formation.programme);

  // Reset downstream selections when domain changes
  React.useEffect(() => {
    // Only run if domain actually changed
    if (formationDomaineRef.current !== formData.formation.domaine) {
      const oldDomaine = formationDomaineRef.current;
      formationDomaineRef.current = formData.formation.domaine;
      
      // Only reset if there was a previous domain and it actually changed
      if (oldDomaine && formData.formation.domaine !== oldDomaine) {
        setFormData(prev => {
          // Only update if programme is currently set (to avoid unnecessary updates)
          if (prev.formation.programme || prev.formation.programmeDetails) {
            return {
              ...prev,
              formation: {
                ...prev.formation,
                programme: '',
                programmeDetails: undefined
              }
            };
          }
          return prev;
        });
      }
    }
  }, [formData.formation.domaine, setFormData]);

  // Update program details when programme selection changes
  React.useEffect(() => {
    // Only run if programme actually changed
    if (formationProgrammeRef.current !== formData.formation.programme) {
      formationProgrammeRef.current = formData.formation.programme;
      
      if (formData.formation.programme && availableCourses.length > 0) {
        const selectedCourse = availableCourses.find(course => course.id === formData.formation.programme);
        if (selectedCourse) {
          setFormData(prev => {
            // Only update if details actually changed
            if (!prev.formation.programmeDetails || prev.formation.programmeDetails.id !== selectedCourse.id) {
              return {
                ...prev,
                formation: {
                  ...prev.formation,
                  programmeDetails: selectedCourse
                }
              };
            }
            return prev;
          });
        }
      }
    }
  }, [formData.formation.programme, availableCourses, setFormData]);

  // Completely stable input change handler - no state updates during render
  const handleInputChange = React.useCallback((field: string, value: string) => {
    // Use setTimeout to ensure state updates happen after render cycle
    setTimeout(() => {
      // Auto-format phone numbers
      if (field === 'phone') {
        value = value.replace(/[^\d+\-\s]/g, ''); // Only allow digits, +, -, and spaces
        if (value.startsWith('0') && !value.startsWith('+')) {
          value = '+33 ' + value.slice(1); // Auto-convert French numbers
        }
      }

      // Auto-format email to lowercase
      if (field === 'email') {
        value = value.toLowerCase().trim();
      }

      // Auto-capitalize names
      if (field === 'firstName' || field === 'lastName') {
        value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      }

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
    }, 0);
  }, [setFormData]);

  // Stable field blur handler with validation
  const handleFieldBlur = React.useCallback((field: string, value: string) => {
    touch(field);
    validate(field, value);
  }, [touch, validate]);

  // Memoize form validation to prevent re-calculation during render
  const isFormValid = React.useMemo(() => {
    const basicFieldsValid = validateAll({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone
    });
    
    const formationValid = formData.formation.formationType &&
                          formData.formation.domaine &&
                          formData.formation.programme;

    return basicFieldsValid && formationValid;
  }, [
    formData.firstName,
    formData.lastName,
    formData.email,
    formData.phone,
    formData.formation.formationType,
    formData.formation.domaine,
    formData.formation.programme,
    validateAll
  ]);

  // Memoize step status calculation to prevent re-calculation during render
  const getStepStatus = React.useMemo(() => {
    return (step: number): 'completed' | 'current' | 'pending' => {
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
  }, [
    formData.formation.formationType,
    formData.formation.domaine,
    formData.formation.programme
  ]);

  // Memoize selected values to prevent re-calculation during render
  const selectedFormationType = React.useMemo(() => 
    formationTypes.find(type => type.value === formData.formation.formationType),
    [formData.formation.formationType]
  );
  
  const selectedDomaine = React.useMemo(() => 
    domaines.find(domain => domain.value === formData.formation.domaine),
    [formData.formation.domaine]
  );

  const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Touch all fields to show validation errors
    ['firstName', 'lastName', 'email', 'phone'].forEach(field => touch(field));
    
    if (isFormValid) {
      try {
        await onSubmit(formData);
        clearData(); // Clear saved form data on successful submission
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
  }, [formData, touch, isFormValid, onSubmit, clearData]);

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
              <FormField
                id="firstName"
                label="Prénom"
                value={formData.firstName}
                onChange={(value) => handleInputChange('firstName', value)}
                onBlur={() => handleFieldBlur('firstName', formData.firstName)}
                error={getError('firstName')}
                required
                placeholder="Votre prénom"
                autoComplete="given-name"
              />
              <FormField
                id="lastName"
                label="Nom"
                value={formData.lastName}
                onChange={(value) => handleInputChange('lastName', value)}
                onBlur={() => handleFieldBlur('lastName', formData.lastName)}
                error={getError('lastName')}
                required
                placeholder="Votre nom de famille"
                autoComplete="family-name"
              />
            </div>
            
            <FormField
              id="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              onBlur={() => handleFieldBlur('email', formData.email)}
              error={getError('email')}
              required
              placeholder="votre.email@exemple.com"
              autoComplete="email"
            />
            
            <FormField
              id="phone"
              label="Téléphone"
              type="tel"
              value={formData.phone}
              onChange={(value) => handleInputChange('phone', value)}
              onBlur={() => handleFieldBlur('phone', formData.phone)}
              error={getError('phone')}
              placeholder="+33 6 12 34 56 78"
              autoComplete="tel"
            />
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
              
                <FieldLoading loading={false}>
                  <div className="relative">
                    <Select 
                      value={formData.formation.formationType} 
                      onValueChange={(value) => handleInputChange('formation.formationType', value)}
                    >
                      <SelectTrigger className="w-full h-12 border-2 border-gray-200 hover:border-academy-blue transition-colors rounded-xl">
                        <SelectValue placeholder="Sélectionnez votre type de formation" className="text-gray-500" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2 shadow-xl max-h-[80vh] overflow-auto">
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
                  </div>
                </FieldLoading>
              
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
                
                <div className="relative">
                  <Select 
                    value={formData.formation.domaine} 
                    onValueChange={(value) => handleInputChange('formation.domaine', value)}
                  >
                    <SelectTrigger className="w-full h-12 border-2 border-gray-200 hover:border-academy-purple transition-colors rounded-xl">
                      <SelectValue placeholder="Choisissez votre domaine d'expertise" className="text-gray-500" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2 shadow-xl max-h-[80vh] overflow-auto">
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
                </div>
                
                {selectedDomaine && (
                  <div className="p-6 bg-gradient-to-r from-academy-purple/5 to-academy-blue/5 rounded-xl border-2 border-academy-purple/20 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="w-5 h-5 text-academy-purple" />
                      <span className="font-bold text-academy-purple text-lg">{selectedDomaine.label}</span>
                       <Badge variant="secondary" className="ml-auto bg-academy-purple/10 text-academy-purple font-semibold">
                         {courseCountText}
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
                
                <FieldLoading loading={coursesLoading}>
                  <div className="relative">
                    <Select 
                      value={formData.formation.programme} 
                      onValueChange={(value) => handleInputChange('formation.programme', value)}
                    >
                      <SelectTrigger className="w-full h-12 border-2 border-gray-200 hover:border-academy-blue transition-colors rounded-xl">
                        <SelectValue placeholder="Sélectionnez votre programme spécifique" className="text-gray-500" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[80vh] rounded-xl border-2 shadow-xl overflow-auto">
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
                  </div>
                </FieldLoading>
                
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
                disabled={!isFormValid || loading}
                className="w-full h-14 bg-gradient-to-r from-academy-blue to-academy-purple hover:from-academy-blue/90 hover:to-academy-purple/90 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LoadingButton
                  loading={loading}
                  loadingText="Inscription en cours..."
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6" />
                    Finaliser mon inscription
                  </div>
                </LoadingButton>
              </Button>
              
              {!isFormValid && (
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