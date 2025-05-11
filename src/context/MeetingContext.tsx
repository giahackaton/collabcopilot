
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { socketService } from '@/services/socketService';

export interface Message {
  id: string;
  content: string;
  sender: string;
  sender_name?: string;
  timestamp: string;
  isAI: boolean;
  meeting_id?: string;
}

export interface Participant {
  email: string;
  name: string;
  id?: string;
}

interface MeetingState {
  isActive: boolean;
  meetingName: string;
  meetingId: string;
  messages: Message[];
  participants: Participant[];
  startTime: Date | null;
  isRecording: boolean;
  isConnected: boolean;
}

interface MeetingContextType {
  meetingState: MeetingState;
  setMeetingActive: (active: boolean, name?: string) => void;
  setMeetingName: (name: string) => void;
  addMessage: (message: Message) => void;
  addParticipant: (participant: Participant) => void;
  setIsRecording: (isRecording: boolean) => void;
  resetMeeting: () => void;
}

const defaultMeetingState: MeetingState = {
  isActive: false,
  meetingName: '',
  meetingId: '',
  messages: [],
  participants: [],
  startTime: null,
  isRecording: false,
  isConnected: false
};

// Crear contexto con un valor predeterminado que no será nulo
const MeetingContext = createContext<MeetingContextType>({
  meetingState: defaultMeetingState,
  setMeetingActive: () => {},
  setMeetingName: () => {},
  addMessage: () => {},
  addParticipant: () => {},
  setIsRecording: () => {},
  resetMeeting: () => {}
});

