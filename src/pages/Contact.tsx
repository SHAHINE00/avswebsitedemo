import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Mail, MapPin, Phone, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContactForm } from '@/hooks/useContactForm';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ErrorBoundary from '@/components/ui/error-boundary';
import SEOHead from '@/components/SEOHead';
import { pageSEO } from '@/utils/seoData';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
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
      // Reset form after 5 seconds
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
      }, 5000);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
        <SEOHead {...pageSEO.contact} />
        <Navbar />
        
        {/* Hero Section */}
        <div className="pt-32 pb-20 relative overflow-hidden bg-gradient-to-r from-emerald-400 to-green-500">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-600"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                Contactez-nous
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                Une question ? Un projet ? Nous sommes là pour vous accompagner dans votre transformation digitale et votre développement professionnel
              </p>
              <div className="mt-8 flex justify-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/20">
                  <p className="text-sm font-medium text-slate-600 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-emerald-500" />
                    Réponse garantie sous 24h • Support multilingue • Équipe dédiée
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <main className="flex-grow pb-20 relative">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Contact Form */}
                <div className="xl:col-span-2">
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 md:p-10">
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold mb-3 text-slate-800 flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mr-4">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        Envoyez-nous un message
                      </h2>
                      <p className="text-slate-600 text-lg">Remplissez le formulaire ci-dessous et nous vous répondrons rapidement</p>
                    </div>
                    
                    {isSubmitted ? (
                      <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-emerald-800 mb-3">Message envoyé avec succès !</h3>
                        <p className="text-emerald-700 text-lg leading-relaxed">
                          Votre message a été transmis à notre équipe.<br />
                          Nous vous répondrons dans les 24 heures.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700">Prénom *</label>
                            <input
                              type="text"
                              id="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-slate-800"
                              required
                              disabled={loading}
                              placeholder="Votre prénom"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700">Nom *</label>
                            <input
                              type="text"
                              id="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-slate-800"
                              required
                              disabled={loading}
                              placeholder="Votre nom"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Email *</label>
                            <input
                              type="email"
                              id="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-slate-800"
                              required
                              disabled={loading}
                              placeholder="votre.email@exemple.com"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">Téléphone</label>
                            <input
                              type="tel"
                              id="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-slate-800"
                              disabled={loading}
                              placeholder="+212 6 XX XX XX XX"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="subject" className="block text-sm font-semibold text-slate-700">Sujet *</label>
                          <select
                            id="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-slate-800"
                            required
                            disabled={loading}
                          >
                            <option value="">Sélectionnez un sujet</option>
                            <option value="information">💬 Demande d'informations</option>
                            <option value="inscription">📝 Inscription</option>
                            <option value="ai-data-science">🤖 Intelligence Artificielle & Data Science</option>
                            <option value="programming-infrastructure">💻 Programmation & Infrastructure</option>
                            <option value="digital-marketing-creative">🎨 Marketing Digital & Créatif</option>
                            <option value="international-certification">🏆 Certification internationale</option>
                            <option value="career-guidance">🎯 Orientation & consultation de carrière</option>
                            <option value="partenariat">🤝 Proposition de partenariat</option>
                            <option value="entrepreneurship">🚀 Entrepreneuriat & innovation</option>
                            <option value="autre">📧 Autre</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="message" className="block text-sm font-semibold text-slate-700">Message *</label>
                          <textarea
                            id="message"
                            rows={5}
                            value={formData.message}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-slate-800 resize-none"
                            placeholder="Décrivez votre demande, vos questions ou votre projet..."
                            required
                            disabled={loading}
                          ></textarea>
                        </div>
                        
                        <div className="pt-4">
                          <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                          >
                            {loading ? (
                              <>
                                <LoadingSpinner size="sm" className="mr-3" />
                                Envoi en cours...
                              </>
                            ) : (
                              <>
                                <Mail className="w-5 h-5 mr-3" />
                                Envoyer le message
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
                
                {/* Information Sidebar */}
                <div className="xl:col-span-1 space-y-6">
                  
                  {/* Contact Information */}
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
                        <Phone className="w-4 h-4 text-white" />
                      </div>
                      Nos coordonnées
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-slate-800 mb-1">Adresse</h4>
                          <p className="text-slate-600 text-sm">
                            Avenue Allal El Fassi – Alpha 2000<br />
                            Marrakech – MAROC
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Phone className="w-5 h-5 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-slate-800 mb-1">Téléphone</h4>
                          <div className="text-slate-600 text-sm">
                            <p>+212 6 62 63 29 53</p>
                            <p>+212 5 24 31 19 82</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Mail className="w-5 h-5 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-slate-800 mb-1">Email</h4>
                          <p className="text-slate-600 text-sm">info@avs.ma</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Office Hours */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      Heures d'ouverture
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center text-slate-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        Lun - Ven : 9h00 - 18h00
                      </li>
                      <li className="flex items-center text-slate-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        Samedi : 9h00 - 14h00
                      </li>
                      <li className="flex items-center text-slate-700">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                        Dimanche : Fermé
                      </li>
                    </ul>
                  </div>

                  {/* Appointment CTA */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold mb-3 text-slate-800">Prendre rendez-vous</h3>
                    <p className="text-slate-600 mb-4 text-sm">
                      Vous préférez discuter directement avec un conseiller ? Planifiez un rendez-vous personnalisé.
                    </p>
                    <Button asChild className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      <Link to="/appointment">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Planifier un rendez-vous
                      </Link>
                    </Button>
                  </div>

                  {/* Response Time */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold mb-3 text-slate-800">Temps de réponse</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center text-slate-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        Email : Sous 24h
                      </li>
                      <li className="flex items-center text-slate-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        Téléphone : Immédiat
                      </li>
                      <li className="flex items-center text-slate-700">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        Support technique : 2-4h
                      </li>
                    </ul>
                  </div>
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
