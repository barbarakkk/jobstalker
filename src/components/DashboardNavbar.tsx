
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth';

const DashboardNavbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isJobsPage = location.pathname === '/jobs';
  const isStatisticsPage = location.pathname === '/statistics';
  const isResumeBuilderPage = location.pathname === '/resume-builder';
  const isProfilePage = location.pathname === '/profile';

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left side - Brand */}
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/25">
                <span className="text-white font-bold text-lg">JS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">JobStalker</h1>
                <p className="text-xs text-gray-500 -mt-1">Job Tracking Made Simple</p>
              </div>
            </div>
          </div>

          {/* Center - Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/jobs"
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isJobsPage
                  ? 'text-blue-700 bg-blue-50 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Jobs
            </Link>
            <Link
              to="/statistics"
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isStatisticsPage
                  ? 'text-blue-700 bg-blue-50 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Statistics
            </Link>
            <Link
              to="/resume-builder"
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isResumeBuilderPage
                  ? 'text-blue-700 bg-blue-50 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              AI Resume Builder
            </Link>
          </div>

          {/* Right side - User actions */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <Link
                  to="/profile"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isProfilePage
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
