import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

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
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 text-white rounded-md w-8 h-8 flex items-center justify-center text-lg font-bold">JS</div>
              <span className="text-xl font-bold text-gray-800">Jobstalker</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-700 hover:text-blue-700 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-700 transition-colors">Pricing</a>
            <a href="#testimonials" className="text-gray-700 hover:text-blue-700 transition-colors">About Us</a>
            <a href="#" className="text-gray-700 hover:text-blue-700 transition-colors">Blog</a>
            <Link to="/job-matcher" className="text-gray-700 hover:text-blue-700 transition-colors">
              Job Matcher
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/signup">
                <Button variant="outline" className="text-blue-600 border-blue-600">
                  Sign Up
                </Button>
              </Link>
              <Link to="/login">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Log In
                </Button>
              </Link>
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
            <a href="#features" className="text-gray-700 hover:text-blue-700 py-2 transition-colors" onClick={toggleMenu}>Features</a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-700 py-2 transition-colors" onClick={toggleMenu}>Pricing</a>
            <a href="#testimonials" className="text-gray-700 hover:text-blue-700 py-2 transition-colors" onClick={toggleMenu}>About Us</a>
            <a href="#" className="text-gray-700 hover:text-blue-700 py-2 transition-colors" onClick={toggleMenu}>Blog</a>
            <Link to="/job-matcher" onClick={toggleMenu} className="text-gray-700 hover:text-blue-700 py-2 transition-colors">
              Job Matcher
            </Link>
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
              <Link to="/signup" onClick={toggleMenu}>
                <Button variant="outline" className="flex justify-center items-center w-full text-blue-600 border-blue-600">
                  Sign Up
                </Button>
              </Link>
              <Link to="/login" onClick={toggleMenu}>
                <Button className="flex justify-center items-center w-full bg-blue-600 hover:bg-blue-700">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
