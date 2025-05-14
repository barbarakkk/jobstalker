
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white rounded-md w-8 h-8 flex items-center justify-center text-lg font-bold">JS</div>
            <span className="text-xl font-bold text-gray-800">JobStalker</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/jobs">
              <Button variant="outline">
                Jobs Dashboard
              </Button>
            </Link>
            <Button 
              variant="ghost"
              onClick={signOut}
              className="text-gray-600 hover:text-gray-900"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>
          <p className="text-gray-600 mb-4">
            You're successfully authenticated as:
          </p>
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="font-medium">Email: {user?.email}</p>
            <p className="font-medium mt-2">User ID: {user?.id}</p>
            <p className="font-medium mt-2">
              Provider: {user?.app_metadata?.provider || "Email"}
            </p>
          </div>
          
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-bold">Quick Actions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/jobs" className="block">
                <div className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                  <h3 className="font-semibold text-lg">Job Applications</h3>
                  <p className="text-gray-600">Track your job applications and statuses</p>
                </div>
              </Link>
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <h3 className="font-semibold text-lg">Settings</h3>
                <p className="text-gray-600">Manage your account settings</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
