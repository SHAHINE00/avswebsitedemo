
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { legalPagesSEO } from '@/utils/seoData';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead {...legalPagesSEO.privacyPolicy} />
      <Navbar />
      
      <div className="pt-24 pb-12 bg-gradient-to-br from-white to-academy-gray">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Politique de confidentialité</h1>
        </div>
      </div>
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto prose prose-lg prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700">
            <p><strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
            
            <h2>1. Responsable du traitement</h2>
            <p>
              <strong>AVS Institut</strong> est responsable du traitement de vos données personnelles.
              <br />Contact : privacy@avsinstitut.com
              <br />Adresse : [Adresse complète à ajouter]
            </p>

            <h2>2. Base légale et finalités du traitement</h2>
            <h3>2.1 Exécution du contrat</h3>
            <p>Nous traitons vos données pour :</p>
            <ul>
              <li>Gérer vos inscriptions aux formations</li>
              <li>Fournir nos services éducatifs</li>
              <li>Traiter vos paiements</li>
              <li>Communiquer concernant vos formations</li>
            </ul>

            <h3>2.2 Intérêts légitimes</h3>
            <p>Nous traitons vos données pour :</p>
            <ul>
              <li>Améliorer nos services (avec votre consentement pour les cookies analytiques)</li>
              <li>Assurer la sécurité de notre plateforme</li>
              <li>Gérer la relation client</li>
            </ul>

            <h3>2.3 Consentement</h3>
            <p>Avec votre consentement, nous utilisons :</p>
            <ul>
              <li>Cookies analytiques (Google Analytics)</li>
              <li>Cookies marketing pour personnaliser votre expérience</li>
              <li>Newsletter et communications marketing</li>
            </ul>

            <h2>3. Données collectées</h2>
            <h3>3.1 Données d'identification</h3>
            <ul>
              <li>Nom et prénom</li>
              <li>Adresse e-mail</li>
              <li>Numéro de téléphone</li>
            </ul>

            <h3>3.2 Données de navigation</h3>
            <ul>
              <li>Adresse IP</li>
              <li>Données de cookies (avec consentement)</li>
              <li>Pages visitées et temps de session</li>
              <li>Appareil et navigateur utilisés</li>
            </ul>

            <h3>3.3 Données d'apprentissage</h3>
            <ul>
              <li>Progrès dans les cours</li>
              <li>Résultats aux quiz</li>
              <li>Notes et discussions</li>
              <li>Certificats obtenus</li>
            </ul>

            <h2>4. Durée de conservation</h2>
            <ul>
              <li><strong>Données de compte :</strong> 3 ans après la dernière connexion</li>
              <li><strong>Données de formation :</strong> 10 ans pour les certificats</li>
              <li><strong>Données de facturation :</strong> 10 ans (obligation légale)</li>
              <li><strong>Cookies analytiques :</strong> 26 mois maximum</li>
              <li><strong>Logs de sécurité :</strong> 1 an</li>
            </ul>

            <h2>5. Destinataires des données</h2>
            <h3>5.1 Sous-traitants</h3>
            <ul>
              <li><strong>Supabase :</strong> Hébergement des données (États-Unis - clauses contractuelles types)</li>
              <li><strong>Google Analytics :</strong> Analyse de trafic (avec consentement)</li>
              <li><strong>Hostinger :</strong> Hébergement web</li>
              <li><strong>Prestataires de paiement :</strong> Traitement des transactions</li>
            </ul>

            <h3>5.2 Transferts internationaux</h3>
            <p>
              Certaines données peuvent être transférées hors UE (Supabase - États-Unis) avec des garanties appropriées 
              (clauses contractuelles types de la Commission européenne).
            </p>

            <h2>6. Vos droits RGPD</h2>
            <h3>6.1 Droit d'accès</h3>
            <p>Vous pouvez demander une copie de toutes vos données personnelles.</p>

            <h3>6.2 Droit de rectification</h3>
            <p>Vous pouvez modifier vos données inexactes ou incomplètes.</p>

            <h3>6.3 Droit à l'effacement</h3>
            <p>Vous pouvez demander la suppression de vos données dans certaines conditions.</p>

            <h3>6.4 Droit à la portabilité</h3>
            <p>Vous pouvez récupérer vos données dans un format structuré et lisible.</p>

            <h3>6.5 Droit d'opposition</h3>
            <p>Vous pouvez vous opposer au traitement basé sur l'intérêt légitime.</p>

            <h3>6.6 Retrait du consentement</h3>
            <p>Vous pouvez retirer votre consentement pour les cookies et le marketing à tout moment.</p>

            <h2>7. Sécurité des données</h2>
            <ul>
              <li>Chiffrement des données en transit et au repos</li>
              <li>Authentification à deux facteurs disponible</li>
              <li>Surveillance continue des accès</li>
              <li>Sauvegarde régulière et sécurisée</li>
              <li>Formation du personnel à la sécurité</li>
            </ul>

            <h2>8. Cookies et technologies similaires</h2>
            <p>
              Nous utilisons différents types de cookies. Vous pouvez gérer vos préférences via notre bannière 
              de consentement ou dans les paramètres de votre compte.
            </p>
            <ul>
              <li><strong>Cookies nécessaires :</strong> Toujours actifs (fonctionnement du site)</li>
              <li><strong>Cookies analytiques :</strong> Google Analytics (avec consentement)</li>
              <li><strong>Cookies marketing :</strong> Personnalisation publicitaire (avec consentement)</li>
            </ul>

            <h2>9. Exercer vos droits</h2>
            <p>
              Pour exercer vos droits ou pour toute question relative à cette politique :
            </p>
            <ul>
              <li>Via votre espace personnel (section "Confidentialité et Données")</li>
              <li>Par e-mail : privacy@avsinstitut.com</li>
              <li>Délai de réponse : 1 mois maximum</li>
            </ul>

            <h2>10. Réclamation</h2>
            <p>
              Vous avez le droit de déposer une plainte auprès de la Commission Nationale de l'informatique 
              et des Libertés (CNIL) si vous estimez que le traitement de vos données ne respecte pas le RGPD.
            </p>

            <h2>11. Modifications</h2>
            <p>
              Cette politique peut être mise à jour. Les modifications importantes vous seront notifiées 
              par e-mail ou via une notification sur la plateforme.
            </p>
            <p><strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
