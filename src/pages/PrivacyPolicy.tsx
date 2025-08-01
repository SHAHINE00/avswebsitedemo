
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-12 bg-gradient-to-br from-white to-academy-gray">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Politique de confidentialité</h1>
        </div>
      </div>
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto prose prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700">
            <p>Dernière mise à jour : 10 mai 2025</p>
            
            <h2>Introduction</h2>
            <p>
              AVS INSTITUTE s'engage à protéger la vie privée et les données personnelles de ses utilisateurs.
              Cette politique de confidentialité décrit nos pratiques concernant la collecte et l'utilisation des informations
              que vous nous fournissez lorsque vous utilisez notre site web et nos services.
            </p>
            
            <h2>Collecte et utilisation des données</h2>
            <p>
              Nous collectons différents types d'informations auprès de nos utilisateurs pour améliorer
              nos services et garantir une expérience optimale sur notre plateforme :
            </p>
            <ul>
              <li>Informations personnelles (nom, adresse email, numéro de téléphone) lors de l'inscription</li>
              <li>Données de navigation et d'utilisation du site</li>
              <li>Informations sur l'appareil et le navigateur utilisés</li>
            </ul>
            
            <h2>Protection des données</h2>
            <p>
              AVS INSTITUTE met en œuvre diverses mesures de sécurité pour protéger vos informations personnelles 
              contre l'accès non autorisé, la modification, la divulgation ou la destruction.
            </p>
            
            <h2>Partage avec des tiers</h2>
            <p>
              Nous ne vendons, n'échangeons ni ne transférons vos informations personnelles à des tiers 
              sans votre consentement, sauf lorsque cela est nécessaire pour fournir un service demandé 
              ou lorsque nous sommes légalement tenus de le faire.
            </p>
            
            <h2>Cookies</h2>
            <p>
              Notre site utilise des cookies pour améliorer votre expérience, analyser l'utilisation du site 
              et personnaliser le contenu. Vous pouvez désactiver les cookies dans les paramètres de votre navigateur.
            </p>
            
            <h2>Vos droits</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, 
              de rectification, de suppression et de portabilité de vos données personnelles.
            </p>
            
            <h2>Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, 
              veuillez nous contacter à privacy@avs.ma.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
