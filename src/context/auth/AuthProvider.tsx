
import React, { createContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AuthContextType } from "./types";
import { 
  signInWithEmail, 
  signInWithGoogle, 
  signInWithLinkedIn, 
  signUpWithEmail, 
  signUpWithGoogle, 
  signUpWithLinkedIn, 
  signOutUser, 
  resetUserPassword,
  deleteUserAccount
} from "./authUtils";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
        
        // Don't set isLoading to false here, as we do that after checking the initial session
        
        if (event === "SIGNED_IN" && currentSession) {
          // Defer navigation with setTimeout to avoid potential deadlocks
          setTimeout(() => {
            toast({
              title: "Signed in successfully",
              description: "Welcome back!",
            });
            navigate("/jobs");
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
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Initial session check:", currentSession?.user?.id || "No session");
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const signIn = {
    email: signInWithEmail,
    withGoogle: signInWithGoogle,
    withLinkedIn: signInWithLinkedIn,
  };

  const signUp = {
    withEmail: signUpWithEmail,
    withGoogle: signUpWithGoogle,
    withLinkedIn: signUpWithLinkedIn,
  };

  const value = {
    session,
    user,
    isLoading,
    signIn,
    signUp,
    signOut: signOutUser,
    resetPassword: resetUserPassword,
    deleteAccount: deleteUserAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

