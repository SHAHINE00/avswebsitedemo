
import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Mail, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Column 1 - About */}
          <div>
            <div className="font-montserrat font-bold text-2xl text-white mb-4">
              <span className="text-academy-blue">IA</span>
              <span className="text-academy-purple">Académie</span>
            </div>
            <p className="mb-4">
              Offrir à la nouvelle génération des spécialistes IA une formation pratique et une évolution de carrière.
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
              <li><a href="#features" className="hover:text-academy-blue transition-colors">Atouts</a></li>
              <li><a href="#curriculum" className="hover:text-academy-blue transition-colors">Programme</a></li>
              <li><a href="#instructors" className="hover:text-academy-blue transition-colors">Formateurs</a></li>
              <li><a href="#pricing" className="hover:text-academy-blue transition-colors">Tarifs</a></li>
              <li><a href="#testimonials" className="hover:text-academy-blue transition-colors">Témoignages</a></li>
              <li><a href="#" className="hover:text-academy-blue transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-academy-blue transition-colors">Carrières</a></li>
            </ul>
          </div>
          
          {/* Column 3 - Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-academy-blue mr-2 mt-0.5 shrink-0" />
                <span>123 avenue Campus IA, San Francisco, CA 94103, États-Unis</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-academy-blue mr-2 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-academy-blue mr-2 shrink-0" />
                <span>admissions@aiacademy.com</span>
              </li>
            </ul>
          </div>
          
          {/* Column 4 - Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Newsletter</h3>
            <p className="mb-4">Abonnez-vous à notre newsletter pour recevoir des actualités IA et offres de formation.</p>
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
              <p>&copy; {new Date().getFullYear()} IA Académie. Tous droits réservés.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-academy-blue transition-colors">Politique de confidentialité</a>
              <a href="#" className="hover:text-academy-blue transition-colors">Conditions d'utilisation</a>
              <a href="#" className="hover:text-academy-blue transition-colors">Politique cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
