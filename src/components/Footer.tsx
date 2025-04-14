
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
              <span className="text-academy-blue">AI</span>
              <span className="text-academy-purple">Academy</span>
            </div>
            <p className="mb-4">
              Empowering the next generation of AI specialists with comprehensive, 
              industry-focused training and career development.
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
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-academy-blue transition-colors">Features</a></li>
              <li><a href="#curriculum" className="hover:text-academy-blue transition-colors">Curriculum</a></li>
              <li><a href="#instructors" className="hover:text-academy-blue transition-colors">Instructors</a></li>
              <li><a href="#pricing" className="hover:text-academy-blue transition-colors">Pricing</a></li>
              <li><a href="#testimonials" className="hover:text-academy-blue transition-colors">Testimonials</a></li>
              <li><a href="#" className="hover:text-academy-blue transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-academy-blue transition-colors">Careers</a></li>
            </ul>
          </div>
          
          {/* Column 3 - Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-academy-blue mr-2 mt-0.5 shrink-0" />
                <span>123 AI Campus Drive, San Francisco, CA 94103, USA</span>
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
            <p className="mb-4">Subscribe to our newsletter for AI industry insights and program updates.</p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-academy-blue"
              />
              <button
                type="submit"
                className="w-full bg-academy-blue hover:bg-academy-purple text-white py-2 rounded transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; {new Date().getFullYear()} AI Academy. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-academy-blue transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-academy-blue transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-academy-blue transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
