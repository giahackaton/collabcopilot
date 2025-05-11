
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, PauseCircle, Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onToggleRecording: () => void;
  isRecording: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onToggleRecording, 
  isRecording 
}) => {
  const [message, setMessage] = useState('');
  
  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage('');
  };

  return (
    <div className="border-t p-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleRecording}
          className={isRecording ? 'bg-red-100 text-red-600 hover:bg-red-200' : ''}
        >
          {isRecording ? <PauseCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="pr-10"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
        </div>
        <Button onClick={handleSend} disabled={!message.trim()}>
          <Send className="h-5 w-5" />
          <span className="ml-2 hidden sm:inline">Enviar</span>
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
