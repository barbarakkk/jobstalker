
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
        
        if (event === "SIGNED_IN" && currentSession) {
          // Defer navigation with setTimeout to avoid potential deadlocks
          setTimeout(() => {
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
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = {
    email: async (email: string, password: string) => {
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return response;
    },
    withGoogle: async () => {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    },
    withLinkedIn: async () => {
      await supabase.auth.signInWithOAuth({
        provider: "linkedin_oidc",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    },
  };

  const signUp = {
    withEmail: async (email: string, password: string) => {
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return response;
    },
    withGoogle: async () => {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    },
    withLinkedIn: async () => {
      await supabase.auth.signInWithOAuth({
        provider: "linkedin_oidc",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const response = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return response;
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
