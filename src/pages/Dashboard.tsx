import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Welcome {user?.email || 'User'}!</h2>
              <p className="mb-6">This is your dashboard where you can access all features of JobStalker.</p>
              
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-2">Job Tracking</h3>
                  <p className="text-gray-600 mb-4">Track and manage all your job applications in one place.</p>
                  <Link to="/jobs">
                    <Button>Go to Job Tracker</Button>
                  </Link>
                </div>
                
                {/* Additional dashboard sections can be added here */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
