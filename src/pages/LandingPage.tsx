
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Layers,
  MessageSquare,
  FileText,
  CheckSquare,
  ArrowRight,
  Users,
  Search,
  Book
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-blue-600 to-indigo-800 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Optimiza tus reuniones con <span className="text-blue-200">CollabCopilot</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-lg">
                La solución integral para reuniones colaborativas eficientes. Captura decisiones, genera resúmenes automáticamente y da seguimiento a las tareas sin esfuerzo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                  <Link to="/auth" className="flex items-center">
                    Comenzar ahora <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-blue-700">
                  Ver demostración
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="w-full h-[400px] bg-white rounded-lg shadow-xl overflow-hidden">
                <img 
                  src="/placeholder.svg" 
                  alt="CollabCopilot en acción" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                  <div className="p-6">
                    <span className="px-2 py-1 bg-blue-600 text-white text-sm rounded-full">En vivo</span>
                    <p className="text-white text-lg font-medium mt-2">Visualiza cómo capturamos todos los detalles importantes de tu reunión</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Una plataforma completa para reuniones efectivas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre las herramientas que transformarán la manera en que colaboras con tu equipo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Reuniones Activas</h3>
                <p className="text-gray-600 mb-4">
                  Graba y transcribe tus reuniones en tiempo real. Permite que todos los participantes contribuyan y colaboren de manera eficiente.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <FileText className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Resúmenes Automáticos</h3>
                <p className="text-gray-600 mb-4">
                  Genera resúmenes detallados de tus reuniones automáticamente con IA. Ahorra tiempo y asegúrate de que nada importante se pierda.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <CheckSquare className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Seguimiento de Tareas</h3>
                <p className="text-gray-600 mb-4">
                  Asigna y da seguimiento a tareas directamente desde la reunión. Establece fechas límite y propietarios para una mejor rendición de cuentas.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-6">
                  <Book className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Bitácora de Reuniones</h3>
                <p className="text-gray-600 mb-4">
                  Mantén un registro organizado de todas tus reuniones. Accede fácilmente a notas, decisiones y acuerdos pasados.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Colaboración en Equipo</h3>
                <p className="text-gray-600 mb-4">
                  Invita a todos los participantes relevantes a tus reuniones. Permite que cada uno contribuya y añada valor a la discusión.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <Search className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Búsqueda de Decisiones</h3>
                <p className="text-gray-600 mb-4">
                  Encuentra rápidamente decisiones importantes tomadas en reuniones pasadas. Nunca más pierdas información crítica.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cómo funciona
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Implementar CollabCopilot en tu equipo es sencillo y transformador
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Programa tu reunión</h3>
              <p className="text-gray-600">
                Crea una nueva reunión en CollabCopilot, establece la agenda e invita a los participantes con anticipación.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Realiza tu reunión</h3>
              <p className="text-gray-600">
                Durante la reunión, la plataforma captura automáticamente la conversación y permite tomar notas en tiempo real.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Recibe el resumen</h3>
              <p className="text-gray-600">
                Al finalizar, recibe un resumen completo con decisiones, tareas asignadas y puntos clave para compartir con tu equipo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Equipos de todos los tamaños están mejorando sus reuniones con CollabCopilot
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-bold">Ana Rodríguez</h4>
                    <p className="text-sm text-gray-500">Directora de Proyectos</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "CollabCopilot ha reducido nuestro tiempo de seguimiento en un 80%. Las reuniones ahora son más efectivas y todos tienen claridad sobre sus responsabilidades."
                </p>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-bold">Carlos Mendoza</h4>
                    <p className="text-sm text-gray-500">CEO, TechStartup</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "La capacidad de capturar decisiones y crear tareas durante nuestras reuniones ha sido un cambio radical para nuestro equipo ejecutivo."
                </p>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-bold">Laura Gómez</h4>
                    <p className="text-sm text-gray-500">Líder de Equipo</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Los resúmenes automáticos nos ahorran horas cada semana. La precisión es impresionante y la interfaz es intuitiva incluso para los menos técnicos del equipo."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Transforma tus reuniones hoy mismo
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Únete a los equipos que están optimizando su colaboración con CollabCopilot. Comienza gratis y descubre la diferencia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              <Link to="/auth" className="flex items-center">
                Registrarse gratis <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-blue-700">
              Contactar ventas
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl text-white font-bold mb-4 flex items-center">
                <Layers className="h-6 w-6 mr-2" />
                CollabCopilot
              </h3>
              <p className="mb-4">
                La solución definitiva para reuniones productivas y seguimiento efectivo de equipos.
              </p>
            </div>
            <div>
              <h4 className="text-lg text-white font-medium mb-4">Producto</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Características</a></li>
                <li><a href="#" className="hover:text-white">Precios</a></li>
                <li><a href="#" className="hover:text-white">Integraciones</a></li>
                <li><a href="#" className="hover:text-white">Hoja de ruta</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg text-white font-medium mb-4">Recursos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Tutoriales</a></li>
                <li><a href="#" className="hover:text-white">Soporte</a></li>
                <li><a href="#" className="hover:text-white">Documentación</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg text-white font-medium mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Sobre nosotros</a></li>
                <li><a href="#" className="hover:text-white">Carreras</a></li>
                <li><a href="#" className="hover:text-white">Contacto</a></li>
                <li><a href="#" className="hover:text-white">Prensa</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 CollabCopilot. Todos los derechos reservados.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Términos</a>
              <a href="#" className="hover:text-white">Privacidad</a>
              <a href="#" className="hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
