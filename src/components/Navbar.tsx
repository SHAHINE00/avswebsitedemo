
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white py-4 px-6 shadow-sm fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="font-montserrat font-bold text-2xl">
            <span className="text-academy-blue">AI</span>
            <span className="text-academy-purple">Académie</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/features" className="font-medium hover:text-academy-blue transition-colors">Atouts</Link>
          <Link to="/curriculum" className="font-medium hover:text-academy-blue transition-colors">Programme</Link>
          <Link to="/instructors" className="font-medium hover:text-academy-blue transition-colors">Formateurs</Link>
          <Link to="/testimonials" className="font-medium hover:text-academy-blue transition-colors">Témoignages</Link>
          <Button asChild className="ml-4 bg-academy-blue hover:bg-academy-purple">
            <Link to="/register">S'inscrire</Link>
          </Button>
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
            <Link to="/curriculum" className="font-medium" onClick={() => setIsOpen(false)}>Programme</Link>
            <Link to="/instructors" className="font-medium" onClick={() => setIsOpen(false)}>Formateurs</Link>
            <Link to="/testimonials" className="font-medium" onClick={() => setIsOpen(false)}>Témoignages</Link>
            <Button asChild className="bg-academy-blue hover:bg-academy-purple w-full">
              <Link to="/register" onClick={() => setIsOpen(false)}>S'inscrire</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
