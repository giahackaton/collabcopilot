
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, UserPlus } from 'lucide-react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { type Message } from '@/context/MeetingContext';

interface ChatSectionProps {
  messages: Message[];
  isRecording: boolean;
  onSendMessage: (message: string) => void;
  onToggleRecording: () => void;
  onShowParticipantsDialog: () => void;
}

const ChatSection: React.FC<ChatSectionProps> = ({
  messages,
  isRecording,
  onSendMessage,
  onToggleRecording,
  onShowParticipantsDialog
}) => {
  return (
    <Card className="flex-1 overflow-hidden">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            Chat de la Reunión
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={onShowParticipantsDialog}>
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Invitar</span>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <MessageList messages={messages} />
        <ChatInput 
          onSendMessage={onSendMessage}
          onToggleRecording={onToggleRecording}
          isRecording={isRecording}
        />
      </CardContent>
    </Card>
  );
};

export default ChatSection;
