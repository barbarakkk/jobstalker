import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth';
import { JobsProvider } from '@/context/jobs';
import { NotesProvider } from '@/context/notes/NotesContext';
import Dashboard from '@/pages/Dashboard';
import JobsPage from '@/pages/Jobs';
import Statistics from '@/pages/Statistics';
import JobMatcher from '@/pages/JobMatcher';
import ResumeBuilder from '@/pages/ResumeBuilder';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import AuthCallback from '@/pages/AuthCallback';
import Index from '@/pages/Index';
import { useAuth } from '@/context/auth';
import { Navigate } from 'react-router-dom';

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
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/jobs" element={<ProtectedRoute><JobsPage /></ProtectedRoute>} />
                <Route path="/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
                <Route path="/job-matcher" element={<ProtectedRoute><JobMatcher /></ProtectedRoute>} />
                <Route path="/resume-builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              </Routes>
            </div>
            <Toaster />
          </Router>
        </NotesProvider>
      </JobsProvider>
    </AuthProvider>
  );
}

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

export default App;
