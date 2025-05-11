
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Globe, Laptop } from 'lucide-react';

interface ConnectionModeToggleProps {
  isLocalMode: boolean;
  onToggle: (localMode: boolean) => void;
}

const ConnectionModeToggle: React.FC<ConnectionModeToggleProps> = ({ 
  isLocalMode, 
  onToggle 
}) => {
  return (
    <div className="flex items-center space-x-4 bg-white p-3 rounded-lg shadow-sm border">
      <div className="flex items-center space-x-2">
        <Switch
          id="local-mode"
          checked={isLocalMode}
          onCheckedChange={onToggle}
        />
        <Label htmlFor="local-mode" className="cursor-pointer">
          {isLocalMode ? "Modo local activado" : "Modo remoto activado"}
        </Label>
      </div>
      <div className="flex items-center text-gray-500 text-sm">
        {isLocalMode ? (
          <Laptop className="h-4 w-4 mr-1" />
        ) : (
          <Globe className="h-4 w-4 mr-1" />
        )}
        <span className="hidden sm:inline">
          {isLocalMode 
            ? "Chat funcionando solo en este dispositivo" 
            : "Chat conectado al servidor"}
        </span>
      </div>
    </div>
  );
};

export default ConnectionModeToggle;
