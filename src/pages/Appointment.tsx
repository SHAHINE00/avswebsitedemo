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
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        
        <div className="pt-24 pb-16 bg-gradient-to-br from-white to-academy-gray">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Planifier un rendez-vous</h1>
            <p className="text-xl text-gray-700 max-w-3xl">
              Réservez un créneau avec nos conseillers pour discuter de votre projet de formation en IA.
            </p>
          </div>
        </div>
        
        <main className="flex-grow py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Appointment Form */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <Calendar className="mr-3 text-academy-blue" />
                    Choisir un créneau
                  </h2>
                  
                  {isSubmitted ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-green-800 mb-2">Rendez-vous confirmé !</h3>
                      <p className="text-green-700">
                        Votre demande de rendez-vous a été enregistrée. Nous vous contacterons pour confirmer.
                      </p>
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
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                          required
                          disabled={loading}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-1">Date souhaitée *</label>
                        <input
                          type="date"
                          id="appointmentDate"
                          value={formData.appointmentDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                          required
                          disabled={loading}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 mb-1">Heure souhaitée *</label>
                        <select
                          id="appointmentTime"
                          value={formData.appointmentTime}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                          required
                          disabled={loading}
                        >
                          <option value="">Sélectionnez une heure</option>
                          {timeSlots.map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="appointmentType" className="block text-sm font-medium text-gray-700 mb-1">Type de rendez-vous *</label>
                        <select
                          id="appointmentType"
                          value={formData.appointmentType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                          required
                          disabled={loading}
                        >
                          <option value="">Sélectionnez le type</option>
                          <option value="phone">Appel téléphonique</option>
                          <option value="video">Visioconférence</option>
                          <option value="office">Visite en présentiel</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Sujet du rendez-vous</label>
                        <select
                          id="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                          disabled={loading}
                        >
                          <option value="">Sélectionnez un sujet</option>
                          <option value="ai-data-science">Intelligence Artificielle & Data Science</option>
                          <option value="programming-infrastructure">Programmation & Infrastructure</option>
                          <option value="digital-marketing-creative">Marketing Digital & Créatif</option>
                          <option value="international-certification">Certification internationale</option>
                          <option value="career-guidance">Orientation & consultation de carrière</option>
                          <option value="partnership">Partenariat entreprise</option>
                          <option value="entrepreneurship">Entrepreneuriat & innovation</option>
                          <option value="general-consultation">Consultation générale</option>
                          <option value="other">Autre</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message (optionnel)</label>
                        <textarea
                          id="message"
                          rows={4}
                          value={formData.message}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                          placeholder="Décrivez brièvement vos attentes pour ce rendez-vous..."
                          disabled={loading}
                        ></textarea>
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-academy-blue hover:bg-academy-purple text-white font-semibold py-3"
                      >
                        {loading ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Confirmation en cours...
                          </>
                        ) : (
                          'Confirmer le rendez-vous'
                        )}
                      </Button>
                    </form>
                  )}
                </div>
                
                {/* Information Panel */}
                <div className="space-y-8">
                  <div className="bg-academy-gray rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Clock className="mr-3 text-academy-blue" />
                      Durée et modalités
                    </h3>
                    <ul className="space-y-3 text-gray-700">
                      <li>• Durée : 30-45 minutes</li>
                      <li>• Gratuit et sans engagement</li>
                      <li>• Disponible en français, anglais et arabe</li>
                      <li>• Confirmation par email dans les 24h</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <User className="mr-3 text-academy-blue" />
                      Que pouvons-nous discuter ?
                    </h3>
                    <ul className="space-y-3 text-gray-700">
                      <li>• Vos objectifs de carrière en IA</li>
                      <li>• Le programme de formation adapté</li>
                      <li>• Les modalités de financement</li>
                      <li>• Les opportunités d'emploi post-formation</li>
                      <li>• Visite de nos installations</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-br from-academy-blue to-academy-purple rounded-lg p-6 text-white">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <MessageSquare className="mr-3" />
                      Besoin d'aide ?
                    </h3>
                    <p className="mb-4">
                      Si vous avez des questions ou besoin d'aide pour planifier votre rendez-vous, n'hésitez pas à nous contacter.
                    </p>
                    <div className="space-y-2">
                      <p className="flex items-center">
                        <Phone className="mr-2" size={16} />
                        +212 6 62 63 29 53
                      </p>
                      <p className="flex items-center">
                        <Phone className="mr-2" size={16} />
                        +212 5 24 31 19 82
                      </p>
                      <p className="flex items-center">
                        <Mail className="mr-2" size={16} />
                        info@avs.ma
                      </p>
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
