
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, UserPlus, Wifi, WifiOff, Laptop } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ScriptSelector from './ScriptSelector';
import { type Message } from '@/context/MeetingContext';

interface ChatSectionProps {
  messages: Message[];
  isRecording: boolean;
  isConnected?: boolean;
  onSendMessage: (message: string) => void;
  onToggleRecording: () => void;
  onShowParticipantsDialog: () => void;
  onScriptActivate?: () => void;
}

const ChatSection: React.FC<ChatSectionProps> = ({
  messages,
  isRecording,
  isConnected = false,
  onSendMessage,
  onToggleRecording,
  onShowParticipantsDialog,
  onScriptActivate = () => {}
}) => {
  return (
    <Card className="flex-1 overflow-hidden">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <span>Chat de la Reunión</span>
            <Badge variant={isConnected ? "outline" : "destructive"} className="ml-2">
              {isConnected ? 
                <><Laptop className="h-3 w-3 mr-1" /> Modo Local</> : 
                <><WifiOff className="h-3 w-3 mr-1" /> Desconectado</>
              }
            </Badge>
          </div>
          <div className="flex gap-2 items-center">
            <div className="opacity-50 hover:opacity-100 transition-opacity">
              <ScriptSelector onScriptActivate={onScriptActivate} />
            </div>
            <Button size="sm" variant="outline" onClick={onShowParticipantsDialog}>
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Invitar</span>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-[calc(100%-64px)]">
        <MessageList messages={messages} />
        <ChatInput 
          onSendMessage={onSendMessage}
          onToggleRecording={onToggleRecording}
          isRecording={isRecording}
          disabled={!isConnected}
        />
      </CardContent>
    </Card>
  );
};

export default ChatSection;
