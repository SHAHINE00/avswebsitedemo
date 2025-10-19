import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-original-uri',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the original URI from nginx header
    const originalUri = req.headers.get('X-Original-URI') || new URL(req.url).pathname;
    console.log('Original URI:', originalUri);

    // Extract path: /files/course-materials/{courseId}/{filename}
    const pathMatch = originalUri.match(/^\/files\/course-materials\/([^\/]+)\/(.+)$/);
    
    if (!pathMatch) {
      console.error('Invalid path format:', originalUri);
      return new Response(JSON.stringify({ error: 'Invalid file path' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const [, courseId, filename] = pathMatch;
    const storagePath = `${courseId}/${filename}`;
    
    console.log('Course ID:', courseId);
    console.log('Filename:', filename);
    console.log('Storage path:', storagePath);

    // Get file metadata from database to check permissions
    const { data: material, error: materialError } = await supabaseClient
      .from('course_materials')
      .select('is_public, course_id')
      .eq('file_url', originalUri)
      .single();

    if (materialError && materialError.code !== 'PGRST116') {
      console.error('Error fetching material:', materialError);
    }

    // Check if file is public
    const isPublic = material?.is_public || false;
    
    console.log('Is public:', isPublic);

    if (!isPublic) {
      // File is not public, check if user is authenticated and enrolled
      const { data: { user } } = await supabaseClient.auth.getUser();
      
      if (!user) {
        console.log('User not authenticated');
        return new Response(JSON.stringify({ error: 'Authentication required' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check if user is enrolled in the course or is admin
      const { data: enrollment } = await supabaseClient
        .from('course_enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

      const { data: isAdmin } = await supabaseClient
        .rpc('is_admin', { _user_id: user.id });

      if (!enrollment && !isAdmin) {
        console.log('User not enrolled and not admin');
        return new Response(JSON.stringify({ error: 'Access denied' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Access granted - enrolled or admin');
    }

    // Fetch file from Supabase Storage
    const { data: fileData, error: fileError } = await supabaseClient.storage
      .from('course-materials')
      .download(storagePath);

    if (fileError) {
      console.error('Error downloading file:', fileError);
      return new Response(JSON.stringify({ error: 'File not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Increment download count
    if (material) {
      await supabaseClient
        .from('course_materials')
        .update({ download_count: (material as any).download_count + 1 })
        .eq('file_url', originalUri);
    }

    // Determine content type from filename extension
    const ext = filename.split('.').pop()?.toLowerCase();
    const contentTypeMap: Record<string, string> = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'zip': 'application/zip',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'mp4': 'video/mp4',
      'mp3': 'audio/mpeg',
    };

    const contentType = contentTypeMap[ext || ''] || 'application/octet-stream';

    console.log('File found, streaming response');

    // Stream file back with proper headers
    return new Response(fileData, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
