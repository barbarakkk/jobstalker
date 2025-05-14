
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: {
    email: (email: string, password: string) => Promise<{
      error: any;
      data: any;
    }>;
    withGoogle: () => Promise<void>;
    withLinkedIn: () => Promise<void>;
  };
  signUp: {
    withEmail: (email: string, password: string) => Promise<{
      error: any;
      data: any;
    }>;
    withGoogle: () => Promise<void>;
    withLinkedIn: () => Promise<void>;
  };
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{
    error: any;
    data: any;
  }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
        
        if (event === "SIGNED_IN" && currentSession) {
          // Defer navigation with setTimeout to avoid potential deadlocks
          setTimeout(() => {
            toast({
              title: "Signed in successfully",
              description: "Welcome back!",
            });
            navigate("/dashboard");
          }, 0);
        } else if (event === "SIGNED_OUT") {
          // Defer navigation with setTimeout to avoid potential deadlocks
          setTimeout(() => {
            navigate("/login");
          }, 0);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession?.user?.id || "No session");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const signIn = {
    email: async (email: string, password: string) => {
      try {
        const response = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (response.error) {
          toast({
            title: "Sign in failed",
            description: response.error.message,
            variant: "destructive",
          });
        }
        
        return response;
      } catch (error: any) {
        toast({
          title: "Sign in failed",
          description: error.message || "An error occurred during sign in.",
          variant: "destructive",
        });
        return { error, data: null };
      }
    },
    withGoogle: async () => {
      try {
        console.log("Starting Google sign in...");
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        
        if (error) {
          console.error("Google sign in error:", error);
          throw error;
        }
        
        console.log("Google sign in data:", data);
      } catch (error: any) {
        console.error("Google sign in catch error:", error);
        toast({
          title: "Google sign in failed",
          description: error.message || "An error occurred during Google sign in.",
          variant: "destructive",
        });
      }
    },
    withLinkedIn: async () => {
      try {
        console.log("Starting LinkedIn sign in...");
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "linkedin_oidc",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        
        if (error) {
          console.error("LinkedIn sign in error:", error);
          throw error;
        }
        
        console.log("LinkedIn sign in data:", data);
      } catch (error: any) {
        console.error("LinkedIn sign in catch error:", error);
        toast({
          title: "LinkedIn sign in failed",
          description: error.message || "An error occurred during LinkedIn sign in.",
          variant: "destructive",
        });
      }
    },
  };

  const signUp = {
    withEmail: async (email: string, password: string) => {
      try {
        const response = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        
        if (response.error) {
          toast({
            title: "Sign up failed",
            description: response.error.message,
            variant: "destructive",
          });
        } else if (!response.data.session) {
          toast({
            title: "Check your email",
            description: "We've sent you a confirmation link to complete your registration.",
          });
        }
        
        return response;
      } catch (error: any) {
        toast({
          title: "Sign up failed",
          description: error.message || "An error occurred during sign up.",
          variant: "destructive",
        });
        return { error, data: null };
      }
    },
    withGoogle: async () => {
      try {
        console.log("Starting Google sign up...");
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            }
          },
        });
        
        if (error) {
          console.error("Google sign up error:", error);
          throw error;
        }
        
        console.log("Google sign up data:", data);
      } catch (error: any) {
        console.error("Google sign up catch error:", error);
        toast({
          title: "Google sign up failed",
          description: error.message || "An error occurred during Google sign up.",
          variant: "destructive",
        });
      }
    },
    withLinkedIn: async () => {
      try {
        console.log("Starting LinkedIn sign up...");
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "linkedin_oidc",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        
        if (error) {
          console.error("LinkedIn sign up error:", error);
          throw error;
        }
        
        console.log("LinkedIn sign up data:", data);
      } catch (error: any) {
        console.error("LinkedIn sign up catch error:", error);
        toast({
          title: "LinkedIn sign up failed",
          description: error.message || "An error occurred during LinkedIn sign up.",
          variant: "destructive",
        });
      }
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out.",
        variant: "destructive",
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const response = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (response.error) {
        toast({
          title: "Password reset failed",
          description: response.error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Check your email",
          description: "We've sent you a password reset link.",
        });
      }
      
      return response;
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message || "An error occurred during password reset.",
        variant: "destructive",
      });
      return { error, data: null };
    }
  };

  const value = {
    session,
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
