
import React from 'react';
import { Shield, Lock, Eye, Network, Bug, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const CybersecurityCourse = () => {
  const keyAreas = [
    { title: "Ethical Hacking", description: "Techniques de piratage éthique et tests de pénétration", icon: Bug, color: "from-red-500 to-pink-600" },
    { title: "Sécurité Réseau", description: "Protection des infrastructures réseau", icon: Network, color: "from-orange-500 to-red-600" },
    { title: "Cryptographie", description: "Chiffrement et protection des données", icon: Lock, color: "from-purple-500 to-red-600" },
    { title: "Analyse Forensique", description: "Investigation numérique et analyse des incidents", icon: Eye, color: "from-blue-500 to-purple-600" },
    { title: "Gouvernance Sécurité", description: "Politiques et conformité sécuritaire", icon: Shield, color: "from-green-500 to-blue-600" },
    { title: "Certification", description: "Préparation aux certifications professionnelles", icon: Award, color: "from-indigo-500 to-purple-600" }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-red-500 to-orange-600 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-2xl">
                <Shield className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Formation Cybersécurité
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Devenez expert en protection et sécurité informatique
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-white/20 px-4 py-2 rounded-full">
                <span className="font-semibold">20 modules</span>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full">
                <span className="font-semibold">15 mois</span>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full">
                <span className="font-semibold">Diplôme certifié</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Areas Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Domaines Clés</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Maîtrisez les compétences essentielles pour exceller en cybersécurité
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {keyAreas.map((area, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <CardContent className="p-8 relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${area.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <area.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                    {area.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {area.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Objectifs de Formation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-red-100 p-2 rounded-lg mr-4 mt-1">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Protection des Systèmes</h3>
                    <p className="text-gray-600">Apprenez à sécuriser les infrastructures IT et à prévenir les cyberattaques.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-orange-100 p-2 rounded-lg mr-4 mt-1">
                    <Bug className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Tests de Pénétration</h3>
                    <p className="text-gray-600">Maîtrisez les techniques d'ethical hacking pour identifier les vulnérabilités.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-lg mr-4 mt-1">
                    <Lock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Cryptographie Avancée</h3>
                    <p className="text-gray-600">Comprenez les mécanismes de chiffrement et de protection des données.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4 mt-1">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Investigation Numérique</h3>
                    <p className="text-gray-600">Développez vos compétences en analyse forensique et gestion d'incidents.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-red-500 to-orange-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Prêt à Sécuriser l'Avenir ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Rejoignez notre programme de formation en cybersécurité et devenez un expert reconnu dans la protection des systèmes informatiques.
          </p>
          <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg rounded-xl">
            <Link to="/register">S'inscrire Maintenant</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CybersecurityCourse;
