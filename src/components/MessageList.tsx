
import React, { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { type Message } from '@/context/MeetingContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Log messages for debugging
  useEffect(() => {
    console.log("MessageList - Mensajes actuales:", messages.length);
    messages.forEach((msg, i) => {
      console.log(`Mensaje ${i+1}: ID=${msg.id}, Sender=${msg.sender}, Content=${msg.content.substring(0, 20)}...`);
    });
  }, [messages]);

  // Group consecutive messages from the same sender
  const groupedMessages = messages.reduce<{ sender: string; messages: Message[] }[]>((acc, msg) => {
    const lastGroup = acc[acc.length - 1];
    
    if (lastGroup && lastGroup.sender === msg.sender) {
      // Add to existing group if from same sender
      lastGroup.messages.push(msg);
    } else {
      // Start a new group
      acc.push({ sender: msg.sender, messages: [msg] });
    }
    
    return acc;
  }, []);

  return (
    <div className="flex-1 h-[350px] sm:h-[400px] overflow-y-auto p-2 sm:p-4 space-y-4">
      {groupedMessages.map((group, groupIndex) => (
        <div key={`group-${groupIndex}-${group.messages[0].id}`} className={`flex ${group.messages[0].isAI ? 'justify-start' : 'justify-end'}`}>
          <div className={`max-w-[85%] sm:max-w-[80%] ${group.messages[0].isAI ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'} rounded-lg p-2 sm:p-3 shadow-sm`}>
            <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                <AvatarFallback>{(group.messages[0].sender_name || group.messages[0].sender)[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium truncate">{group.messages[0].isAI ? 'Asistente IA' : group.messages[0].sender_name || group.messages[0].sender}</span>
              <span className="text-[10px] sm:text-xs text-gray-500">{group.messages[0].timestamp}</span>
            </div>
            
            {group.messages.map((msg, msgIndex) => (
              <div key={`msg-${msg.id}-${msgIndex}`} className={msgIndex > 0 ? "mt-2 pt-2 border-t border-gray-200" : ""}>
                <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{msg.content}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {messages.length === 0 && (
        <div className="flex flex-col justify-center items-center h-40 space-y-2">
          <p className="text-gray-500 text-center text-sm">
            No hay mensajes aún. ¡Comienza la conversación!
          </p>
          <p className="text-gray-400 text-xs text-center">
            Conectando al servidor de chat...
          </p>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
