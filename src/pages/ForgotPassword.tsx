
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/auth";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        throw error;
      }
      
      setIsSubmitted(true);
      toast({
        title: "Reset email sent",
        description: "Check your inbox for password reset instructions.",
      });
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
            <Link to="/login" className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to login
            </Link>
            <h1 className="mt-6 text-3xl font-bold">Reset your password</h1>
            <p className="mt-2 text-gray-600">
              {isSubmitted
                ? "Check your email for a link to reset your password."
                : "Enter your email address and we'll send you a link to reset your password."}
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Sending Reset Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-medium mb-2">Check your email</h2>
              <p className="text-gray-600 mb-4">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="mr-2"
              >
                Try another email
              </Button>
              <Button
                onClick={() => window.location.href = "https://mail.google.com"}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Open Gmail
              </Button>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
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

export default ForgotPassword;
