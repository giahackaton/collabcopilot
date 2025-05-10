
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0';

interface MeetingData {
  title: string;
  content: string;
  participants: string[];
  user_id: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, content, participants, user_id } = await req.json() as MeetingData;

    if (!content || !user_id || !title) {
      return new Response(JSON.stringify({
        error: "Missing required fields: content, user_id and title are required"
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Use OpenAI API to generate a summary
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API Key is not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate summary using OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente que genera resúmenes concisos pero completos de reuniones. Identifica los puntos principales, decisiones tomadas, tareas asignadas y próximos pasos. Estructura tu respuesta en secciones claramente definidas.'
          },
          {
            role: 'user',
            content: `Por favor, resume la siguiente transcripción de reunión titulada "${title}": \n\n${content}`
          }
        ],
        temperature: 0.5,
        max_tokens: 1000,
      }),
    });

    const openaiData = await openaiResponse.json();
    const summary = openaiData.choices[0]?.message?.content;

    if (!summary) {
      throw new Error('Failed to generate summary from OpenAI');
    }

    // Store the summary in the database
    const { data, error } = await supabase
      .from('summaries')
      .insert([{
        title,
        user_id,
        meeting_content: content,
        summary,
        participants,
      }])
      .select('*');

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({
      success: true,
      data
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(JSON.stringify({
      error: error.message || 'An unexpected error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
