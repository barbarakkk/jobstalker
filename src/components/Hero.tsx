
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-6 md:pt-40 md:pb-32 hero-gradient">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 max-w-3xl">
            Your Job Search, <span className="gradient-text">Simplified</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
            Track applications, analyze progress, and land your dream job with our intelligent
            job search companion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="text-md px-8 bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                Log In
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="text-md border-blue-600 text-blue-600">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
