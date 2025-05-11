
import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="border-blue-100 shadow-sm">
      <CardContent className="p-2">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-md">
          <elevenlabs-convai agent-id="qpL7DFiOttmlnC5ESiBo"></elevenlabs-convai>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssistantWidget;
