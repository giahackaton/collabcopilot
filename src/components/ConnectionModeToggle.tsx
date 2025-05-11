
import React from 'react';
import { Toggle } from "@/components/ui/toggle";
import { Wifi, Laptop } from "lucide-react";
import { toast } from "sonner";

interface ConnectionModeToggleProps {
  isLocalMode: boolean;
  onToggle: (localMode: boolean) => void;
}

const ConnectionModeToggle: React.FC<ConnectionModeToggleProps> = ({ isLocalMode, onToggle }) => {
  const handleToggle = () => {
    const newMode = !isLocalMode;
    onToggle(newMode);
    
    toast.info(
      newMode 
        ? "Modo local activado. Los mensajes se guardan solo en este dispositivo." 
        : "Conectando al servidor. Los mensajes se comparten con todos los participantes."
    );
  };
  
  return (
    <div className="flex items-center justify-end gap-2 mb-2">
      <span className="text-xs text-gray-500">
        {isLocalMode ? "Modo local" : "Conectado al servidor"}
      </span>
      <Toggle
        pressed={!isLocalMode}
        onPressedChange={() => handleToggle()}
        aria-label="Alternar modo de conexión"
        size="sm"
        className="data-[state=on]:bg-green-500"
      >
        {isLocalMode ? (
          <Laptop className="h-3.5 w-3.5" />
        ) : (
          <Wifi className="h-3.5 w-3.5" />
        )}
      </Toggle>
    </div>
  );
};

export default ConnectionModeToggle;
