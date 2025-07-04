
import React from 'react';
import JobsNavbar from '@/components/DashboardNavbar';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
      <JobsNavbar />
      <main className="container mx-auto py-6 px-6 pt-24">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-gray-900/5 p-12 text-center border border-gray-200/60">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Job Tracker</h1>
          <p className="text-gray-600 mb-6">Track your job applications and take control of your career journey.</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
