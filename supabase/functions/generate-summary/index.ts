
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

    // Validate content length
    if (content.length < 10) {
      return new Response(JSON.stringify({
        error: "Content is too short to generate a meaningful summary"
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
      console.error('OpenAI API Key is not configured');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API Key is not configured',
        message: 'Please add your OpenAI API Key to the Supabase Edge Function secrets.'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Generating summary for meeting:', title);
    console.log('Content length:', content.length, 'characters');
    console.log('Participants:', participants.length);
    
    try {
      // Generate summary using OpenAI
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
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

      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.json();
        console.error('OpenAI API error:', errorData);
        throw new Error(`OpenAI API error: ${errorData.error?.message || JSON.stringify(errorData)}`);
      }

      const openaiData = await openaiResponse.json();
      const summary = openaiData.choices[0]?.message?.content;

      if (!summary) {
        throw new Error('Failed to generate summary from OpenAI');
      }

      console.log('Summary generated successfully');

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
        console.error('Error inserting summary into database:', error);
        throw error;
      }

      return new Response(JSON.stringify({
        success: true,
        data
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (openaiError) {
      console.error('Error calling OpenAI API:', openaiError);
      return new Response(JSON.stringify({
        error: 'Failed to generate summary',
        details: openaiError.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(JSON.stringify({
      error: 'An unexpected error occurred',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
