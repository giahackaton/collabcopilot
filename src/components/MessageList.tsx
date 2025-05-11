
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
    <div className="h-[50vh] overflow-y-auto p-4 space-y-4">
      {groupedMessages.map((group, groupIndex) => (
        <div key={groupIndex} className={`flex ${group.messages[0].isAI ? 'justify-start' : 'justify-end'}`}>
          <div className={`max-w-[80%] ${group.messages[0].isAI ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'} rounded-lg p-3 shadow-sm`}>
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback>{(group.messages[0].sender_name || group.messages[0].sender)[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium">{group.messages[0].isAI ? 'Asistente IA' : group.messages[0].sender_name || group.messages[0].sender}</span>
              <span className="text-xs text-gray-500">{group.messages[0].timestamp}</span>
            </div>
            
            {group.messages.map((msg, msgIndex) => (
              <div key={msg.id} className={msgIndex > 0 ? "mt-2 pt-2 border-t border-gray-200" : ""}>
                <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
              </div>
            ))}
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
