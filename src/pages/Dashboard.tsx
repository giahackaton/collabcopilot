
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const { session } = useAuth();

  // Función para crear el usuario de prueba
  const createTestUser = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'usuario1@copilot.com',
        password: '123456'
      });
      
      if (error) {
        toast.error(`Error al crear usuario: ${error.message}`);
      } else {
        toast.success('Usuario de prueba creado correctamente. Ya puedes iniciar sesión con: usuario1@copilot.com y contraseña: 123456');
      }
    } catch (err) {
      toast.error('Error inesperado al crear el usuario');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Bienvenido a CollabCopilot1.0, {session.user?.email}
          </p>
        </div>
        
        {/* Botón para crear usuario de prueba */}
        {!session.user && (
          <Button onClick={createTestUser} variant="outline">
            Crear Usuario de Prueba
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reunión Activa</CardTitle>
            <CardDescription>
              Participa en la reunión de sprint actual con asistencia de voz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/meeting" className="text-blue-600 hover:underline text-sm">
              Ir a la reunión →
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resúmenes</CardTitle>
            <CardDescription>
              Consulta los resúmenes de las reuniones anteriores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/summaries" className="text-blue-600 hover:underline text-sm">
              Ver resúmenes →
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bitácora</CardTitle>
            <CardDescription>
              Accede a la bitácora del proyecto y su historial
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/logbook" className="text-blue-600 hover:underline text-sm">
              Ver bitácora →
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tareas Asignadas</CardTitle>
            <CardDescription>
              Revisa y actualiza tus tareas pendientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/tasks" className="text-blue-600 hover:underline text-sm">
              Ver tareas →
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Buscar Decisiones</CardTitle>
            <CardDescription>
              Encuentra decisiones tomadas en reuniones anteriores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/decisions" className="text-blue-600 hover:underline text-sm">
              Buscar decisiones →
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
