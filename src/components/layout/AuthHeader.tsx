
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

type AuthHeaderProps = {
  title: string;
  subtitle?: string;
};

const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => {
  return (
    <div className="mb-8">
      <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to home
      </Link>
      <h1 className="mt-6 text-3xl font-bold">{title}</h1>
      {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
    </div>
  );
};

export default AuthHeader;
