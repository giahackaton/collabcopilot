
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent } from '@/components/ui/card';

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Miembro 1 PromptHunters",
      position: "Fundador & Desarrollador",
      bio: "Líder del equipo PromptHunters con experiencia en desarrollo web y aplicaciones basadas en IA. Especializado en crear soluciones innovadoras.",
      image: "/team-member-1.jpg" // Placeholder - you'll replace with uploaded image
    },
    {
      name: "Miembro 2 PromptHunters",
      position: "Diseñador & UX",
      bio: "Responsable del diseño visual y experiencia de usuario en PromptHunters. Apasionado por crear interfaces intuitivas y atractivas.",
      image: "/team-member-2.jpg" // Placeholder - you'll replace with uploaded image
    },
    {
      name: "Miembro 3 PromptHunters",
      position: "Ingeniero Full Stack",
      bio: "Desarrollador full stack del equipo PromptHunters con especialización en tecnologías React y bases de datos. Enfocado en optimización de rendimiento.",
      image: "/team-member-3.jpg" // Placeholder - you'll replace with uploaded image
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
                PromptHunters nació con la visión de transformar la forma en que las personas interactúan con la tecnología de IA, especialmente en entornos colaborativos.
              </p>
              <p className="text-lg mb-4">
                Nuestro equipo identificó la necesidad de herramientas que aprovechen el poder de la IA para mejorar la colaboración y la productividad en equipos distribuidos.
              </p>
              <p className="text-lg">
                Estamos comprometidos con crear soluciones que no solo capturan información valiosa, sino que también proporcionan estructura, análisis y seguimiento para transformar ideas en acciones concretas.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden h-80">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                alt="El equipo de PromptHunters" 
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
