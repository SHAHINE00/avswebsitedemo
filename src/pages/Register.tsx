
// Subscriber-only registration page
import React from 'react';
import { useSafeState } from '@/utils/safeHooks';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EnhancedMultiStepForm from '@/components/EnhancedMultiStepForm';
import SimpleErrorBoundary from '@/components/ui/SimpleErrorBoundary';
import { useToast } from '@/hooks/use-toast';
import SEOHead from '@/components/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import { logError } from '@/utils/logger';

const Register = () => {
  const [loading, setLoading] = useSafeState(false);
  const [submissionStatus, setSubmissionStatus] = useSafeState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useSafeState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFormSubmit = async (formData: any) => {
    setLoading(true);
    setSubmissionStatus('submitting');
    setStatusMessage('Envoi en cours...');
    
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      
      // Create tags for the submission with full formation details
      const formationTag = [
        formData.formation.formationType === 'complete' ? 'Formation Professionnelle Complète (2 ans)' : 'Certificat International (Courte durée)',
        formData.formation.domaine === 'ai-data' ? 'Intelligence Artificielle & Data Science' :
        formData.formation.domaine === 'programming' ? 'Programmation & Infrastructure' : 'Marketing Digital & Créatif',
        formData.formation.programmeDetails?.title || formData.formation.programme
      ].join(' | ');

      // Use secure Edge Function to create subscriber (bypasses RLS safely)
      const { data: subscribeRes, error: subscribeError } = await supabase.functions.invoke('subscribe', {
        body: {
          email: formData.email,
          fullName,
          phone: formData.phone,
          formationType: formData.formation.formationType,
          formationDomaine: formData.formation.domaine,
          formationProgramme: formData.formation.programme,
          formationProgrammeTitle: formData.formation.programmeDetails?.title,
          formationTag
        }
      });
      
      if (subscribeError || (subscribeRes && subscribeRes.success === false)) {
        const errMsg = (subscribeError as any)?.message || subscribeRes?.error || 'Subscription failed';
        throw new Error(errMsg);
      }
      if (subscribeRes?.status === 'already_subscribed') {
        setSubmissionStatus('success');
        setStatusMessage("Vous êtes déjà inscrit. Merci !");
      } else {
        setSubmissionStatus('success');
        setStatusMessage(`Inscription réussie !`);
      }
    } catch (error: any) {
      logError('Registration error:', error);
      setSubmissionStatus('error');
      setStatusMessage(error?.message || "Une erreur s'est produite lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead 
        title="Inscription - AVS Innovation Institute"
        description="Rejoignez AVS Innovation Institute. Choisissez parmi nos formations en IA, Programmation ou Marketing Digital avec certification internationale."
        keywords="inscription, formation, AI, programmation, marketing digital, certification"
      />
      <Navbar />
      
      <div className="pt-24 pb-16 bg-gradient-to-br from-academy-blue to-academy-purple text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Inscription</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Commencez votre parcours vers une carrière réussie dans la technologie avec nos formations certifiées.
          </p>
        </div>
      </div>
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <SimpleErrorBoundary>
              <EnhancedMultiStepForm 
                onSubmit={handleFormSubmit}
                loading={loading}
                submissionStatus={submissionStatus}
                statusMessage={statusMessage}
              />
            </SimpleErrorBoundary>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
