
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, LogOut, Settings } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import OptimizedImage from '@/components/OptimizedImage';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      setIsAdmin(data?.role === 'admin');
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white py-4 px-6 shadow-sm fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <OptimizedImage
              src="/lovable-uploads/0db8713d-35db-40a9-8615-5db99717c56c.png"
              alt="AVS - Institut de l'Innovation et de l'Intelligence Artificielle" 
              className="h-14 w-auto object-contain"
              priority={true}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const nextElement = e.currentTarget.nextSibling as HTMLElement;
                if (nextElement) {
                  nextElement.style.display = 'block';
                }
              }}
            />
            <span 
              className="font-montserrat font-bold text-2xl hidden"
              style={{ display: 'none' }}
            >
              <span className="text-academy-blue">A</span>
              <span className="text-academy-purple">VS</span>
            </span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/features" className="font-medium hover:text-academy-blue transition-colors">Atouts</Link>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-medium hover:text-academy-blue transition-colors bg-transparent">
                  Formations
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-academy-purple/20 to-academy-blue/20 p-6 no-underline outline-none focus:shadow-md"
                          to="/curriculum"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium text-academy-blue">
                            Programmes complets
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Découvrez notre programme complet de formations en IA et en programmation.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/ai-course" title="Formation IA">
                      Intelligence Artificielle, Machine Learning et Deep Learning
                    </ListItem>
                    <ListItem href="/programming-course" title="Formation Programmation">
                      Développement web, mobile et logiciel
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-medium hover:text-academy-blue transition-colors bg-transparent">
                  Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4">
                    <ListItem href="/blog" title="Blog">
                      Articles et actualités sur l'IA et la technologie
                    </ListItem>
                    <ListItem href="/careers" title="Carrières">
                      Opportunités de carrière et conseils professionnels
                    </ListItem>
                    <ListItem href="/contact" title="Contact">
                      Contactez notre équipe pour plus d'informations
                    </ListItem>
                    <ListItem href="/appointment" title="Rendez-vous">
                      Planifiez un entretien personnalisé
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <Link to="/instructors" className="font-medium hover:text-academy-blue transition-colors">Formateurs</Link>
          <Link to="/testimonials" className="font-medium hover:text-academy-blue transition-colors">Témoignages</Link>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-4">
                  {user.email}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/courses">
                        <Settings className="mr-2 h-4 w-4" />
                        Administration
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="ml-4 bg-academy-blue hover:bg-academy-purple">
              <Link to="/auth">Se connecter</Link>
            </Button>
          )}
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white absolute w-full left-0 px-6 py-4 shadow-md">
          <div className="flex flex-col space-y-4">
            <Link to="/features" className="font-medium" onClick={() => setIsOpen(false)}>Atouts</Link>
            <div className="font-medium">
              Formations <ChevronDown size={16} className="inline ml-1" />
              <div className="pl-4 mt-2 space-y-2">
                <Link to="/curriculum" className="block py-1" onClick={() => setIsOpen(false)}>Programmes complets</Link>
                <Link to="/ai-course" className="block py-1" onClick={() => setIsOpen(false)}>Formation IA</Link>
                <Link to="/programming-course" className="block py-1" onClick={() => setIsOpen(false)}>Formation Programmation</Link>
              </div>
            </div>
            <div className="font-medium">
              Services <ChevronDown size={16} className="inline ml-1" />
              <div className="pl-4 mt-2 space-y-2">
                <Link to="/blog" className="block py-1" onClick={() => setIsOpen(false)}>Blog</Link>
                <Link to="/careers" className="block py-1" onClick={() => setIsOpen(false)}>Carrières</Link>
                <Link to="/contact" className="block py-1" onClick={() => setIsOpen(false)}>Contact</Link>
                <Link to="/appointment" className="block py-1" onClick={() => setIsOpen(false)}>Rendez-vous</Link>
              </div>
            </div>
            <Link to="/instructors" className="font-medium" onClick={() => setIsOpen(false)}>Formateurs</Link>
            <Link to="/testimonials" className="font-medium" onClick={() => setIsOpen(false)}>Témoignages</Link>
            
            {user ? (
              <div className="space-y-2">
                {isAdmin && (
                  <Link to="/admin/courses" className="block font-medium text-academy-blue" onClick={() => setIsOpen(false)}>
                    Administration
                  </Link>
                )}
                <Button variant="outline" onClick={handleSignOut} className="w-full">
                  Déconnexion
                </Button>
              </div>
            ) : (
              <Button asChild className="bg-academy-blue hover:bg-academy-purple w-full">
                <Link to="/auth" onClick={() => setIsOpen(false)}>Se connecter</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string;
  }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navbar;
