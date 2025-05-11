
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, PauseCircle, Send, AlertCircle, RefreshCcw, BookOpen } from 'lucide-react';
import { socketService } from '@/services/socketService';
import { scriptService } from '@/services/scriptService';
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onToggleRecording: () => void;
  isRecording: boolean;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onToggleRecording, 
  isRecording,
  disabled = false
}) => {
  const [message, setMessage] = useState('');
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [suggestedMessage, setSuggestedMessage] = useState<string | null>(null);
  const [scriptActive, setScriptActive] = useState(false);
  
  // Verificar si hay un guión activo y obtener mensaje sugerido
  useEffect(() => {
    const hasActiveScript = scriptService.hasActiveScript();
    setScriptActive(hasActiveScript);
    
    if (hasActiveScript) {
      const nextMessage = scriptService.getNextUserMessage();
      setSuggestedMessage(nextMessage?.content || null);
    } else {
      setSuggestedMessage(null);
    }
  }, [message]); // Se actualiza cuando cambia el mensaje
  
  const handleSend = () => {
    if (!message.trim() || disabled) return;
    onSendMessage(message);
    setMessage('');
    
    // Si hay guión activo, verificar si debemos generar respuesta
    if (scriptActive) {
      const nextSuggestion = scriptService.getNextUserMessage();
      setSuggestedMessage(nextSuggestion?.content || null);
    }
  };
  
  const handleReconnect = async () => {
    setIsReconnecting(true);
    try {
      const success = await socketService.reconnect();
      if (!success) {
        console.error('No se pudo reconectar al servidor');
      }
    } catch (error) {
      console.error('Error al intentar reconectar:', error);
    } finally {
      setIsReconnecting(false);
    }
  };

  const handleUseSuggestion = () => {
    if (suggestedMessage) {
      setMessage(suggestedMessage);
      // No enviamos automáticamente para que el usuario pueda ver lo que va a enviar
    }
  };

  return (
    <div className="border-t p-4">
      {disabled && (
        <div className="mb-2 p-2 bg-red-50 border border-red-100 rounded flex items-center justify-between text-red-600 text-sm">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" /> 
            Sin conexión. Reconectando...
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReconnect}
            disabled={isReconnecting}
            className="text-red-600 hover:bg-red-100 p-1 h-8"
          >
            <RefreshCcw className={`h-4 w-4 ${isReconnecting ? 'animate-spin' : ''}`} />
            <span className="ml-1 text-xs">{isReconnecting ? 'Activando...' : 'Activar local'}</span>
          </Button>
        </div>
      )}
      
      {scriptActive && suggestedMessage && (
        <div className="mb-2 p-2 bg-blue-50 border border-blue-100 rounded flex items-center justify-between">
          <div className="flex items-center text-blue-600 text-sm flex-1">
            <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" /> 
            <span className="truncate">{suggestedMessage}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUseSuggestion}
            className="text-blue-600 hover:bg-blue-100 whitespace-nowrap ml-2"
          >
            Usar sugerencia
          </Button>
        </div>
      )}
      
      {scriptActive && (
        <div className="flex justify-end mb-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-600">
            Modo guión activo
          </Badge>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleRecording}
          className={isRecording ? 'bg-red-100 text-red-600 hover:bg-red-200' : ''}
          disabled={disabled}
        >
          {isRecording ? <PauseCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={disabled ? "Sin conexión..." : "Escribe un mensaje..."}
            className="pr-10"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={disabled}
          />
        </div>
        <Button onClick={handleSend} disabled={!message.trim() || disabled}>
          <Send className="h-5 w-5" />
          <span className="ml-2 hidden sm:inline">Enviar</span>
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
