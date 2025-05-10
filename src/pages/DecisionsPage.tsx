
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, Calendar, Tag, Filter } from 'lucide-react';

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
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8 text-blue-600" />
          Buscar Decisiones
        </h1>
        <p className="text-gray-500 mt-1">
          Encuentra decisiones tomadas en reuniones anteriores
        </p>
      </div>

      <div className="flex mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por contenido, etiqueta o reunión..."
            className="pl-8"
          />
        </div>
        <Button className="ml-4 flex items-center gap-2">
          <Search className="h-4 w-4" />
          Buscar
        </Button>
        <Button variant="outline" className="ml-2 flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtrar
        </Button>
      </div>

      <div className="space-y-4">
        {filteredDecisions.length > 0 ? (
          filteredDecisions.map((decision) => (
            <Card key={decision.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center text-lg">
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    {decision.meetingTitle}
                  </span>
                  <span className="text-sm font-normal text-gray-500 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
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
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                    >
                      <Tag className="h-3 w-3" />
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
