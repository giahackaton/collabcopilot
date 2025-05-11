
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useMeetingSummary } from '@/hooks/useMeetingSummary';
import { useMeetingContext } from '@/context/MeetingContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface MeetingActionsProps {
  messages: any[];
  participants: any[];
}

const MeetingActions: React.FC<MeetingActionsProps> = ({ messages, participants }) => {
  const [showEndMeetingDialog, setShowEndMeetingDialog] = useState(false);
  const { meetingState, resetMeeting } = useMeetingContext();
  const [meetingTitle, setMeetingTitle] = useState(meetingState.meetingName);
  const { generateSummary, loading } = useMeetingSummary();

  const handleFinishMeeting = async () => {
    if (!meetingTitle.trim()) {
      toast.error('El título de la reunión es obligatorio');
      return;
    }

    // Check if there are any messages
    if (messages.length <= 1) { // Only the system welcome message
      toast.warning('La reunión no tiene mensajes suficientes para generar un resumen');
      resetMeeting(); // Reset meeting state anyway
      setShowEndMeetingDialog(false);
      return;
    }

    // Prepare meeting content from messages
    const meetingContent = messages
      .map(msg => `[${msg.sender_name || msg.sender}]: ${msg.content}`)
      .join('\n\n');
    
    // Extract participant emails
    const participantEmails = participants.map(p => p.email);
    
    // Generate summary
    const success = await generateSummary(
      meetingTitle, 
      meetingContent, 
      participantEmails
    );
    
    if (success) {
      resetMeeting(); // Reset meeting state after successful summary generation
      setShowEndMeetingDialog(false);
    }
  };

  return (
    <>
      <Button 
        className="w-full" 
        onClick={() => setShowEndMeetingDialog(true)}
      >
        Finalizar Reunión y Generar Resumen
      </Button>

      <Dialog open={showEndMeetingDialog} onOpenChange={setShowEndMeetingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar Reunión</DialogTitle>
            <DialogDescription>
              Al finalizar la reunión se generará un resumen automáticamente. Por favor, confirma el título de la reunión.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="meeting-title">Título de la Reunión</Label>
              <Input
                id="meeting-title"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                placeholder="Reunión de Sprint Mayo 2025"
              />
            </div>
            <p className="text-sm text-gray-500">
              Se generará un resumen de la conversación utilizando IA. Este proceso puede tardar unos segundos.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEndMeetingDialog(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleFinishMeeting} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : (
                'Finalizar y Generar Resumen'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MeetingActions;
