import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QRPayload {
  sessionId: string;
  courseId: string;
  expiresAt: string;
}

serve(async (req) => {
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

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const { token } = await req.json();
    
    // Parse and validate QR token
    const payload: QRPayload = JSON.parse(atob(token));
    
    // Check expiration
    if (new Date(payload.expiresAt) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'QR code expired' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify session exists and is active
    const { data: session, error: sessionError } = await supabaseClient
      .from('class_sessions')
      .select('*')
      .eq('id', payload.sessionId)
      .eq('course_id', payload.courseId)
      .single();

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ error: 'Invalid session' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if student is enrolled
    const { data: enrollment } = await supabaseClient
      .from('course_enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', payload.courseId)
      .single();

    if (!enrollment) {
      return new Response(
        JSON.stringify({ error: 'Not enrolled in this course' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark attendance
    const { data: attendance, error: attendanceError } = await supabaseClient
      .from('attendance')
      .upsert({
        student_id: user.id,
        course_id: payload.courseId,
        session_id: payload.sessionId,
        professor_id: session.professor_id,
        attendance_date: session.session_date,
        status: 'present',
        notes: 'Marked via QR code check-in'
      }, {
        onConflict: 'student_id,course_id,attendance_date,session_id'
      })
      .select()
      .single();

    if (attendanceError) {
      console.error('Attendance error:', attendanceError);
      throw attendanceError;
    }

    console.log(`✅ Attendance marked for user ${user.id} in session ${payload.sessionId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Présence enregistrée avec succès',
        session: {
          course_title: session.course_id,
          session_date: session.session_date,
          start_time: session.start_time
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in validate-qr-checkin:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});