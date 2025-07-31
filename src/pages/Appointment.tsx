import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle } from 'lucide-react';
import { useAppointmentBooking } from '@/hooks/useAppointmentBooking';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ErrorBoundary from '@/components/ui/error-boundary';

const Appointment = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    appointmentDate: '',
    appointmentTime: '',
    appointmentType: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { bookAppointment, loading } = useAppointmentBooking();

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure appointmentType is properly typed
    const appointmentData = {
      ...formData,
      appointmentType: formData.appointmentType as 'phone' | 'video' | 'office'
    };
    
    const success = await bookAppointment(appointmentData);
    
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
          appointmentDate: '',
          appointmentTime: '',
          appointmentType: '',
          subject: '',
          message: ''
        });
      }, 5000);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
        <Navbar />
        
        {/* Hero Section */}
        <div className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Planifier un rendez-vous
              </h1>
              <p className="text-xl md:text-2xl text-slate-700 leading-relaxed max-w-3xl mx-auto">
                Réservez un créneau personnalisé avec nos experts pour explorer ensemble votre projet de formation et définir votre parcours professionnel
              </p>
              <div className="mt-8 flex justify-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/20">
                  <p className="text-sm font-medium text-slate-600 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                    Consultation gratuite • Sans engagement • 30-45 minutes
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
                
                {/* Appointment Form */}
                <div className="xl:col-span-2">
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 md:p-10">
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold mb-3 text-slate-800 flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-4">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        Réserver votre consultation
                      </h2>
                      <p className="text-slate-600 text-lg">Remplissez le formulaire ci-dessous pour planifier votre rendez-vous</p>
                    </div>
                    
                    {isSubmitted ? (
                      <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-emerald-800 mb-3">Rendez-vous confirmé !</h3>
                        <p className="text-emerald-700 text-lg leading-relaxed">
                          Votre demande de rendez-vous a été enregistrée avec succès.<br />
                          Notre équipe vous contactera dans les 24h pour confirmer votre créneau.
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
                              className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800"
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
                              className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800"
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
                              className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800"
                              required
                              disabled={loading}
                              placeholder="votre.email@exemple.com"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">Téléphone *</label>
                            <input
                              type="tel"
                              id="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800"
                              required
                              disabled={loading}
                              placeholder="+212 6 XX XX XX XX"
                            />
                          </div>
                        </div>
                        
                        {/* Appointment Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label htmlFor="appointmentDate" className="block text-sm font-semibold text-slate-700">Date souhaitée *</label>
                            <input
                              type="date"
                              id="appointmentDate"
                              value={formData.appointmentDate}
                              onChange={handleInputChange}
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800"
                              required
                              disabled={loading}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor="appointmentTime" className="block text-sm font-semibold text-slate-700">Heure souhaitée *</label>
                            <select
                              id="appointmentTime"
                              value={formData.appointmentTime}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800"
                              required
                              disabled={loading}
                            >
                              <option value="">Sélectionnez une heure</option>
                              {timeSlots.map((time) => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="appointmentType" className="block text-sm font-semibold text-slate-700">Type de rendez-vous *</label>
                          <select
                            id="appointmentType"
                            value={formData.appointmentType}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800"
                            required
                            disabled={loading}
                          >
                            <option value="">Sélectionnez le type</option>
                            <option value="phone">📞 Appel téléphonique</option>
                            <option value="video">💻 Visioconférence</option>
                            <option value="office">🏢 Visite en présentiel</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="subject" className="block text-sm font-semibold text-slate-700">Sujet du rendez-vous</label>
                          <select
                            id="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800"
                            disabled={loading}
                          >
                            <option value="">Sélectionnez un sujet</option>
                            <option value="ai-data-science">🤖 Intelligence Artificielle & Data Science</option>
                            <option value="programming-infrastructure">💻 Programmation & Infrastructure</option>
                            <option value="digital-marketing-creative">🎨 Marketing Digital & Créatif</option>
                            <option value="international-certification">🏆 Certification internationale</option>
                            <option value="career-guidance">🎯 Orientation & consultation de carrière</option>
                            <option value="partnership">🤝 Partenariat entreprise</option>
                            <option value="entrepreneurship">🚀 Entrepreneuriat & innovation</option>
                            <option value="general-consultation">💬 Consultation générale</option>
                            <option value="other">📝 Autre</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="message" className="block text-sm font-semibold text-slate-700">Message (optionnel)</label>
                          <textarea
                            id="message"
                            rows={4}
                            value={formData.message}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800 resize-none"
                            placeholder="Décrivez brièvement vos attentes, votre situation actuelle ou toute information que vous souhaitez partager..."
                            disabled={loading}
                          ></textarea>
                        </div>
                        
                        <div className="pt-4">
                          <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                          >
                            {loading ? (
                              <>
                                <LoadingSpinner size="sm" className="mr-3" />
                                Traitement en cours...
                              </>
                            ) : (
                              <>
                                <Calendar className="w-5 h-5 mr-3" />
                                Confirmer le rendez-vous
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
                  
                  {/* Duration & Details */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      Durée et modalités
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center text-slate-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        Durée : 30-45 minutes
                      </li>
                      <li className="flex items-center text-slate-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        Gratuit et sans engagement
                      </li>
                      <li className="flex items-center text-slate-700">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        Disponible en français, anglais et arabe
                      </li>
                      <li className="flex items-center text-slate-700">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        Confirmation par email dans les 24h
                      </li>
                    </ul>
                  </div>
                  
                  {/* Discussion Topics */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                    <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      Points de discussion
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start text-slate-700">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2"></div>
                        Vos objectifs de carrière en technologie
                      </li>
                      <li className="flex items-start text-slate-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                        Le programme de formation adapté à votre profil
                      </li>
                      <li className="flex items-start text-slate-700">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></div>
                        Les modalités de financement disponibles
                      </li>
                      <li className="flex items-start text-slate-700">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2"></div>
                        Les opportunités d'emploi post-formation
                      </li>
                      <li className="flex items-start text-slate-700">
                        <div className="w-2 h-2 bg-pink-500 rounded-full mr-3 mt-2"></div>
                        Visite de nos installations modernes
                      </li>
                    </ul>
                  </div>
                  
                  {/* Contact Information */}
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center mr-3">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      Besoin d'assistance ?
                    </h3>
                    <p className="mb-6 text-slate-300 leading-relaxed">
                      Notre équipe est disponible pour vous accompagner dans la planification de votre rendez-vous.
                    </p>
                    <div className="space-y-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <p className="flex items-center font-medium">
                          <Phone className="mr-3 text-blue-400" size={18} />
                          +212 6 62 63 29 53
                        </p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <p className="flex items-center font-medium">
                          <Phone className="mr-3 text-blue-400" size={18} />
                          +212 5 24 31 19 82
                        </p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <p className="flex items-center font-medium">
                          <Mail className="mr-3 text-blue-400" size={18} />
                          info@avs.ma
                        </p>
                      </div>
                    </div>
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

export default Appointment;
