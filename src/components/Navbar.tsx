
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import NotificationBell from './user/NotificationBell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Formations', href: '/curriculum' },
    { name: 'Fonctionnalités', href: '/features' },
    { name: 'Formateurs', href: '/instructors' },
    { name: 'Témoignages', href: '/testimonials' },
    { name: 'Carrières', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    return path !== '/' && location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm fixed w-full z-50 top-0">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-28 relative">
          {/* Desktop Navigation - Left */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigation.slice(0, 4).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-academy-blue'
                    : 'text-gray-700 hover:text-academy-blue'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Logo - Centered */}
          <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 lg:relative lg:left-auto lg:transform-none flex items-center justify-center">
            <img 
              src="/lovable-uploads/f3c7543c-fddb-40be-aa1c-7e6b6891bccb.png" 
              alt="AVS Innovation Institute" 
              className="h-24 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation - Right */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigation.slice(4).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-academy-blue'
                    : 'text-gray-700 hover:text-academy-blue'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center space-x-4 ml-6">
            {user ? (
              <>
                <NotificationBell />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {user.email?.split('@')[0]}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Tableau de bord
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-red-600">
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/auth">Connexion</Link>
                </Button>
                <Button asChild size="sm" className="bg-academy-blue hover:bg-academy-purple">
                  <Link to="/appointment">Prendre RDV</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-academy-blue bg-academy-blue/10'
                      : 'text-gray-700 hover:text-academy-blue hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-academy-blue hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Tableau de bord
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-academy-blue hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/appointment"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-academy-blue text-white hover:bg-academy-purple"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Prendre RDV
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
