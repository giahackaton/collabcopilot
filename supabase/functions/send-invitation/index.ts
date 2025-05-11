
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@1.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvitationRequest {
  email: string;
  sender: string;
  meetingTitle: string;
  appUrl?: string; // URL base de la aplicación
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, sender, meetingTitle, appUrl = '' }: InvitationRequest = await req.json();

    // Validate required fields
    if (!email || !sender) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: email and sender are required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({
        error: 'Invalid email format'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get Resend API key from environment variables
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not found in environment variables");
      return new Response(JSON.stringify({ 
        error: 'Email service configuration error' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Resend client
    const resend = new Resend(resendApiKey);
    
    // Use the actual app URL if provided, or fallback to a default relative path
    // This ensures the invitation links to the current application instance
    const baseUrl = appUrl || window.location.origin;
    const joinLink = `${baseUrl}/meeting?meeting=${encodeURIComponent(meetingTitle)}&inviter=${encodeURIComponent(sender)}`;
    
    console.log(`Generated join link: ${joinLink} using base URL: ${baseUrl}`);
    
    // Send actual email using Resend
    const { data, error: resendError } = await resend.emails.send({
      from: 'Meeting AI <onboarding@resend.dev>',
      to: [email],
      subject: `Invitación a reunión: ${meetingTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #3b82f6;">Invitación a Reunión</h2>
          <p>Hola,</p>
          <p><strong>${sender}</strong> te ha invitado a unirte a la reunión <strong>${meetingTitle}</strong>.</p>
          <div style="margin: 25px 0;">
            <a href="${joinLink}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Unirse a la reunión
            </a>
          </div>
          <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
          <p style="background-color: #f3f4f6; padding: 10px; border-radius: 3px; word-break: break-all;">
            ${joinLink}
          </p>
          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            Este es un mensaje automático, por favor no respondas a este correo.
          </p>
        </div>
      `
    });

    if (resendError) {
      console.error('Error sending email with Resend:', resendError);
      return new Response(JSON.stringify({ 
        error: 'Failed to send invitation email', 
        details: resendError 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Invitation email sent to ${email} for meeting "${meetingTitle}" from ${sender}`);
    console.log('Resend response:', data);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Invitación enviada a ${email}`,
      data: data
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
