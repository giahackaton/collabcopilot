
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Play } from 'lucide-react';
import MeetingTimer from '@/components/MeetingTimer';
import { toast } from 'sonner';

interface MeetingControllerProps {
  onStartMeeting: () => void;
}

const MeetingController: React.FC<MeetingControllerProps> = ({ onStartMeeting }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <span>Iniciar Nueva Reunión</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-500">
          Inicia una nueva reunión para comenzar a colaborar con tu equipo. El asistente de IA ayudará a tomar notas y generar resúmenes automáticamente.
        </p>
        <Button 
          onClick={onStartMeeting} 
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
