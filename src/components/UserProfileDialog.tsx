
import React, { useState, useEffect, useRef } from 'react';
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
import { Loader2, Upload } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProfileUpdated?: () => void;
}

interface UserProfileData {
  username?: string;
  full_name?: string;
  avatar_url?: string;
}

const UserProfileDialog: React.FC<UserProfileDialogProps> = ({ 
  open, 
  onOpenChange,
  onProfileUpdated 
}) => {
  const { session } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!session?.user) return;
    
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten archivos de imagen');
      return;
    }
    
    try {
      setUploadingAvatar(true);
      
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
      
      // Create avatars bucket if it doesn't exist
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('avatars');
      
      if (bucketError && bucketError.message.includes('does not exist')) {
        // Create bucket if it doesn't exist
        await supabase.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        });
      }
      
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);
        
      if (error) throw error;
      
      // Get public URL
      const { data: publicURL } = supabase.storage.from('avatars').getPublicUrl(fileName);
      
      // Update form data
      setFormData({
        ...formData,
        avatar_url: publicURL.publicUrl,
      });
      
      toast.success('Avatar subido correctamente');
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error(`Error al subir el avatar: ${error.message || 'Error desconocido'}`);
    } finally {
      setUploadingAvatar(false);
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
      
      // Call the onProfileUpdated callback if provided
      if (onProfileUpdated) {
        onProfileUpdated();
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
        
        <div className="py-4 h-[60vh] overflow-hidden">
          <ScrollArea className="h-full pr-4">
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
                  
                  <input
                    type="file" 
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                  
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="flex items-center gap-2"
                  >
                    {uploadingAvatar ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    {uploadingAvatar ? "Subiendo..." : "Subir avatar"}
                  </Button>
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
          </ScrollArea>
        </div>
        
        <DialogFooter className="border-t pt-4 mt-2">
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
