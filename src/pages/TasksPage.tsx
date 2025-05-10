
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  CheckSquare, Search, AlertTriangle, Clock, CheckCircle, User, Calendar, 
  Info, Plus, Trash2, Edit, Loader2, X, Save, Filter
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TasksPage = () => {
  const { session } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({
    subject: '',
    description: '',
    dueDate: '',
    status: 'pending'
  });
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [session]);

  const fetchTasks = async () => {
    if (!session.user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('No se pudieron cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNewTask = () => {
    setFormState({
      subject: '',
      description: '',
      dueDate: '',
      status: 'pending'
    });
    setIsEditing(false);
    setShowTaskDialog(true);
  };

  const handleOpenEditTask = (task: any) => {
    setFormState({
      subject: task.subject,
      description: task.description || '',
      dueDate: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
      status: task.status
    });
    setSelectedTask(task);
    setIsEditing(true);
    setShowTaskDialog(true);
  };

  const handleViewTaskDetails = (task: any) => {
    setSelectedTask(task);
    setShowDetailsDialog(true);
  };

  const handleSaveTask = async () => {
    if (!session.user) {
      toast.error('Debes iniciar sesión para guardar tareas');
      return;
    }
    
    if (!formState.subject.trim()) {
      toast.error('El asunto de la tarea es obligatorio');
      return;
    }
    
    try {
      if (isEditing && selectedTask) {
        // Update existing task
        const { error } = await supabase
          .from('tasks')
          .update({
            subject: formState.subject,
            description: formState.description,
            due_date: formState.dueDate || null,
            status: formState.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedTask.id);
          
        if (error) throw error;
        
        toast.success('Tarea actualizada correctamente');
      } else {
        // Create new task
        const { error } = await supabase
          .from('tasks')
          .insert([{
            user_id: session.user.id,
            subject: formState.subject,
            description: formState.description,
            due_date: formState.dueDate || null,
            status: formState.status
          }]);
          
        if (error) throw error;
        
        toast.success('Tarea creada correctamente');
      }
      
      fetchTasks();
      setShowTaskDialog(false);
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('No se pudo guardar la tarea');
    }
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);
        
      if (error) throw error;
      
      fetchTasks();
      toast.success(`Tarea marcada como ${newStatus === 'completed' ? 'completada' : 'pendiente'}`);
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('No se pudo actualizar el estado de la tarea');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
        
      if (error) throw error;
      
      fetchTasks();
      setShowDetailsDialog(false);
      toast.success('Tarea eliminada correctamente');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('No se pudo eliminar la tarea');
    }
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

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending':
        return 'Pendiente';
      case 'in-progress':
        return 'En progreso';
      case 'completed':
        return 'Completada';
      default:
        return status;
    }
  };

  const filteredTasks = tasks
    .filter(task => 
      (statusFilter === null || task.status === statusFilter) &&
      (task.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())))
    );

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

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <Button onClick={handleOpenNewTask} className="w-full sm:w-auto flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Tarea
        </Button>
        
        <div className="flex flex-col md:flex-row gap-4 w-full sm:w-auto">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar tareas..."
              className="pl-8"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter || ''} onValueChange={(value) => setStatusFilter(value || null)}>
              <SelectTrigger className="min-w-[180px] flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="in-progress">En progreso</SelectItem>
                <SelectItem value="completed">Completada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: 50 }}>Estado</TableHead>
                <TableHead>Asunto</TableHead>
                <TableHead className="hidden sm:table-cell">Fecha Límite</TableHead>
                <TableHead className="hidden lg:table-cell">Descripción</TableHead>
                <TableHead style={{ width: 100 }}>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TableRow key={task.id} className={task.status === 'completed' ? 'bg-gray-50' : ''}>
                    <TableCell>
                      <Checkbox 
                        checked={task.status === 'completed'}
                        onCheckedChange={() => toggleTaskStatus(task.id, task.status)}
                      />
                    </TableCell>
                    <TableCell className={task.status === 'completed' ? 'line-through text-gray-500' : ''}>
                      <span className="font-medium">{task.subject}</span>
                      {task.status !== 'completed' && task.due_date && new Date(task.due_date) < new Date() && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                          <AlertTriangle className="h-2.5 w-2.5 mr-1" />
                          Vencida
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell max-w-xs truncate">
                      {task.description || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleViewTaskDetails(task)} 
                          title="Ver detalles"
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleOpenEditTask(task)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <AlertCircle className="h-8 w-8 mb-2" />
                      {searchTerm || statusFilter ? 'No se encontraron tareas con esos criterios' : 'No hay tareas creadas'}
                      <Button 
                        variant="link" 
                        onClick={handleOpenNewTask} 
                        className="mt-2"
                      >
                        Crear una nueva tarea
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* New/Edit Task Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Tarea' : 'Nueva Tarea'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Modifica los detalles de la tarea.' : 'Introduce los detalles de la nueva tarea.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subject">Asunto</Label>
              <Input
                id="subject"
                value={formState.subject}
                onChange={(e) => setFormState({...formState, subject: e.target.value})}
                placeholder="Asunto de la tarea"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formState.description}
                onChange={(e) => setFormState({...formState, description: e.target.value})}
                placeholder="Descripción detallada de la tarea"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Fecha Límite</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formState.dueDate}
                  onChange={(e) => setFormState({...formState, dueDate: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={formState.status}
                  onValueChange={(value) => setFormState({...formState, status: value})}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="in-progress">En progreso</SelectItem>
                    <SelectItem value="completed">Completada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTaskDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTask} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Details Dialog */}
      {selectedTask && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>{selectedTask.subject}</DialogTitle>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedTask.status)}
                  <span className="text-sm font-normal">
                    {getStatusText(selectedTask.status)}
                  </span>
                </div>
              </div>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1 flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    Descripción
                  </h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">
                    {selectedTask.description || "Sin descripción"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      Fecha de Creación
                    </h4>
                    <p className="text-sm">
                      {new Date(selectedTask.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      Fecha Límite
                    </h4>
                    <p className="text-sm">
                      {selectedTask.due_date 
                        ? new Date(selectedTask.due_date).toLocaleDateString()
                        : "No definida"}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    Asignada a
                  </h4>
                  <p className="text-sm">{session.user?.email}</p>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button 
                variant="outline" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDeleteTask(selectedTask.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowDetailsDialog(false);
                  handleOpenEditTask(selectedTask);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button onClick={() => toggleTaskStatus(selectedTask.id, selectedTask.status)}>
                {selectedTask.status === 'completed' ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Marcar como pendiente
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar como completada
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TasksPage;
