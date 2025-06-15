
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/auth";
import { JobsProvider } from "./context/jobs/JobsContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuthCallback from "./pages/AuthCallback";
import Jobs from "./pages/Jobs";
import JobNotes from "./pages/JobNotes";
import Statistics from "./pages/Statistics";
import Profile from "./pages/Profile";
import ResumeBuilder from "./pages/ResumeBuilder";
// Removed: import JobMatcher from "./pages/JobMatcher";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Route guard for protected routes with improved loading state
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  console.log("User authenticated, rendering protected content");
  return <>{children}</>;
};

// Protected routes that need access to the JobsProvider
const ProtectedJobRoutes = ({ children }: { children: React.ReactNode }) => {
  return (
    <JobsProvider>
      {children}
    </JobsProvider>
  );
};

// Auth wrapper to get access to auth context
const AuthenticatedApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Redirect /dashboard to /jobs */}
      <Route path="/dashboard" element={<Navigate to="/jobs" replace />} />
      
      {/* Protected job-related routes - wrapped with both ProtectedRoute and JobsProvider */}
      <Route 
        path="/jobs" 
        element={
          <ProtectedRoute>
            <ProtectedJobRoutes>
              <Jobs />
            </ProtectedJobRoutes>
          </ProtectedRoute>
        } 
      />
      
      {/* Job Notes Page */}
      <Route 
        path="/jobs/:jobId/notes" 
        element={
          <ProtectedRoute>
            <ProtectedJobRoutes>
              <JobNotes />
            </ProtectedJobRoutes>
          </ProtectedRoute>
        } 
      />
      
      {/* Statistics Page */}
      <Route 
        path="/statistics" 
        element={
          <ProtectedRoute>
            <ProtectedJobRoutes>
              <Statistics />
            </ProtectedJobRoutes>
          </ProtectedRoute>
        } 
      />
      
      {/* AI Resume Builder Page */}
      <Route 
        path="/resume-builder" 
        element={
          <ProtectedRoute>
            <ResumeBuilder />
          </ProtectedRoute>
        } 
      />
      
      {/* Profile Page */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <AuthenticatedApp />
          <Toaster />
          <Sonner />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
