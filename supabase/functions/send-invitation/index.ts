
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvitationRequest {
  email: string;
  sender: string;
  meetingTitle: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, sender, meetingTitle }: InvitationRequest = await req.json();

    if (!email || !sender) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: email and sender are required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // In a production environment, you would send an actual email here
    // For now, we'll just log the invitation details
    console.log(`Invitation sent to ${email} for meeting "${meetingTitle}" from ${sender}`);

    // Simulate email sending
    // In production, you would use a service like Resend, SendGrid, etc.

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Invitación enviada a ${email}` 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in send-invitation function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
