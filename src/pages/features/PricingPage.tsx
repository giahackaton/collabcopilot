
import React from 'react';
import PageTemplate from '@/components/PageTemplate';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingPage = () => {
  const plans = [
    {
      name: "Básico",
      price: "Gratis",
      description: "Para individuos y equipos pequeños",
      features: [
        "5 reuniones por mes",
        "Resúmenes básicos",
        "Hasta 5 participantes por reunión",
        "Duración máxima de 30 minutos",
        "Almacenamiento de 7 días",
      ],
      cta: "Comenzar gratis",
      popular: false,
    },
    {
      name: "Profesional",
      price: "$12",
      period: "usuario / mes",
      description: "Para equipos y departamentos",
      features: [
        "Reuniones ilimitadas",
        "Resúmenes avanzados con IA",
        "Hasta 20 participantes por reunión",
        "Duración ilimitada",
        "Almacenamiento de 3 meses",
        "Integración con calendario",
        "Soporte prioritario",
      ],
      cta: "Prueba gratuita de 14 días",
      popular: true,
    },
    {
      name: "Empresarial",
      price: "Personalizado",
      description: "Para grandes organizaciones",
      features: [
        "Todo lo incluido en Profesional",
        "Participantes ilimitados",
        "Administración de equipo avanzada",
        "Almacenamiento ilimitado",
        "Atención personalizada",
        "API para integraciones",
        "Soporte 24/7",
      ],
      cta: "Contactar ventas",
      popular: false,
    }
  ];

  return (
    <PageTemplate 
      title="Precios" 
      subtitle="Planes flexibles para equipos de todos los tamaños"
      showCTA={false}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`border ${plan.popular ? 'border-indigo-500 shadow-lg relative' : ''}`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Popular
              </div>
            )}
            <CardHeader>
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-gray-500 ml-1">/{plan.period}</span>}
              </div>
              <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className={`w-full ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-700' : ''}`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                <Link to="/auth">{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </PageTemplate>
  );
};

export default PricingPage;
