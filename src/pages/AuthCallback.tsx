
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
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
        setLoading(true);
        
        // Get and handle session from URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data?.session) {
          toast({
            title: "Authentication successful",
            description: "You have been signed in successfully.",
          });
          
          // Redirect to jobs page after short delay
          setTimeout(() => {
            navigate('/jobs', { replace: true });
          }, 300);
        } else {
          setError("No session found. Please try signing in again.");
          
          // Redirect to login after short delay
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 1500);
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || "An error occurred during authentication");
        
        // Show error toast
        toast({
          title: "Authentication failed",
          description: err.message || "An error occurred during authentication",
          variant: "destructive",
        });
        
        // Redirect to login after error
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1500);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          </div>
          <h2 className="text-xl font-semibold">Finalizing authentication...</h2>
          <p className="mt-2 text-gray-600">Please wait while we complete the process.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-red-500">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-600">Authentication Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <p className="mt-4 text-gray-600">Redirecting you to the login page...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
