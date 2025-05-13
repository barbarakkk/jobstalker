
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const benefits = [
  "Smart job matching with AI",
  "Resume optimization for ATS",
  "Interview preparation and coaching",
  "Application tracking and analytics",
  "Free plan available"
];

const Cta = () => {
  return (
    <section id="pricing" className="py-20 px-6 bg-gray-50">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to land your dream job?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of job seekers who have increased their interview rates by 3x with JobStalker's AI-powered tools.
              </p>
              
              <ul className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-md px-8 bg-blue-600 hover:bg-blue-700">
                  Sign Up
                </Button>
              </div>
            </div>
            
            <div className="bg-blue-600 p-8 md:p-12 text-white flex items-center">
              <div>
                <div className="bg-white/20 inline-block p-3 rounded-lg mb-6">
                  <div className="bg-white text-blue-600 rounded font-bold text-xl px-4 py-2">
                    PRO
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">JobStalker Pro</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$10</span>
                  <span className="text-xl">/month</span>
                </div>
                <p className="text-white/80 mb-6">
                  Unlock advanced AI tools, unlimited job applications, and priority support.
                </p>
                <Button variant="secondary" size="lg" className="text-blue-600 hover:text-blue-700 bg-white w-full">
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
