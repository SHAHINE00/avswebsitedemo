
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-12 bg-gradient-to-br from-white to-academy-gray">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Conditions d'utilisation</h1>
        </div>
      </div>
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto prose prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700">
            <p>Dernière mise à jour : 10 mai 2025</p>
            
            <h2>Acceptation des conditions</h2>
            <p>
              En accédant à ce site web et en utilisant nos services, vous acceptez d'être lié par ces conditions d'utilisation,
              toutes les lois et règlements applicables, et vous acceptez que vous êtes responsable du respect
              des lois locales applicables.
            </p>
            
            <h2>Propriété intellectuelle</h2>
            <p>
              Le contenu publié sur ce site (textes, images, logos, vidéos) est la propriété d'AI Académie
              et est protégé par les lois sur la propriété intellectuelle. Toute reproduction ou utilisation
              non autorisée de ce contenu est strictement interdite.
            </p>
            
            <h2>Utilisation des services</h2>
            <p>
              Nos services sont fournis "tels quels" sans garantie d'aucune sorte. Nous ne garantissons pas que nos services
              seront ininterrompus, sécurisés ou exempts d'erreurs.
            </p>
            
            <h2>Compte utilisateur</h2>
            <p>
              Pour accéder à certaines fonctionnalités de notre site, vous devrez créer un compte. Vous êtes responsable
              de maintenir la confidentialité de votre compte et mot de passe et de restreindre l'accès à votre ordinateur.
            </p>
            
            <h2>Limitations de responsabilité</h2>
            <p>
              AI Académie ne sera pas tenue responsable des dommages directs, indirects, accessoires, consécutifs ou punitifs
              résultant de votre utilisation ou de votre incapacité à utiliser nos services.
            </p>
            
            <h2>Modifications des conditions</h2>
            <p>
              Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment. Les modifications entrent
              en vigueur dès leur publication sur le site. Il est de votre responsabilité de consulter régulièrement
              les conditions d'utilisation.
            </p>
            
            <h2>Loi applicable</h2>
            <p>
              Ces conditions sont régies par les lois françaises. Tout litige relatif à l'interprétation ou à l'exécution
              de ces conditions sera de la compétence exclusive des tribunaux français.
            </p>
            
            <h2>Contact</h2>
            <p>
              Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter à legal@aiacademie.fr.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfUse;
