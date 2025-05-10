
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CheckSquare, 
  Search, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  User, 
  Calendar, 
  Info
} from 'lucide-react';

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

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <CheckSquare className="h-8 w-8 text-blue-600" />
          Tareas Asignadas
        </h1>
        <p className="text-gray-500 mt-1">
          Gestiona y actualiza tus tareas pendientes
        </p>
      </div>

      <div className="flex mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar tareas..."
            className="pl-8"
          />
        </div>
        <Button className="ml-4 flex items-center gap-2">
          <Search className="h-4 w-4" />
          Buscar
        </Button>
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
                  <span className="text-sm font-normal flex items-center gap-1">
                    {task.status === 'pending' && (
                      <span className="flex items-center text-yellow-600 gap-1">
                        {getStatusIcon('pending')} Pendiente
                      </span>
                    )}
                    {task.status === 'in-progress' && (
                      <span className="flex items-center text-blue-600 gap-1">
                        {getStatusIcon('in-progress')} En progreso
                      </span>
                    )}
                    {task.status === 'completed' && (
                      <span className="flex items-center text-green-600 gap-1">
                        {getStatusIcon('completed')} Completada
                      </span>
                    )}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">{task.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Asignada a: {task.assignedTo}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Fecha límite: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-4">
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Ver detalles
                  </Button>
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
