
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

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
  isRecording: false
};

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

export const MeetingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [meetingState, setMeetingState] = useState<MeetingState>(() => {
    // Try to load the meeting state from session storage on initial load
    const savedState = sessionStorage.getItem('meetingState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      // Convert startTime string back to Date object if it exists
      if (parsedState.startTime) {
        parsedState.startTime = new Date(parsedState.startTime);
      }
      return parsedState;
    }
    return defaultMeetingState;
  });

  // Save meeting state to session storage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('meetingState', JSON.stringify(meetingState));
  }, [meetingState]);

  // Track current subscription
  const [currentChannel, setCurrentChannel] = useState<any>(null);
  
  // Handle realtime subscription cleanup
  useEffect(() => {
    return () => {
      if (currentChannel) {
        console.log("Limpiando canal de Supabase al desmontar");
        supabase.removeChannel(currentChannel);
        setCurrentChannel(null);
      }
    };
  }, [currentChannel]);
  
  // Subscribe to realtime updates for meeting messages
  useEffect(() => {
    if (!meetingState.isActive || !meetingState.meetingId) {
      // Cleanup existing channel when meeting becomes inactive
      if (currentChannel) {
        console.log("Limpiando canal porque la reunión ya no está activa");
        supabase.removeChannel(currentChannel);
        setCurrentChannel(null);
      }
      return;
    }
    
    // Cleanup any existing channel before creating a new one
    if (currentChannel) {
      console.log("Limpiando canal existente antes de crear uno nuevo");
      supabase.removeChannel(currentChannel);
      setCurrentChannel(null);
    }

    console.log(`Suscribiendo al canal: meeting_${meetingState.meetingId}`);
    
    // Create a new channel subscription
    const channel = supabase
      .channel(`meeting_${meetingState.meetingId}`)
      .on('broadcast', { event: 'new_message' }, (payload) => {
        const receivedMessage = payload.payload as Message;
        console.log('Mensaje recibido:', receivedMessage);
        
        // Check if this message is from the current user (already in state)
        // or if it's a duplicate message we've already processed
        const isDuplicate = meetingState.messages.some(m => m.id === receivedMessage.id);
        
        if (!isDuplicate) {
          console.log('Añadiendo nuevo mensaje a la lista:', receivedMessage);
          setMeetingState(prev => ({
            ...prev,
            messages: [...prev.messages, receivedMessage]
          }));
        } else {
          console.log('Mensaje duplicado, no agregado:', receivedMessage);
        }
      })
      .on('broadcast', { event: 'new_participant' }, (payload) => {
        const receivedParticipant = payload.payload as Participant;
        console.log('Participante recibido:', receivedParticipant);
        
        // Check if participant already exists to avoid duplicates
        const isDuplicate = meetingState.participants.some(p => 
          p.email === receivedParticipant.email
        );
        
        if (!isDuplicate) {
          console.log('Añadiendo nuevo participante:', receivedParticipant);
          setMeetingState(prev => ({
            ...prev,
            participants: [...prev.participants, receivedParticipant]
          }));
          
          // Notify when a new participant joins
          toast.info(`${receivedParticipant.name} se ha unido a la reunión`);
        } else {
          console.log('Participante duplicado, no agregado:', receivedParticipant);
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('¡Suscripción exitosa al canal!');
          setCurrentChannel(channel);
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error en el canal de Supabase');
          toast.error('Error de conexión. Intentando reconectar...');
        } else if (status === 'TIMED_OUT') {
          console.error('Tiempo de espera agotado en la conexión');
          toast.error('Tiempo de espera agotado. Intentando reconectar...');
        }
      });

    console.log("Canal creado y en proceso de suscripción");
    setCurrentChannel(channel);
    
    return () => {
      // This cleanup will only run if the component unmounts or dependencies change
      console.log('Limpiando suscripción al canal');
      supabase.removeChannel(channel);
    };
  }, [meetingState.isActive, meetingState.meetingId]);

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
    
    // First check if message with this ID already exists
    if (meetingState.messages.some(m => m.id === message.id)) {
      console.log('Mensaje ya existe, no se enviará:', message);
      return;
    }
    
    // Add message to local state immediately for responsive UI
    setMeetingState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
    
    // Prepare message with meeting ID
    const messageWithMeetingId = {
      ...message,
      meeting_id: meetingState.meetingId
    };
    
    try {
      console.log('Enviando mensaje por broadcast:', messageWithMeetingId);
      
      if (!currentChannel) {
        console.error('Error: No hay canal activo para enviar mensaje');
        toast.error('Error de conexión al enviar mensaje');
        return;
      }
      
      await currentChannel.send({
        type: 'broadcast',
        event: 'new_message',
        payload: messageWithMeetingId
      });
      
      console.log('Mensaje enviado correctamente por broadcast');
    } catch (error) {
      console.error('Error enviando mensaje por broadcast:', error);
      toast.error('Error al enviar mensaje. Intentando reconectar...');
      
      // On error, try to refresh channel connection
      if (currentChannel) {
        supabase.removeChannel(currentChannel);
        setCurrentChannel(null);
      }
    }
  };

  const addParticipant = async (participant: Participant) => {
    if (!meetingState.isActive || !meetingState.meetingId) {
      console.warn('No se puede añadir participante - reunión inactiva');
      return;
    }
    
    // Check if participant already exists locally
    const exists = meetingState.participants.some(p => p.email === participant.email);
    if (exists) {
      console.log('Participante ya existe localmente, no se añadirá:', participant);
      return;
    }
    
    // Add participant to local state immediately
    setMeetingState(prev => ({
      ...prev,
      participants: [...prev.participants, participant]
    }));
    
    try {
      console.log('Enviando nuevo participante por broadcast:', participant);
      
      if (!currentChannel) {
        console.error('Error: No hay canal activo para enviar participante');
        toast.error('Error de conexión al añadir participante');
        return;
      }
      
      await currentChannel.send({
        type: 'broadcast',
        event: 'new_participant',
        payload: participant
      });
      
      console.log('Participante enviado correctamente por broadcast');
    } catch (error) {
      console.error('Error enviando participante por broadcast:', error);
      toast.error('Error al añadir participante');
      
      // On error, try to refresh channel connection
      if (currentChannel) {
        supabase.removeChannel(currentChannel);
        setCurrentChannel(null);
      }
    }
  };

  const setIsRecording = (isRecording: boolean) => {
    setMeetingState(prev => ({
      ...prev,
      isRecording
    }));
  };

  const resetMeeting = () => {
    // Clean up any active channel subscription
    if (currentChannel) {
      supabase.removeChannel(currentChannel);
      setCurrentChannel(null);
    }
    
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
  if (context === undefined) {
    throw new Error('useMeetingContext debe usarse dentro de un MeetingProvider');
  }
  return context;
};
