
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

  // Solo mostrar en desarrollo o localhost
  const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
  
  if (!isDevelopment) {
    return null;
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDialog(true)}
        className="opacity-10 hover:opacity-40 transition-opacity"
        style={{ fontSize: '10px' }}
      >
        MP
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modo Presentación</DialogTitle>
            <DialogDescription>
              Selecciona un guión predefinido para la demostración.
              Los guiones se encuentran en el archivo src/scripts/demo-scripts.txt
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="script-select" className="text-sm text-gray-500">
                Guión de demostración
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
              Activar modo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScriptSelector;
