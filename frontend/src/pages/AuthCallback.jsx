import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/common/Spinner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      navigate('/login?error=oauth_failed');
      return;
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        login(token, user);
        // Redirect to dashboard or home
        navigate('/dashboard');
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login?error=parse_failed');
      }
    } else {
      navigate('/login?error=missing_data');
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen bg-inpact-dark flex items-center justify-center">
      <div className="text-center">
        <Spinner />
        <p className="mt-4 text-white">Completing sign-in...</p>
      </div>
    </div>
  );
}

