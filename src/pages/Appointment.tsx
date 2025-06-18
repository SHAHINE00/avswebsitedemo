
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Phone, Mail, MessageSquare } from 'lucide-react';

const Appointment = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Appointment scheduled');
  };

  return (
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
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                      <input
                        type="text"
                        id="firstName"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                      <input
                        type="text"
                        id="lastName"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-1">Date souhaitée *</label>
                    <input
                      type="date"
                      id="appointmentDate"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 mb-1">Heure souhaitée *</label>
                    <select
                      id="appointmentTime"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                      required
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                      required
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="ai-course">Formation IA</option>
                      <option value="programming-course">Formation Programmation</option>
                      <option value="career-guidance">Orientation de carrière</option>
                      <option value="partnership">Partenariat entreprise</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message (optionnel)</label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                      placeholder="Décrivez brièvement vos attentes pour ce rendez-vous..."
                    ></textarea>
                  </div>
                  
                  <Button type="submit" className="w-full bg-academy-blue hover:bg-academy-purple text-white font-semibold py-3">
                    Confirmer le rendez-vous
                  </Button>
                </form>
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
                      +33 (0)1 23 45 67 89
                    </p>
                    <p className="flex items-center">
                      <Mail className="mr-2" size={16} />
                      contact@aiacademie.fr
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
  );
};

export default Appointment;
