
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, PauseCircle, Send, AlertCircle, RefreshCcw } from 'lucide-react';
import { socketService } from '@/services/socketService';

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
  
  const handleSend = () => {
    if (!message.trim() || disabled) return;
    onSendMessage(message);
    setMessage('');
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
