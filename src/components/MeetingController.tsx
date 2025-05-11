
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Play } from 'lucide-react';
import MeetingTimer from '@/components/MeetingTimer';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMeetingContext } from '@/context/MeetingContext';

interface MeetingControllerProps {
  onStartMeeting: (meetingName: string) => void;
}

const MeetingController: React.FC<MeetingControllerProps> = ({ onStartMeeting }) => {
  const { meetingState } = useMeetingContext();
  const [meetingName, setMeetingName] = useState(meetingState.meetingName);
  
  const handleStartMeeting = () => {
    if (!meetingName.trim()) {
      toast.error('Por favor, ingresa un nombre para la reunión');
      return;
    }
    onStartMeeting(meetingName);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <span>Iniciar Nueva Reunión</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="meeting-name">Nombre de la reunión</Label>
          <Input 
            id="meeting-name" 
            value={meetingName} 
            onChange={(e) => setMeetingName(e.target.value)}
            placeholder="Ej: Sprint Planning, Retrospectiva, etc."
          />
        </div>
        
        <p className="text-gray-500">
          Inicia una nueva reunión para comenzar a colaborar con tu equipo. El asistente de IA ayudará a tomar notas y generar resúmenes automáticamente.
        </p>
        
        <Button 
          onClick={handleStartMeeting} 
          className="w-full mt-4 flex items-center justify-center gap-2"
        >
          <Play className="h-5 w-5" />
          Iniciar Chat de Reunión
        </Button>
      </CardContent>
    </Card>
  );
};

export default MeetingController;
