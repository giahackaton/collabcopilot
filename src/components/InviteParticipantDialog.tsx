
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from 'lucide-react';

interface InviteParticipantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (email: string) => Promise<void>;
  isInviting: boolean;
}

const InviteParticipantDialog: React.FC<InviteParticipantDialogProps> = ({
  open,
  onOpenChange,
  onInvite,
  isInviting
}) => {
  const [newParticipant, setNewParticipant] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    if (!isValid) {
      setEmailError('Por favor ingresa un correo electrónico válido');
    } else {
      setEmailError('');
    }
    
    return isValid;
  };

  const handleInvite = async () => {
    if (!newParticipant.trim() || !validateEmail(newParticipant)) return;
    await onInvite(newParticipant);
    setNewParticipant('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onChange={(e) => {
                setNewParticipant(e.target.value);
                if (emailError) validateEmail(e.target.value);
              }}
              className={emailError ? "border-red-500" : ""}
            />
            {emailError && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {emailError}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button 
            onClick={handleInvite}
            disabled={isInviting || !newParticipant.trim() || !!emailError}
          >
            {isInviting ? 'Enviando...' : 'Invitar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteParticipantDialog;
