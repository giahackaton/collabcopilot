
import React, { useState, useEffect } from 'react';
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
  Menu,
  User,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import Sidebar from '@/components/ui/sidebar';
import UserProfileDialog from '@/components/UserProfileDialog';
import { supabase } from '@/integrations/supabase/client';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{username?: string, avatar_url?: string}>({});
  
  // Fetch user profile data when session changes or when profile is updated
  useEffect(() => {
    if (session.user) {
      fetchUserProfile();
    }
  }, [session.user, isUserProfileOpen]);

  const fetchUserProfile = async () => {
    if (!session.user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', session.user.id)
        .single();
        
      if (error) throw error;
      
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
  
  // Don't show navigation on auth pages
  if (location.pathname === '/auth') {
    return <main className="min-h-screen">{children}</main>;
  }

  const handleSignOut = async () => {
    await signOut();
    toast.success('Sesión cerrada correctamente');
    navigate('/auth');
  };

  const renderLinkItem = (to: string, Icon: any, text: string, closeMenu?: () => void) => {
    const isActive = location.pathname === to;
    const baseClasses = "flex items-center gap-2 p-2 rounded transition-colors";
    const activeClasses = "bg-blue-100 text-blue-700 font-medium";
    const inactiveClasses = "text-gray-700 hover:bg-blue-50";
    
    return (
      <Link 
        to={to} 
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        onClick={closeMenu}
      >
        <Icon className="h-4 w-4" />
        <span className="truncate">{text}</span>
      </Link>
    );
  };

  // Get display name (username or email)
  const displayName = userProfile?.username || session.user?.email?.split('@')[0] || 'Usuario';
  const avatarLetter = (userProfile?.username?.[0] || session.user?.email?.[0] || 'U').toUpperCase();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar>
          <div className="mb-6">
            <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
              <Layers className="h-5 w-5" />
              <span className="truncate">CollabCopilot1.0</span>
            </h1>
          </div>

          <div>
            {session.user && (
              <div className="mb-6 p-3 bg-blue-50 rounded-lg flex items-center gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                  {userProfile?.avatar_url ? (
                    <AvatarImage src={userProfile.avatar_url} />
                  ) : (
                    <AvatarFallback>{avatarLetter}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{displayName}</p>
                  <p className="text-xs text-gray-500 truncate">Sesión activa</p>
                </div>
              </div>
            )}
            
            <nav>
              <ul className="space-y-1">
                {session.user ? (
                  <>
                    <li>
                      {renderLinkItem('/', Home, 'Dashboard')}
                    </li>
                    <li>
                      {renderLinkItem('/meeting', MessageSquare, 'Reunión Activa')}
                    </li>
                    <li>
                      {renderLinkItem('/summaries', FileText, 'Resúmenes')}
                    </li>
                    <li>
                      {renderLinkItem('/logbook', Book, 'Bitácora')}
                    </li>
                    <li>
                      {renderLinkItem('/tasks', CheckSquare, 'Tareas Asignadas')}
                    </li>
                    <li>
                      {renderLinkItem('/decisions', Search, 'Buscar Decisiones')}
                    </li>
                    <li className="p-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsUserProfileOpen(true)}
                        className="w-full"
                      >
                        <User className="h-4 w-4" />
                        <span className="ml-2">Perfil</span>
                      </Button>
                    </li>
                    <li className="pt-4 mt-4 border-t">
                      <button 
                        onClick={handleSignOut}
                        className="w-full text-left flex items-center gap-2 p-2 rounded hover:bg-red-100 text-red-600"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="truncate">Cerrar Sesión</span>
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    {renderLinkItem('/auth', LogIn, 'Iniciar Sesión')}
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </Sidebar>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-md">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <Layers className="h-5 w-5" />
            CollabCopilot1.0
          </h1>
          
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px]">
              <SheetHeader>
                <SheetTitle className="text-xl font-bold text-blue-600 flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  CollabCopilot1.0
                </SheetTitle>
              </SheetHeader>
              <div className="py-6">
                {session.user && (
                  <div className="mb-6 p-3 bg-blue-50 rounded-lg flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      {userProfile?.avatar_url ? (
                        <AvatarImage src={userProfile.avatar_url} />
                      ) : (
                        <AvatarFallback>{avatarLetter}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{displayName}</p>
                      <p className="text-xs text-gray-500">Sesión activa</p>
                    </div>
                  </div>
                )}
                <nav>
                  <ul className="space-y-2">
                    {session.user ? (
                      <>
                        <li>
                          {renderLinkItem('/', Home, 'Dashboard', () => setIsMobileMenuOpen(false))}
                        </li>
                        <li>
                          {renderLinkItem('/meeting', MessageSquare, 'Reunión Activa', () => setIsMobileMenuOpen(false))}
                        </li>
                        <li>
                          {renderLinkItem('/summaries', FileText, 'Resúmenes', () => setIsMobileMenuOpen(false))}
                        </li>
                        <li>
                          {renderLinkItem('/logbook', Book, 'Bitácora', () => setIsMobileMenuOpen(false))}
                        </li>
                        <li>
                          {renderLinkItem('/tasks', CheckSquare, 'Tareas Asignadas', () => setIsMobileMenuOpen(false))}
                        </li>
                        <li>
                          {renderLinkItem('/decisions', Search, 'Buscar Decisiones', () => setIsMobileMenuOpen(false))}
                        </li>
                        <li>
                          <SheetClose asChild>
                            <Button 
                              variant="outline" 
                              className="w-full flex items-center gap-2 justify-start"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setTimeout(() => setIsUserProfileOpen(true), 100);
                              }}
                            >
                              <User className="h-4 w-4" />
                              Perfil
                            </Button>
                          </SheetClose>
                        </li>
                        <li className="pt-4 mt-4 border-t">
                          <SheetClose asChild>
                            <button 
                              onClick={handleSignOut}
                              className="w-full text-left flex items-center gap-2 p-2 rounded hover:bg-red-100 text-red-600"
                            >
                              <LogOut className="h-4 w-4" />
                              Cerrar Sesión
                            </button>
                          </SheetClose>
                        </li>
                      </>
                    ) : (
                      <li>
                        <SheetClose asChild>
                          {renderLinkItem('/auth', LogIn, 'Iniciar Sesión')}
                        </SheetClose>
                      </li>
                    )}
                  </ul>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 md:pt-8 pt-20 overflow-x-hidden">
        {children}
      </main>
      
      {/* User Profile Dialog */}
      <UserProfileDialog 
        open={isUserProfileOpen} 
        onOpenChange={setIsUserProfileOpen}
        onProfileUpdated={fetchUserProfile} 
      />
    </div>
  );
};

export default Layout;
