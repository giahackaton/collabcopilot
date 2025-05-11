
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useMeetingSummary = () => {
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();

  const generateSummary = async (title: string, content: string, participants: string[]) => {
    if (!session.user) {
      toast.error('Debes iniciar sesión para generar resúmenes');
      return false;
    }

    if (!title || !content) {
      toast.error('El título y el contenido son obligatorios');
      return false;
    }
    
    // Verify content length
    if (content.length < 10) {
      toast.error('El contenido es demasiado corto para generar un resumen significativo');
      return false;
    }

    try {
      setLoading(true);
      toast.info('Generando resumen de la reunión...');

      // Call the Supabase Edge Function with improved error handling
      const { data, error } = await supabase.functions.invoke('generate-summary', {
        body: {
          title,
          content,
          participants,
          user_id: session.user.id
        }
      });

      if (error) {
        console.error('Error invoking generate-summary function:', error);
        toast.error(`Error al generar el resumen: ${error.message}`);
        return false;
      }

      if (data.error) {
        console.error('Error from generate-summary function:', data.error);
        
        // Check if the error is related to insufficient quota
        if (data.code === 'insufficient_quota' || 
            (data.error && data.error.includes('cuota'))) {
          toast.error(
            'La cuenta de OpenAI ha excedido su cuota de uso. Por favor, verifica el estado de tu cuenta o utiliza una cuenta diferente.',
            { duration: 6000 }
          );
          return false;
        }
        
        // Check if the error is related to missing API key
        if (data.error.includes('OpenAI API Key is not configured')) {
          toast.error('Se requiere configurar la clave de API de OpenAI en las funciones Edge de Supabase');
        } else {
          toast.error(`Error al generar el resumen: ${data.error}`);
        }
        return false;
      }

      toast.success('Resumen generado correctamente');
      navigate('/summaries');
      return true;
    } catch (error: any) {
      console.error('Error generating summary:', error);
      toast.error(`Error al generar el resumen: ${error.message || 'Error desconocido'}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateSummary,
    loading
  };
};
