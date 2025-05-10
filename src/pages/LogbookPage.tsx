
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Book, Search, Plus, Calendar, User, Save, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const LogbookPage = () => {
  const { session } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [newEntry, setNewEntry] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [logEntries, setLogEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchLogEntries();
  }, [session]);

  const fetchLogEntries = async () => {
    if (!session.user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('logbook_entries')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setLogEntries(data || []);
    } catch (error) {
      console.error('Error fetching logbook entries:', error);
      toast.error('No se pudieron cargar las entradas de la bitácora');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async () => {
    if (!session.user) {
      toast.error('Debes iniciar sesión para guardar entradas');
      return;
    }
    
    if (!newTitle.trim() || !newEntry.trim()) {
      toast.error('Debes completar el título y el contenido de la entrada');
      return;
    }
    
    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('logbook_entries')
        .insert([
          {
            user_id: session.user.id,
            title: newTitle,
            content: newEntry
          }
        ])
        .select();
        
      if (error) throw error;
      
      toast.success('Entrada añadida correctamente');
      setNewEntry('');
      setNewTitle('');
      fetchLogEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast.error('No se pudo guardar la entrada');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    setEntryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!entryToDelete) return;
    
    try {
      const { error } = await supabase
        .from('logbook_entries')
        .delete()
        .eq('id', entryToDelete);
        
      if (error) throw error;
      
      toast.success('Entrada eliminada correctamente');
      fetchLogEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('No se pudo eliminar la entrada');
    } finally {
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
    }
  };

  const filteredEntries = logEntries.filter(entry => 
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Book className="h-8 w-8 text-blue-600" />
          Bitácora
        </h1>
        <p className="text-gray-500 mt-1">
          Registro de actividades y eventos del proyecto
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-600" />
            Añadir nueva entrada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Título de la entrada..."
                className="mb-2"
              />
              <Textarea
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                placeholder="Escribe los detalles de la nueva entrada..."
                className="mb-4"
                rows={4}
              />
            </div>
            <Button onClick={handleAddEntry} className="flex items-center gap-2" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Guardar entrada
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row mb-6 gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar en la bitácora..."
            className="pl-8"
          />
        </div>
        <Button className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Buscar
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredEntries.length > 0 ? (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{entry.title}</h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-800 hover:bg-red-100"
                        onClick={() => handleDeleteEntry(entry.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-900 whitespace-pre-wrap">{entry.content}</p>
                  <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                    <p className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(entry.created_at).toLocaleDateString()}
                    </p>
                    <p className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {session.user?.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-10 border rounded-lg bg-gray-50">
          <p className="text-gray-500 flex justify-center items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            No se encontraron entradas en la bitácora
          </p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente esta entrada de la bitácora.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LogbookPage;
