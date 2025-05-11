
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
    
    // Verificar si el contenido es un resumen predefinido o contenido de chat
    const isPreformattedSummary = content.includes('# ') && content.includes('##');
    
    try {
      setLoading(true);
      toast.info('Generando resumen de la reunión...');

      // Si es un resumen predefinido, lo usamos directamente
      if (isPreformattedSummary) {
        console.log('Usando resumen predefinido sin llamar a OpenAI');
        
        try {
          // Almacenar el resumen predefinido directamente en la base de datos
          const { data, error } = await supabase
            .from('summaries')
            .insert([{
              title,
              user_id: session.user.id,
              meeting_content: content, // El contenido original
              summary: content, // Usamos el mismo contenido como resumen
              participants,
            }])
            .select('*');
            
          if (error) {
            console.error('Error al insertar resumen en base de datos:', error);
            toast.error(`Error al guardar el resumen: ${error.message}`);
            return false;
          }
          
          toast.success('Resumen guardado correctamente');
          navigate('/summaries');
          return true;
          
        } catch (dbError) {
          console.error('Error al guardar resumen predefinido:', dbError);
          toast.error('Error al guardar el resumen en la base de datos');
          return false;
        }
      }

      // Si no es un resumen predefinido, usamos OpenAI como antes
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
