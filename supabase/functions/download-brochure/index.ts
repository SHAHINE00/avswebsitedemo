import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get the brochure name from query params or use default
    const url = new URL(req.url);
    const brochureName = url.searchParams.get('file') || 'Syllabus_Complet.pdf';
    
    console.log('Fetching brochure:', brochureName);

    // Fetch file from Supabase Storage
    const { data: fileData, error: fileError } = await supabaseClient.storage
      .from('brochures')
      .download(brochureName);

    if (fileError) {
      console.error('Error downloading brochure:', fileError);
      return new Response(
        JSON.stringify({ error: 'Brochure not found' }), 
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Brochure found, streaming response with download headers');

    // Return file with Content-Disposition: attachment to force download on iOS
    return new Response(fileData, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Brochure_Formation_IA_Excellence.pdf"',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
