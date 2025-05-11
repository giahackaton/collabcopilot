
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/context/AuthContext';
import { useMeetingContext } from '@/context/MeetingContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import MeetingHeader from '@/components/MeetingHeader';
import MeetingController from '@/components/MeetingController';
import MeetingActions from '@/components/MeetingActions';
import ChatSection from '@/components/ChatSection';
import AssistantWidget from '@/components/AssistantWidget';
import ParticipantsCard from '@/components/ParticipantsCard';
import InviteParticipantDialog from '@/components/InviteParticipantDialog';
import ParticipantProfileDialog from '@/components/ParticipantProfileDialog';
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

  // Destructure meeting state for easier access
  const {
    isActive: meetingActive,
    meetingName,
    meetingId,
    messages,
    participants,
    startTime: meetingStartTime,
    isRecording
  } = meetingState;

  // Check for invitation parameters and join meeting automatically
  useEffect(() => {
    // Check if there are invitation parameters in the URL
    const meetingParam = searchParams.get('meeting');
    const inviterParam = searchParams.get('inviter');
    
    if (meetingParam && session.user) {
      // If there's a meeting name in the URL and user is authenticated
      console.log(`Found meeting parameter: "${meetingParam}" from invitation link`);
      
      // Auto join the meeting with the given name
      startMeeting(meetingParam);
      
      // Add a notification that user joined via invitation
      if (inviterParam) {
        toast.success(`Te has unido a la reunión "${meetingParam}" invitado por ${inviterParam}`);
      } else {
        toast.success(`Te has unido a la reunión "${meetingParam}"`);
      }
      
      // Clear the URL parameters to avoid re-joining on refresh
      navigate('/meeting', { replace: true });
    }
  }, [searchParams, session.user]);

  // Fetch user profile when component mounts
  useEffect(() => {
    if (session.user) {
      fetchUserProfile();
    }
  }, [session.user]);

  // Add current user as participant when joining a meeting
  useEffect(() => {
    if (meetingActive && session.user && userProfile) {
      console.log("Adding current user as participant");
      
      const currentUser = {
        email: session.user?.email || 'usuario.actual@ejemplo.com',
        name: userProfile?.full_name || session.user?.email?.split('@')[0] || 'Usuario Actual',
        id: session.user?.id
      };
      
      addParticipant(currentUser);
    }
  }, [meetingActive, session.user, userProfile]);

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
    
    // Add system message
    const systemMessage: Message = {
      id: uuidv4(),
      content: 'La reunión ha comenzado. El asistente de IA está listo para ayudar.',
      sender: 'system',
      sender_name: 'Sistema',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAI: true
    };
    
    addMessage(systemMessage);
    toast.success('Reunión iniciada correctamente');
  };

  const handleSendMessage = (messageText: string) => {
    if (!session.user) return;
    
    // Create a new message
    const newMessage: Message = {
      id: uuidv4(),
      content: messageText,
      sender: session.user?.email || 'anonymous',
      sender_name: userProfile?.full_name || session.user?.email?.split('@')[0] || 'Usuario',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAI: false
    };
    
    addMessage(newMessage);
    
    // Generate AI response after a short delay
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
    setIsRecording(!isRecording);
    toast.info(isRecording ? 'Grabación detenida' : 'Grabación iniciada');
  };

  const handleInviteParticipant = async (email: string) => {
    setIsInviting(true);
    
    try {
      // Create a new participant object
      const newParticipantObj: Participant = {
        email: email,
        name: email.split('@')[0] || 'Invitado',
      };
      
      // Get the current app URL
      const appUrl = window.location.origin;
      
      // Send invitation email using edge function
      const { data, error } = await supabase.functions.invoke('send-invitation', {
        body: {
          email: email,
          sender: session.user?.email,
          meetingTitle: meetingName,
          appUrl: appUrl // Passing the current app URL
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
      
      // Add to participants list only if email was sent successfully
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

  // Handle viewing participant profile
  const handleViewParticipantProfile = (participant: Participant) => {
    setSelectedParticipant(participant);
    setShowParticipantProfileDialog(true);
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
          {/* Chat section */}
          <div className="lg:col-span-2 flex flex-col">
            <ChatSection
              messages={meetingState.messages}
              isRecording={meetingState.isRecording}
              onSendMessage={handleSendMessage}
              onToggleRecording={toggleRecording}
              onShowParticipantsDialog={() => setShowParticipantsDialog(true)}
            />
            
            <div className="mt-6">
              <MeetingActions messages={meetingState.messages} participants={meetingState.participants} />
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
