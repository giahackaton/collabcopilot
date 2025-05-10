
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DecisionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dummy decisions data
  const decisions = [
    {
      id: '1',
      meetingTitle: 'Sprint Planning - Mayo 2025',
      date: '2025-05-05',
      content: 'Se decidió priorizar la implementación de la autenticación con Supabase.',
      tags: ['autenticación', 'priorización', 'técnico']
    },
    {
      id: '2',
      meetingTitle: 'Design Review - Mayo 2025',
      date: '2025-05-07',
      content: 'El equipo acordó utilizar una paleta de colores azul y gris para la interfaz.',
      tags: ['diseño', 'UI', 'decisión-consenso']
    },
    {
      id: '3',
      meetingTitle: 'Retrospectiva - Abril 2025',
      date: '2025-04-30',
      content: 'Se tomó la decisión de mejorar la documentación del código.',
      tags: ['documentación', 'calidad', 'mejora']
    }
  ];

  const filteredDecisions = decisions.filter(decision => 
    decision.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    decision.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    decision.meetingTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Buscar Decisiones</h1>
        <p className="text-gray-500 mt-1">
          Encuentra decisiones tomadas en reuniones anteriores
        </p>
      </div>

      <div className="flex mb-6">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por contenido, etiqueta o reunión..."
          className="max-w-sm"
        />
        <Button className="ml-4">Buscar</Button>
      </div>

      <div className="space-y-4">
        {filteredDecisions.length > 0 ? (
          filteredDecisions.map((decision) => (
            <Card key={decision.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center text-lg">
                  <span>{decision.meetingTitle}</span>
                  <span className="text-sm font-normal text-gray-500">
                    {new Date(decision.date).toLocaleDateString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{decision.content}</p>
                <div className="flex gap-2 flex-wrap">
                  {decision.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center p-10 border rounded-lg bg-gray-50">
            <p className="text-gray-500">No se encontraron decisiones</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DecisionsPage;
