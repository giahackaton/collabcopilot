
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Home, 
  MessageSquare, 
  FileText, 
  Book, 
  CheckSquare, 
  Search, 
  LogOut, 
  LogIn,
  Layers,
  UserRound
} from 'lucide-react';
import UserProfileDialog from '@/components/UserProfileDialog';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <Layers className="h-5 w-5" />
            CollabCopilot1.0
          </h1>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {session.user ? (
              <>
                <li>
                  <Link 
                    to="/dashboard" 
                    className={`flex items-center gap-2 p-2 rounded hover:bg-blue-100 ${location.pathname === '/dashboard' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                  >
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/meeting" 
                    className={`flex items-center gap-2 p-2 rounded hover:bg-blue-100 ${location.pathname === '/meeting' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Reunión Activa
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/summaries" 
                    className={`flex items-center gap-2 p-2 rounded hover:bg-blue-100 ${location.pathname === '/summaries' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                  >
                    <FileText className="h-4 w-4" />
                    Resúmenes
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/logbook" 
                    className={`flex items-center gap-2 p-2 rounded hover:bg-blue-100 ${location.pathname === '/logbook' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                  >
                    <Book className="h-4 w-4" />
                    Bitácora
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/tasks" 
                    className={`flex items-center gap-2 p-2 rounded hover:bg-blue-100 ${location.pathname === '/tasks' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                  >
                    <CheckSquare className="h-4 w-4" />
                    Tareas Asignadas
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/decisions" 
                    className={`flex items-center gap-2 p-2 rounded hover:bg-blue-100 ${location.pathname === '/decisions' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                  >
                    <Search className="h-4 w-4" />
                    Buscar Decisiones
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => setIsProfileOpen(true)}
                    className="w-full text-left flex items-center gap-2 p-2 rounded hover:bg-blue-100 text-gray-700"
                  >
                    <UserRound className="h-4 w-4" />
                    Mi Perfil
                  </button>
                </li>
                <li className="pt-4 mt-4 border-t">
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left flex items-center gap-2 p-2 rounded hover:bg-red-100 text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link 
                  to="/auth" 
                  className="flex items-center gap-2 p-2 rounded hover:bg-blue-100 text-gray-700"
                >
                  <LogIn className="h-4 w-4" />
                  Iniciar Sesión
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
      
      {/* User Profile Dialog */}
      <UserProfileDialog 
        open={isProfileOpen} 
        onOpenChange={setIsProfileOpen}
      />
    </div>
  );
};

export default Layout;
