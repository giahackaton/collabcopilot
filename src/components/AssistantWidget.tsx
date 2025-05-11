
import React, { useEffect } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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
