
import { Session, User, UserResponse } from "@supabase/supabase-js";

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: {
    email: (email: string, password: string) => Promise<UserResponse>;
    withGoogle: () => Promise<void>;
    withLinkedIn: () => Promise<void>;
  };
  signUp: {
    withEmail: (email: string, password: string) => Promise<UserResponse>;
    withGoogle: () => Promise<void>;
    withLinkedIn: () => Promise<void>;
  };
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  deleteAccount: () => Promise<{
    error: Error | null;
  }>;
}
