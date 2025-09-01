import React from 'react';
import SectionWrapper from '@/components/layouts/SectionWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Brain, Code2, Globe, MapPin } from 'lucide-react';

const AVSCertifications = () => {
  const allCertifications = [
    { name: "Certificat professionnel d'ingénierie IA d'IBM", type: "international", category: "ia" },
    { name: "Principes de base de l'IA Microsoft Azure", type: "international", category: "ia" },
    { name: "Plateforme d'IA Google Cloud", type: "international", category: "ia" },
    { name: "Certification PCAP de l'Institut Python", type: "international", category: "ia" },
    { name: "Développeur certifié AWS", type: "international", category: "ia" },
    { name: "Certificat de développeur frontal Meta", type: "international", category: "programmation" },
    { name: "Certificat OFPPT en technologies avancées", type: "national", category: "programmation" },
    { name: "Certificat OFPPT en développement d'applications", type: "national", category: "programmation" }
  ];

  return (
    <SectionWrapper background="white" padding="sm">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 px-4 sm:px-0">
          <Badge variant="outline" className="mb-4 text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2 bg-academy-lightblue/10 text-academy-lightblue border-academy-lightblue/30">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Certifications Reconnues
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-academy-blue via-academy-purple to-academy-lightblue bg-clip-text text-transparent">
            Certifications Internationales & Nationales
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Obtenez des certifications reconnues mondialement qui valorisent votre expertise sur le marché du travail
          </p>
        </div>

        <div className="mb-12 px-4 sm:px-0">
          {/* Single Unified Certifications Card */}
          <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-academy-blue/5 via-academy-purple/5 to-academy-lightblue/5 border-academy-blue/20">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center text-xl sm:text-2xl bg-gradient-to-r from-academy-blue via-academy-purple to-academy-lightblue bg-clip-text text-transparent">
                <div className="bg-gradient-to-r from-academy-blue to-academy-purple p-2 sm:p-3 rounded-xl mr-0 sm:mr-4 mb-2 sm:mb-0 flex-shrink-0">
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                Toutes nos Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {allCertifications.map((cert, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 sm:p-4 bg-white/60 rounded-lg border border-gray-200 hover:border-academy-blue/30 transition-colors">
                    <div className={`p-1.5 sm:p-2 rounded-full mt-1 flex-shrink-0 ${
                      cert.category === 'ia' 
                        ? 'bg-academy-blue/20' 
                        : 'bg-academy-purple/20'
                    }`}>
                      {cert.type === 'national' ? (
                        <MapPin className={`w-3 h-3 sm:w-4 sm:h-4 ${
                          cert.category === 'ia' ? 'text-academy-blue' : 'text-academy-purple'
                        }`} />
                      ) : (
                        <Globe className={`w-3 h-3 sm:w-4 sm:h-4 ${
                          cert.category === 'ia' ? 'text-academy-blue' : 'text-academy-purple'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-gray-800">{cert.name}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className={`text-xs ${
                          cert.type === 'national'
                            ? 'text-academy-purple border-academy-purple/30'
                            : 'text-academy-blue border-academy-blue/30'
                        }`}>
                          {cert.type === 'national' ? 'National' : 'International'}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${
                          cert.category === 'ia'
                            ? 'text-academy-blue border-academy-blue/30'
                            : 'text-academy-purple border-academy-purple/30'
                        }`}>
                          {cert.category === 'ia' ? 'IA' : 'Programmation'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certification Benefits */}
        <Card className="bg-gradient-to-r from-academy-blue/5 via-academy-purple/5 to-academy-lightblue/5 border-2 border-academy-blue/20">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-academy-blue via-academy-purple to-academy-lightblue bg-clip-text text-transparent">
                Avantages de nos Certifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="bg-academy-blue/20 p-3 sm:p-4 rounded-2xl w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                    <Award className="w-6 h-6 sm:w-8 sm:h-8 text-academy-blue" />
                  </div>
                  <h4 className="font-semibold text-sm sm:text-base text-gray-800 mb-2">Reconnaissance Mondiale</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">Certifications reconnues par les leaders technologiques internationaux</p>
                </div>
                <div className="text-center">
                  <div className="bg-academy-purple/20 p-3 sm:p-4 rounded-2xl w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                    <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-academy-purple" />
                  </div>
                  <h4 className="font-semibold text-sm sm:text-base text-gray-800 mb-2">Opportunités Globales</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">Ouvrez les portes vers des carrières internationales</p>
                </div>
                <div className="text-center">
                  <div className="bg-academy-lightblue/20 p-3 sm:p-4 rounded-2xl w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                    <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-academy-lightblue" />
                  </div>
                  <h4 className="font-semibold text-sm sm:text-base text-gray-800 mb-2">Conformité Locale</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">Certifications adaptées au marché marocain et maghrébin</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
};

export default AVSCertifications;