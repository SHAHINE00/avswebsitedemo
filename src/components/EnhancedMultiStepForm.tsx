import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedFormField } from '@/components/ui/EnhancedFormField';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { LoadingButton } from '@/components/ui/LoadingStates';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useFormProgress } from '@/hooks/useFormProgress';
import { usePhoneFormatter } from '@/hooks/usePhoneFormatter';
import { useCourses } from '@/hooks/useCourses';
import { useToast } from '@/hooks/use-toast';
import { useIsAndroid, useIsIOS } from '@/hooks/use-mobile-simple';
import { cn } from '@/lib/utils';
import { AlertTriangle, RefreshCw, CheckCircle2, Calendar, Users, Star, Loader2, CheckCircle, X } from 'lucide-react';

interface FormationData {
  formationType: string;
  domaine: string;
  programme: string;
  programmeDetails?: any;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  formation: FormationData;
  acceptTerms: boolean;
}

interface EnhancedMultiStepFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  loading: boolean;
  submissionStatus?: 'idle' | 'submitting' | 'success' | 'error';
  statusMessage?: string;
}

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
  },
  acceptTerms: false
};

const EnhancedMultiStepForm: React.FC<EnhancedMultiStepFormProps> = ({ 
  onSubmit, 
  loading,
  submissionStatus = 'idle',
  statusMessage
}) => {
  const [inlineStatus, setInlineStatus] = React.useState<{
    type: 'idle' | 'submitting' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });
  const { data: formData, updateData } = useFormPersistence<FormData>(
    'enhanced-registration-form',
    INITIAL_FORM_DATA
  );

  const { courses, loading: coursesLoading } = useCourses();
  const { validateEmail, getValidationResult, isValidating: emailValidating } = useEmailValidation();
  const networkStatus = useNetworkStatus();
  const { formatPhone, validatePhone } = usePhoneFormatter();
  const { toast } = useToast();
  
  // Device detection for responsive optimization
  const isAndroid = useIsAndroid();
  const isIOS = useIsIOS();

  const { 
    errors, 
    touched, 
    validate, 
    validateAll, 
    touch, 
    hasError, 
    getError,
    isValidating
  } = useFormValidation({
    firstName: { required: true, minLength: 2 },
    lastName: { required: true, minLength: 2 },
    email: { 
      required: true, 
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      asyncValidator: async (email: string) => {
        const result = getValidationResult(email);
        if (result?.isDuplicate) return 'Cette adresse email est déjà enregistrée';
        if (result?.suggestion) return `Vouliez-vous dire ${result.suggestion} ?`;
        return null;
      }
    },
    phone: { required: true },
    'formation.formationType': { required: true },
    'formation.domaine': { required: true },
    'formation.programme': { required: true },
    acceptTerms: { required: true }
  });

  const { progress, markSaved, getSavedStatus } = useFormProgress(formData, {
    steps: {
      'Informations personnelles': {
        fields: ['firstName', 'lastName', 'email', 'phone']
      },
      'Type de formation': {
        fields: ['formation.formationType', 'formation.domaine']
      },
      'Programme spécifique': {
        fields: ['formation.programme']
      },
      'Finalisation': {
        fields: ['acceptTerms']
      }
    }
  });

  // Formation options
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

  // Filter courses by domain
  const availableCourses = React.useMemo(() => {
    if (!courses.length || !formData.formation.domaine) return [];
    
    const publishedCourses = courses.filter(course => course.status === 'published');
    
    switch (formData.formation.domaine) {
      case 'ai-data':
        return publishedCourses.filter(course => {
          const searchText = `${course.title} ${course.subtitle || ''}`.toLowerCase();
          const keywords = ['ia', 'ai', 'intelligence', 'machine learning', 'data', 'python', 'analytics'];
          return keywords.some(keyword => searchText.includes(keyword));
        });
      case 'programming':
        return publishedCourses.filter(course => {
          const searchText = `${course.title} ${course.subtitle || ''}`.toLowerCase();
          const keywords = ['programmation', 'programming', 'web', 'mobile', 'cybersécurité', 'cloud'];
          return keywords.some(keyword => searchText.includes(keyword));
        });
      case 'marketing':
        return publishedCourses.filter(course => {
          const searchText = `${course.title} ${course.subtitle || ''}`.toLowerCase();
          const keywords = ['marketing', 'digital', 'design', 'créatif', 'social', 'commerce'];
          return keywords.some(keyword => searchText.includes(keyword));
        });
      default:
        return [];
    }
  }, [courses, formData.formation.domaine]);

  const handleInputChange = React.useCallback((field: string, value: string) => {
    let processedValue = value;
    
    if (field === 'email') {
      processedValue = value.toLowerCase().trim();
      if (processedValue) {
        validateEmail(processedValue);
      }
    } else if (field === 'phone') {
      processedValue = formatPhone(value);
    } else if (field === 'firstName' || field === 'lastName') {
      processedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
    
    updateData({ [field]: processedValue });
    setTimeout(markSaved, 1000);
  }, [updateData, validateEmail, formatPhone, markSaved]);

  const handleFormationChange = React.useCallback((field: string, value: string) => {
    updateData(prev => {
      const formationField = field.split('.')[1];
      let updates: any = { [formationField]: value };
      
      if (formationField === 'domaine') {
        updates.programme = '';
        updates.programmeDetails = undefined;
      }
      
      if (formationField === 'programme' && value) {
        const selectedCourse = availableCourses.find(course => course.id === value);
        if (selectedCourse) {
          updates.programmeDetails = selectedCourse;
        }
      }
      
      return {
        ...prev,
        formation: {
          ...prev.formation,
          ...updates
        }
      };
    });
    
    setTimeout(markSaved, 1000);
  }, [updateData, availableCourses, markSaved]);

  const handleFieldBlur = React.useCallback(async (field: string) => {
    touch(field);
    
    if (field === 'email') {
      await validate(field, formData.email);
    } else if (field === 'phone') {
      const phoneValidation = validatePhone(formData.phone);
      await validate(field, phoneValidation.isValid ? formData.phone : '');
    } else if (field === 'firstName') {
      await validate(field, formData.firstName);
    } else if (field === 'lastName') {
      await validate(field, formData.lastName);
    }
  }, [touch, validate, validatePhone, formData]);

  // Sync external status with inline status
  React.useEffect(() => {
    if (submissionStatus && statusMessage) {
      setInlineStatus({ type: submissionStatus, message: statusMessage });
    }
  }, [submissionStatus, statusMessage]);

  // Clear inline status when user starts typing after an error
  React.useEffect(() => {
    if (inlineStatus.type === 'error' && (formData.firstName || formData.lastName || formData.email || formData.phone)) {
      const timer = setTimeout(() => {
        setInlineStatus({ type: 'idle', message: '' });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.firstName, formData.lastName, formData.email, formData.phone, inlineStatus.type]);

  const handleSubmit = React.useCallback(async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log("=== FORM SUBMISSION STARTED ===");
    console.log("Form data:", formData);
    console.log("Network status:", networkStatus);
    console.log("Loading state:", loading);
    
    setInlineStatus({ type: 'submitting', message: 'Vérification en cours...' });
    
    if (!networkStatus.isOnline) {
      console.log("❌ Network offline");
      setInlineStatus({ type: 'error', message: 'Pas de connexion internet. Vérifiez votre connexion.' });
      return;
    }
    
    // Check terms acceptance first
    if (!formData.acceptTerms) {
      console.log("❌ Terms not accepted");
      setInlineStatus({ type: 'error', message: 'Veuillez accepter les conditions d\'utilisation' });
      return;
    }
    
    // Check if formation is properly selected
    if (!formData.formation.formationType || !formData.formation.domaine || !formData.formation.programme) {
      console.log("❌ Formation incomplete:", formData.formation);
      setInlineStatus({ type: 'error', message: 'Veuillez compléter votre sélection de formation' });
      return;
    }

    // Prepare values for validation
    const validationValues = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      'formation.formationType': formData.formation.formationType,
      'formation.domaine': formData.formation.domaine,
      'formation.programme': formData.formation.programme,
      acceptTerms: formData.acceptTerms ? 'true' : ''
    };
    
    console.log("🔍 Starting validation...");
    console.log("Validation values:", validationValues);
    const isFormValid = validateAll(validationValues);
    console.log("Validation result:", isFormValid);
    console.log("Current errors:", errors);
    
    if (!isFormValid) {
      console.log("❌ Validation failed");
      const errorFields = Object.keys(errors).filter(key => errors[key]);
      console.log("Error fields:", errorFields);
      setInlineStatus({ type: 'error', message: 'Veuillez corriger les erreurs du formulaire' });
      return;
    }

    // Check email validation
    const emailResult = getValidationResult(formData.email);
    console.log("Email validation result:", emailResult);
    if (emailResult?.isDuplicate) {
      console.log("❌ Email already exists");
      toast({
        title: "Email déjà utilisé",
        description: "Cette adresse email est déjà enregistrée.",
        variant: "destructive"
      });
      return;
    }

    console.log("✅ All validations passed, submitting...");
    
    try {
      await onSubmit(formData);
      console.log("✅ Submission completed successfully");
      // Status will be managed by parent component
    } catch (error) {
      console.error("❌ Submission failed:", error);
      setInlineStatus({ type: 'error', message: 'Erreur lors de l\'inscription' });
    }
  }, [formData, validateAll, onSubmit, networkStatus, getValidationResult, toast, errors, loading]);

  const getStepStatus = React.useCallback((step: number): 'completed' | 'current' | 'pending' => {
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
  }, [formData.formation]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-xl border-2 border-gray-100">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
            Inscription aux Formations
          </CardTitle>
          <p className="text-gray-600 text-lg mb-6">
            Choisissez votre parcours de formation professionnelle
          </p>
          
          <ProgressIndicator
            percentage={progress.percentage}
            completedSteps={progress.completedSteps}
            totalSteps={progress.totalSteps}
            currentStep={progress.currentStep}
            lastSaved={getSavedStatus()}
            className="max-w-md mx-auto"
          />
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Network Status Warning */}
          {!networkStatus.isOnline && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="font-medium text-red-800">Connexion Internet requise</p>
                <p className="text-sm text-red-600">
                  Veuillez vérifier votre connexion Internet pour continuer l'inscription.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={networkStatus.retryConnection}
                className="ml-auto"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Réessayer
              </Button>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Informations Personnelles
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EnhancedFormField
                  id="firstName"
                  label="Prénom"
                  value={formData.firstName}
                  onChange={(value) => handleInputChange('firstName', value)}
                  onBlur={() => handleFieldBlur('firstName')}
                  error={getError('firstName')}
                  required
                  placeholder="Votre prénom"
                  autoComplete="given-name"
                  showValidationIcon
                  isValid={formData.firstName.length >= 2 && !hasError('firstName')}
                  networkStatus={networkStatus}
                />
                
                <EnhancedFormField
                  id="lastName"
                  label="Nom"
                  value={formData.lastName}
                  onChange={(value) => handleInputChange('lastName', value)}
                  onBlur={() => handleFieldBlur('lastName')}
                  error={getError('lastName')}
                  required
                  placeholder="Votre nom de famille"
                  autoComplete="family-name"
                  showValidationIcon
                  isValid={formData.lastName.length >= 2 && !hasError('lastName')}
                  networkStatus={networkStatus}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EnhancedFormField
                  id="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(value) => handleInputChange('email', value)}
                  onBlur={() => handleFieldBlur('email')}
                  error={getError('email')}
                  suggestion={getValidationResult(formData.email)?.suggestion ? 
                    `Vouliez-vous dire ${getValidationResult(formData.email)?.suggestion} ?` : undefined}
                  required
                  placeholder="votre.email@exemple.com"
                  autoComplete="email"
                  showValidationIcon
                  isValidating={emailValidating || isValidating('email')}
                  isValid={getValidationResult(formData.email)?.isValid}
                  networkStatus={networkStatus}
                />
                
                <EnhancedFormField
                  id="phone"
                  label="Téléphone"
                  type="tel"
                  value={formData.phone}
                  onChange={(value) => handleInputChange('phone', value)}
                  onBlur={() => handleFieldBlur('phone')}
                  error={getError('phone') || (!validatePhone(formData.phone).isValid && formData.phone ? 
                    validatePhone(formData.phone).message : undefined)}
                  required
                  placeholder="+212 6 12 34 56 78"
                  autoComplete="tel"
                  showValidationIcon
                  isValid={validatePhone(formData.phone).isValid}
                  networkStatus={networkStatus}
                />
              </div>
            </div>

            {/* Formation Selection */}
            <div className="space-y-8">
              <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Choix de Formation
              </h3>

              {/* Step indicators */}
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-8">
                  {[1, 2, 3].map((step) => {
                    const status = getStepStatus(step);
                    const stepLabels = ['Type', 'Domaine', 'Programme'];
                    return (
                      <div key={step} className="flex flex-col items-center">
                        <div className={cn(
                          'flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300',
                          status === 'completed' && 'bg-academy-blue border-academy-blue text-white',
                          status === 'current' && 'border-academy-blue text-academy-blue bg-blue-50',
                          status === 'pending' && 'border-gray-300 text-gray-400'
                        )}>
                          {status === 'completed' ? (
                            <CheckCircle2 className="w-6 h-6" />
                          ) : (
                            <span className="font-semibold">{step}</span>
                          )}
                        </div>
                        <span className="text-sm mt-2 font-medium">
                          {stepLabels[step - 1]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 1: Formation Type */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700">1. Type de Formation</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formationTypes.map((type) => (
                    <Card 
                      key={type.value}
                      className={cn(
                        'cursor-pointer border-2 transition-all duration-200 hover:shadow-md',
                        formData.formation.formationType === type.value
                          ? 'border-academy-blue bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                      onClick={() => handleFormationChange('formation.formationType', type.value)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            'w-4 h-4 rounded-full border-2',
                            formData.formation.formationType === type.value
                              ? 'bg-academy-blue border-academy-blue'
                              : 'border-gray-300'
                          )} />
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-800">{type.label}</h5>
                            <p className="text-sm text-gray-600">{type.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Step 2: Domain Selection */}
              {formData.formation.formationType && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700">2. Domaine d'études</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {domaines.map((domaine) => (
                      <Card 
                        key={domaine.value}
                        className={cn(
                          'cursor-pointer border-2 transition-all duration-200 hover:shadow-md',
                          formData.formation.domaine === domaine.value
                            ? 'border-academy-purple bg-purple-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                        onClick={() => handleFormationChange('formation.domaine', domaine.value)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <div className={cn(
                                'w-4 h-4 rounded-full border-2',
                                formData.formation.domaine === domaine.value
                                  ? 'bg-academy-purple border-academy-purple'
                                  : 'border-gray-300'
                              )} />
                              <h5 className="font-semibold text-gray-800">{domaine.label}</h5>
                            </div>
                            <p className="text-sm text-gray-600">{domaine.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Programme Selection */}
              {formData.formation.domaine && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-700">3. Programme spécifique</h4>
                    <Badge variant="secondary">
                      {availableCourses.length} programme{availableCourses.length > 1 ? 's' : ''} disponible{availableCourses.length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  {coursesLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-academy-blue mx-auto"></div>
                      <p className="text-gray-600 mt-2">Chargement des programmes...</p>
                    </div>
                  ) : availableCourses.length > 0 ? (
                     <div className={cn(
                       "grid gap-3 sm:gap-4",
                       "grid-cols-1 sm:grid-cols-1 md:grid-cols-2",
                       isAndroid && "android-responsive-grid"
                     )}>
                       {availableCourses.map((course) => (
                         <Card 
                           key={course.id}
                           className={cn(
                             'cursor-pointer border-2 transition-all duration-200 hover:shadow-md',
                             'min-h-[120px] sm:min-h-[140px]', // Better touch targets
                             'touch-manipulation', // Android touch optimization
                             formData.formation.programme === course.id
                               ? 'border-academy-blue bg-blue-50' 
                               : 'border-gray-200 hover:border-gray-300'
                           )}
                           onClick={() => handleFormationChange('formation.programme', course.id)}
                         >
                           <CardContent className="p-3 sm:p-4">
                             <div className="space-y-2 sm:space-y-3">
                               <div className="flex items-start space-x-2 sm:space-x-3">
                                 <div className={cn(
                                   'w-5 h-5 sm:w-4 sm:h-4 rounded-full border-2 mt-0.5 sm:mt-1 flex-shrink-0',
                                   'touch-manipulation', // Better touch interaction
                                   formData.formation.programme === course.id
                                     ? 'bg-academy-blue border-academy-blue'
                                     : 'border-gray-300'
                                 )} />
                                 <div className="flex-1 min-w-0">
                                   <h5 className="font-semibold text-gray-800 leading-tight text-sm sm:text-base">
                                     {course.title}
                                   </h5>
                                   {course.subtitle && (
                                     <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                                       {course.subtitle}
                                     </p>
                                   )}
                                 </div>
                               </div>
                               
                               <div className="flex items-center space-x-3 sm:space-x-4 text-xs text-gray-500">
                                 {course.duration && (
                                   <div className="flex items-center space-x-1">
                                     <Calendar className="w-3 h-3" />
                                     <span className="text-xs">{course.duration}</span>
                                   </div>
                                 )}
                                 {course.modules && (
                                   <div className="flex items-center space-x-1">
                                     <Users className="w-3 h-3" />
                                     <span className="text-xs">{course.modules}</span>
                                   </div>
                                 )}
                               </div>
                             </div>
                           </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-600">
                      <p>Aucun programme disponible pour ce domaine.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Terms and Submit */}
            {formData.formation.programme && (
              <div className="space-y-6 pt-6 border-t border-gray-200">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => updateData({ acceptTerms: !!checked })}
                    className="mt-1"
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                    J'accepte les{' '}
                    <a href="/terms-of-use" target="_blank" className="text-academy-blue hover:underline">
                      conditions d'utilisation
                    </a>{' '}
                    et la{' '}
                    <a href="/privacy-policy" target="_blank" className="text-academy-blue hover:underline">
                      politique de confidentialité
                    </a>
                    . J'autorise AVS Innovation Institute à me contacter concernant ma formation.
                  </label>
                </div>
                
                 <div className="flex flex-col items-center space-y-4">
                   <Button
                     onClick={handleSubmit}
                     disabled={!formData.acceptTerms || !networkStatus.isOnline || loading}
                     className={cn(
                       "w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4",
                       "min-h-[48px] touch-manipulation", // Android requirements
                       "bg-gradient-to-r from-academy-blue to-academy-purple text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50",
                       "text-sm sm:text-base"
                     )}
                   >
                     {loading || inlineStatus.type === 'submitting' ? (
                       <>
                         <Loader2 className="w-4 h-4 animate-spin mr-2" />
                         <span className="text-sm sm:text-base">Inscription en cours...</span>
                       </>
                     ) : (
                       <span className="text-sm sm:text-base">Finaliser l'inscription</span>
                     )}
                   </Button>
                  
                  {/* Inline Status Message */}
                  {inlineStatus.type !== 'idle' && inlineStatus.message && (
                    <div className={cn(
                      'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                      inlineStatus.type === 'success' && 'bg-green-50 text-green-800 border border-green-200',
                      inlineStatus.type === 'error' && 'bg-red-50 text-red-800 border border-red-200',
                      inlineStatus.type === 'submitting' && 'bg-blue-50 text-blue-800 border border-blue-200'
                    )}>
                      {inlineStatus.type === 'success' && <CheckCircle className="w-4 h-4" />}
                      {inlineStatus.type === 'error' && <X className="w-4 h-4" />}
                      {inlineStatus.type === 'submitting' && <Loader2 className="w-4 h-4 animate-spin" />}
                      <span>{inlineStatus.message}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedMultiStepForm;