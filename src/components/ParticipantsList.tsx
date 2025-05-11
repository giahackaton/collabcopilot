
import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, User, UserPlus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Participant } from '@/context/MeetingContext';

interface ParticipantsListProps {
  participants: Participant[];
  onAddParticipant: () => void;
  onViewProfile: (participant: Participant) => void;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({ 
  participants, 
  onAddParticipant,
  onViewProfile
}) => {
  return (
    <div className="space-y-3">
      {participants.length > 0 ? (
        participants.map((participant, index) => (
          <div key={index} className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{participant.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{participant.name}</p>
              <p className="text-xs text-gray-500 truncate">{participant.email}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border shadow-md">
                <DropdownMenuItem onClick={() => onViewProfile(participant)}>
                  <User className="h-4 w-4 mr-2" />
                  Ver perfil
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm text-center py-2">
          No hay participantes aún
        </p>
      )}
    </div>
  );
};

export default ParticipantsList;
