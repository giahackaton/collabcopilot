
import React, { useEffect, useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { Message } from '@/types/meeting';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageSquare, User, Users, Copy, Download, Mic, MoreHorizontal, Search } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle,
  DrawerTrigger 
} from "@/components/ui/drawer";
import { toast } from "sonner";

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
          convaiElement.setAttribute('button-text', 'Hablar con Asistente');
          
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
      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
        <Mic className="h-5 w-5 text-blue-600" />
        Asistente de Voz
      </h3>
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
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleCopyMessages = () => {
    const messagesText = messages.map(msg => 
      `${msg.sender} (${new Date(msg.timestamp).toLocaleString()}): ${msg.content}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(messagesText)
      .then(() => toast.success("Mensajes copiados al portapapeles"))
      .catch(err => toast.error("Error al copiar: " + err));
  };

  const handleDownloadChat = () => {
    const messagesText = messages.map(msg => 
      `${msg.sender} (${new Date(msg.timestamp).toLocaleString()}): ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([messagesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reunion-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Chat descargado correctamente");
  };
  
  const filteredMessages = searchTerm 
    ? messages.filter(msg => 
        msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.sender.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : messages;

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <MessageSquare className="h-8 w-8 text-blue-600" /> 
          Reunión Activa
        </h1>
        <p className="text-gray-500 mt-1">
          Participa en la reunión activa con el asistente
        </p>
      </div>

      <div className="flex flex-1 gap-6">
        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat toolbar */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopyMessages} 
                className="flex items-center gap-1"
              >
                <Copy className="h-4 w-4" /> Copiar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownloadChat}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" /> Descargar
              </Button>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar en el chat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        
          <ScrollArea className="flex-1 border rounded-lg p-4 bg-white mb-4 h-[60vh]">
            {filteredMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <MessageSquare className="h-12 w-12 mb-2 opacity-30" />
                <p>No hay mensajes aún. Inicia la conversación.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMessages.map((msg) => (
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
                      <div className="font-medium text-sm mb-1 flex items-center gap-1">
                        {msg.isAI ? (
                          <>
                            <User className="h-3 w-3" />
                            {msg.sender}
                          </>
                        ) : (
                          <>
                            {msg.sender}
                            <User className="h-3 w-3" />
                          </>
                        )}
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
            <Button type="submit" className="flex items-center gap-1">
              <Send className="h-4 w-4" /> Enviar
            </Button>
          </form>
        </div>

        {/* Voice agent sidebar - now persistent */}
        <div className="w-80">
          <VoiceAgent onMessage={handleVoiceAgentMessage} />
          
          <div className="border rounded-lg p-4 shadow-sm bg-white mb-6">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Participantes
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4 text-gray-600" />
                    {session.user?.email || 'Usuario'} (Tú)
                  </span>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Información de usuario</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-gray-600">Email: {session.user?.email}</p>
                      <p className="text-sm text-gray-600">Estado: Activo</p>
                      <p className="text-sm text-gray-600">Rol: Participante</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4 text-blue-600" />
                    Asistente de Sprint
                  </span>
                </div>
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Sobre el Asistente</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-2">
                        El Asistente de Sprint es un agente AI diseñado para facilitar las reuniones 
                        de sprint, tomar notas, y ayudar con la gestión del proyecto.
                      </p>
                      <p className="text-sm text-gray-600">
                        Utiliza la voz o el chat para interactuar con el asistente y obtener ayuda.
                      </p>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full flex justify-center items-center gap-1">
                <Users className="h-4 w-4" /> Invitar participantes
              </Button>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 shadow-sm bg-white">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="flex flex-col items-center py-3 h-auto">
                <User className="h-5 w-5 mb-1" />
                <span className="text-xs">Perfil</span>
              </Button>
              <Button variant="outline" size="sm" className="flex flex-col items-center py-3 h-auto">
                <Search className="h-5 w-5 mb-1" />
                <span className="text-xs">Buscar</span>
              </Button>
              <Button variant="outline" size="sm" className="flex flex-col items-center py-3 h-auto">
                <Download className="h-5 w-5 mb-1" />
                <span className="text-xs">Exportar</span>
              </Button>
              <Button variant="outline" size="sm" className="flex flex-col items-center py-3 h-auto">
                <Copy className="h-5 w-5 mb-1" />
                <span className="text-xs">Duplicar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingPage;
