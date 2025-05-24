
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Handling auth callback...");
        setLoading(true);
        
        // Handle the auth callback from URL parameters
        const { data, error: authError } = await supabase.auth.getSession();
        
        if (authError) {
          throw authError;
        }
        
        if (data?.session) {
          console.log("Auth callback successful, session found");
          toast({
            title: "Authentication successful",
            description: "You have been signed in successfully.",
          });
          
          // Navigate to jobs page
          navigate('/jobs', { replace: true });
        } else {
          console.log("Auth callback completed but no session found");
          setError("Authentication completed but no session was created. Please try signing in again.");
          
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 2000);
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || "An error occurred during authentication");
        
        toast({
          title: "Authentication failed",
          description: err.message || "An error occurred during authentication",
          variant: "destructive",
        });
        
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="mb-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Finalizing authentication...</h2>
          <p className="mt-2 text-gray-600">Please wait while we complete the process.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-4 text-red-500">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-600 mb-2">Authentication Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <p className="text-sm text-gray-600">Redirecting you to the login page...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
