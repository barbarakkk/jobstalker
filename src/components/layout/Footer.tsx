
import React from 'react';

const Footer = () => {
  return (
    <div className="py-4 px-6 bg-white border-t border-gray-100 text-center text-sm text-gray-500">
      <div className="container mx-auto">
        <p>© {new Date().getFullYear()} JobStalker. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
