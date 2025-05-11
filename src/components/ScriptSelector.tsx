
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { scriptService } from '@/services/scriptService';
import { toast } from 'sonner';

interface ScriptSelectorProps {
  onScriptActivate: () => void;
}

const ScriptSelector: React.FC<ScriptSelectorProps> = ({ onScriptActivate }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedScript, setSelectedScript] = useState<string>('');
  const scripts = scriptService.getAllScripts();

  const handleActivateScript = () => {
    if (!selectedScript) {
      toast.error("Por favor, selecciona un guión primero");
      return;
    }

    const success = scriptService.activateScript(selectedScript);
    
    if (success) {
      toast.success(`Guión activado: ${scripts.find(s => s.id === selectedScript)?.title}`);
      setShowDialog(false);
      onScriptActivate();
    } else {
      toast.error("Error al activar el guión");
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDialog(true)}
        className="flex items-center gap-2"
      >
        <span className="text-xs">Usar guión predefinido</span>
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Seleccionar guión de reunión</DialogTitle>
            <DialogDescription>
              Elige un guión predefinido para simular una conversación con el asistente de IA.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="script-select" className="text-sm text-gray-500">
                Guión de reunión
              </label>
              <Select
                value={selectedScript}
                onValueChange={(value) => setSelectedScript(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un guión" />
                </SelectTrigger>
                <SelectContent>
                  {scripts.map(script => (
                    <SelectItem key={script.id} value={script.id}>
                      {script.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedScript && (
                <p className="text-sm text-gray-500 mt-2">
                  {scripts.find(s => s.id === selectedScript)?.description}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleActivateScript}>
              Activar guión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScriptSelector;
