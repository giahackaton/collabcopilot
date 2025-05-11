
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Message {
  id: string;
  content: string;
  sender: string;
  sender_name?: string;
  timestamp: string;
  isAI: boolean;
}

export interface Participant {
  email: string;
  name: string;
  id?: string;
}

interface MeetingState {
  isActive: boolean;
  meetingName: string;
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
  meetingName: 'Sprint Planning - Mayo 2025',
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

  const setMeetingActive = (active: boolean, name?: string) => {
    setMeetingState(prev => ({
      ...prev,
      isActive: active,
      meetingName: name || prev.meetingName,
      startTime: active ? (prev.startTime || new Date()) : prev.startTime
    }));
  };

  const setMeetingName = (name: string) => {
    setMeetingState(prev => ({
      ...prev,
      meetingName: name
    }));
  };

  const addMessage = (message: Message) => {
    setMeetingState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
  };

  const addParticipant = (participant: Participant) => {
    // Check if participant already exists to avoid duplicates
    const exists = meetingState.participants.some(p => p.email === participant.email);
    if (!exists) {
      setMeetingState(prev => ({
        ...prev,
        participants: [...prev.participants, participant]
      }));
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
