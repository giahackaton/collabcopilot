
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Download } from 'lucide-react';

const PressPage = () => {
  const pressReleases = [
    {
      title: "CollabCopilot cierra ronda de financiación Serie A de $15 millones",
      date: "15 de mayo, 2025",
      excerpt: "La ronda fue liderada por Accel Partners con participación de inversores existentes. La financiación se utilizará para expandir el equipo de ingeniería y acelerar el desarrollo de nuevas características.",
      link: "/auth"
    },
    {
      title: "CollabCopilot anuncia integración con Microsoft Teams",
      date: "3 de abril, 2025",
      excerpt: "La nueva integración permite a los usuarios de Microsoft Teams utilizar todas las funciones de CollabCopilot sin salir de su entorno de trabajo habitual.",
      link: "/auth"
    },
    {
      title: "CollabCopilot nombrada una de las startups más prometedoras de 2025",
      date: "22 de marzo, 2025",
      excerpt: "La prestigiosa publicación Tech Innovators ha incluido a CollabCopilot en su lista anual de las 50 startups más prometedoras del año.",
      link: "/auth"
    },
    {
      title: "CollabCopilot expande operaciones a América Latina",
      date: "5 de febrero, 2025",
      excerpt: "Con la apertura de una nueva oficina en Ciudad de México, CollabCopilot fortalece su presencia en América Latina para satisfacer la creciente demanda regional.",
      link: "/auth"
    }
  ];

  const mediaFeatures = [
    {
      title: "CollabCopilot está transformando las reuniones virtuales",
      publication: "TechCrunch",
      date: "28 de abril, 2025",
      quote: "CollabCopilot ha logrado resolver uno de los mayores desafíos del trabajo remoto: garantizar que las decisiones tomadas en reuniones se conviertan en acciones concretas.",
      link: "/auth",
      logo: "https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png?w=32"
    },
    {
      title: "Las 10 herramientas de productividad que debes conocer en 2025",
      publication: "Forbes",
      date: "15 de marzo, 2025",
      quote: "En el número 3 de nuestra lista, CollabCopilot destaca por su enfoque innovador para resolver el problema de la pérdida de información en reuniones remotas.",
      link: "/auth",
      logo: "https://i.forbesimg.com/favicon.ico"
    },
    {
      title: "Cómo la IA está mejorando la colaboración en el trabajo",
      publication: "El País",
      date: "2 de marzo, 2025",
      quote: "Empresas como CollabCopilot están utilizando la inteligencia artificial para transformar la forma en que los equipos trabajan juntos, con resultados prometedores.",
      link: "/auth",
      logo: "https://assets-fd.elpais.com/dist/2022.04.29.1751/images/favicon/elpais/favicon-96x96.png"
    }
  ];

  return (
    <PageTemplate 
      title="Sala de Prensa" 
      subtitle="Últimas noticias, comunicados y recursos para medios"
      showCTA={false}
    >
      <div className="space-y-16">
        {/* Media Contact Section */}
        <section className="bg-indigo-50 p-8 rounded-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Contacto para medios</h2>
              <p className="text-lg mb-4 md:mb-0">
                Para consultas de prensa, entrevistas o recursos adicionales:
              </p>
            </div>
            <div className="space-y-2">
              <div className="font-medium">Laura Martínez, Directora de Comunicación</div>
              <a href="mailto:prensa@collabcopilot.com" className="text-indigo-600 hover:underline block">
                prensa@collabcopilot.com
              </a>
              <div>+34 91 123 4567 ext. 301</div>
            </div>
          </div>
        </section>

        {/* Press Releases */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Comunicados de prensa</h2>
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-sm text-gray-500 mb-2">{release.date}</div>
                  <h3 className="text-xl font-bold mb-3">{release.title}</h3>
                  <p className="text-gray-600">{release.excerpt}</p>
                </CardContent>
                <CardFooter className="bg-gray-50 px-6 py-3 border-t">
                  <Link 
                    to={release.link}
                    className="text-indigo-600 font-medium flex items-center hover:text-indigo-800"
                  >
                    Leer comunicado completo
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Media Coverage */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Apariciones en medios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mediaFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={feature.logo} 
                      alt={feature.publication} 
                      className="w-6 h-6 mr-2"
                    />
                    <span className="font-medium">{feature.publication}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                  <div className="text-sm text-gray-500 mb-3">{feature.date}</div>
                  <blockquote className="border-l-4 border-indigo-200 pl-4 italic text-gray-600 mb-4">
                    "{feature.quote}"
                  </blockquote>
                </CardContent>
                <CardFooter className="bg-gray-50 px-6 py-3 border-t">
                  <Link 
                    to={feature.link}
                    className="text-indigo-600 font-medium flex items-center hover:text-indigo-800"
                  >
                    Leer artículo completo
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Press Kit */}
        <section className="bg-gray-50 p-8 rounded-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4">Kit de prensa</h2>
              <p className="text-gray-600 mb-6 md:mb-0">
                Descarga nuestro kit de prensa que incluye logotipos, imágenes de alta resolución, 
                información sobre la empresa, biografías del equipo directivo y materiales 
                promocionales para uso en publicaciones de medios.
              </p>
            </div>
            <div className="md:w-1/3 flex justify-center md:justify-end">
              <Button className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Descargar kit de prensa (ZIP)
              </Button>
            </div>
          </div>
        </section>

        {/* Latest News */}
        <section>
          <h2 className="text-3xl font-bold mb-8">CollabCopilot en las noticias</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="font-medium">Expansión</div>
                <Badge variant="outline">12/04/2025</Badge>
              </div>
              <h3 className="text-lg font-bold mb-3">
                <Link to="/auth" className="hover:text-indigo-600">
                  "El auge de las herramientas de colaboración remota en la era post-pandemia"
                </Link>
              </h3>
            </div>
            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="font-medium">Wired</div>
                <Badge variant="outline">05/04/2025</Badge>
              </div>
              <h3 className="text-lg font-bold mb-3">
                <Link to="/auth" className="hover:text-indigo-600">
                  "Por qué las grandes empresas están adoptando CollabCopilot"
                </Link>
              </h3>
            </div>
            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="font-medium">El Economista</div>
                <Badge variant="outline">28/03/2025</Badge>
              </div>
              <h3 className="text-lg font-bold mb-3">
                <Link to="/auth" className="hover:text-indigo-600">
                  "CollabCopilot: la startup española que conquista Silicon Valley"
                </Link>
              </h3>
            </div>
            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="font-medium">The Next Web</div>
                <Badge variant="outline">15/03/2025</Badge>
              </div>
              <h3 className="text-lg font-bold mb-3">
                <Link to="/auth" className="hover:text-indigo-600">
                  "5 startups que están redefiniendo el futuro del trabajo"
                </Link>
              </h3>
            </div>
          </div>
        </section>
      </div>
    </PageTemplate>
  );
};

export default PressPage;
