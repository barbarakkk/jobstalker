
import { Session, User } from "@supabase/supabase-js";

export type AuthContextType = {
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
