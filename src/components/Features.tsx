
import React from 'react';
import { CheckCircle2, BarChart3, Search, FileText, BrainCircuit, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: <Search className="h-12 w-12 text-purple-600" />,
    title: 'Smart Job Matching',
    description: 'Our AI analyzes thousands of job listings and matches them to your skills and experience, finding opportunities you might miss.'
  },
  {
    icon: <FileText className="h-12 w-12 text-purple-600" />,
    title: 'Resume Optimization',
    description: 'Get AI-powered suggestions to tailor your resume for each job, ensuring you have the right keywords and format to pass ATS systems.'
  },
  {
    icon: <BrainCircuit className="h-12 w-12 text-purple-600" />,
    title: 'Interview Preparation',
    description: 'Practice with our AI interviewer that creates custom questions based on the job description and provides feedback on your answers.'
  },
  {
    icon: <BarChart3 className="h-12 w-12 text-purple-600" />,
    title: 'Application Tracking',
    description: 'Keep track of all your applications in one place with status updates, follow-up reminders, and insights on your progress.'
  },
  {
    icon: <CheckCircle2 className="h-12 w-12 text-purple-600" />,
    title: 'Success Metrics',
    description: 'See detailed analytics on your job search performance and get actionable recommendations to improve your results.'
  },
  {
    icon: <MessageSquare className="h-12 w-12 text-purple-600" />,
    title: 'Networking Assistant',
    description: 'Get help crafting personalized messages for LinkedIn and email outreach to expand your professional network.'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 px-6 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Job Search Tools</h2>
          <p className="text-lg text-gray-600">
            Our suite of intelligent features is designed to maximize your chances of landing your dream job.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm card-hover"
            >
              <div className="mb-5">
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
