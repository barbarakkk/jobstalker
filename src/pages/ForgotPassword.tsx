import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://jobstalker.netlify.app/reset-password"
    });
    setIsLoading(false);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for a reset link.",
      });
      navigate("/login");
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
            <h1 className="text-2xl font-bold">Forgot Password</h1>
            <p className="mt-2 text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
          </div>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
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
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/login" className="text-blue-600 hover:underline">
              Back to login
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
