
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Play, Clock, BookOpen } from 'lucide-react';

const TutorialsPage = () => {
  const tutorials = [
    {
      title: "Primeros pasos con CollabCopilot",
      description: "Aprende los conceptos básicos y configura tu primera reunión en menos de 10 minutos.",
      duration: "10 min",
      level: "Principiante",
      type: "Video",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    },
    {
      title: "Cómo configurar reuniones recurrentes",
      description: "Automatiza la creación de reuniones periódicas y mantén la consistencia en tu equipo.",
      duration: "8 min",
      level: "Principiante",
      type: "Video",
      image: "https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80"
    },
    {
      title: "Domina los resúmenes automáticos",
      description: "Obtén el máximo provecho de la función de resumen automático y personaliza la salida según tus necesidades.",
      duration: "15 min",
      level: "Intermedio",
      type: "Guía",
      image: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    },
    {
      title: "Asignación y seguimiento avanzado de tareas",
      description: "Técnicas avanzadas para la gestión de tareas, incluyendo etiquetas, prioridades y filtros personalizados.",
      duration: "20 min",
      level: "Avanzado",
      type: "Video",
      image: "https://images.unsplash.com/photo-1590402494587-44b71d7772f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    },
    {
      title: "Integración con Google Calendar y Outlook",
      description: "Aprende a sincronizar tu calendario y automatizar la creación de reuniones desde tus aplicaciones favoritas.",
      duration: "12 min",
      level: "Intermedio",
      type: "Guía",
      image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1468&q=80"
    },
    {
      title: "Configuración para empresas grandes",
      description: "Guía completa para administradores sobre cómo configurar y gestionar CollabCopilot para grandes organizaciones.",
      duration: "30 min",
      level: "Avanzado",
      type: "Webinar",
      image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80"
    }
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case "Principiante": return "bg-green-100 text-green-800";
      case "Intermedio": return "bg-amber-100 text-amber-800";
      case "Avanzado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Video": return <Play className="h-4 w-4" />;
      case "Guía": return <BookOpen className="h-4 w-4" />;
      case "Webinar": return <Play className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <PageTemplate 
      title="Tutoriales" 
      subtitle="Aprende a sacar el máximo provecho de CollabCopilot con nuestros tutoriales paso a paso"
      showCTA={false}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {tutorials.map((tutorial, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 overflow-hidden relative">
              <img 
                src={tutorial.image} 
                alt={tutorial.title} 
                className="w-full h-full object-cover"
              />
              {tutorial.type === "Video" || tutorial.type === "Webinar" ? (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                    <Play className="h-6 w-6 text-indigo-600 ml-1" />
                  </div>
                </div>
              ) : null}
            </div>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <Badge className={`${getLevelColor(tutorial.level)}`}>
                  {tutorial.level}
                </Badge>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="h-4 w-4 mr-1" /> 
                  {tutorial.duration}
                </div>
              </div>
              <Link to="/auth" className="block">
                <h3 className="text-xl font-bold mb-2 hover:text-indigo-600 transition-colors">{tutorial.title}</h3>
              </Link>
              <p className="text-gray-600 mb-4">
                {tutorial.description}
              </p>
            </CardContent>
            <CardFooter className="px-5 py-3 bg-gray-50 border-t">
              <Link to="/auth" className="text-indigo-600 font-medium flex items-center hover:text-indigo-800 transition-colors">
                {getTypeIcon(tutorial.type)}
                <span className="ml-2">Ver {tutorial.type.toLowerCase()}</span>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </PageTemplate>
  );
};

export default TutorialsPage;
