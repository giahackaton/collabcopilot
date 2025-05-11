
import React from 'react';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MainNavigation: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Layers className="h-6 w-6 text-indigo-600" />
              <span className="text-xl font-bold text-indigo-600">CollabCopilot</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link to="/features" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
              Características
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
              Precios
            </Link>
            <Link to="/blog" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
              Blog
            </Link>
            <Link to="/support" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
              Soporte
            </Link>
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline">
              <Link to="/auth">Iniciar Sesión</Link>
            </Button>
            <Button>
              <Link to="/auth" className="text-white">Registrarse</Link>
            </Button>
          </div>
          
          <div className="md:hidden flex items-center">
            <Button variant="ghost">
              <Link to="/">Inicio</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainNavigation;
