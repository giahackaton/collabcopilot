
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageSquare, 
  FileText, 
  CheckSquare, 
  Search, 
  Book,
  Users 
} from 'lucide-react';

const FeaturesPage = () => {
  const features = [
    {
      icon: <MessageSquare className="h-8 w-8 text-indigo-600" />,
      title: "Reuniones Activas",
      description: "Graba y transcribe reuniones en tiempo real. Permite la colaboración entre todos los participantes de manera eficiente."
    },
    {
      icon: <FileText className="h-8 w-8 text-indigo-600" />,
      title: "Resúmenes Automáticos",
      description: "Genera resúmenes detallados de tus reuniones automáticamente con IA, ahorrando tiempo y asegurando que nada importante se pierda."
    },
    {
      icon: <CheckSquare className="h-8 w-8 text-indigo-600" />,
      title: "Seguimiento de Tareas",
      description: "Asigna y da seguimiento a tareas directamente desde la reunión, estableciendo fechas límite y responsables."
    },
    {
      icon: <Book className="h-8 w-8 text-indigo-600" />,
      title: "Bitácora de Reuniones",
      description: "Mantén un registro organizado de todas tus reuniones con acceso fácil a notas, decisiones y acuerdos pasados."
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: "Colaboración en Equipo",
      description: "Invita a todos los participantes relevantes a tus reuniones, permitiendo que cada uno contribuya y añada valor a la discusión."
    },
    {
      icon: <Search className="h-8 w-8 text-indigo-600" />,
      title: "Búsqueda de Decisiones",
      description: "Encuentra rápidamente decisiones importantes tomadas en reuniones pasadas para nunca perder información crítica."
    }
  ];

  return (
    <PageTemplate 
      title="Características" 
      subtitle="Descubre todas las herramientas que CollabCopilot ofrece para transformar tus reuniones"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {features.map((feature, index) => (
          <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                {feature.icon}
                <h3 className="text-xl font-bold ml-4">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageTemplate>
  );
};

export default FeaturesPage;
