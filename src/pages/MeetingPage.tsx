
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/context/AuthContext';
import MeetingActions from '@/components/MeetingActions';
import {
  MessageSquare, Send, Mic, User, Search, Download, Copy,
  UserPlus, Settings, MoreHorizontal, Play, PauseCircle, Clock, Calendar,
  ChevronLeft, ChevronRight, AlertCircle
} from 'lucide-react';
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, 
  DialogTitle, DialogTrigger, DialogFooter, DialogClose 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  sender: string;
  sender_name?: string;
  timestamp: string;
  isAI: boolean;
}

interface Participant {
  email: string;
  name: string;
  id?: string;
}

const MeetingPage = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showParticipantsDialog, setShowParticipantsDialog] = useState(false);
  const [newParticipant, setNewParticipant] = useState('');
  const [showUserProfileDialog, setShowUserProfileDialog] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isInviting, setIsInviting] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Fetch participants and messages when component mounts
  useEffect(() => {
    if (session.user) {
      fetchParticipants();
    }
  }, [session.user]);

  const fetchParticipants = async () => {
    try {
      // In a real application, you would fetch this from your database
      const currentUser = {
        email: session.user?.email || 'usuario.actual@ejemplo.com',
        name: userProfile?.full_name || session.user?.email?.split('@')[0] || 'Usuario Actual',
        id: session.user?.id
      };
      
      setParticipants([currentUser]);
    } catch (error) {
      console.error('Error fetching participants:', error);
      toast.error('No se pudieron cargar los participantes');
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    
    // Create a new message
    const newMessage: Message = {
      id: crypto.randomUUID(),
      content: message,
      sender: session.user?.email || 'anonymous',
      sender_name: userProfile?.full_name || session.user?.email?.split('@')[0] || 'Usuario',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAI: false
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    // Generate AI response after a short delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: crypto.randomUUID(),
        content: 'He registrado tu mensaje y lo tendré en cuenta para el resumen de la reunión.',
        sender: 'ai-assistant',
        sender_name: 'Asistente IA',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAI: true
      };
      
      setMessages(prevMessages => [...prevMessages, aiResponse]);
    }, 1000);
    
    setMessage('');
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast.info(isRecording ? 'Grabación detenida' : 'Grabación iniciada');
  };

  const searchInMeeting = () => {
    toast.info('Búsqueda en reunión');
  };

  const exportMeeting = () => {
    toast.success('Reunión exportada');
  };

  const duplicateMeeting = () => {
    toast.success('Reunión duplicada');
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    if (!isValid) {
      setEmailError('Por favor ingresa un correo electrónico válido');
    } else {
      setEmailError('');
    }
    
    return isValid;
  };

  const inviteParticipant = async () => {
    if (!newParticipant.trim() || !validateEmail(newParticipant)) return;
    
    setIsInviting(true);
    
    try {
      // Create a new participant object
      const newParticipantObj: Participant = {
        email: newParticipant,
        name: newParticipant.split('@')[0] || 'Invitado',
      };
      
      // Send invitation email using edge function
      const { data, error } = await supabase.functions.invoke('send-invitation', {
        body: {
          email: newParticipant,
          sender: session.user?.email,
          meetingTitle: 'Sprint Planning - Mayo 2025'
        }
      });
      
      if (error) {
        console.error('Error from send-invitation function:', error);
        toast.error(`Error al enviar la invitación: ${error.message}`);
        setIsInviting(false);
        return;
      }
      
      if (!data?.success) {
        console.error('Error response from send-invitation function:', data);
        toast.error(`Error al enviar la invitación: ${data?.error || 'Error desconocido'}`);
        setIsInviting(false);
        return;
      }
      
      // Add to participants list only if email was sent successfully
      setParticipants(prev => [...prev, newParticipantObj]);
      toast.success(`Invitación enviada a ${newParticipant}`);
      setNewParticipant('');
      setShowParticipantsDialog(false);
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Error al enviar la invitación');
    } finally {
      setIsInviting(false);
    }
  };

  const fetchUserProfile = async () => {
    if (!session.user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (error) throw error;
      
      setUserProfile(data);
      setShowUserProfileDialog(true);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('No se pudo cargar el perfil del usuario');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Meeting header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <MessageSquare className="h-8 w-8 text-blue-600" />
          Reunión Activa
        </h1>
        <div className="flex items-center justify-between mt-2">
          <p className="text-gray-500 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Sprint Planning - Mayo 2025
          </p>
          <p className="text-gray-500 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Duración: <span id="meeting-duration">00:00</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        {/* Chat section */}
        <div className="lg:col-span-2 flex flex-col">
          <Card className="flex-1 overflow-hidden">
            <CardHeader className="border-b p-4">
              <CardTitle className="text-xl flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  Chat de la Reunión
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => setShowParticipantsDialog(true)}>
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden sm:inline ml-2">Invitar</span>
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[50vh] overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isAI ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] ${msg.isAI ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'} rounded-lg p-3 shadow-sm`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{(msg.sender_name || msg.sender)[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{msg.isAI ? 'AI Assistant' : msg.sender_name || msg.sender}</span>
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
              </div>
              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleRecording}
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
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                  </div>
                  <Button onClick={sendMessage} disabled={!message.trim()}>
                    <Send className="h-5 w-5" />
                    <span className="ml-2 hidden sm:inline">Enviar</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <MeetingActions messages={messages} participants={participants} />
          </div>
        </div>

        {/* Toggle sidebar button */}
        <div className="absolute top-1/2 -translate-y-1/2 right-0 lg:right-auto lg:left-0 z-10">
          <Button 
            variant="outline" 
            size="icon" 
            className="hidden lg:flex bg-white shadow-md rounded-full"
            onClick={toggleSidebar}
          >
            {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Right sidebar */}
        <div className={`space-y-6 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:hidden' : 'block'}`}>
          {/* Voice assistant section */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Mic className="h-5 w-5 text-blue-600" />
                <span>Widget de Asistente</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-md text-center">
                <elevenlabs-convai agent-id="qpL7DFiOttmlnC5ESiBo"></elevenlabs-convai>
                <p className="text-xs text-gray-500 mt-2">
                  El asistente transcribirá y analizará la conversación
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                Acciones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={fetchUserProfile} className="flex-col h-24 space-y-2">
                  <User className="h-6 w-6" />
                  <span className="text-xs">Perfil</span>
                </Button>
                <Button variant="outline" onClick={searchInMeeting} className="flex-col h-24 space-y-2">
                  <Search className="h-6 w-6" />
                  <span className="text-xs">Buscar</span>
                </Button>
                <Button variant="outline" onClick={exportMeeting} className="flex-col h-24 space-y-2">
                  <Download className="h-6 w-6" />
                  <span className="text-xs">Exportar</span>
                </Button>
                <Button variant="outline" onClick={duplicateMeeting} className="flex-col h-24 space-y-2">
                  <Copy className="h-6 w-6" />
                  <span className="text-xs">Duplicar</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Participantes
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowParticipantsDialog(true)}>
                <UserPlus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {participants.map((participant, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{participant.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{participant.name}</p>
                      <p className="text-xs text-gray-500 truncate">{participant.email}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invite Participants Dialog */}
      <Dialog open={showParticipantsDialog} onOpenChange={setShowParticipantsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invitar Participantes</DialogTitle>
            <DialogDescription>
              Ingresa el correo electrónico de la persona que deseas invitar a esta reunión.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                value={newParticipant}
                onChange={(e) => {
                  setNewParticipant(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                className={emailError ? "border-red-500" : ""}
              />
              {emailError && (
                <div className="flex items-center text-red-500 text-sm mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {emailError}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button 
              onClick={inviteParticipant} 
              disabled={isInviting || !newParticipant.trim() || !!emailError}
            >
              {isInviting ? 'Enviando...' : 'Invitar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Profile Dialog */}
      <Dialog open={showUserProfileDialog} onOpenChange={setShowUserProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Perfil de Usuario</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback>{session.user?.email?.[0].toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold">{userProfile?.full_name || session.user?.email}</h3>
              <p className="text-gray-500">{session.user?.email}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label className="text-xs text-gray-500">Nombre de Usuario</Label>
                <p>{userProfile?.username || 'No definido'}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Cuenta Creada</Label>
                <p>{userProfile ? new Date(userProfile.created_at).toLocaleDateString() : 'No disponible'}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Cerrar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MeetingPage;
