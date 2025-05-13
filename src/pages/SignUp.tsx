
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/components/layout/AuthLayout';
import AuthHeader from '@/components/layout/AuthHeader';
import SocialAuth from '@/components/auth/SocialAuth';
import AuthDivider from '@/components/auth/AuthDivider';
import SignUpForm from '@/components/auth/SignUpForm';

const SignUp = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <AuthLayout>
      <AuthHeader 
        title="Create your account" 
        subtitle="Track job applications and get hired faster with JobStalker" 
      />
      
      {/* Social sign-up buttons */}
      <div className="mb-6">
        <SocialAuth mode="signup" />
      </div>
      
      <AuthDivider />
      
      {/* Email sign-up form */}
      <SignUpForm />
      
      <div className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Log In
        </Link>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
