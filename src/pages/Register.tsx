
// Subscriber-only registration page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MultiStepRegistrationForm from '@/components/MultiStepRegistrationForm';
import { useToast } from '@/hooks/use-toast';
import SEOHead from '@/components/SEOHead';
import { supabase } from '@/integrations/supabase/client';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFormSubmit = async (formData: any) => {
    setLoading(true);
    
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      
      // Create tags for the submission with full formation details
      const formationTag = [
        formData.formation.formationType === 'complete' ? 'Formation Professionnelle Complète (2 ans)' : 'Certificat International (Courte durée)',
        formData.formation.domaine === 'ai-data' ? 'Intelligence Artificielle & Data Science' :
        formData.formation.domaine === 'programming' ? 'Programmation & Infrastructure' : 'Marketing Digital & Créatif',
        formData.formation.programmeDetails?.title || formData.formation.programme
      ].join(' | ');

      // Insert subscriber data directly into the subscribers table
      const { error } = await supabase
        .from('subscribers')
        .insert({
          email: formData.email,
          full_name: fullName,
          phone: formData.phone,
          formation_type: formData.formation.formationType,
          formation_domaine: formData.formation.domaine,
          formation_programme: formData.formation.programme,
          formation_programme_title: formData.formation.programmeDetails?.title,
          formation_tag: formationTag
        });
      
      if (error) {
        console.error('Subscription error:', error);
        toast({
          title: "Erreur d'inscription",
          description: error.message === 'duplicate key value violates unique constraint "subscribers_email_key"' 
            ? "Cette adresse email est déjà enregistrée."
            : "Une erreur s'est produite lors de l'inscription. Veuillez réessayer.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Inscription réussie !",
          description: `Merci ${formData.firstName} ! Votre inscription au programme "${formData.formation.programmeDetails?.title}" a été enregistrée. Nous vous contacterons bientôt.`,
        });
        
        // Redirect to home page after successful registration
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur s'est produite lors de l'inscription. Veuillez réessayer.",
        variant: "destructive",
      });
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
            <MultiStepRegistrationForm 
              onSubmit={handleFormSubmit}
              loading={loading}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
