
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, Menu, UserPlus, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="py-4 px-6 md:px-10 fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2">
              <div className="bg-purple-600 text-white rounded-md w-8 h-8 flex items-center justify-center text-lg font-bold">JS</div>
              <span className="text-xl font-bold">JobStalker</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-700 hover:text-purple-700 transition-colors">Features</a>
            <a href="#testimonials" className="text-gray-700 hover:text-purple-700 transition-colors">Testimonials</a>
            <a href="#pricing" className="text-gray-700 hover:text-purple-700 transition-colors">Pricing</a>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-1">
                <LogIn className="h-4 w-4" />
                <span>Log In</span>
              </Button>
              <Button className="flex items-center gap-1">
                <UserPlus className="h-4 w-4" />
                <span>Sign Up</span>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 right-0 bg-white border-b border-gray-200 py-4 px-6 z-50">
          <div className="flex flex-col space-y-4">
            <a href="#features" className="text-gray-700 hover:text-purple-700 py-2 transition-colors" onClick={toggleMenu}>Features</a>
            <a href="#testimonials" className="text-gray-700 hover:text-purple-700 py-2 transition-colors" onClick={toggleMenu}>Testimonials</a>
            <a href="#pricing" className="text-gray-700 hover:text-purple-700 py-2 transition-colors" onClick={toggleMenu}>Pricing</a>
            
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
              <Button variant="outline" className="flex justify-center items-center gap-1 w-full">
                <LogIn className="h-4 w-4" />
                <span>Log In</span>
              </Button>
              <Button className="flex justify-center items-center gap-1 w-full">
                <UserPlus className="h-4 w-4" />
                <span>Sign Up</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
