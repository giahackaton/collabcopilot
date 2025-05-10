
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, Calendar, Eye, ArrowRight } from 'lucide-react';

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
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8 text-blue-600" />
          Resúmenes
        </h1>
        <p className="text-gray-500 mt-1">
          Consulta los resúmenes de reuniones anteriores
        </p>
      </div>

      <div className="flex mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar resúmenes..."
            className="pl-8"
          />
        </div>
        <Button className="ml-4 flex items-center gap-2">
          <Search className="h-4 w-4" />
          Buscar
        </Button>
      </div>

      <div className="space-y-6">
        {filteredSummaries.length > 0 ? (
          filteredSummaries.map((summary) => (
            <Card key={summary.id}>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    {summary.title}
                  </span>
                  <span className="text-gray-500 text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(summary.date).toLocaleDateString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{summary.content}</p>
                <Button variant="outline" className="mt-4 text-sm flex items-center gap-2">
                  <Eye className="h-4 w-4" /> Ver completo <ArrowRight className="h-4 w-4 ml-1" />
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
