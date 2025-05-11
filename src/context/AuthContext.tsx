
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '../types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

type AuthContextType = {
  session: Session;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session>({
    user: null,
    isLoading: true,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.id);
        
        if (currentSession?.user) {
          setSession({
            user: {
              id: currentSession.user.id,
              email: currentSession.user.email || '',
              username: currentSession.user.user_metadata?.username,
            },
            isLoading: false,
          });
        } else {
          setSession({
            user: null,
            isLoading: false,
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Initial session check:', currentSession?.user?.id);
      
      if (currentSession?.user) {
        setSession({
          user: {
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            username: currentSession.user.user_metadata?.username,
          },
          isLoading: false,
        });
      } else {
        setSession({
          user: null,
          isLoading: false,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      // Obtener la URL actual para usar como base para la redirección
      const redirectUrl = window.location.origin;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: email.split('@')[0], // Usar la parte del email como nombre de usuario
            full_name: '',
          },
          emailRedirectTo: redirectUrl + '/auth', // Redirigir a la página de autenticación después de verificar email
        }
      });
      
      if (error) throw new Error(error.message);
      
      // Actualizar el perfil con el email y la contraseña
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            email: email,
            password: password // Nota: Esto es solo para fines de prueba, normalmente no guardamos contraseñas en texto plano
          })
          .eq('id', data.user.id);
          
        if (profileError) console.error("Error al actualizar perfil:", profileError);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      console.log('Iniciando cierre de sesión...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error al cerrar sesión:', error);
        throw new Error(error.message);
      }
      
      console.log('Sesión cerrada exitosamente');
      toast.success("Sesión cerrada exitosamente");
      
      // Asegurar que el estado de la sesión se actualice correctamente
      setSession({
        user: null,
        isLoading: false
      });
    } catch (err: any) {
      console.error('Error en función signOut:', err);
      setError(err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ session, signUp, signIn, signOut, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
