
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MultiStepRegistrationForm from '@/components/MultiStepRegistrationForm';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import SEOHead from '@/components/SEOHead';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

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

      // Add formation metadata to the signup
      const metadata = {
        formation_type: formData.formation.formationType,
        formation_domaine: formData.formation.domaine,
        formation_programme: formData.formation.programme,
        formation_programme_title: formData.formation.programmeDetails?.title,
        formation_tag: formationTag,
        phone: formData.phone
      };

      const { error } = await signUp(formData.email, formData.password, fullName, metadata);
      
      if (error) {
        toast({
          title: "Erreur d'inscription",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Inscription réussie !",
          description: `Bienvenue dans le programme: ${formData.formation.programmeDetails?.title}. Vérifiez votre email pour confirmer votre compte.`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur s'est produite lors de l'inscription",
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
