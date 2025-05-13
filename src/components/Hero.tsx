
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-6 md:pt-40 md:pb-32 hero-gradient">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Land <span className="gradient-text">3x more interviews</span> with AI-powered job search
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto md:mx-0">
              JobStalker uses advanced AI to optimize your job search, tailor your resume, and prepare you for interviews. Get the edge you need to stand out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" className="text-md px-8">
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" className="text-md flex items-center gap-2">
                See how it works
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-8 text-sm text-gray-500">
              <p>No credit card required. Free plan available.</p>
            </div>
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative bg-white rounded-2xl shadow-xl p-2 border border-gray-100">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold">AI</div>
                  <div>
                    <h3 className="font-semibold">JobStalker AI Assistant</h3>
                    <p className="text-xs text-gray-500">Analyzing your profile</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium">Your resume matches 68% of requirements for "Senior Product Designer" positions</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium">Recommended skill to add: User Research Methods</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium">3 new matching jobs found today</p>
                  </div>
                </div>
                <Button className="w-full mt-6">Optimize My Profile</Button>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 bg-purple-100 w-20 h-20 rounded-full blur-2xl opacity-70 z-[-1]"></div>
              <div className="absolute -bottom-6 -left-6 bg-indigo-100 w-24 h-24 rounded-full blur-2xl opacity-70 z-[-1]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
