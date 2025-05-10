
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, signOut } = useAuth();
  const location = useLocation();
  
  // Don't show navigation on auth pages
  if (location.pathname === '/auth') {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-blue-600">CollabCopilot1.0</h1>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {session.user ? (
              <>
                <li>
                  <Link 
                    to="/" 
                    className={`block p-2 rounded hover:bg-blue-100 ${location.pathname === '/' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/meeting" 
                    className={`block p-2 rounded hover:bg-blue-100 ${location.pathname === '/meeting' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                  >
                    Reunión Activa
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/summaries" 
                    className={`block p-2 rounded hover:bg-blue-100 ${location.pathname === '/summaries' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                  >
                    Resúmenes
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/logbook" 
                    className={`block p-2 rounded hover:bg-blue-100 ${location.pathname === '/logbook' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                  >
                    Bitácora
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/tasks" 
                    className={`block p-2 rounded hover:bg-blue-100 ${location.pathname === '/tasks' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                  >
                    Tareas Asignadas
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/decisions" 
                    className={`block p-2 rounded hover:bg-blue-100 ${location.pathname === '/decisions' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                  >
                    Buscar Decisiones
                  </Link>
                </li>
                <li className="pt-4 mt-4 border-t">
                  <button 
                    onClick={() => signOut()}
                    className="w-full text-left p-2 rounded hover:bg-red-100 text-red-600"
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link 
                  to="/auth" 
                  className="block p-2 rounded hover:bg-blue-100 text-gray-700"
                >
                  Iniciar Sesión
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default Layout;
