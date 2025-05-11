
import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Bot } from "lucide-react";

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
    <Card className="border-blue-100 shadow-md">
      <CardContent className="p-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-md flex flex-col items-center">
          <div className="flex items-center justify-center mb-2 text-blue-500">
            <Bot size={20} className="mr-2" />
            <span className="text-sm font-medium">AI Assistant</span>
          </div>
          <div className="w-full">
            <elevenlabs-convai agent-id="qpL7DFiOttmlnC5ESiBo"></elevenlabs-convai>
          </div>
          <div className="mt-2 w-full flex justify-center">
            <div className="h-1 w-16 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssistantWidget;
