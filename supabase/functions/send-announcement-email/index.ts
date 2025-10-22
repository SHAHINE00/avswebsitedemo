import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnnouncementEmailRequest {
  announcementId: string;
  courseId: string;
  title: string;
  content: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { announcementId, courseId, title, content }: AnnouncementEmailRequest = await req.json();

    // Get enrolled students
    const { data: enrollments, error: enrollError } = await supabaseClient
      .from("course_enrollments")
      .select("user_id")
      .eq("course_id", courseId);

    if (enrollError) {
      console.error("Error fetching enrollments:", enrollError);
      throw enrollError;
    }

    if (!enrollments || enrollments.length === 0) {
      console.log("No students enrolled in this course");
      return new Response(
        JSON.stringify({ 
          success: true, 
          notificationsSent: 0,
          message: "No students enrolled"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    console.log(`Found ${enrollments.length} enrolled students`);

    // Get course info
    const { data: course } = await supabaseClient
      .from("courses")
      .select("title")
      .eq("id", courseId)
      .single();

    // Create notifications for all students
    const notifications = enrollments?.map((enrollment: any) => ({
      user_id: enrollment.user_id,
      title: `Nouvelle annonce: ${title}`,
      message: `Nouvelle annonce pour le cours ${course?.title}: ${content.substring(0, 100)}...`,
      type: "announcement",
      action_url: `/learn/${courseId}`
    })) || [];

    if (notifications.length > 0) {
      const { error: notifError } = await supabaseClient
        .from("notifications")
        .insert(notifications);

      if (notifError) {
        console.error("Error creating notifications:", notifError);
      }
    }

    console.log(`Sent ${notifications.length} notifications for announcement ${announcementId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        notificationsSent: notifications.length 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error in send-announcement-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
