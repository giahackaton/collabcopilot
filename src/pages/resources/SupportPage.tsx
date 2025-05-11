
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Mail, Phone, FileQuestion } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const SupportPage = () => {
  return (
    <PageTemplate 
      title="Soporte" 
      subtitle="Estamos aquí para ayudarte con cualquier pregunta o problema"
      showCTA={false}
    >
      <Tabs defaultValue="contact" className="w-full mt-8">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="contact">Contacto</TabsTrigger>
          <TabsTrigger value="faq">Preguntas frecuentes</TabsTrigger>
          <TabsTrigger value="resources">Recursos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="contact">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="col-span-1">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Opciones de contacto</h3>
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <MessageSquare className="h-6 w-6 text-indigo-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Chat en vivo</h4>
                      <p className="text-sm text-gray-600 mb-2">Disponible de lunes a viernes, 9am - 6pm (GMT-6)</p>
                      <Button variant="outline" className="w-full">Iniciar chat</Button>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Mail className="h-6 w-6 text-indigo-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Email</h4>
                      <p className="text-sm text-gray-600">soporte@collabcopilot.com</p>
                      <p className="text-sm text-gray-500">Tiempo de respuesta: 24 horas</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Phone className="h-6 w-6 text-indigo-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Teléfono</h4>
                      <p className="text-sm text-gray-600">+52 (55) 1234-5678</p>
                      <p className="text-sm text-gray-500">Disponible para clientes empresariales</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 lg:col-span-2">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6">Envíanos un mensaje</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Nombre</label>
                      <Input id="name" placeholder="Tu nombre completo" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <Input id="email" type="email" placeholder="tu@email.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">Asunto</label>
                    <Input id="subject" placeholder="¿Sobre qué nos escribes?" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Mensaje</label>
                    <Textarea id="message" placeholder="Describe tu consulta o problema en detalle..." className="min-h-[150px]" />
                  </div>
                  <Button className="w-full md:w-auto">Enviar mensaje</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="faq">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">¿Cómo puedo cambiar mi plan de suscripción?</h3>
                <p className="text-gray-700">
                  Puedes cambiar tu plan en cualquier momento desde la sección "Configuración {'>'}  Facturación". Los cambios a un plan superior se aplican inmediatamente, mientras que las reducciones se aplican al final del ciclo de facturación actual.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">¿Puedo exportar mis datos de reuniones?</h3>
                <p className="text-gray-700">
                  Sí, puedes exportar resúmenes de reuniones, transcripciones y tareas en varios formatos incluyendo PDF, Word, Excel y JSON. Ve a cualquier reunión y utiliza el menú "Exportar" en la esquina superior derecha.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">¿Cómo añado participantes a una reunión existente?</h3>
                <p className="text-gray-700">
                  Para añadir participantes a una reunión ya creada, abre la reunión y haz clic en "Participantes" en el panel lateral. Luego selecciona "Añadir participantes" e introduce sus direcciones de correo electrónico.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">¿CollabCopilot funciona con conexiones de internet lentas?</h3>
                <p className="text-gray-700">
                  CollabCopilot está optimizado para funcionar incluso con conexiones de baja velocidad. Las transcripciones y funciones principales funcionarán, aunque algunas características avanzadas como el video HD pueden verse afectadas. También ofrecemos un modo offline que sincroniza cuando recuperas la conexión.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">¿Es seguro compartir información confidencial en CollabCopilot?</h3>
                <p className="text-gray-700">
                  Absolutamente. CollabCopilot utiliza cifrado de extremo a extremo para todas las reuniones y datos. Cumplimos con GDPR, CCPA y SOC 2 Tipo II. Para reuniones altamente confidenciales, recomendamos activar la opción "Seguridad avanzada" en la configuración de la reunión.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="resources">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <FileQuestion className="h-8 w-8 text-indigo-600 mr-4" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Centro de ayuda</h3>
                    <p className="text-gray-600 mb-4">
                      Explora nuestra base de conocimientos con guías detalladas y soluciones a problemas comunes.
                    </p>
                    <Button variant="outline">Visitar centro de ayuda</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <MessageSquare className="h-8 w-8 text-indigo-600 mr-4" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Comunidad</h3>
                    <p className="text-gray-600 mb-4">
                      Únete a nuestra comunidad de usuarios para compartir consejos, trucos y mejores prácticas.
                    </p>
                    <Button variant="outline">Unirse a la comunidad</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <FileQuestion className="h-8 w-8 text-indigo-600 mr-4" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Guías de inicio rápido</h3>
                    <p className="text-gray-600 mb-4">
                      Tutoriales paso a paso para configurar y comenzar a usar CollabCopilot en minutos.
                    </p>
                    <Button variant="outline">Ver guías</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <FileQuestion className="h-8 w-8 text-indigo-600 mr-4" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Webinars y eventos</h3>
                    <p className="text-gray-600 mb-4">
                      Participa en nuestros webinars semanales y eventos de formación para usuarios.
                    </p>
                    <Button variant="outline">Ver calendario de eventos</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageTemplate>
  );
};

export default SupportPage;
