
import React from 'react';
import { Briefcase, Clock, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: <Briefcase className="h-12 w-12 text-blue-600" />,
    title: 'Job Application Tracking',
    description: 'Keep track of all your job applications in one place, never miss a follow-up.'
  },
  {
    icon: <BarChart3 className="h-12 w-12 text-blue-600" />,
    title: 'Smart Analytics',
    description: 'Get insights into your job search progress and improve your strategy.'
  },
  {
    icon: <Clock className="h-12 w-12 text-blue-600" />,
    title: 'Timeline Management',
    description: 'Organize interviews and deadlines with our intuitive timeline view.'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 px-6 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Land Your Dream Job</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-center"
            >
              <div className="flex justify-center mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
