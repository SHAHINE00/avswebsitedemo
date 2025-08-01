
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const CookiesPolicy = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-12 bg-gradient-to-br from-white to-academy-gray">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Politique de cookies</h1>
        </div>
      </div>
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto prose prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700">
            <p>Dernière mise à jour : 10 mai 2025</p>
            
            <h2>Qu'est-ce qu'un cookie ?</h2>
            <p>
              Un cookie est un petit fichier texte stocké sur votre appareil (ordinateur, tablette, smartphone) 
              lorsque vous naviguez sur un site web. Les cookies permettent à un site web de reconnaître votre appareil
              et de mémoriser certaines informations vous concernant, comme vos préférences de navigation.
            </p>
            
            <h2>Types de cookies utilisés</h2>
            <p>
              Nous utilisons différents types de cookies sur notre site :
            </p>
            <ul>
              <li>
                <strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site, ils vous permettent d'utiliser ses fonctionnalités de base.
              </li>
              <li>
                <strong>Cookies de performance :</strong> Ils nous aident à comprendre comment les visiteurs interagissent avec notre site en recueillant des informations anonymisées.
              </li>
              <li>
                <strong>Cookies de fonctionnalité :</strong> Ils permettent au site de se souvenir des choix que vous faites et de fournir des fonctionnalités améliorées et personnalisées.
              </li>
              <li>
                <strong>Cookies de ciblage :</strong> Ils sont utilisés pour vous montrer des publicités pertinentes en fonction de vos intérêts.
              </li>
            </ul>
            
            <h2>Gestion des cookies</h2>
            <p>
              Vous pouvez contrôler et/ou supprimer les cookies comme vous le souhaitez. Vous pouvez supprimer tous les cookies déjà présents sur votre appareil et vous pouvez configurer la plupart des navigateurs pour qu'ils ne les acceptent pas. Toutefois, si vous faites cela, vous devrez peut-être ajuster manuellement certaines préférences chaque fois que vous visiterez un site, et certaines fonctionnalités pourraient ne pas fonctionner.
            </p>
            
            <h2>Comment modifier vos paramètres de cookies</h2>
            <p>
              La plupart des navigateurs web vous permettent de gérer vos préférences en matière de cookies. Vous pouvez configurer votre navigateur pour refuser les cookies ou supprimer certains cookies. En général, vous trouverez les paramètres de cookies dans les menus "Options", "Outils" ou "Préférences" de votre navigateur.
            </p>
            
            <h2>Mises à jour de notre politique de cookies</h2>
            <p>
              Nous pouvons mettre à jour notre politique de cookies de temps à autre pour refléter les changements dans notre pratique ou pour d'autres raisons opérationnelles, légales ou réglementaires. Nous vous encourageons donc à consulter régulièrement cette page.
            </p>
            
            <h2>Contact</h2>
            <p>
              Si vous avez des questions concernant l'utilisation des cookies sur notre site, n'hésitez pas à nous contacter à privacy@avs.ma.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CookiesPolicy;
