
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Mail, 
  Phone, 
  MessageSquare, 
  Users, 
  FileQuestion,
  HelpCircle
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ContactPage = () => {
  const offices = [
    {
      city: "Ciudad de México",
      address: "Av. Paseo de la Reforma 483, Piso 16\nCol. Cuauhtémoc, 06500\nMéxico D.F., México",
      email: "mexico@collabcopilot.com",
      phone: "+52 (55) 5340-1234"
    },
    {
      city: "Madrid",
      address: "Calle de Velázquez 92, Planta 4\n28006 Madrid\nEspaña",
      email: "madrid@collabcopilot.com",
      phone: "+34 91 123 4567"
    },
    {
      city: "Barcelona",
      address: "Carrer de Pallars 193, Planta 5\n08005 Barcelona\nEspaña",
      email: "barcelona@collabcopilot.com",
      phone: "+34 93 123 4567"
    }
  ];

  const departments = [
    {
      name: "Ventas",
      email: "ventas@collabcopilot.com",
      description: "Para consultas sobre precios, demos personalizadas o planes empresariales",
      icon: <Users className="h-6 w-6" />
    },
    {
      name: "Soporte",
      email: "soporte@collabcopilot.com",
      description: "Ayuda con problemas técnicos o preguntas sobre el uso del producto",
      icon: <HelpCircle className="h-6 w-6" />
    },
    {
      name: "Prensa",
      email: "prensa@collabcopilot.com",
      description: "Consultas de medios, solicitudes de entrevistas o materiales de prensa",
      icon: <FileQuestion className="h-6 w-6" />
    },
    {
      name: "Asociaciones",
      email: "partners@collabcopilot.com",
      description: "Oportunidades de colaboración o integración con CollabCopilot",
      icon: <MessageSquare className="h-6 w-6" />
    }
  ];

  return (
    <PageTemplate 
      title="Contacto" 
      subtitle="Ponte en contacto con nosotros para cualquier consulta"
      showCTA={false}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Envíanos un mensaje</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstname" className="text-sm font-medium">Nombre</label>
                    <Input id="firstname" placeholder="Tu nombre" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastname" className="text-sm font-medium">Apellido</label>
                    <Input id="lastname" placeholder="Tu apellido" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input id="email" type="email" placeholder="tu@email.com" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium">Empresa</label>
                  <Input id="company" placeholder="Nombre de tu empresa" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="department" className="text-sm font-medium">Departamento</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Ventas</SelectItem>
                      <SelectItem value="support">Soporte</SelectItem>
                      <SelectItem value="press">Prensa</SelectItem>
                      <SelectItem value="partnerships">Asociaciones</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Mensaje</label>
                  <Textarea 
                    id="message" 
                    placeholder="¿En qué podemos ayudarte?" 
                    className="min-h-[150px]"
                  />
                </div>
                
                <Button className="w-full md:w-auto">Enviar mensaje</Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Nuestras oficinas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offices.map((office, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start mb-4">
                      <Building className="h-5 w-5 text-indigo-600 mr-3 mt-1" />
                      <div>
                        <h3 className="font-bold text-lg">{office.city}</h3>
                        <p className="text-gray-600 whitespace-pre-line">{office.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center mb-2">
                      <Mail className="h-5 w-5 text-indigo-600 mr-3" />
                      <a href={`mailto:${office.email}`} className="text-indigo-600 hover:underline">
                        {office.email}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-indigo-600 mr-3" />
                      <span>{office.phone}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6">Departamentos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {departments.map((dept, index) => (
                <div key={index} className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-4">
                    {dept.icon}
                  </div>
                  <div>
                    <h3 className="font-bold">{dept.name}</h3>
                    <a href={`mailto:${dept.email}`} className="text-indigo-600 hover:underline block mb-1">
                      {dept.email}
                    </a>
                    <p className="text-sm text-gray-600">{dept.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Card className="bg-indigo-50 border-none">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">Horario de atención</h3>
              <p className="mb-4">
                Nuestro equipo está disponible para ayudarte de lunes a viernes, de 9:00 a 18:00 (GMT+1).
              </p>
              <p className="text-sm text-gray-600">
                Para soporte urgente fuera de este horario, los clientes de planes Premium y Enterprise 
                pueden acceder a nuestro soporte 24/7 a través de su portal dedicado.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTemplate>
  );
};

export default ContactPage;