export const MeetingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [meetingState, setMeetingState] = useState<MeetingState>(() => {
    // Intentar cargar el estado de la reunión desde sessionStorage en carga inicial
    const savedState = sessionStorage.getItem('meetingState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      // Convertir startTime string de vuelta a objeto Date si existe
      if (parsedState.startTime) {
        parsedState.startTime = new Date(parsedState.startTime);
      }
      return parsedState;
    }
    return defaultMeetingState;
  });

  // Guardar el estado de la reunión en sessionStorage cuando cambie
  useEffect(() => {
    sessionStorage.setItem('meetingState', JSON.stringify(meetingState));
  }, [meetingState]);

  // Gestionar la conexión Socket.IO cuando la reunión está activa
  useEffect(() => {
    if (!meetingState.isActive || !meetingState.meetingId) {
      // Desconectar socket si la reunión ya no está activa
      socketService.disconnect();
      return;
    }

    // No intentar conectar si no tenemos ID de usuario (debe manejarse en MeetingPage)
    return () => {
      // Limpiar sólo en desmontaje del componente o cambio de meetingId
      if (meetingState.isActive) {
        socketService.disconnect();
      }
    };
  }, [meetingState.isActive, meetingState.meetingId]);

  // Suscribirse al estado de conexión
  useEffect(() => {
    const unsubscribe = socketService.onConnectionStatus((connected) => {
      setMeetingState(prev => ({
        ...prev,
        isConnected: connected
      }));
      
      if (connected && meetingState.isActive) {
        toast.success('Conectado al chat de la reunión');
      } else if (!connected && meetingState.isActive) {
        toast.error('Desconectado del chat de la reunión. Reconectando...');
      }
    });

    return unsubscribe;
  }, [meetingState.isActive]);

  // Suscribirse a nuevos mensajes
  useEffect(() => {
    const unsubscribe = socketService.onMessage((message) => {
      // Verificar que el mensaje sea para esta reunión
      if (message.meeting_id !== meetingState.meetingId) {
        return;
      }
      
      // Verificar si este mensaje ya existe en nuestro estado
      const isDuplicate = meetingState.messages.some(m => m.id === message.id);
      if (isDuplicate) {
        console.log('Mensaje duplicado, no agregado:', message);
        return;
      }
      
      console.log('Añadiendo nuevo mensaje a la lista:', message);
      setMeetingState(prev => ({
        ...prev,
        messages: [...prev.messages, message]
      }));
    });

    return unsubscribe;
  }, [meetingState.meetingId, meetingState.messages]);

  // Suscribirse a eventos de participantes
  useEffect(() => {
    const unsubscribe = socketService.onParticipant((data) => {
      if (data.type === 'new_participant') {
        const participant = data.participant;
        
        // Verificar que el participante sea para esta reunión
        if (data.meetingId !== meetingState.meetingId) {
          return;
        }
        
        // Verificar si este participante ya existe
        const isDuplicate = meetingState.participants.some(p => 
          p.email === participant.email && p.id === participant.id
        );
        
        if (!isDuplicate) {
          console.log('Añadiendo nuevo participante:', participant);
          setMeetingState(prev => ({
            ...prev,
            participants: [...prev.participants, participant]
          }));
          
          // Notificar cuando un participante nuevo se une
          toast.info(`${participant.name} se ha unido a la reunión`);
        }
      }
      
      else if (data.type === 'participant_left') {
        const participantId = data.participantId;
        
        // Eliminar participante que se ha ido
        setMeetingState(prev => ({
          ...prev,
          participants: prev.participants.filter(p => p.id !== participantId)
        }));
        
        // Notificar cuando un participante se va
        toast.info(`Un participante ha abandonado la reunión`);
      }
    });

    return unsubscribe;
  }, [meetingState.meetingId, meetingState.participants]);

  const setMeetingActive = (active: boolean, name?: string) => {
    const meetingId = active ? (meetingState.meetingId || uuidv4()) : meetingState.meetingId;
    setMeetingState(prev => ({
      ...prev,
      isActive: active,
      meetingName: name || prev.meetingName,
      meetingId: meetingId,
      startTime: active ? (prev.startTime || new Date()) : prev.startTime
    }));
  };

  const setMeetingName = (name: string) => {
    setMeetingState(prev => ({
      ...prev,
      meetingName: name
    }));
  };

  const addMessage = async (message: Message) => {
    if (!meetingState.isActive || !meetingState.meetingId) {
      console.warn('No se puede enviar mensaje - reunión inactiva');
      return;
    }
    
    // Primero comprobar si el mensaje con este ID ya existe
    if (meetingState.messages.some(m => m.id === message.id)) {
      console.log('Mensaje ya existe, no se enviará:', message);
      return;
    }
    
    // Añadir mensaje al estado local inmediatamente para UI responsiva
    setMeetingState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
    
    // Preparar mensaje con ID de reunión
    const messageWithMeetingId = {
      ...message,
      meeting_id: meetingState.meetingId
    };
    
    try {
      console.log('Enviando mensaje vía Socket.IO:', messageWithMeetingId);
      
      if (!socketService.isConnected()) {
        console.error('Error: Socket no conectado para enviar mensaje');
        toast.error('Error de conexión al enviar mensaje');
        return;
      }
      
      const success = socketService.sendMessage(messageWithMeetingId);
      
      if (!success) {
        toast.error('Error al enviar mensaje. Intentando reconectar...');
      } else {
        console.log('Mensaje enviado correctamente por Socket.IO');
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      toast.error('Error al enviar mensaje. Intentando reconectar...');
    }
  };

  const addParticipant = async (participant: Participant) => {
    if (!meetingState.isActive || !meetingState.meetingId) {
      console.warn('No se puede añadir participante - reunión inactiva');
      return;
    }
    
    // Verificar si el participante ya existe localmente
    const exists = meetingState.participants.some(p => p.email === participant.email);
    if (exists) {
      console.log('Participante ya existe localmente, no se añadirá:', participant);
      return;
    }
    
    // Añadir participante al estado local inmediatamente
    setMeetingState(prev => ({
      ...prev,
      participants: [...prev.participants, participant]
    }));
    
    try {
      console.log('Registrando nuevo participante vía Socket.IO:', participant);
      
      if (!socketService.isConnected()) {
        console.error('Error: Socket no conectado para registrar participante');
        return;
      }
      
      const success = socketService.registerParticipant({
        ...participant,
        meetingId: meetingState.meetingId
      });
      
      if (!success) {
        console.error('Error registrando participante');
      } else {
        console.log('Participante registrado correctamente por Socket.IO');
      }
    } catch (error) {
      console.error('Error registrando participante:', error);
    }
  };

  const setIsRecording = (isRecording: boolean) => {
    setMeetingState(prev => ({
      ...prev,
      isRecording
    }));
  };

  const resetMeeting = () => {
    // Desconectar Socket.IO
    socketService.disconnect();
    
    setMeetingState(defaultMeetingState);
    sessionStorage.removeItem('meetingState');
  };

  return (
    <MeetingContext.Provider value={{
      meetingState,
      setMeetingActive,
      setMeetingName,
      addMessage,
      addParticipant,
      setIsRecording,
      resetMeeting
    }}>
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeetingContext = () => {
  const context = useContext(MeetingContext);
  if (!context) {
    throw new Error('useMeetingContext debe usarse dentro de un MeetingProvider');
  }
  return context;
};
