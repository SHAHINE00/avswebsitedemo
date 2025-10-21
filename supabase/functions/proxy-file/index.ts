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

    // Determine bucket and parse path
    let bucketName: string;
    let entityId: string;
    let filename: string;
    let storagePath: string;

    // Try course-materials pattern: /files/course-materials/{courseId}/{filename}
    const courseMaterialsMatch = originalUri.match(/^\/files\/course-materials\/([^\/]+)\/(.+)$/);
    // Try student-documents pattern: /files/student-documents/{userId}/{filename}
    const studentDocumentsMatch = originalUri.match(/^\/files\/student-documents\/([^\/]+)\/(.+)$/);
    
    if (courseMaterialsMatch) {
      bucketName = 'course-materials';
      [, entityId, filename] = courseMaterialsMatch;
      storagePath = `${entityId}/${filename}`;
      console.log('Course materials - Course ID:', entityId, 'Filename:', filename);
    } else if (studentDocumentsMatch) {
      bucketName = 'student-documents';
      [, entityId, filename] = studentDocumentsMatch;
      storagePath = `${entityId}/${filename}`;
      console.log('Student documents - User ID:', entityId, 'Filename:', filename);
    } else {
      console.error('Invalid path format:', originalUri);
      return new Response(JSON.stringify({ error: 'Invalid file path' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle access control based on bucket type
    if (bucketName === 'course-materials') {
      // Get file metadata from database to check permissions
      const { data: material, error: materialError } = await supabaseClient
        .from('course_materials')
        .select('is_public, course_id, id, download_count')
        .eq('file_url', originalUri)
        .single();

      if (materialError && materialError.code !== 'PGRST116') {
        console.error('Error fetching material:', materialError);
      }

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
          .eq('course_id', entityId)
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

      // Track download
      if (material) {
        try {
          await supabaseClient.rpc('increment_material_download', { p_material_id: material.id });
        } catch (e) {
          console.error('Error tracking download:', e);
        }
      }
    } else if (bucketName === 'student-documents') {
      // Always require authentication for student documents
      const { data: { user } } = await supabaseClient.auth.getUser();
      
      if (!user) {
        console.log('User not authenticated for student document');
        return new Response(JSON.stringify({ error: 'Authentication required' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check if user can access this student's document
      const { data: canAccess, error: accessError } = await supabaseClient
        .rpc('can_access_student_document', { 
          p_accessor_id: user.id, 
          p_student_id: entityId 
        });

      if (accessError || !canAccess) {
        console.error('Access denied to student document:', accessError);
        return new Response(JSON.stringify({ error: 'Access denied - not authorized to view this document' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Access granted to student document');

      // Log the access
      try {
        await supabaseClient.rpc('log_storage_access', {
          p_bucket_id: bucketName,
          p_object_path: storagePath,
          p_action: 'download',
          p_metadata: { student_id: entityId }
        });
      } catch (e) {
        console.error('Error logging access:', e);
      }
    }

    // Fetch file from Supabase Storage
    const { data: fileData, error: fileError } = await supabaseClient.storage
      .from(bucketName)
      .download(storagePath);

    if (fileError) {
      console.error('Error downloading file:', fileError);
      return new Response(JSON.stringify({ error: 'File not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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

    console.log('File found from', bucketName, 'streaming response');

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
