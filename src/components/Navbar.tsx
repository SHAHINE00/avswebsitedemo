
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white py-4 px-6 shadow-sm fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <span className="font-montserrat font-bold text-2xl">
            <span className="text-academy-blue">AI</span>
            <span className="text-academy-purple">Academy</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#features" className="font-medium hover:text-academy-blue transition-colors">Features</a>
          <a href="#curriculum" className="font-medium hover:text-academy-blue transition-colors">Curriculum</a>
          <a href="#instructors" className="font-medium hover:text-academy-blue transition-colors">Instructors</a>
          <a href="#pricing" className="font-medium hover:text-academy-blue transition-colors">Pricing</a>
          <a href="#testimonials" className="font-medium hover:text-academy-blue transition-colors">Testimonials</a>
          <Button className="ml-4 bg-academy-blue hover:bg-academy-purple">Enroll Now</Button>
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
            <a href="#features" className="font-medium" onClick={() => setIsOpen(false)}>Features</a>
            <a href="#curriculum" className="font-medium" onClick={() => setIsOpen(false)}>Curriculum</a>
            <a href="#instructors" className="font-medium" onClick={() => setIsOpen(false)}>Instructors</a>
            <a href="#pricing" className="font-medium" onClick={() => setIsOpen(false)}>Pricing</a>
            <a href="#testimonials" className="font-medium" onClick={() => setIsOpen(false)}>Testimonials</a>
            <Button className="bg-academy-blue hover:bg-academy-purple w-full">Enroll Now</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
