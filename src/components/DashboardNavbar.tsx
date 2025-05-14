
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';
import { Menu, X, LogOut, User, Briefcase } from 'lucide-react';

const DashboardNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="py-4 px-6 md:px-10 fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="bg-blue-600 text-white rounded-md w-8 h-8 flex items-center justify-center text-lg font-bold">JS</div>
              <span className="text-xl font-bold text-gray-800">JobStalker</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/dashboard" 
              className={`${location.pathname === '/dashboard' ? 'text-blue-700' : 'text-gray-700 hover:text-blue-700'} transition-colors`}
            >
              Dashboard
            </Link>
            <Link 
              to="/jobs" 
              className={`${location.pathname === '/jobs' ? 'text-blue-700' : 'text-gray-700 hover:text-blue-700'} transition-colors`}
            >
              Job Tracker
            </Link>
            
            {user && (
              <div className="flex items-center gap-3">
                <Button variant="ghost" className="flex items-center gap-2" onClick={handleSignOut}>
                  <LogOut size={16} />
                  Log Out
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <User size={16} />
                  Profile
                </Button>
              </div>
            )}
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
            <Link 
              to="/dashboard" 
              className={`${location.pathname === '/dashboard' ? 'text-blue-700' : 'text-gray-700'} py-2 transition-colors`} 
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
            <Link 
              to="/jobs" 
              className={`${location.pathname === '/jobs' ? 'text-blue-700' : 'text-gray-700'} py-2 transition-colors`} 
              onClick={toggleMenu}
            >
              Job Tracker
            </Link>
            
            {user && (
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                <Button 
                  variant="ghost" 
                  className="flex justify-start items-center gap-2"
                  onClick={() => {
                    toggleMenu();
                    handleSignOut();
                  }}
                >
                  <LogOut size={16} />
                  Log Out
                </Button>
                <Button variant="outline" className="flex justify-start items-center gap-2">
                  <User size={16} />
                  Profile
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default DashboardNavbar;
