
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SummariesPage = () => {
  const [searchTerm, setSearchTerm] = React.useState('');

  // Dummy summary data
  const summaries = [
    {
      id: '1',
      title: 'Sprint Planning - Mayo 2025',
      date: '2025-05-05',
      content: 'En esta reunión se definieron los objetivos del sprint...'
    },
    {
      id: '2',
      title: 'Daily Standup - Mayo 2025',
      date: '2025-05-06',
      content: 'Revisión diaria de las tareas en progreso y bloqueantes...'
    },
    {
      id: '3',
      title: 'Sprint Review - Abril 2025',
      date: '2025-04-30',
      content: 'Presentación de los avances al final del sprint anterior...'
    }
  ];

  const filteredSummaries = summaries.filter(summary => 
    summary.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Resúmenes</h1>
        <p className="text-gray-500 mt-1">
          Consulta los resúmenes de reuniones anteriores
        </p>
      </div>

      <div className="flex mb-6">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar resúmenes..."
          className="max-w-sm"
        />
        <Button className="ml-4">Buscar</Button>
      </div>

      <div className="space-y-6">
        {filteredSummaries.length > 0 ? (
          filteredSummaries.map((summary) => (
            <Card key={summary.id}>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>{summary.title}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(summary.date).toLocaleDateString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{summary.content}</p>
                <Button variant="outline" className="mt-4 text-sm">
                  Ver completo
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center p-10 border rounded-lg bg-gray-50">
            <p className="text-gray-500">No se encontraron resúmenes</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummariesPage;
