
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const RoadmapPage = () => {
  const quarters = [
    {
      name: "Q2 2025",
      features: [
        {
          title: "Análisis avanzado de sentimientos",
          description: "Detecta automáticamente el estado de ánimo y la recepción de ideas en las reuniones.",
          status: "En desarrollo"
        },
        {
          title: "Integración con Microsoft 365",
          description: "Conecta con todo el ecosistema de Microsoft para una experiencia sin fricciones.",
          status: "Próximamente"
        },
        {
          title: "Modo offline mejorado",
          description: "Funcionalidades ampliadas mientras trabajas sin conexión a internet.",
          status: "En desarrollo"
        }
      ]
    },
    {
      name: "Q3 2025",
      features: [
        {
          title: "Soporte para múltiples idiomas",
          description: "Transcripción y resúmenes en más de 20 idiomas diferentes.",
          status: "Planificado"
        },
        {
          title: "Análisis predictivo de tareas",
          description: "Sugiere plazos y asignaciones basadas en el historial del equipo.",
          status: "Investigando"
        },
        {
          title: "Panel de tendencias de reuniones",
          description: "Visualiza métricas sobre la eficacia de tus reuniones a lo largo del tiempo.",
          status: "Planificado"
        }
      ]
    },
    {
      name: "Q4 2025",
      features: [
        {
          title: "Asistente de reunión con IA avanzada",
          description: "Un asistente virtual que puede responder preguntas y proporcionar contexto durante las reuniones.",
          status: "Investigando"
        },
        {
          title: "API pública",
          description: "Permite a los desarrolladores construir sobre la plataforma CollabCopilot.",
          status: "Planificado"
        },
        {
          title: "Análisis comparativo entre equipos",
          description: "Compara la eficacia y los resultados entre diferentes equipos de tu organización.",
          status: "Propuesto"
        }
      ]
    },
    {
      name: "2026 y más allá",
      features: [
        {
          title: "Reuniones en realidad aumentada",
          description: "Experiencia inmersiva para reuniones remotas utilizando tecnología AR.",
          status: "Visión"
        },
        {
          title: "Colaboración en tiempo real con documentos 3D",
          description: "Comparte y modifica modelos 3D durante las reuniones.",
          status: "Visión"
        },
        {
          title: "Asistente completamente autónomo",
          description: "IA capaz de liderar reuniones rutinarias sin intervención humana.",
          status: "Investigando"
        }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "En desarrollo": return "bg-amber-500";
      case "Próximamente": return "bg-green-500";
      case "Planificado": return "bg-blue-500";
      case "Investigando": return "bg-purple-500";
      case "Propuesto": return "bg-gray-500";
      case "Visión": return "bg-indigo-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <PageTemplate 
      title="Hoja de Ruta" 
      subtitle="Descubre qué características estamos desarrollando para el futuro"
    >
      <div className="space-y-12 mt-12">
        {quarters.map((quarter, index) => (
          <div key={index}>
            <h2 className="text-2xl font-bold mb-6 text-indigo-700">{quarter.name}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {quarter.features.map((feature, i) => (
                <Card key={i} className="border hover:shadow-md transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <Badge className={`mb-3 ${getStatusColor(feature.status)}`}>
                      {feature.status}
                    </Badge>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageTemplate>
  );
};

export default RoadmapPage;
