import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth';
import { JobsProvider } from '@/context/jobs';
import { NotesProvider } from '@/context/notes/NotesContext';
import Dashboard from '@/pages/Dashboard';
import JobsPage from '@/pages/Jobs';
import JobNotes from '@/pages/JobNotes';
import Notes from '@/pages/Notes';
import Settings from '@/pages/Settings';
import Authentication from '@/pages/Authentication';
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
                <Route path="/auth" element={<Authentication />} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/jobs" element={<ProtectedRoute><JobsPage /></ProtectedRoute>} />
                <Route path="/jobs/:jobId/notes" element={<ProtectedRoute><JobNotes /></ProtectedRoute>} />
                <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
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
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

export default App;
