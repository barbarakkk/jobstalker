import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const signInWithEmail = async (email: string, password: string) => {
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
};

export const signInWithGoogle = async () => {
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
};

export const signInWithLinkedIn = async () => {
  try {
    console.log("Starting LinkedIn sign in...");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "linkedin_oidc", // Updated from linkedin to linkedin_oidc
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
};

export const signUpWithEmail = async (email: string, password: string) => {
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
};

export const signUpWithGoogle = async () => {
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
};

export const signUpWithLinkedIn = async () => {
  try {
    console.log("Starting LinkedIn sign up...");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "linkedin_oidc", // Updated from linkedin to linkedin_oidc
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
};

export const signOutUser = async () => {
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

export const deleteUserAccount = async () => {
  try {
    const { error } = await supabase.auth.admin.deleteUser(
      (await supabase.auth.getUser()).data.user?.id || ""
    );
    
    if (error) {
      throw error;
    }
    
    // Sign out the user after deleting their account
    await signOutUser();
    
    toast({
      title: "Account deleted",
      description: "Your account has been successfully deleted.",
    });
    
    return { error: null };
  } catch (error: any) {
    console.error("Error deleting user account:", error);
    toast({
      title: "Error deleting account",
      description: error.message || "An error occurred while deleting your account.",
      variant: "destructive",
    });
    return { error };
  }
};

export const resetUserPassword = async (email: string) => {
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
