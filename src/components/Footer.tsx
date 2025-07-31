
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-6 sm:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {/* Column 1 - About */}
          <div>
            <Link to="/" className="mb-4 inline-block">
              <img
                src="/lovable-uploads/b53d5fbe-9869-4eff-8493-4d7c4ff0be2d.png"
                alt="AVS Innovation Institute" 
                className="h-28 sm:h-32 lg:h-40 w-auto object-contain filter brightness-0 invert"
              />
              <span 
                className="font-montserrat font-bold text-2xl text-white hidden"
                style={{ display: 'none' }}
              >
                <span className="text-academy-blue">A</span>
                <span className="text-academy-purple">VS</span>
              </span>
            </Link>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              AVS l'institut de l'Innovation et de l'Intelligence Artificielle - Offrir à la nouvelle génération des spécialistes AI une formation pratique et une évolution de carrière.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/avsacademy" target="_blank" rel="noopener noreferrer" className="hover:text-academy-blue transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com/avsacademy" target="_blank" rel="noopener noreferrer" className="hover:text-academy-blue transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com/company/avsacademy" target="_blank" rel="noopener noreferrer" className="hover:text-academy-blue transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://instagram.com/avsacademy" target="_blank" rel="noopener noreferrer" className="hover:text-academy-blue transition-colors">
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
              <li><Link to="/ai-course" className="hover:text-academy-blue transition-colors">Formation IA</Link></li>
              <li><Link to="/programming-course" className="hover:text-academy-blue transition-colors">Formation Programmation</Link></li>
              <li><Link to="/instructors" className="hover:text-academy-blue transition-colors">Formateurs</Link></li>
              <li><Link to="/testimonials" className="hover:text-academy-blue transition-colors">Témoignages</Link></li>
              <li><Link to="/appointment" className="hover:text-academy-blue transition-colors">Rendez-vous</Link></li>
              <li><Link to="/blog" className="hover:text-academy-blue transition-colors">Blog</Link></li>
              <li><Link to="/careers" className="hover:text-academy-blue transition-colors">Carrières</Link></li>
              <li><Link to="/contact" className="hover:text-academy-blue transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          {/* Column 3 - Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start">
                <MapPin className="text-academy-blue mr-2 mt-1 flex-shrink-0" size={16} />
                <p className="text-xs sm:text-sm">Avenue Allal El Fassi – Alpha 2000<br />Marrakech – MAROC</p>
              </div>
              <div className="flex items-center">
                <Phone className="text-academy-blue mr-2 flex-shrink-0" size={16} />
                <div className="text-xs sm:text-sm">
                  <p>+212 6 62 63 29 53</p>
                  <p>+212 5 24 31 19 82</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="text-academy-blue mr-2 flex-shrink-0" size={16} />
                <p className="text-xs sm:text-sm">info@avs.ma</p>
              </div>
            </div>
          </div>
          
          {/* Column 4 - Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Newsletter</h3>
            <p className="mb-3 sm:mb-4 text-xs sm:text-sm">Abonnez-vous à notre newsletter pour recevoir des actualités AI et offres de formation.</p>
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Votre adresse e-mail"
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-academy-blue"
                required
              />
              <button
                type="submit"
                className="w-full bg-academy-blue hover:bg-academy-purple text-white py-1.5 sm:py-2 text-xs sm:text-sm rounded transition-colors"
              >
                S'abonner
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="mb-3 sm:mb-4 md:mb-0">
              <p className="text-xs sm:text-sm">&copy; {new Date().getFullYear()} AVS INSTITUTE. Tous droits réservés.</p>
            </div>
            <div className="flex flex-wrap justify-center space-x-4 sm:space-x-6 text-xs sm:text-sm">
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
