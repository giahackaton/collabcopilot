
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Book, Search, Plus, Calendar, User, Clock, Save } from 'lucide-react';

const LogbookPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newEntry, setNewEntry] = useState('');

  // Dummy logbook data
  const logEntries = [
    {
      id: '1',
      date: '2025-05-09',
      content: 'Se actualizó la documentación del proyecto para reflejar los cambios en la API.',
      author: 'juan.perez@ejemplo.com'
    },
    {
      id: '2',
      date: '2025-05-08',
      content: 'Reunión con el equipo para revisar el progreso del sprint actual.',
      author: 'maria.rodriguez@ejemplo.com'
    },
    {
      id: '3',
      date: '2025-05-07',
      content: 'Se identificó y corrigió un problema crítico en el proceso de autenticación.',
      author: 'pedro.gomez@ejemplo.com'
    }
  ];

  const filteredEntries = logEntries.filter(entry => 
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEntry = () => {
    if (!newEntry.trim()) return;
    alert('Nueva entrada añadida: ' + newEntry);
    setNewEntry('');
    // Aquí se añadiría la entrada a la base de datos
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Book className="h-8 w-8 text-blue-600" />
          Bitácora
        </h1>
        <p className="text-gray-500 mt-1">
          Registro de actividades y eventos del proyecto
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-600" />
            Añadir nueva entrada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="Escribe los detalles de la nueva entrada..."
            className="mb-4"
            rows={4}
          />
          <Button onClick={handleAddEntry} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Guardar entrada
          </Button>
        </CardContent>
      </Card>

      <div className="flex mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar en la bitácora..."
            className="pl-8"
          />
        </div>
        <Button className="ml-4 flex items-center gap-2">
          <Search className="h-4 w-4" />
          Buscar
        </Button>
      </div>

      <div className="space-y-4">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-gray-900">{entry.content}</p>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 flex items-center justify-end gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center justify-end gap-1">
                      <User className="h-3 w-3" />
                      {entry.author}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center p-10 border rounded-lg bg-gray-50">
            <p className="text-gray-500">No se encontraron entradas en la bitácora</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogbookPage;
