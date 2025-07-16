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

  useEffect(() => {
    const handleSessionFromHash = async () => {
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
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.hash.substring(1));
        if (error) {
          setError("Invalid or expired password reset link.");
          setIsLoading(false);
          return;
        }
        setSessionRestored(true);
        setIsLoading(false);
      } else {
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
    return null;
  }

  return (
    <div style={{ padding: 40, fontSize: 24, color: 'blue' }}>
      DEBUG: ResetPassword component is rendering!
    </div>
  );
};

export default ResetPassword;
