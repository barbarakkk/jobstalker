import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleSessionFromHash = async () => {
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const urlError = hashParams.get('error') || hashParams.get('error_code');
        const errorDescription = hashParams.get('error_description');
        if (urlError || errorDescription) {
          setError(errorDescription || urlError || 'Invalid or expired password reset link.');
          setIsLoading(false);
          return;
        }
        setIsLoading(true);
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.hash.substring(1));
        if (error) {
          setError("Invalid or expired password reset link.");
          setIsLoading(false);
          return;
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    handleSessionFromHash();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <div style={{ padding: 40, fontSize: 24 }}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 40, color: 'red', fontSize: 20 }}>
        <div>Error: {error}</div>
        <button onClick={() => navigate('/forgot-password')} style={{ marginTop: 20 }}>Request New Reset Link</button>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ padding: 40, color: 'green', fontSize: 20 }}>
        Password reset successfully! <br />
        <button onClick={() => navigate('/login')} style={{ marginTop: 20 }}>Go to Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: '0 auto' }}>
      <h2 style={{ fontSize: 28, marginBottom: 20 }}>Reset Your Password</h2>
      <form onSubmit={handleResetPassword}>
        <div style={{ marginBottom: 16 }}>
          <label>New Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={8}
            style={{ width: '100%', padding: 8, fontSize: 16 }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            style={{ width: '100%', padding: 8, fontSize: 16 }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: 12, fontSize: 18 }} disabled={isLoading}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      <div style={{ marginTop: 20 }}>
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
};

export default ResetPassword; 