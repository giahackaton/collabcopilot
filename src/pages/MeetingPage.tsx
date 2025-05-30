
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/context/AuthContext';
import { useMeetingContext } from '@/context/MeetingContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { socketService } from '@/services/socketService';
import { scriptService } from '@/services/scriptService';
import MeetingHeader from '@/components/MeetingHeader';
import MeetingController from '@/components/MeetingController';
import MeetingActions from '@/components/MeetingActions';
import ChatSection from '@/components/ChatSection';
import AssistantWidget from '@/components/AssistantWidget';
import ParticipantsCard from '@/components/ParticipantsCard';
import InviteParticipantDialog from '@/components/InviteParticipantDialog';
import ParticipantProfileDialog from '@/components/ParticipantProfileDialog';
import ConnectionModeToggle from '@/components/ConnectionModeToggle';
import ScriptSelector from '@/components/ScriptSelector';
import { type Message, type Participant } from '@/context/MeetingContext';

const MeetingPage = () => {
  console.log("Rendering MeetingPage component");
  
  const { session } = useAuth();
  const { 
    meetingState, 
    setMeetingActive, 
    addMessage, 
    addParticipant,
    setIsRecording 
  } = useMeetingContext();
  
  console.log("MeetingPage: Context loaded", meetingState);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showParticipantsDialog, setShowParticipantsDialog] = useState(false);
  const [showParticipantProfileDialog, setShowParticipantProfileDialog] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [isInviting, setIsInviting] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [scriptEnabled, setScriptEnabled] = useState(false);
  // Inicialmente intentaremos conectar al servidor remoto
  const [isLocalMode, setIsLocalMode] = useState(false);

  // Verificar parámetros de invitación y unirse automáticamente a la reunión
  useEffect(() => {
    // Verificar si hay parámetros de invitación en la URL
    const meetingParam = searchParams.get('meeting');
    const inviterParam = searchParams.get('inviter');
    
    if (meetingParam && session.user) {
      // Si hay un nombre de reunión en la URL y el usuario está autenticado
      console.log(`Found meeting parameter: "${meetingParam}" from invitation link`);
      
      // Auto-unirse a la reunión con el nombre dado
      startMeeting(meetingParam);
      
      // Añadir notificación de que el usuario se unió por invitación
      if (inviterParam) {
        toast.success(`Te has unido a la reunión "${meetingParam}" invitado por ${inviterParam}`);
      } else {
        toast.success(`Te has unido a la reunión "${meetingParam}"`);
      }
      
      // Limpiar los parámetros de URL para evitar volver a unirse al refrescar
      navigate('/meeting', { replace: true });
    }
  }, [searchParams, session.user]);

  // Obtener perfil de usuario cuando el componente se monta
  useEffect(() => {
    if (session.user) {
      fetchUserProfile();
    }
  }, [session.user]);

  // Conectar Socket.IO cuando la reunión está activa
  useEffect(() => {
    const connectSocket = async () => {
      if (meetingState.isActive && session.user && userProfile) {
        console.log("Conectando a Socket.IO para la reunión", meetingState.meetingId);
        
        const connected = await socketService.connect({
          meetingId: meetingState.meetingId,
          userId: session.user.id,
          userName: userProfile?.full_name || session.user?.email?.split('@')[0] || 'Usuario'
        });
        
        setSocketConnected(connected);
        
        if (connected) {
          console.log("Conexión Socket.IO exitosa");
          toast.success("Conectado al chat de la reunión");
        } else {
          console.error("Error al conectar con Socket.IO");
          toast.error("Error de conexión al chat. La funcionalidad puede estar limitada.");
        }
      }
    };
    
    if (meetingState.isActive && session.user && userProfile) {
      connectSocket();
    }
    
    return () => {
      if (socketConnected) {
        socketService.disconnect();
        setSocketConnected(false);
      }
    };
  }, [meetingState.isActive, meetingState.meetingId, session.user, userProfile]);

  // Suscribirse al estado de conexión del socket
  useEffect(() => {
    const unsubscribe = socketService.onConnectionStatus((connected) => {
      console.log("Estado de conexión actualizado:", connected);
      setSocketConnected(connected);
    });
    
    return unsubscribe;
  }, []);

  // Añadir usuario actual como participante al unirse a una reunión
  useEffect(() => {
    if (meetingState.isActive && session.user && userProfile && socketConnected) {
      console.log("Añadiendo usuario actual como participante");
      
      const currentUser = {
        email: session.user?.email || 'usuario.actual@ejemplo.com',
        name: userProfile?.full_name || session.user?.email?.split('@')[0] || 'Usuario Actual',
        id: session.user?.id
      };
      
      addParticipant(currentUser);
    }
  }, [meetingState.isActive, session.user, userProfile, socketConnected]);

  // Add effect to handle local mode changes
  useEffect(() => {
    if (meetingState.isActive && session.user && userProfile) {
      // When local mode is toggled, reconnect the socket service
      socketService.setUseLocalEmulator(isLocalMode);
      
      // Reconnect with new mode
      const reconnect = async () => {
        const connected = await socketService.connect({
          meetingId: meetingState.meetingId,
          userId: session.user.id,
          userName: userProfile?.full_name || session.user?.email?.split('@')[0] || 'Usuario'
        });
        
        setSocketConnected(connected);
        
        if (connected) {
          toast.success(`Conectado en modo ${isLocalMode ? 'local' : 'remoto'}`);
        } else {
          toast.error("Error de conexión. La funcionalidad puede estar limitada.");
        }
      };
      
      reconnect();
    }
  }, [isLocalMode, meetingState.isActive, meetingState.meetingId, session.user, userProfile]);

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
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const startMeeting = (name: string) => {
    if (!name.trim()) {
      toast.error('Por favor, ingresa un nombre para la reunión');
      return;
    }
    
    setMeetingActive(true, name);
    
    // Añadir mensaje del sistema
    setTimeout(() => {
      // Esperamos un momento para asegurar que la reunión esté activa
      const systemMessage: Message = {
        id: uuidv4(),
        content: 'La reunión ha comenzado. El asistente de IA está listo para ayudar.',
        sender: 'system',
        sender_name: 'Sistema',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAI: true
      };
      
      addMessage(systemMessage);
    }, 1000);
    
    toast.success('Reunión iniciada correctamente');
  };

  const handleSendMessage = (messageText: string) => {
    if (!session.user) return;
    
    // Crear un nuevo mensaje
    const newMessage: Message = {
      id: uuidv4(),
      content: messageText,
      sender: session.user?.email || 'anonymous',
      sender_name: userProfile?.full_name || session.user?.email?.split('@')[0] || 'Usuario',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAI: false
    };
    
    addMessage(newMessage);
    
    // Verificar si estamos usando un guión
    if (scriptEnabled) {
      // Intentar procesar el mensaje según el guión
      const aiResponse = scriptService.processUserMessage(messageText);
      
      if (aiResponse) {
        // Si hay respuesta del guión, enviarla después de un breve retraso
        setTimeout(() => {
          const scriptAiMessage: Message = {
            id: uuidv4(),
            content: aiResponse.content,
            sender: 'ai-assistant',
            sender_name: 'Asistente IA',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isAI: true
          };
          
          addMessage(scriptAiMessage);
        }, 1000);
        
        return;
      }
      
      // Verificar si el mensaje solicita un resumen
      if (scriptService.shouldGenerateSummary(messageText)) {
        setTimeout(() => {
          const summaryResponseMessage: Message = {
            id: uuidv4(),
            content: 'He creado un resumen de la reunión con los puntos clave discutidos.',
            sender: 'ai-assistant',
            sender_name: 'Asistente IA',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isAI: true
          };
          
          addMessage(summaryResponseMessage);
        }, 1000);
        
        return;
      }
    }
    
    // Si no es parte de un guión o no se reconoce, usar respuesta genérica
    setTimeout(() => {
      const aiResponse: Message = {
        id: uuidv4(),
        content: 'He registrado tu mensaje y lo tendré en cuenta para el resumen de la reunión.',
        sender: 'ai-assistant',
        sender_name: 'Asistente IA',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAI: true
      };
      
      addMessage(aiResponse);
    }, 1000);
  };

  const toggleRecording = () => {
    setIsRecording(!meetingState.isRecording);
    toast.info(meetingState.isRecording ? 'Grabación detenida' : 'Grabación iniciada');
  };

  const handleInviteParticipant = async (email: string) => {
    setIsInviting(true);
    
    try {
      // Crear nuevo objeto de participante
      const newParticipantObj: Participant = {
        email: email,
        name: email.split('@')[0] || 'Invitado',
      };
      
      // Obtener la URL actual de la aplicación
      const appUrl = window.location.origin;
      
      // Enviar email de invitación usando edge function
      const { data, error } = await supabase.functions.invoke('send-invitation', {
        body: {
          email: email,
          sender: session.user?.email,
          meetingTitle: meetingState.meetingName,
          appUrl: appUrl // Pasando la URL actual de la app
        }
      });
      
      if (error) {
        console.error('Error from send-invitation function:', error);
        toast.error(`Error al enviar la invitación: ${error.message}`);
        return;
      }
      
      if (!data?.success) {
        console.error('Error response from send-invitation function:', data);
        toast.error(`Error al enviar la invitación: ${data?.error || 'Error desconocido'}`);
        return;
      }
      
      // Añadir a la lista de participantes solo si el email se envió correctamente
      addParticipant(newParticipantObj);
      toast.success(`Invitación enviada a ${email}`);
      setShowParticipantsDialog(false);
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Error al enviar la invitación');
    } finally {
      setIsInviting(false);
    }
  };

  // Manejar visualización del perfil de participante
  const handleViewParticipantProfile = (participant: Participant) => {
    setSelectedParticipant(participant);
    setShowParticipantProfileDialog(true);
  };

  // Manejar activación de guión
  const handleScriptActivate = () => {
    setScriptEnabled(true);
    toast.success('Guión activado. Sigue las sugerencias para la conversación simulada.');
  };

  // Toggle local mode handler
  const handleToggleLocalMode = (localMode: boolean) => {
    console.log("Cambiando modo local a:", localMode);
    setIsLocalMode(localMode);
  };

  return (
    <div className="flex flex-col h-full">
      <MeetingHeader 
        meetingActive={meetingState.isActive} 
        meetingName={meetingState.meetingName} 
        startTime={meetingState.startTime} 
      />

      {!meetingState.isActive ? (
        <MeetingController onStartMeeting={startMeeting} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          {/* Connection mode toggle */}
          <div className="lg:col-span-2 mb-2 flex justify-between items-center">
            <ConnectionModeToggle 
              isLocalMode={isLocalMode}
              onToggle={handleToggleLocalMode}
            />
            <ScriptSelector onScriptActivate={handleScriptActivate} />
          </div>

          {/* Chat section */}
          <div className="lg:col-span-2 flex flex-col">
            <ChatSection
              messages={meetingState.messages}
              isRecording={meetingState.isRecording}
              onSendMessage={handleSendMessage}
              onToggleRecording={toggleRecording}
              onShowParticipantsDialog={() => setShowParticipantsDialog(true)}
              isConnected={socketConnected}
              onScriptActivate={handleScriptActivate}
            />
            
            <div className="mt-6">
              <MeetingActions 
                messages={meetingState.messages} 
                participants={meetingState.participants} 
                useScriptSummary={scriptEnabled}
              />
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            <AssistantWidget />

            <ParticipantsCard
              participants={meetingState.participants}
              onAddParticipant={() => setShowParticipantsDialog(true)}
              onViewProfile={handleViewParticipantProfile}
            />
          </div>
        </div>
      )}

      {/* Dialogs */}
      <InviteParticipantDialog
        open={showParticipantsDialog}
        onOpenChange={setShowParticipantsDialog}
        onInvite={handleInviteParticipant}
        isInviting={isInviting}
      />

      <ParticipantProfileDialog
        open={showParticipantProfileDialog}
        onOpenChange={setShowParticipantProfileDialog}
        participant={selectedParticipant}
      />
    </div>
  );
};

export default MeetingPage;
