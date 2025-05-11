
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, PauseCircle, Send, AlertCircle } from 'lucide-react';

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
  
  const handleSend = () => {
    if (!message.trim() || disabled) return;
    onSendMessage(message);
    setMessage('');
  };

  return (
    <div className="border-t p-4">
      {disabled && (
        <div className="mb-2 p-2 bg-red-50 border border-red-100 rounded flex items-center text-red-600 text-sm">
          <AlertCircle className="h-4 w-4 mr-2" /> 
          Sin conexión. Reconectando...
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
