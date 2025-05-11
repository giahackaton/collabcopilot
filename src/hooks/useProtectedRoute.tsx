
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
      
      // Store the current path to redirect back after login
      sessionStorage.setItem('redirectAfterLogin', location.pathname);
      
      navigate('/auth');
    } else if (session.user && location.pathname === '/auth') {
      // If user is logged in and on auth page, redirect to dashboard
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath);
    }
  }, [session, navigate, location.pathname]);

  return session;
};
