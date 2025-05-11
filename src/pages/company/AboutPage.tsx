
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent } from '@/components/ui/card';

const AboutPage = () => {
  const teamMembers = [
    {
      name: "María Rodríguez",
      position: "CEO & Co-fundadora",
      bio: "Anteriormente lideró equipos de producto en Google y Microsoft. Apasionada por mejorar la forma en que las personas trabajan juntas.",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
    },
    {
      name: "Carlos Vega",
      position: "CTO & Co-fundador",
      bio: "Ingeniero de software con experiencia en IA y aprendizaje automático. Anteriormente en Amazon Web Services y Meta.",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
    },
    {
      name: "Laura González",
      position: "Directora de Producto",
      bio: "Más de 10 años de experiencia diseñando productos centrados en el usuario. Especialista en optimización de flujos de trabajo.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80"
    },
    {
      name: "Alejandro Méndez",
      position: "Director de Ingeniería",
      bio: "Ingeniero experimentado en crear arquitecturas escalables. Ha liderado equipos técnicos en startups y empresas Fortune 500.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
    },
    {
      name: "Patricia Lima",
      position: "Directora de Operaciones",
      bio: "Experta en operaciones y estrategia empresarial. Anteriormente en McKinsey y BCG, con enfoque en optimización operacional.",
      image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
    },
    {
      name: "Miguel Sánchez",
      position: "Director de Marketing",
      bio: "Apasionado del marketing basado en datos. Ha dirigido campañas exitosas para SaaS B2B en América Latina y España.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
    }
  ];

  return (
    <PageTemplate 
      title="Sobre Nosotros" 
      subtitle="Conoce al equipo detrás de CollabCopilot y nuestra misión"
    >
      <div className="space-y-16">
        {/* Our Story Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-center">Nuestra Historia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-lg mb-4">
                CollabCopilot nació en 2023 cuando María y Carlos experimentaron de primera mano la frustración de perder información valiosa en reuniones remotas durante la pandemia.
              </p>
              <p className="text-lg mb-4">
                Como líderes de equipos distribuidos, vieron cómo las decisiones importantes se perdían, las tareas no se seguían y la información crítica se dispersaba entre notas fragmentadas y mensajes de chat.
              </p>
              <p className="text-lg">
                Decidieron crear una solución que no solo capturara lo que se decía en las reuniones, sino que también proporcionara estructura, análisis y, lo más importante, seguimiento para asegurar que las reuniones se tradujeran en acción.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden h-80">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                alt="El equipo de CollabCopilot" 
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
                Transformar las reuniones de una necesidad percibida como tediosa a una herramienta estratégica que impulsa la colaboración efectiva, la toma de decisiones clara y la acción concreta.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-indigo-700">Nuestra Visión</h2>
              <p className="text-lg">
                Un mundo laboral donde las reuniones sean momentos de verdadero valor, donde cada participante tenga voz, y donde las ideas brillantes nunca se pierdan en la transcripción.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-center">Nuestro Equipo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <h3 className="text-xl font-bold mb-3 text-indigo-700">Transparencia</h3>
              <p>
                Creemos en la comunicación abierta y honesta, tanto dentro de nuestro equipo como con nuestros clientes.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-indigo-700">Colaboración</h3>
              <p>
                Las mejores ideas surgen cuando diversos equipos trabajan juntos hacia un objetivo común.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-indigo-700">Innovación</h3>
              <p>
                Constantemente buscamos formas mejores y más inteligentes de resolver los desafíos de nuestros clientes.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-indigo-700">Impacto</h3>
              <p>
                Medimos nuestro éxito por el valor real que aportamos a los equipos y organizaciones.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageTemplate>
  );
};

export default AboutPage;
