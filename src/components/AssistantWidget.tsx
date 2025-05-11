
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Mic } from 'lucide-react';

const AssistantWidget: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Mic className="h-5 w-5 text-blue-600" />
          <span>Widget de Asistente</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-blue-50 p-4 rounded-md text-center">
          {/* Using a div instead of the custom element to avoid potential issues */}
          <div id="elevenlabs-widget" className="min-h-[150px]">
            {/* ElevenLabs widget will be initialized here using JavaScript */}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            El asistente transcribirá y analizará la conversación
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssistantWidget;
