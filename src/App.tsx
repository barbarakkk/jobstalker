
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/context/auth';
import { JobsProvider } from '@/context/jobs';
import { NotesProvider } from '@/context/notes/NotesContext';
import JobsPage from '@/pages/Jobs';
import Statistics from '@/pages/Statistics';
import JobMatcher from '@/pages/JobMatcher';
import ResumeBuilder from '@/pages/ResumeBuilder';
import Profile from '@/pages/Profile';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import AuthCallback from '@/pages/AuthCallback';
import Index from '@/pages/Index';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <JobsProvider>
        <NotesProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/auth" element={<Navigate to="/login" replace />} />
                <Route 
                  path="/jobs" 
                  element={
                    <ProtectedRoute>
                      <JobsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/statistics" 
                  element={
                    <ProtectedRoute>
                      <Statistics />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/job-matcher" 
                  element={
                    <ProtectedRoute>
                      <JobMatcher />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/resume-builder" 
                  element={
                    <ProtectedRoute>
                      <ResumeBuilder />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </div>
            <Toaster />
          </Router>
        </NotesProvider>
      </JobsProvider>
    </AuthProvider>
  );
}

export default App;
