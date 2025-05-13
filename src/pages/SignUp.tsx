
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      toast({
        title: "Terms Agreement Required",
        description: "Please accept the terms of service to continue.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error, data } = await signUp.withEmail(email, password);
      
      if (error) {
        throw error;
      }
      
      // Check if email confirmation is required
      if (data.session === null) {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link to complete your registration.",
        });
        navigate('/login');
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signUp.withGoogle();
    } catch (error: any) {
      toast({
        title: "Google sign up failed",
        description: error.message || "An error occurred during Google sign up.",
        variant: "destructive",
      });
    }
  };

  const handleLinkedInSignUp = async () => {
    try {
      await signUp.withLinkedIn();
    } catch (error: any) {
      toast({
        title: "LinkedIn sign up failed",
        description: error.message || "An error occurred during LinkedIn sign up.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top navigation bar */}
      <div className="py-4 px-6 md:px-10 bg-white border-b border-gray-100">
        <div className="container mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 text-white rounded-md w-8 h-8 flex items-center justify-center text-lg font-bold">JS</div>
            <span className="text-xl font-bold text-gray-800">JobStalker</span>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to home
            </Link>
            <h1 className="mt-6 text-3xl font-bold">Create your account</h1>
            <p className="mt-2 text-gray-600">Track job applications and get hired faster with JobStalker</p>
          </div>

          {/* Social sign-up buttons */}
          <div className="space-y-3 mb-6">
            <Button 
              onClick={handleGoogleSignUp} 
              variant="outline" 
              className="w-full justify-center bg-white hover:bg-gray-50 text-gray-700 font-medium"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>
            
            <Button 
              onClick={handleLinkedInSignUp} 
              variant="outline" 
              className="w-full justify-center bg-white hover:bg-gray-50 text-gray-700 font-medium"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="#0072b1">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
              </svg>
              Continue with LinkedIn
            </Button>
          </div>
          
          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>
          
          {/* Email sign-up form */}
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  required 
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
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
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked === true)}
              />
              <label 
                htmlFor="terms" 
                className="text-sm text-gray-600 leading-none cursor-pointer"
              >
                I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Log In
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="py-4 px-6 bg-white border-t border-gray-100 text-center text-sm text-gray-500">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} JobStalker. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
