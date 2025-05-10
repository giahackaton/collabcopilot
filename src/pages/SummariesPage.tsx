
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, Calendar, Eye, ArrowRight, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

const SummariesPage = () => {
  const { session } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [summaries, setSummaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSummary, setSelectedSummary] = useState<any>(null);
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [summaryToDelete, setSummaryToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchSummaries();
  }, [session]);

  const fetchSummaries = async () => {
    if (!session.user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('summaries')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setSummaries(data || []);
    } catch (error) {
      console.error('Error fetching summaries:', error);
      toast.error('No se pudieron cargar los resúmenes');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSummary = (summary: any) => {
    setSelectedSummary(summary);
    setShowSummaryDialog(true);
  };

  const handleDeleteSummary = (id: string) => {
    setSummaryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!summaryToDelete) return;
    
    try {
      const { error } = await supabase
        .from('summaries')
        .delete()
        .eq('id', summaryToDelete);
        
      if (error) throw error;
      
      toast.success('Resumen eliminado correctamente');
      fetchSummaries();
    } catch (error) {
      console.error('Error deleting summary:', error);
      toast.error('No se pudo eliminar el resumen');
    } finally {
      setDeleteDialogOpen(false);
      setSummaryToDelete(null);
    }
  };

  const filteredSummaries = summaries.filter(summary => 
    summary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (summary.summary && summary.summary.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8 text-blue-600" />
          Resúmenes
        </h1>
        <p className="text-gray-500 mt-1">
          Consulta los resúmenes de reuniones anteriores
        </p>
      </div>

      <div className="flex flex-col md:flex-row mb-6 gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar resúmenes..."
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
      ) : filteredSummaries.length > 0 ? (
        <div className="space-y-6">
          {filteredSummaries.map((summary) => (
            <Card key={summary.id}>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    {summary.title}
                  </span>
                  <span className="text-gray-500 text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(summary.created_at).toLocaleDateString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 mb-2">
                  {summary.summary || "No hay resumen disponible."}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    {summary.participants && summary.participants.length > 0 && (
                      <p className="text-xs text-gray-500">
                        Participantes: {summary.participants.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteSummary(summary.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="text-sm flex items-center gap-2"
                      onClick={() => handleViewSummary(summary)}
                    >
                      <Eye className="h-4 w-4" /> Ver completo <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-10 border rounded-lg bg-gray-50">
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="h-10 w-10 text-gray-400" />
            <p className="text-gray-500">No se encontraron resúmenes</p>
            <p className="text-sm text-gray-400 mt-2">
              Los resúmenes de las reuniones se generarán automáticamente cuando finalices una reunión activa.
            </p>
          </div>
        </div>
      )}

      {/* Summary Details Dialog */}
      {selectedSummary && (
        <Dialog open={showSummaryDialog} onOpenChange={setShowSummaryDialog}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                {selectedSummary.title}
              </DialogTitle>
              <DialogDescription>
                Creado el {new Date(selectedSummary.created_at).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-6">
              {selectedSummary.participants && selectedSummary.participants.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-1">Participantes</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSummary.participants.map((participant: string, index: number) => (
                      <span 
                        key={index}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                      >
                        {participant}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-semibold mb-2">Resumen</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="whitespace-pre-wrap">{selectedSummary.summary || "No hay resumen disponible."}</p>
                </div>
              </div>
              
              {selectedSummary.meeting_content && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Contenido Original</h3>
                  <div className="bg-gray-50 p-4 rounded-md max-h-[200px] overflow-y-auto">
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedSummary.meeting_content}</p>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button 
                variant="ghost" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50 mr-auto"
                onClick={() => {
                  setShowSummaryDialog(false);
                  handleDeleteSummary(selectedSummary.id);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
              <Button onClick={() => setShowSummaryDialog(false)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente este resumen.
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

export default SummariesPage;
