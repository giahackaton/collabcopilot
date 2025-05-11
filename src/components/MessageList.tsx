
import React, { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { type Message } from '@/context/MeetingContext';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-[50vh] overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.isAI ? 'justify-start' : 'justify-end'}`}>
          <div className={`max-w-[80%] ${msg.isAI ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'} rounded-lg p-3 shadow-sm`}>
            <div className="flex items-center gap-2 mb-1">
              <Avatar className="h-6 w-6">
                <AvatarFallback>{(msg.sender_name || msg.sender)[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium">{msg.isAI ? 'Asistente IA' : msg.sender_name || msg.sender}</span>
              <span className="text-xs text-gray-500">{msg.timestamp}</span>
            </div>
            <p className="text-sm">{msg.content}</p>
          </div>
        </div>
      ))}
      {messages.length === 0 && (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 text-center">
            No hay mensajes aún. ¡Comienza la conversación!
          </p>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
