import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionRestored, setSessionRestored] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Debug print to see state on every render
  console.log("ResetPassword render", { isLoading, error, sessionRestored, hash: window.location.hash });

  // Force render error if present in hash
  if (window.location.hash) {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const urlError = hashParams.get('error') || hashParams.get('error_code');
    const errorDescription = hashParams.get('error_description');
    if (urlError || errorDescription) {
      return <div style={{ color: 'red', padding: 40, fontSize: 24 }}>
        ERROR: {errorDescription || urlError}
        <div style={{ marginTop: 20 }}>
          <Button onClick={() => navigate('/forgot-password')}>Request New Reset Link</Button>
          <Button onClick={() => navigate('/login')} style={{ marginLeft: 10 }}>Return to Login</Button>
        </div>
      </div>;
    }
  }

  // Handle Supabase password reset hash fragment and error messages
  useEffect(() => {
    const handleSessionFromHash = async () => {
      // Check for error in hash fragment
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const urlError = hashParams.get('error') || hashParams.get('error_code');
        const errorDescription = hashParams.get('error_description');
        if (urlError || errorDescription) {
          setError(errorDescription || urlError || 'Invalid or expired password reset link.');
          setIsLoading(false);
          return;
        }
        setIsLoading(true);
        // For Supabase v2, use exchangeCodeForSession
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.hash.substring(1));
        if (error) {
          setError("Invalid or expired password reset link.");
          setIsLoading(false);
          return;
        }
        setSessionRestored(true);
        setIsLoading(false);
      } else {
        // If no hash, assume session is already restored (e.g., user navigated here directly)
        setSessionRestored(true);
        setIsLoading(false);
      }
    };
    handleSessionFromHash();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Your password has been updated successfully.",
        });
        navigate("/login");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="py-4 px-6 md:px-10 bg-white border-b border-gray-100">
          <div className="container mx-auto">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 text-white rounded-md w-8 h-8 flex items-center justify-center text-lg font-bold">JS</div>
              <span className="text-xl font-bold text-gray-800">JobStalker</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Password Reset Error</h1>
              <p className="mt-2 text-gray-600">{error}</p>
              <Button
                onClick={() => navigate("/forgot-password")}
                className="mt-6 bg-blue-600 hover:bg-blue-700"
              >
                Request New Reset Link
              </Button>
              <Button
                onClick={() => navigate("/login")}
                className="mt-2 ml-2 bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Return to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!sessionRestored) {
    // Should not happen, but just in case
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="py-4 px-6 md:px-10 bg-white border-b border-gray-100">
        <div className="container mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 text-white rounded-md w-8 h-8 flex items-center justify-center text-lg font-bold">JS</div>
            <span className="text-xl font-bold text-gray-800">JobStalker</span>
          </Link>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Reset Your Password</h1>
            <p className="mt-2 text-gray-600">Please enter a new password for your account.</p>
          </div>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-gray-300 focus:border-blue-600 focus:ring-blue-600 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-gray-300 focus:border-blue-600 focus:ring-blue-600 pr-10"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/login" className="text-blue-600 hover:underline flex items-center justify-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
