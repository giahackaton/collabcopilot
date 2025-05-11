
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

  // Subscribe to realtime updates for meeting messages
  useEffect(() => {
    if (!meetingState.isActive || !meetingState.meetingId) return;

    // Subscribe to new messages for this meeting
    const channel = supabase
      .channel(`meeting_${meetingState.meetingId}`)
      .on('broadcast', { event: 'new_message' }, (payload) => {
        const message = payload.payload as Message;
        // Check if message is already in state to prevent duplicates
        if (!meetingState.messages.some(m => m.id === message.id)) {
          setMeetingState(prev => ({
            ...prev,
            messages: [...prev.messages, message]
          }));
        }
      })
      .on('broadcast', { event: 'new_participant' }, (payload) => {
        const participant = payload.payload as Participant;
        // Check if participant is already in state to prevent duplicates
        if (!meetingState.participants.some(p => p.email === participant.email)) {
          setMeetingState(prev => ({
            ...prev,
            participants: [...prev.participants, participant]
          }));
        }
      })
      .subscribe();

    return () => {
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
    if (!meetingState.isActive || !meetingState.meetingId) return;
    
    // Add message to local state
    setMeetingState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
    
    // Broadcast message to all meeting participants
    try {
      const messageWithMeetingId = {
        ...message,
        meeting_id: meetingState.meetingId
      };
      
      await supabase
        .channel(`meeting_${meetingState.meetingId}`)
        .send({
          type: 'broadcast',
          event: 'new_message',
          payload: messageWithMeetingId
        });
    } catch (error) {
      console.error('Error broadcasting message:', error);
      toast.error('Error sending message');
    }
  };

  const addParticipant = async (participant: Participant) => {
    if (!meetingState.isActive || !meetingState.meetingId) return;
    
    // Check if participant already exists to avoid duplicates
    const exists = meetingState.participants.some(p => p.email === participant.email);
    if (!exists) {
      // Add participant to local state
      setMeetingState(prev => ({
        ...prev,
        participants: [...prev.participants, participant]
      }));
      
      // Broadcast new participant to all meeting participants
      try {
        await supabase
          .channel(`meeting_${meetingState.meetingId}`)
          .send({
            type: 'broadcast',
            event: 'new_participant',
            payload: participant
          });
      } catch (error) {
        console.error('Error broadcasting new participant:', error);
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
    throw new Error('useMeetingContext must be used within a MeetingProvider');
  }
  return context;
};
