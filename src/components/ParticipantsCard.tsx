
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, UserPlus } from 'lucide-react';
import ParticipantsList from './ParticipantsList';
import { type Participant } from '@/context/MeetingContext';

interface ParticipantsCardProps {
  participants: Participant[];
  onAddParticipant: () => void;
  onViewProfile: (participant: Participant) => void;
}

const ParticipantsCard: React.FC<ParticipantsCardProps> = ({
  participants,
  onAddParticipant,
  onViewProfile
}) => {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          Participantes
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onAddParticipant}>
          <UserPlus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ParticipantsList 
          participants={participants} 
          onAddParticipant={onAddParticipant}
          onViewProfile={onViewProfile}
        />
      </CardContent>
    </Card>
  );
};

export default ParticipantsCard;
