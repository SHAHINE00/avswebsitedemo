import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Mail, MapPin, Phone, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContactForm } from '@/hooks/useContactForm';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ErrorBoundary from '@/components/ui/error-boundary';
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
    <ErrorBoundary>
      <div className="min-h-screen bg-white flex flex-col">
        <SEOHead {...pageSEO.contact} />
        <Navbar />
        
        <div className="pt-24 pb-16 bg-gradient-to-br from-white to-academy-gray">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact</h1>
            <p className="text-xl text-gray-700 max-w-3xl">
              Prenez rendez-vous avec nos conseillers ou contactez-nous pour toute question.
            </p>
          </div>
        </div>
        
        <main className="flex-grow py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-6">Contactez-nous</h2>
                
                {isSubmitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Message envoyé avec succès !</h3>
                    <p className="text-green-700">Nous vous répondrons dans les plus brefs délais.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                        <input
                          type="text"
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                          required
                          disabled={loading}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                        <input
                          type="text"
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                        required
                        disabled={loading}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                        disabled={loading}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Sujet *</label>
                      <select
                        id="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                        required
                        disabled={loading}
                      >
                        <option value="">Sélectionnez un sujet</option>
                        <option value="information">Demande d'informations</option>
                        <option value="inscription">Inscription</option>
                        <option value="partenariat">Proposition de partenariat</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                      <textarea
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                        required
                        disabled={loading}
                      ></textarea>
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="bg-academy-blue hover:bg-academy-purple text-white font-semibold py-3 px-6 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Envoi en cours...
                        </>
                      ) : (
                        'Envoyer le message'
                      )}
                    </Button>
                  </form>
                )}
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-6">Informations de contact</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="text-academy-blue mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Adresse</h3>
                      <p className="text-gray-700">
                        Avenue Allal El Fassi – Alpha 2000<br />
                        Marrakech – MAROC
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="text-academy-blue mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Téléphone</h3>
                      <div className="text-gray-700">
                        <p>+212 6 62 63 29 53</p>
                        <p>+212 5 24 31 19 82</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="text-academy-blue mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-gray-700">info@avs.ma</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="text-academy-blue mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Heures d'ouverture</h3>
                      <p className="text-gray-700">
                        Du lundi au vendredi, de 9h à 18h<br />
                        Samedi, de 9h à 14h<br />
                        Fermé le dimanche
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 bg-academy-gray rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Prendre rendez-vous</h3>
                  <p className="text-gray-700 mb-4">
                    Vous préférez discuter avec un conseiller ? Prenez rendez-vous pour un appel ou une visite dans nos locaux.
                  </p>
                  <Button asChild className="bg-academy-blue hover:bg-academy-purple text-white">
                    <Link to="/appointment">Planifier un rendez-vous</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Contact;
