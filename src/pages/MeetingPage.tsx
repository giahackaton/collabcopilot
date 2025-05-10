
import React, { useEffect, useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { Message } from '@/types/meeting';
import { ScrollArea } from "@/components/ui/scroll-area";

// ElevenLabs Voice Agent Component
const VoiceAgent = ({ onMessage }: { onMessage: (content: string, isAI?: boolean) => void }) => {
  // Referencia al contenedor donde se montará el widget
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    // Cargamos el script de ElevenLabs solo una vez
    if (!isInitialized) {
      const script = document.createElement('script');
      script.src = 'https://elevenlabs.io/convai-widget/index.js';
      script.async = true;
      script.type = 'text/javascript';
      document.body.appendChild(script);
      
      // Una vez que el script está cargado, creamos manualmente el elemento personalizado
      script.onload = () => {
        if (widgetContainerRef.current) {
          // Limpiamos el contenido anterior si existe
          widgetContainerRef.current.innerHTML = '';
          
          // Creamos el elemento personalizado de manera dinámica
          const convaiElement = document.createElement('elevenlabs-convai');
          convaiElement.setAttribute('agent-id', 'qpL7DFiOttmlnC5ESiBo');
          
          // Añadimos el elemento al contenedor
          widgetContainerRef.current.appendChild(convaiElement);
          
          // Configuramos la captura de mensajes del agente
          window.addEventListener('message', handleMessage);
          
          setIsInitialized(true);
        }
      };
    }
    
    // Función para manejar los mensajes del widget
    const handleMessage = (event: MessageEvent) => {
      // Verificamos si el mensaje es del widget de ElevenLabs
      if (event.data && typeof event.data === 'object' && 'source' in event.data && event.data.source === 'convai-widget') {
        if (event.data.type === 'agent-response') {
          // Enviamos el mensaje del agente al chat
          onMessage(event.data.text || 'El asistente está procesando...');
        }
        // También podemos capturar cuando el usuario habla con el agente
        if (event.data.type === 'user-input') {
          onMessage(event.data.text || 'Enviando mensaje al asistente...', false);
        }
      }
    };
    
    return () => {
      // Solo eliminamos el event listener, pero mantenemos el script cargado
      window.removeEventListener('message', handleMessage);
    };
  }, [onMessage, isInitialized]); // Dependencias actualizadas
  
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white mb-6">
      <h3 className="text-lg font-medium mb-3">Asistente de Voz</h3>
      <div ref={widgetContainerRef} className="elevenlabs-convai-widget">
        {/* Aquí se montará dinámicamente el widget de ElevenLabs */}
      </div>
    </div>
  );
};

const MeetingPage = () => {
  const { session } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: session.user?.email || 'Usuario',
      timestamp: new Date().toISOString(),
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };
  
  // Función para agregar mensajes del asistente de voz al chat
  const handleVoiceAgentMessage = (content: string, isAI: boolean = true) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content: content,
      sender: isAI ? 'Asistente de Sprint' : session.user?.email || 'Usuario',
      timestamp: new Date().toISOString(),
      isAI: isAI
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Reunión Activa</h1>
        <p className="text-gray-500 mt-1">
          Participa en la reunión activa con el asistente
        </p>
      </div>

      <div className="flex flex-1 gap-6">
        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 border rounded-lg p-4 bg-white mb-4 h-[60vh]">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <p>No hay mensajes aún. Inicia la conversación.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${
                      msg.isAI ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div 
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.isAI 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      <div className="font-medium text-sm mb-1">
                        {msg.sender}
                      </div>
                      <p>{msg.content}</p>
                      <div className="text-xs opacity-70 text-right mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1"
            />
            <Button type="submit">Enviar</Button>
          </form>
        </div>

        {/* Voice agent sidebar - now persistent */}
        <div className="w-80">
          <VoiceAgent onMessage={handleVoiceAgentMessage} />
          
          <div className="border rounded-lg p-4 shadow-sm bg-white">
            <h3 className="text-lg font-medium mb-3">Participantes</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>{session.user?.email || 'Usuario'} (Tú)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Asistente de Sprint</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingPage;
