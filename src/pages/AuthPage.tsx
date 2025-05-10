
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormValues = {
  email: string;
  password: string;
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, error, session } = useAuth();
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Mostrar errores de autenticación como toasts
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // If user is already logged in, redirect to home
  React.useEffect(() => {
    if (session.user && !session.isLoading) {
      navigate('/');
    }
  }, [session, navigate]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        await signIn(data.email, data.password);
      } else {
        await signUp(data.email, data.password);
        toast.success("Cuenta creada correctamente. Ya puedes iniciar sesión.");
        setIsLogin(true); // Cambiar a la pantalla de inicio de sesión después del registro
      }
    } catch (err) {
      console.error("Authentication error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-fill the test user credentials
  const fillTestUser = () => {
    form.setValue('email', 'usuario1@copilot.com');
    form.setValue('password', '123456');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin
                ? 'Ingresa tus credenciales para acceder'
                : 'Crea una cuenta para comenzar a usar CollabCopilot1.0'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="email@ejemplo.com" 
                          type="email" 
                          {...field} 
                          required
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="********" 
                          type="password" 
                          {...field} 
                          required
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full mb-2"
                  onClick={fillTestUser}
                >
                  Usar cuenta de prueba
                </Button>

                <Button type="submit" className="w-full" disabled={isLoading || session.isLoading}>
                  {isLoading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                </Button>
              </form>
            </Form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-600 hover:underline"
              >
                {isLogin ? '¿No tienes una cuenta? Regístrate' : '¿Ya tienes una cuenta? Inicia sesión'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
