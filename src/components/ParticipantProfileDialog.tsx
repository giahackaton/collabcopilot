
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { type Participant } from '@/context/MeetingContext';

interface ParticipantProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participant: Participant | null;
}

const ParticipantProfileDialog: React.FC<ParticipantProfileDialogProps> = ({
  open,
  onOpenChange,
  participant
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Perfil del Participante</DialogTitle>
        </DialogHeader>
        {participant && (
          <div className="py-4">
            <div className="flex flex-col items-center mb-4">
              <Avatar className="h-20 w-20 mb-2">
                <AvatarFallback className="text-lg">{participant.name[0]}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">{participant.name}</h3>
              <p className="text-gray-500">{participant.email}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Este participante está activo en la reunión actual.
              </p>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantProfileDialog;
