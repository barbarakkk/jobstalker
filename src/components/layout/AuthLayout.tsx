
import React, { ReactNode } from 'react';
import Logo from './Logo';
import Footer from './Footer';

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top navigation bar */}
      <div className="py-4 px-6 md:px-10 bg-white border-b border-gray-100">
        <div className="container mx-auto">
          <Logo />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AuthLayout;
