import React from 'react';
import StandardPageLayout from '@/components/layouts/StandardPageLayout';
import PageHero from '@/components/layouts/PageHero';
import SectionWrapper from '@/components/layouts/SectionWrapper';
import StandardForm from '@/components/forms/StandardForm';
import { Button } from '@/components/ui/button';
import { Mail, MapPin, Phone, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContactForm } from '@/hooks/useContactForm';
import SEOHead from '@/components/SEOHead';
import { pageSEO } from '@/utils/seoData';

const Contact = () => {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const { submitContactForm, loading } = useContactForm();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await submitContactForm(formData);
    
    if (success) {
      setIsSubmitted(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }, 3000);
    }
  };

  return (
    <StandardPageLayout>
      <SEOHead {...pageSEO.contact} />
      
      <PageHero
        title="Contact"
        description="Prenez rendez-vous avec nos conseillers ou contactez-nous pour toute question."
        backgroundGradient="from-background to-muted/50"
        textColor="text-foreground"
        icon={Mail}
      />
      
      <SectionWrapper padding="lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-6">Contactez-nous</h2>
                
                <StandardForm
                  fields={[
                    {
                      label: 'Prénom',
                      id: 'firstName',
                      type: 'text',
                      value: formData.firstName,
                      onChange: handleInputChange,
                      required: true,
                      disabled: loading
                    },
                    {
                      label: 'Nom',
                      id: 'lastName',
                      type: 'text',
                      value: formData.lastName,
                      onChange: handleInputChange,
                      required: true,
                      disabled: loading
                    },
                    {
                      label: 'Email',
                      id: 'email',
                      type: 'email',
                      value: formData.email,
                      onChange: handleInputChange,
                      required: true,
                      disabled: loading
                    },
                    {
                      label: 'Téléphone',
                      id: 'phone',
                      type: 'tel',
                      value: formData.phone,
                      onChange: handleInputChange,
                      disabled: loading
                    },
                    {
                      label: 'Sujet',
                      id: 'subject',
                      type: 'select',
                      value: formData.subject,
                      onChange: handleInputChange,
                      required: true,
                      disabled: loading,
                      options: [
                        { value: 'information', label: 'Demande d\'informations' },
                        { value: 'inscription', label: 'Inscription' },
                        { value: 'partenariat', label: 'Proposition de partenariat' },
                        { value: 'autre', label: 'Autre' }
                      ]
                    },
                    {
                      label: 'Message',
                      id: 'message',
                      type: 'textarea',
                      value: formData.message,
                      onChange: handleInputChange,
                      required: true,
                      disabled: loading,
                      rows: 5
                    }
                  ]}
                  onSubmit={handleSubmit}
                  submitText="Envoyer le message"
                  loading={loading}
                  successMessage={isSubmitted ? (
                    <>
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-green-800 mb-2">Message envoyé avec succès !</h3>
                      <p className="text-green-700">Nous vous répondrons dans les plus brefs délais.</p>
                    </>
                  ) : undefined}
                />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-6">Informations de contact</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="text-primary mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Adresse</h3>
                      <p className="text-muted-foreground">
                        Avenue Allal El Fassi – Alpha 2000<br />
                        Marrakech – MAROC
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="text-primary mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Téléphone</h3>
                      <div className="text-muted-foreground">
                        <p>+212 6 62 63 29 53</p>
                        <p>+212 5 24 31 19 82</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="text-primary mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-muted-foreground">info@avs.ma</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="text-primary mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Heures d'ouverture</h3>
                      <p className="text-muted-foreground">
                        Du lundi au vendredi, de 9h à 18h<br />
                        Samedi, de 9h à 14h<br />
                        Fermé le dimanche
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 bg-muted/30 rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Prendre rendez-vous</h3>
                  <p className="text-muted-foreground mb-4">
                    Vous préférez discuter avec un conseiller ? Prenez rendez-vous pour un appel ou une visite dans nos locaux.
                  </p>
                  <Button asChild>
                    <Link to="/appointment">Planifier un rendez-vous</Link>
                  </Button>
                </div>
              </div>
            </div>
      </SectionWrapper>
    </StandardPageLayout>
  );
};

export default Contact;
