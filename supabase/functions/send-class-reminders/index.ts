import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get sessions starting in next 15 minutes
    const now = new Date();
    const fifteenMinutesLater = new Date(now.getTime() + 15 * 60000);
    
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
    const futureTime = fifteenMinutesLater.toTimeString().split(' ')[0].substring(0, 5);

    const { data: upcomingSessions, error: sessionsError } = await supabaseAdmin
      .from('class_sessions')
      .select(`
        *,
        courses!inner(title)
      `)
      .eq('session_date', today)
      .gte('start_time', currentTime)
      .lte('start_time', futureTime)
      .eq('status', 'scheduled');

    if (sessionsError) throw sessionsError;

    console.log(`Found ${upcomingSessions?.length || 0} upcoming sessions`);

    let notificationCount = 0;

    for (const session of upcomingSessions || []) {
      // Get enrolled students
      const { data: enrollments, error: enrollError } = await supabaseAdmin
        .from('course_enrollments')
        .select('user_id')
        .eq('course_id', session.course_id)
        .eq('status', 'active');

      if (enrollError) {
        console.error(`Error fetching enrollments for session ${session.id}:`, enrollError);
        continue;
      }

      // Create notifications for each enrolled student
      for (const enrollment of enrollments || []) {
        const { error: notifError } = await supabaseAdmin
          .from('notifications')
          .insert({
            user_id: enrollment.user_id,
            title: 'Cours dans 15 minutes',
            message: `Le cours "${session.courses.title}" commence à ${session.start_time}${session.room_location ? ` en salle ${session.room_location}` : ''}.`,
            type: 'class_reminder',
            action_url: '/student?tab=schedule'
          });

        if (!notifError) {
          notificationCount++;
        }
      }
    }

    console.log(`✅ Sent ${notificationCount} class reminder notifications`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sessionsProcessed: upcomingSessions?.length || 0,
        notificationsSent: notificationCount
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in send-class-reminders:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});