
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UserProfileData {
  username?: string;
  full_name?: string;
  avatar_url?: string;
}

const UserProfileDialog: React.FC<UserProfileDialogProps> = ({ open, onOpenChange }) => {
  const { session } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Form fields
  const [formData, setFormData] = useState<UserProfileData>({
    username: "",
    full_name: "",
    avatar_url: "",
  });

  // Load user profile data
  useEffect(() => {
    if (open && session?.user) {
      fetchUserProfile();
    }
  }, [open, session?.user]);

  const fetchUserProfile = async () => {
    if (!session?.user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (error) throw error;
      
      setUserProfile(data);
      setFormData({
        username: data?.username || "",
        full_name: data?.full_name || "",
        avatar_url: data?.avatar_url || "",
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('No se pudo cargar el perfil del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!session?.user) return;
    
    try {
      setUpdating(true);
      
      // Update profile information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          full_name: formData.full_name,
          avatar_url: formData.avatar_url,
          updated_at: new Date().toISOString() // Convert Date to ISO string
        })
        .eq('id', session.user.id);
        
      if (profileError) throw profileError;
      
      // Update password if provided
      if (password && password === confirmPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: password
        });
        
        if (passwordError) throw passwordError;
        toast.success('Contraseña actualizada correctamente');
      } else if (password && password !== confirmPassword) {
        toast.error('Las contraseñas no coinciden');
        setUpdating(false);
        return;
      }
      
      toast.success('Perfil actualizado correctamente');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(`Error al actualizar el perfil: ${error.message || 'Error desconocido'}`);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Perfil de Usuario</DialogTitle>
          <DialogDescription>
            Actualiza tu información de perfil y contraseña
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center space-y-4 mb-4">
              <Avatar className="h-24 w-24">
                {formData.avatar_url ? (
                  <AvatarImage src={formData.avatar_url} />
                ) : (
                  <AvatarFallback>{formData.username?.[0]?.toUpperCase() || session.user?.email?.[0].toUpperCase() || 'U'}</AvatarFallback>
                )}
              </Avatar>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" value={session.user?.email || ''} disabled />
              <p className="text-xs text-gray-500">El correo electrónico no se puede cambiar</p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="username">Nombre de Usuario</Label>
              <Input 
                id="username" 
                value={formData.username} 
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="fullName">Nombre Completo</Label>
              <Input 
                id="fullName" 
                value={formData.full_name} 
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="avatarUrl">URL de Avatar</Label>
              <Input 
                id="avatarUrl" 
                placeholder="https://ejemplo.com/imagen.jpg"
                value={formData.avatar_url} 
                onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2 mt-4">
              <Label htmlFor="password">Nueva Contraseña</Label>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input 
                id="confirmPassword" 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleUpdateProfile} 
            disabled={updating || loading}
          >
            {updating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Actualizando...
              </>
            ) : 'Guardar Cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;
