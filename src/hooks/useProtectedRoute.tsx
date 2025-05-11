
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const useProtectedRoute = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!session.isLoading && !session.user && !location.pathname.startsWith('/auth')) {
      console.log('Hook useProtectedRoute: No hay sesión activa, redirigiendo a /auth');
      navigate('/auth');
    }
  }, [session, navigate, location.pathname]);

  return session;
};
