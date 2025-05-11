
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent } from '@/components/ui/card';

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Anthony George Yncahuaman Gomez",
      position: "Fundador & Desarrollador",
      bio: "Líder del equipo PromptHunters con experiencia en desarrollo web y aplicaciones basadas en IA. Especializado en crear soluciones innovadoras.",
      image: "/lovable-uploads/dfc07b1b-6197-4917-a8f1-690ad6226e36.png" 
    },
    {
      name: "Johanna Barragan Arteaga",
      position: "Fundador & Desarrollador",
      bio: "Responsable del diseño backend, Base de datos y Servicio de Automatizacion en PromptHunters. Especialista en Soluciones y aplicaciones IA.",
      image: "/lovable-uploads/18f66781-835a-4132-988c-a2b2e2e3d6a7.png"
    },
    {
      name: "Edwin Calvo Rincon",
      position: "Fundador & Desarrollador",
      bio: "Especialista en Soluciones con Agentes conversacionales con experiencia en desarrollo web y aplicaciones basadas en IA. Especializado en crear soluciones innovadoras.",
      image: "/lovable-uploads/261dd8c6-63b0-4842-98e1-7545cbcc726a.png"
    }
  ];

  return (
    <PageTemplate 
      title="Sobre Nosotros" 
      subtitle="Conoce al equipo detrás de PromptHunters y nuestra misión"
    >
      <div className="space-y-16">
        {/* Our Story Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-center">Nuestra Historia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-lg mb-4">
                PromptHunters nació en el hackaton de Inteligencia Artificial  AI-Hackathon.co, la hackathon más increíble de LATAM.
1.000 Builders. 10 días. Una sola meta: crear cosas absurdamente útiles con inteligencia artificial.
              </p>
              <p className="text-lg mb-4">
                Nuestro equipo identificó la necesidad de herramientas que aprovechen el poder de la IA para mejorar la colaboración y la productividad en equipos distribuidos.
              </p>
              <p className="text-lg">
                Estamos comprometidos con crear soluciones que no solo capturan información valiosa, sino que también proporcionan estructura, análisis y seguimiento para transformar ideas en acciones concretas.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden h-80 flex items-center justify-center bg-gray-100 p-4">
              <img 
                src="/lovable-uploads/d0a1641b-948d-4df5-8b3c-ad9a9fd603a6.png" 
                alt="Logo PromptHunters" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="bg-gray-50 p-10 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-indigo-700">Nuestra Misión</h2>
              <p className="text-lg">
                Transformar las interacciones digitales mediante soluciones de IA que potencien la colaboración efectiva, la toma de decisiones informada y la acción estratégica.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-indigo-700">Nuestra Visión</h2>
              <p className="text-lg">
                Un mundo donde la tecnología de IA sea accesible y útil para todos, permitiendo que las personas trabajen juntas de forma más efectiva y significativa.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-center">Nuestro Equipo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-5">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-indigo-600 font-medium mb-2">{member.position}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-indigo-50 p-10 rounded-2xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-indigo-700">Innovación</h3>
              <p>
                Constantemente buscamos formas nuevas y creativas de resolver problemas complejos con tecnología de vanguardia.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-indigo-700">Colaboración</h3>
              <p>
                Creemos que las mejores soluciones surgen cuando diversos equipos trabajan juntos hacia un objetivo común.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-indigo-700">Calidad</h3>
              <p>
                Nos comprometemos a ofrecer productos de la más alta calidad que superen las expectativas de nuestros usuarios.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-indigo-700">Impacto</h3>
              <p>
                Medimos nuestro éxito por el valor real y el cambio positivo que aportamos a individuos y organizaciones.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageTemplate>
  );
};

export default AboutPage;
