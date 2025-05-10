import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/context/AuthContext';
import MeetingActions from '@/components/MeetingActions';
import {
  MessageSquare, Send, Mic, User, Search, Download, Copy,
  UserPlus, Settings, MoreHorizontal, Play, PauseCircle, Clock, Calendar
} from 'lucide-react';
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, 
  DialogTitle, DialogTrigger, DialogFooter, DialogClose 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const MeetingPage = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showParticipantsDialog, setShowParticipantsDialog] = useState(false);
  const [newParticipant, setNewParticipant] = useState('');
  const [showUserProfileDialog, setShowUserProfileDialog] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Dummy messages
  const messages = [
    { id: '1', content: 'Bienvenidos a la reunión de sprint', sender: 'juan.perez@ejemplo.com', timestamp: '10:00', isAI: false },
    { id: '2', content: 'Revisemos los objetivos alcanzados durante el último sprint', sender: 'maria.rodriguez@ejemplo.com', timestamp: '10:02', isAI: false },
    { id: '3', content: '¿Podemos empezar por el proceso de autenticación?', sender: 'pedro.gomez@ejemplo.com', timestamp: '10:05', isAI: false },
    { id: '4', content: 'Resumen de la conversación hasta ahora: Se está discutiendo los objetivos del sprint y se planea revisar el proceso de autenticación.', sender: 'ai-assistant', timestamp: '10:06', isAI: true },
  ];

  // Dummy participants
  const participants = [
    { email: 'juan.perez@ejemplo.com', name: 'Juan Pérez' },
    { email: 'maria.rodriguez@ejemplo.com', name: 'María Rodríguez' },
    { email: 'pedro.gomez@ejemplo.com', name: 'Pedro Gómez' },
  ];

  const sendMessage = () => {
    if (!message.trim()) return;
    
    // Here we would normally send the message to the server
    toast.success('Mensaje enviado');
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

  const inviteParticipant = () => {
    if (!newParticipant.trim()) return;
    
    // Here we would normally send an invitation to the participant
    toast.success(`Invitación enviada a ${newParticipant}`);
    setNewParticipant('');
    setShowParticipantsDialog(false);
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

  const handleFinishMeeting = () => {
    // Generate meeting summary dialog or navigate to summary page
    navigate('/summaries');
    toast.success('Reunión finalizada. Generando resumen...');
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
            Duración: 45:12
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                          <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{msg.isAI ? 'AI Assistant' : msg.sender}</span>
                        <span className="text-xs text-gray-500">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
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

        {/* Right sidebar */}
        <div className="space-y-6">
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
                <Button variant="outline" onClick={toggleRecording} className="mb-2">
                  {isRecording ? (
                    <span className="flex items-center gap-2">
                      <PauseCircle className="h-5 w-5 text-red-600" />
                      Detener grabación
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Play className="h-5 w-5 text-green-600" />
                      Iniciar grabación
                    </span>
                  )}
                </Button>
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
                onChange={(e) => setNewParticipant(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={inviteParticipant} disabled={!newParticipant.trim()}>Invitar</Button>
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
