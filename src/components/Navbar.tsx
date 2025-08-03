
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { Button } from './ui/button';
import NotificationBell from './user/NotificationBell';
import OptimizedImage from '@/components/OptimizedImage';
import SafeComponentWrapper from '@/components/ui/SafeComponentWrapper';
import { useSafeState, useSafeLocation, useSafeAuth } from '@/hooks/useSafeHooks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const NavbarCore = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useSafeState(false);
  const location = useSafeLocation();
  const { user, signOut } = useSafeAuth();

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Formations', href: '/curriculum' },
    { name: 'Fonctionnalités', href: '/features' },
    { name: 'Formateurs', href: '/instructors' },
    { name: 'À propos', href: '/about' },
    { name: 'Carrières', href: '/careers' },
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
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm fixed w-full z-50 top-0 will-change-transform">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center h-16 xs:h-18 sm:h-20 lg:h-22 xl:h-24 relative">
          {/* Logo - Desktop Left */}
          <div className="hidden lg:flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center py-2">
               <OptimizedImage 
                src="/lovable-uploads/b53d5fbe-9869-4eff-8493-4d7c4ff0be2d.png" 
                alt="AVS Innovation Institute" 
                className="h-12 lg:h-14 xl:h-16 2xl:h-18 w-auto object-contain transform hover:scale-105 transition-transform duration-200"
                priority={true}
              />
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="flex items-center space-x-6 xl:space-x-8 2xl:space-x-10">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm xl:text-base font-medium transition-colors duration-200 px-2 py-1 rounded-md min-h-[44px] flex items-center ${
                    isActive(item.href)
                      ? 'text-academy-blue'
                      : 'text-gray-700 hover:text-academy-blue'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth - Right */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
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
                  <DropdownMenuContent align="end" sideOffset={8} className="w-56">
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

          {/* Mobile - Logo Centered, Menu Button Right */}
          <div className="lg:hidden flex items-center justify-between w-full">
            <div className="w-10"></div> {/* Spacer for centering */}
            <Link to="/" className="flex items-center py-1">
               <OptimizedImage 
                src="/lovable-uploads/b53d5fbe-9869-4eff-8493-4d7c4ff0be2d.png" 
                alt="AVS Innovation Institute" 
                className="h-12 xs:h-14 sm:h-16 w-auto object-contain transform hover:scale-105 transition-transform duration-200"
                priority={true}
              />
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex-shrink-0 min-h-[44px] min-w-[44px] touch-manipulation"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t scroll-container">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 min-h-[44px] touch-manipulation ${
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

const Navbar = () => {
  return (
    <SafeComponentWrapper 
      componentName="Navbar" 
      requiresRouter={true}
      requiresAuth={true}
    >
      <NavbarCore />
    </SafeComponentWrapper>
  );
};

export default Navbar;
