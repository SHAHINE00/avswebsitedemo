import React from 'react';
import SectionWrapper from '@/components/layouts/SectionWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MapPin, Clock, Calendar, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AVSContact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Téléphones",
      details: ["+212 6 62 63 29 53", "+212 5 24 31 19 82"],
      color: "academy-blue"
    },
    {
      icon: Mail,
      title: "Email & Website",
      details: ["info@avs.ma", "www.avs.ma"],
      color: "academy-purple"
    },
    {
      icon: MapPin,
      title: "Adresse",
      details: ["Avenue Allal El Fassi – Alpha 2000", "Marrakech – MAROC"],
      color: "academy-lightblue"
    },
    {
      icon: Clock,
      title: "Horaires",
      details: ["Lundi - Vendredi : 9:00 - 18:00", "Samedi : 9:00 - 13:00"],
      color: "academy-blue"
    }
  ];

  return (
    <SectionWrapper background="white" padding="xl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-lg px-4 py-2 bg-academy-blue/10 text-academy-blue border-academy-blue/30">
            <MessageCircle className="w-5 h-5 mr-2" />
            Contactez-nous
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-academy-blue via-academy-purple to-academy-lightblue bg-clip-text text-transparent">
            Prêt à Commencer Votre Transformation ?
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Notre équipe est là pour vous accompagner dans votre projet de formation. Contactez-nous dès aujourd'hui !
          </p>
        </div>

        {/* Contact Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <Card key={index} className={`group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-${info.color}/5 to-${info.color}/10 border-${info.color}/20`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`bg-${info.color}/20 p-3 rounded-xl group-hover:bg-${info.color} group-hover:text-white transition-colors duration-300`}>
                      <Icon className={`w-6 h-6 text-${info.color} group-hover:text-white`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold mb-2 text-${info.color}`}>
                        {info.title}
                      </h3>
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-gray-700 mb-1">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-academy-blue/10 via-academy-purple/10 to-academy-lightblue/10 border-2 border-academy-blue/20">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-academy-blue via-academy-purple to-academy-lightblue bg-clip-text text-transparent">
                🚀 Réservez une Consultation Gratuite
              </h3>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Découvrez comment ce programme peut changer votre avenir professionnel ! 
                Rendez-vous disponibles tous les jours de 9h à 18h.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <Button asChild size="lg" className="h-14 text-lg bg-academy-blue hover:bg-academy-blue/90">
                  <Link to="/appointment">
                    <Calendar className="w-6 h-6 mr-2" />
                    Réserver un Rendez-vous
                  </Link>
                </Button>
                
                <Button asChild size="lg" variant="outline" className="h-14 text-lg border-academy-purple text-academy-purple hover:bg-academy-purple hover:text-white">
                  <Link to="/contact">
                    <MessageCircle className="w-6 h-6 mr-2" />
                    Nous Contacter
                  </Link>
                </Button>
              </div>
              
              <div className="mt-8 p-6 bg-white/60 rounded-xl border border-academy-blue/20">
                <h4 className="text-lg font-bold text-gray-800 mb-3">
                  🗓️ Prochaines Sessions d'Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-academy-blue/10 rounded-lg">
                    <div className="font-semibold text-academy-blue">Lundi</div>
                    <div className="text-sm text-gray-600">10:00 - 11:00</div>
                  </div>
                  <div className="p-3 bg-academy-purple/10 rounded-lg">
                    <div className="font-semibold text-academy-purple">Mercredi</div>
                    <div className="text-sm text-gray-600">15:00 - 16:00</div>
                  </div>
                  <div className="p-3 bg-academy-lightblue/10 rounded-lg">
                    <div className="font-semibold text-academy-lightblue">Samedi</div>
                    <div className="text-sm text-gray-600">10:00 - 11:00</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Contact Actions */}
        <div className="mt-12 text-center">
          <h4 className="text-2xl font-bold mb-6 text-gray-800">
            Besoin d'une réponse rapide ?
          </h4>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+212662632953" className="inline-flex items-center justify-center px-6 py-3 bg-academy-blue text-white rounded-lg hover:bg-academy-blue/90 transition-colors">
              <Phone className="w-5 h-5 mr-2" />
              Appeler Maintenant
            </a>
            <a href="mailto:info@avs.ma" className="inline-flex items-center justify-center px-6 py-3 bg-academy-purple text-white rounded-lg hover:bg-academy-purple/90 transition-colors">
              <Mail className="w-5 h-5 mr-2" />
              Envoyer un Email
            </a>
            <a href="https://wa.me/212662632953" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default AVSContact;