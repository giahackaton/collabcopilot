
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent } from '@/components/ui/card';

const IntegrationsPage = () => {
  const integrations = [
    {
      name: "Google Calendar",
      logo: "https://www.gstatic.com/images/branding/product/1x/calendar_48dp.png",
      description: "Programa y gestiona reuniones directamente desde tu calendario de Google. Mantén sincronizadas todas tus reuniones."
    },
    {
      name: "Microsoft Teams",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg/1200px-Microsoft_Office_Teams_%282018%E2%80%93present%29.svg.png",
      description: "Integra CollabCopilot con Microsoft Teams para una experiencia de reunión perfecta. Accede a todas las herramientas sin salir de Teams."
    },
    {
      name: "Slack",
      logo: "https://a.slack-edge.com/80588/marketing/img/meta/slack_hash_256.png",
      description: "Recibe notificaciones y comparte resúmenes de reuniones directamente en tus canales de Slack. Mantén a todos informados."
    },
    {
      name: "Trello",
      logo: "https://d2k1ftgv7pobq7.cloudfront.net/meta/u/res/images/brand-assets/Logos/0099ec3754bf473d2bbf317204ab6fea/trello-logo-blue.png",
      description: "Convierte automáticamente las tareas de tus reuniones en tarjetas de Trello. Organiza y da seguimiento a todo desde un solo lugar."
    },
    {
      name: "Jira",
      logo: "https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/apple-touch-icon.png",
      description: "Crea issues y tickets en Jira directamente desde tus reuniones. Mantén sincronizado tu flujo de trabajo técnico."
    },
    {
      name: "Notion",
      logo: "https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Flogo-ios.png?table=block&id=b8b1e5fb-e594-4dd8-b61b-2970a7f10e18&width=250&userId=&cache=v2",
      description: "Exporta resúmenes y notas de reuniones a Notion. Crea una base de conocimientos organizada para tu equipo."
    },
    {
      name: "Zoom",
      logo: "https://st1.zoom.us/zoom.ico",
      description: "Integra CollabCopilot con tus reuniones de Zoom para transcripción y notas en tiempo real."
    },
    {
      name: "Google Drive",
      logo: "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png",
      description: "Guarda y comparte todos los documentos y resúmenes de tus reuniones directamente en Google Drive."
    }
  ];

  return (
    <PageTemplate 
      title="Integraciones" 
      subtitle="CollabCopilot se integra con las herramientas que ya usas"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {integrations.map((integration, index) => (
          <Card key={index} className="border hover:shadow-md transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <img 
                  src={integration.logo} 
                  alt={integration.name} 
                  className="w-10 h-10 object-contain mr-4"
                />
                <h3 className="text-lg font-bold">{integration.name}</h3>
              </div>
              <p className="text-gray-600 text-sm">{integration.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageTemplate>
  );
};

export default IntegrationsPage;
