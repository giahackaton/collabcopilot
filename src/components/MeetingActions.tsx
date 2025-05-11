
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useMeetingSummary } from '@/hooks/useMeetingSummary';
import { useMeetingContext } from '@/context/MeetingContext';
import { scriptService } from '@/services/scriptService';
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
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface MeetingActionsProps {
  messages: any[];
  participants: any[];
  useScriptSummary?: boolean;
}

const MeetingActions: React.FC<MeetingActionsProps> = ({ 
  messages, 
  participants,
  useScriptSummary = false
}) => {
  const [showEndMeetingDialog, setShowEndMeetingDialog] = useState(false);
  const { meetingState, resetMeeting } = useMeetingContext();
  const [meetingTitle, setMeetingTitle] = useState('');
  const { generateSummary, loading } = useMeetingSummary();
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const handleFinishMeeting = async () => {
    setSummaryError(null);
    if (!meetingTitle.trim()) {
      toast.error('El título de la reunión es obligatorio');
      return;
    }

    // Comprobar si estamos usando un guión predefinido
    if (useScriptSummary && scriptService.hasActiveScript()) {
      try {
        // Usar el resumen predefinido del guión
        const scriptSummary = scriptService.getScriptSummary();
        const scriptTitle = scriptService.getActiveScriptTitle();
        const combinedTitle = meetingTitle || scriptTitle;
        
        // Extraer emails de participantes
        const participantEmails = participants.map(p => p.email).filter(Boolean);
        
        // Generar resumen usando el texto predefinido
        const success = await generateSummary(
          combinedTitle,
          scriptSummary,
          participantEmails
        );
        
        if (success) {
          resetMeeting();
          setShowEndMeetingDialog(false);
          scriptService.resetScript(); // Reiniciar el guión
        } else {
          setSummaryError('No se pudo generar el resumen. Intente nuevamente o póngase en contacto con soporte.');
        }
        
        return;
      } catch (error) {
        console.error('Error al finalizar reunión con guión:', error);
        setSummaryError(`Error inesperado: ${error instanceof Error ? error.message : 'Desconocido'}`);
        return;
      }
    }

    // Proceso normal sin guión
    // Check if there are any messages
    if (messages.length <= 1) { // Only the system welcome message
      toast.warning('La reunión no tiene mensajes suficientes para generar un resumen');
      resetMeeting(); // Reset meeting state anyway
      setShowEndMeetingDialog(false);
      return;
    }

    // Check if there are enough user messages (not just system messages)
    const userMessages = messages.filter(msg => !msg.isAI);
    if (userMessages.length === 0) {
      toast.warning('La reunión no tiene mensajes de usuario para generar un resumen');
      resetMeeting(); // Reset meeting state anyway
      setShowEndMeetingDialog(false);
      return;
    }

    // Prepare meeting content from messages
    const meetingContent = messages
      .map(msg => `[${msg.sender_name || msg.sender}]: ${msg.content}`)
      .join('\n\n');
    
    // Extract participant emails
    const participantEmails = participants.map(p => p.email).filter(Boolean);
    
    try {
      // Generate summary
      const success = await generateSummary(
        meetingTitle, 
        meetingContent, 
        participantEmails
      );
      
      if (success) {
        resetMeeting(); // Reset meeting state after successful summary generation
        setShowEndMeetingDialog(false);
        
        // Si había un guión activo, reiniciarlo también
        if (scriptService.hasActiveScript()) {
          scriptService.resetScript();
        }
      } else {
        setSummaryError('No se pudo generar el resumen. Intente nuevamente o póngase en contacto con soporte.');
      }
    } catch (error) {
      console.error('Error al finalizar reunión:', error);
      setSummaryError(`Error inesperado: ${error instanceof Error ? error.message : 'Desconocido'}`);
    }
  };

  // Function to finish meeting without generating summary
  const handleFinishWithoutSummary = () => {
    resetMeeting();
    setShowEndMeetingDialog(false);
    // Si había un guión activo, reiniciarlo también
    if (scriptService.hasActiveScript()) {
      scriptService.resetScript();
    }
    toast.success('Reunión finalizada');
  };

  // Preparar el título inicial cuando se abre el diálogo
  const prepareInitialTitle = () => {
    if (useScriptSummary && scriptService.hasActiveScript()) {
      setMeetingTitle(scriptService.getActiveScriptTitle());
    } else {
      setMeetingTitle('');
    }
  };

  return (
    <>
      <Button 
        className="w-full" 
        onClick={() => {
          prepareInitialTitle(); // Prepare title when opening dialog
          setShowEndMeetingDialog(true);
        }}
      >
        Finalizar Reunión y Generar Resumen
      </Button>

      <Dialog open={showEndMeetingDialog} onOpenChange={setShowEndMeetingDialog}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Finalizar Reunión</DialogTitle>
            <DialogDescription>
              {useScriptSummary 
                ? "Se generará un resumen usando el guión predefinido. Confirma o modifica el título."
                : "Al finalizar la reunión se generará un resumen automáticamente. Por favor, confirma el título de la reunión."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label htmlFor="meeting-title">Título de la Reunión</Label>
              <Input
                id="meeting-title"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                placeholder={useScriptSummary ? scriptService.getActiveScriptTitle() : "Reunión de Sprint Mayo 2025"}
              />
            </div>
            
            {useScriptSummary && (
              <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                <p className="text-sm text-blue-700 font-medium">Resumen desde guión</p>
                <p className="text-sm text-blue-600">
                  Se utilizará el resumen predefinido del guión "{scriptService.getActiveScriptTitle()}" para generar el documento.
                </p>
              </div>
            )}
            
            {!useScriptSummary && (
              <p className="text-sm text-gray-500">
                Se generará un resumen de la conversación utilizando IA. Este proceso puede tardar unos segundos.
              </p>
            )}
            
            {summaryError && (
              <div className="bg-red-50 p-3 rounded-md border border-red-200">
                <div className="flex items-start gap-2 text-red-700">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Error al generar el resumen</p>
                    <p className="text-sm">{summaryError}</p>
                    <p className="text-xs mt-1 text-gray-600">
                      Si el error persiste, verifica que tu cuenta de OpenAI tenga crédito suficiente.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:justify-end">
              <Button variant="outline" onClick={() => {
                setShowEndMeetingDialog(false);
                setSummaryError(null);
              }} disabled={loading}>
                Cancelar
              </Button>
              <Button 
                variant="secondary"
                onClick={handleFinishWithoutSummary}
              >
                Finalizar sin resumen
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
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MeetingActions;
