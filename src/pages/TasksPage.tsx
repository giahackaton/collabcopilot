
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const TasksPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dummy task data
  const tasks = [
    {
      id: '1',
      title: 'Implementar autenticación',
      description: 'Implementar el sistema de login y registro usando Supabase',
      assignedTo: 'juan.perez@ejemplo.com',
      dueDate: '2025-05-15',
      status: 'in-progress' as const
    },
    {
      id: '2',
      title: 'Diseñar interfaz de usuario',
      description: 'Crear prototipos y maquetas para la nueva interfaz',
      assignedTo: 'maria.rodriguez@ejemplo.com',
      dueDate: '2025-05-20',
      status: 'pending' as const
    },
    {
      id: '3',
      title: 'Pruebas de integración',
      description: 'Realizar pruebas de integración para los nuevos módulos',
      assignedTo: 'pedro.gomez@ejemplo.com',
      dueDate: '2025-05-10',
      status: 'completed' as const
    }
  ];

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTaskStatus = (taskId: string) => {
    alert(`Cambiando estado de la tarea ${taskId}`);
    // Aquí se actualizaría el estado en la base de datos
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Tareas Asignadas</h1>
        <p className="text-gray-500 mt-1">
          Gestiona y actualiza tus tareas pendientes
        </p>
      </div>

      <div className="flex mb-6">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar tareas..."
          className="max-w-sm"
        />
        <Button className="ml-4">Buscar</Button>
      </div>

      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Card key={task.id} className={task.status === 'completed' ? 'bg-gray-50' : ''}>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id={`task-${task.id}`}
                      checked={task.status === 'completed'}
                      onCheckedChange={() => toggleTaskStatus(task.id)}
                    />
                    <span className={task.status === 'completed' ? 'line-through text-gray-500' : ''}>
                      {task.title}
                    </span>
                  </div>
                  <span className="text-sm font-normal">
                    {task.status === 'pending' && <span className="text-yellow-600">Pendiente</span>}
                    {task.status === 'in-progress' && <span className="text-blue-600">En progreso</span>}
                    {task.status === 'completed' && <span className="text-green-600">Completada</span>}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">{task.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Asignada a: {task.assignedTo}</span>
                  <span>Fecha límite: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="mt-4">
                  <Button size="sm" variant="outline">Ver detalles</Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center p-10 border rounded-lg bg-gray-50">
            <p className="text-gray-500">No se encontraron tareas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
