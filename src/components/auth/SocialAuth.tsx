
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type SocialAuthProps = {
  mode: 'signup' | 'login';
};

const SocialAuth = ({ mode }: SocialAuthProps) => {
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLinkedInLoading, setIsLinkedInLoading] = useState(false);

  const handleGoogleAuth = async () => {
    try {
      setIsGoogleLoading(true);
      console.log(`Initiating Google ${mode} flow...`);
      
      if (mode === 'signup') {
        await signUp.withGoogle();
      } else {
        await signIn.withGoogle();
      }
    } catch (error: any) {
      console.error(`Google ${mode} error:`, error);
      toast({
        title: `Google ${mode} failed`,
        description: error.message || `An error occurred during Google ${mode}.`,
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleLinkedInAuth = async () => {
    try {
      setIsLinkedInLoading(true);
      console.log(`Initiating LinkedIn ${mode} flow...`);
      
      if (mode === 'signup') {
        await signUp.withLinkedIn();
      } else {
        await signIn.withLinkedIn();
      }
    } catch (error: any) {
      console.error(`LinkedIn ${mode} error:`, error);
      toast({
        title: `LinkedIn ${mode} failed`,
        description: error.message || `An error occurred during LinkedIn ${mode}.`,
        variant: "destructive",
      });
    } finally {
      setIsLinkedInLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button 
        onClick={handleGoogleAuth} 
        variant="outline" 
        className="w-full justify-center bg-white hover:bg-gray-50 text-gray-700 font-medium"
        disabled={isGoogleLoading || isLinkedInLoading}
        type="button"
      >
        {isGoogleLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
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
        )}
        Continue with Google
      </Button>
      
      <Button 
        onClick={handleLinkedInAuth} 
        variant="outline" 
        className="w-full justify-center bg-white hover:bg-gray-50 text-gray-700 font-medium"
        disabled={isGoogleLoading || isLinkedInLoading}
        type="button"
      >
        {isLinkedInLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="#0072b1">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
          </svg>
        )}
        Continue with LinkedIn
      </Button>
    </div>
  );
};

export default SocialAuth;
