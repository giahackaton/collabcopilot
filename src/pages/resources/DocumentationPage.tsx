
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const DocumentationPage = () => {
  const sections = [
    {
      title: 'Introducción',
      links: [
        { title: 'Bienvenido a CollabCopilot', url: '/auth' },
        { title: 'Requisitos del sistema', url: '/auth' },
        { title: 'Primeros pasos', url: '/auth' },
        { title: 'Conceptos básicos', url: '/auth' }
      ]
    },
    {
      title: 'Reuniones',
      links: [
        { title: 'Crear una reunión', url: '/auth' },
        { title: 'Invitar participantes', url: '/auth' },
        { title: 'Configuración de grabación', url: '/auth' },
        { title: 'Modo sin conexión', url: '/auth' },
        { title: 'Compartir pantalla', url: '/auth' }
      ]
    },
    {
      title: 'Resúmenes y transcripciones',
      links: [
        { title: 'Generación automática de resúmenes', url: '/auth' },
        { title: 'Personalizar el formato de resúmenes', url: '/auth' },
        { title: 'Búsqueda en transcripciones', url: '/auth' },
        { title: 'Exportación de resúmenes', url: '/auth' }
      ]
    },
    {
      title: 'Tareas y seguimiento',
      links: [
        { title: 'Crear tareas durante reuniones', url: '/auth' },
        { title: 'Asignar responsables', url: '/auth' },
        { title: 'Fechas límite y recordatorios', url: '/auth' },
        { title: 'Seguimiento de progreso', url: '/auth' },
        { title: 'Integración con sistemas de tareas', url: '/auth' }
      ]
    },
    {
      title: 'Integraciones',
      links: [
        { title: 'Google Workspace', url: '/auth' },
        { title: 'Microsoft 365', url: '/auth' },
        { title: 'Slack', url: '/auth' },
        { title: 'Trello y Jira', url: '/auth' },
        { title: 'Zapier', url: '/auth' }
      ]
    },
    {
      title: 'Administración',
      links: [
        { title: 'Gestión de usuarios', url: '/auth' },
        { title: 'Permisos y roles', url: '/auth' },
        { title: 'Facturación y suscripciones', url: '/auth' },
        { title: 'Seguridad y privacidad', url: '/auth' },
        { title: 'Directrices de cumplimiento', url: '/auth' }
      ]
    }
  ];

  const popularTopics = [
    {
      title: "Integración con Google Calendar",
      description: "Aprende a conectar CollabCopilot con Google Calendar para sincronizar automáticamente tus reuniones.",
      icon: "📅"
    },
    {
      title: "Configuración de resúmenes personalizados",
      description: "Personaliza los formatos de los resúmenes automáticos según las necesidades de tu equipo.",
      icon: "📝"
    },
    {
      title: "Modo sin conexión",
      description: "Cómo utilizar CollabCopilot cuando no tienes acceso a Internet y sincronizar después.",
      icon: "🔄"
    },
    {
      title: "API para desarrolladores",
      description: "Documentación completa de nuestra API para integrar CollabCopilot en tus aplicaciones.",
      icon: "🔌"
    }
  ];

  return (
    <PageTemplate 
      title="Documentación" 
      subtitle="Guías detalladas y documentación técnica para CollabCopilot"
      showCTA={false}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        {/* Sidebar navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <ScrollArea className="h-[70vh]">
                <div className="pr-4">
                  <div className="mb-6">
                    <input 
                      type="search" 
                      placeholder="Buscar en la documentación..." 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  
                  {sections.map((section, index) => (
                    <div key={index} className="mb-6">
                      <h3 className="font-medium text-lg mb-3">{section.title}</h3>
                      <ul className="space-y-2">
                        {section.links.map((link, i) => (
                          <li key={i}>
                            <Link 
                              to={link.url}
                              className="text-gray-700 hover:text-indigo-600 text-sm flex items-center"
                            >
                              <ChevronRight className="h-3 w-3 mr-1" />
                              {link.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold mb-6">Bienvenido a la documentación de CollabCopilot</h2>
          
          <div className="prose max-w-none mb-8">
            <p>
              CollabCopilot es una plataforma diseñada para optimizar reuniones y colaboración en equipo. 
              Esta documentación te ayudará a aprovechar al máximo todas sus funcionalidades, desde la 
              configuración básica hasta características avanzadas.
            </p>
            <p>
              Para comenzar, selecciona un tema del menú de navegación o explora los temas populares a continuación.
            </p>
          </div>

          <h3 className="text-xl font-bold mb-4">Temas populares</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {popularTopics.map((topic, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-5">
                  <div className="text-3xl mb-3">{topic.icon}</div>
                  <h4 className="font-bold mb-2">{topic.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{topic.description}</p>
                  <Button variant="outline" size="sm">
                    <Link to="/auth">Leer más</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-2">¿No encuentras lo que buscas?</h3>
            <p className="text-gray-600 mb-4">
              Nuestro equipo de soporte está listo para ayudarte con cualquier pregunta o problema que puedas tener.
            </p>
            <Button>
              <Link to="/support">Contactar soporte</Link>
            </Button>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default DocumentationPage;
