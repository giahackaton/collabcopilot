
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const useProtectedRoute = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session.isLoading && !session.user) {
      navigate('/auth');
    }
  }, [session, navigate]);

  return session;
};
