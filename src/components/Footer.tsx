
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Column 1 - About */}
          <div>
            <Link to="/" className="mb-4 inline-block">
              <img 
                src="/lovable-uploads/4de454e0-72f1-4194-b789-e0b545468e2e.png"
                alt="AVS - Institut de l'Innovation et de l'Intelligence Artificielle" 
                className="h-10 w-auto object-contain filter brightness-0 invert"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'block';
                  }
                }}
              />
              <span 
                className="font-montserrat font-bold text-2xl text-white hidden"
                style={{ display: 'none' }}
              >
                <span className="text-academy-blue">A</span>
                <span className="text-academy-purple">VS</span>
              </span>
            </Link>
            <p className="mb-4">
              AVS l'institut de l'Innovation et de l'Intelligence Artificielle - Offrir à la nouvelle génération des spécialistes AI une formation pratique et une évolution de carrière.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-academy-blue transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-academy-blue transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-academy-blue transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="hover:text-academy-blue transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="hover:text-academy-blue transition-colors">Atouts</Link></li>
              <li><Link to="/curriculum" className="hover:text-academy-blue transition-colors">Programme</Link></li>
              <li><Link to="/instructors" className="hover:text-academy-blue transition-colors">Formateurs</Link></li>
              <li><Link to="/testimonials" className="hover:text-academy-blue transition-colors">Témoignages</Link></li>
              <li><Link to="/blog" className="hover:text-academy-blue transition-colors">Blog</Link></li>
              <li><Link to="/careers" className="hover:text-academy-blue transition-colors">Carrières</Link></li>
            </ul>
          </div>
          
          {/* Column 3 - Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Newsletter</h3>
            <p className="mb-4">Abonnez-vous à notre newsletter pour recevoir des actualités AI et offres de formation.</p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Votre adresse e-mail"
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-academy-blue"
              />
              <button
                type="submit"
                className="w-full bg-academy-blue hover:bg-academy-purple text-white py-2 rounded transition-colors"
              >
                S'abonner
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; {new Date().getFullYear()} AVS. Tous droits réservés.</p>
            </div>
            <div className="flex space-x-6">
              <Link to="/privacy-policy" className="hover:text-academy-blue transition-colors">Politique de confidentialité</Link>
              <Link to="/terms-of-use" className="hover:text-academy-blue transition-colors">Conditions d'utilisation</Link>
              <Link to="/cookies-policy" className="hover:text-academy-blue transition-colors">Politique cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
