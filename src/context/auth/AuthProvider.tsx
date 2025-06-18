
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
  const [hasInitialized, setHasInitialized] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id || "no session");
        
        if (!mounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Only redirect on actual sign-in events after initialization, not on session restoration
        if (event === "SIGNED_IN" && currentSession && hasInitialized) {
          console.log("User signed in successfully, navigating to jobs");
          toast({
            title: "Signed in successfully",
            description: "Welcome back!",
          });
          navigate("/jobs");
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out, navigating to login");
          navigate("/login");
        } else if (event === "TOKEN_REFRESHED") {
          console.log("Token refreshed successfully");
        }
      }
    );

    // Then check for existing session
    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          return;
        }
        
        console.log("Initial session check:", currentSession?.user?.id || "No session");
        
        if (!mounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setHasInitialized(true);
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast, hasInitialized]);

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
