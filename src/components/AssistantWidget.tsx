
import React, { useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Mic } from 'lucide-react';

const AssistantWidget: React.FC = () => {
  useEffect(() => {
    // Ensure the widget script is loaded and initialized properly
    const script = document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]');
    if (!script) {
      const newScript = document.createElement('script');
      newScript.src = "https://elevenlabs.io/convai-widget/index.js";
      newScript.async = true;
      newScript.type = "text/javascript";
      document.body.appendChild(newScript);
    }
  }, []);

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
          <elevenlabs-convai agent-id="qpL7DFiOttmlnC5ESiBo"></elevenlabs-convai>
          <p className="text-xs text-gray-500 mt-2">
            El asistente transcribirá y analizará la conversación
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssistantWidget;
