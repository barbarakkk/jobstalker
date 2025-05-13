
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the OAuth callback or email confirmation
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error during auth callback:", error);
        navigate("/login?error=auth_callback_error");
      } else {
        // Successfully authenticated, redirect to dashboard
        navigate("/dashboard");
      }
    };
    
    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
        </div>
        <h2 className="text-xl font-medium text-gray-900">Completing authentication...</h2>
        <p className="mt-2 text-gray-600">Please wait while we redirect you.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
