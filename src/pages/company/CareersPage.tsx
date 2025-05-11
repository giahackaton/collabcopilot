
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { MapPin, Building, Clock } from 'lucide-react';

const CareersPage = () => {
  const positions = [
    {
      title: "Ingeniero/a Full Stack Senior",
      department: "Ingeniería",
      location: "Ciudad de México / Remoto",
      type: "Tiempo completo",
      description: "Buscamos un ingeniero/a con experiencia en React, Node.js y bases de datos SQL/NoSQL para ayudar a construir nuevas características en nuestra plataforma principal.",
      requirements: [
        "5+ años de experiencia en desarrollo web",
        "Experiencia con React, TypeScript y Node.js",
        "Experiencia con bases de datos SQL y NoSQL",
        "Comprensión de arquitecturas de microservicios"
      ]
    },
    {
      title: "Ingeniero/a de Aprendizaje Automático",
      department: "IA",
      location: "100% Remoto",
      type: "Tiempo completo",
      description: "Únete a nuestro equipo de IA para desarrollar algoritmos avanzados de procesamiento de lenguaje natural que potencien nuestras funciones de resumen automático.",
      requirements: [
        "Maestría o Doctorado en Ciencias de la Computación, Aprendizaje Automático o campo relacionado",
        "Experiencia con NLP y modelos de lenguaje grandes",
        "Conocimiento de PyTorch o TensorFlow",
        "Publicaciones en conferencias relevantes es un plus"
      ]
    },
    {
      title: "Diseñador/a UX/UI",
      department: "Diseño de Producto",
      location: "Barcelona / Remoto",
      type: "Tiempo completo",
      description: "Ayuda a crear interfaces intuitivas y atractivas que hagan que las reuniones colaborativas sean fáciles y agradables para todos los usuarios.",
      requirements: [
        "3+ años de experiencia en diseño de productos digitales",
        "Excelentes habilidades con Figma y otras herramientas de diseño",
        "Experiencia en investigación de usuarios y pruebas de usabilidad",
        "Capacidad para comunicar decisiones de diseño efectivamente"
      ]
    },
    {
      title: "Gerente de Éxito del Cliente",
      department: "Atención al Cliente",
      location: "Madrid / Hybrid",
      type: "Tiempo completo",
      description: "Trabaja con nuestros clientes empresariales para garantizar que obtengan el máximo valor de CollabCopilot y ayúdales a implementar mejores prácticas.",
      requirements: [
        "4+ años de experiencia en roles de éxito del cliente o consultoría",
        "Excelentes habilidades de comunicación y presentación",
        "Experiencia con software SaaS empresarial",
        "Capacidad para entender desafíos técnicos y empresariales"
      ]
    },
    {
      title: "Especialista en Marketing de Contenidos",
      department: "Marketing",
      location: "100% Remoto",
      type: "Tiempo completo",
      description: "Crea contenido convincente que eduque a nuestro público sobre cómo CollabCopilot puede transformar sus reuniones y colaboración.",
      requirements: [
        "3+ años de experiencia en marketing de contenidos B2B",
        "Excelentes habilidades de redacción y edición",
        "Comprensión de SEO y marketing digital",
        "Capacidad para explicar conceptos técnicos de manera accesible"
      ]
    },
    {
      title: "Representante de Ventas Enterprise",
      department: "Ventas",
      location: "Ciudad de México / Híbrido",
      type: "Tiempo completo",
      description: "Lidera el proceso de ventas para clientes empresariales en México y Latinoamérica, desde la prospección inicial hasta el cierre de contratos.",
      requirements: [
        "5+ años de experiencia en ventas B2B de software",
        "Historial comprobado de cumplimiento de objetivos de ventas",
        "Excelentes habilidades de negociación y presentación",
        "Experiencia en venta de soluciones tecnológicas a nivel C-suite"
      ]
    }
  ];
  
  const perks = [
    {
      title: "Trabajo remoto flexible",
      description: "Trabaja desde donde seas más productivo. Ofrecemos opciones completamente remotas, híbridas o desde nuestras oficinas."
    },
    {
      title: "Salud y bienestar",
      description: "Seguro médico completo, subsidio para gimnasio y días de salud mental para que cuides de ti mismo."
    },
    {
      title: "Desarrollo profesional",
      description: "Presupuesto anual para conferencias, cursos y libros relacionados con tu crecimiento profesional."
    },
    {
      title: "Horario flexible",
      description: "Te enfocamos en resultados, no en horas. Gestiona tu tiempo de la manera que mejor funcione para ti."
    },
    {
      title: "Equipo diverso",
      description: "Trabajarás con profesionales talentosos de diferentes países y culturas."
    },
    {
      title: "Impacto real",
      description: "Tus contribuciones afectarán directamente a miles de usuarios y equipos en todo el mundo."
    }
  ];

  return (
    <PageTemplate 
      title="Carreras" 
      subtitle="Únete a nuestro equipo y ayúdanos a transformar cómo colaboran los equipos"
      showCTA={false}
    >
      <div className="space-y-16">
        {/* Why Join Us Section */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">¿Por qué unirte a CollabCopilot?</h2>
              <p className="text-lg mb-4">
                En CollabCopilot, estamos construyendo la próxima generación de herramientas de colaboración que ayudan a los equipos a comunicarse mejor y lograr más.
              </p>
              <p className="text-lg mb-4">
                Somos un equipo diverso y en crecimiento de personas apasionadas por resolver problemas complejos con soluciones elegantes. Valoramos la autonomía, la transparencia y el equilibrio entre el trabajo y la vida personal.
              </p>
              <p className="text-lg">
                Si te emociona el impacto que el software bien diseñado puede tener en la forma en que trabajan las personas, te encantará formar parte de nuestro equipo.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden h-80">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                alt="Equipo de CollabCopilot trabajando" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Benefits and Perks */}
        <section className="bg-gray-50 p-10 rounded-2xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Beneficios y ventajas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((perk, index) => (
              <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-3">{perk.title}</h3>
                  <p className="text-gray-600">{perk.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">Posiciones abiertas</h2>
          <div className="space-y-6">
            {positions.map((position, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h3 className="text-xl font-bold">{position.title}</h3>
                    <Badge className="mt-2 md:mt-0 w-fit bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                      {position.department}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-gray-500 text-sm mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {position.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {position.type}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{position.description}</p>
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Requisitos:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {position.requirements.map((req, i) => (
                        <li key={i} className="text-gray-600 text-sm">{req}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 px-6 py-3 border-t">
                  <Button>
                    <Link to="/auth">Aplicar ahora</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Application Process */}
        <section className="bg-indigo-50 p-10 rounded-2xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Nuestro proceso</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-none shadow-sm">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="font-bold mb-2">Aplicación</h3>
                <p className="text-gray-600 text-sm">
                  Envía tu CV y una breve presentación explicando por qué te interesa la posición.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="font-bold mb-2">Entrevista inicial</h3>
                <p className="text-gray-600 text-sm">
                  Conversación de 30 minutos con nuestro equipo de Recursos Humanos.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="font-bold mb-2">Evaluación técnica</h3>
                <p className="text-gray-600 text-sm">
                  Prueba práctica o ejercicio relevante para el rol al que aplicas.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="font-bold mb-2">Entrevistas finales</h3>
                <p className="text-gray-600 text-sm">
                  Conversaciones con el equipo y los líderes con los que trabajarías.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </PageTemplate>
  );
};

export default CareersPage;
