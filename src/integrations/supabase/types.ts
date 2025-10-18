export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_activity_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      analytics_data: {
        Row: {
          created_at: string
          date: string
          hour: number | null
          id: string
          metadata: Json | null
          metric_name: string
          metric_type: string
          value: number
        }
        Insert: {
          created_at?: string
          date?: string
          hour?: number | null
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_type: string
          value: number
        }
        Update: {
          created_at?: string
          date?: string
          hour?: number | null
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_type?: string
          value?: number
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          appointment_type: string
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          message: string | null
          phone: string
          status: string
          subject: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          appointment_type: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          message?: string | null
          phone: string
          status?: string
          subject?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          appointment_type?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          message?: string | null
          phone?: string
          status?: string
          subject?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      approval_notifications: {
        Row: {
          admin_id: string | null
          email_sent: boolean
          id: string
          metadata: Json | null
          notification_type: string
          pending_user_id: string
          sent_at: string
        }
        Insert: {
          admin_id?: string | null
          email_sent?: boolean
          id?: string
          metadata?: Json | null
          notification_type: string
          pending_user_id: string
          sent_at?: string
        }
        Update: {
          admin_id?: string | null
          email_sent?: boolean
          id?: string
          metadata?: Json | null
          notification_type?: string
          pending_user_id?: string
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_notifications_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_notifications_pending_user_id_fkey"
            columns: ["pending_user_id"]
            isOneToOne: false
            referencedRelation: "pending_users"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          attendance_date: string
          course_id: string
          created_at: string | null
          id: string
          notes: string | null
          professor_id: string
          status: string
          student_id: string
          updated_at: string | null
        }
        Insert: {
          attendance_date: string
          course_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          professor_id: string
          status: string
          student_id: string
          updated_at?: string | null
        }
        Update: {
          attendance_date?: string
          course_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          professor_id?: string
          status?: string
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
        ]
      }
      automated_tasks: {
        Row: {
          created_at: string | null
          executed_at: string | null
          id: string
          metadata: Json | null
          scheduled_for: string | null
          task_status: string
          task_type: string
        }
        Insert: {
          created_at?: string | null
          executed_at?: string | null
          id?: string
          metadata?: Json | null
          scheduled_for?: string | null
          task_status?: string
          task_type: string
        }
        Update: {
          created_at?: string | null
          executed_at?: string | null
          id?: string
          metadata?: Json | null
          scheduled_for?: string | null
          task_status?: string
          task_type?: string
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          status: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          status?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          category_id: string
          content: string
          created_at: string
          excerpt: string
          featured_image_url: string | null
          id: string
          published_at: string | null
          slug: string
          status: string
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author_id: string
          category_id: string
          content: string
          created_at?: string
          excerpt: string
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author_id?: string
          category_id?: string
          content?: string
          created_at?: string
          excerpt?: string
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_blog_posts_author"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          certificate_data: Json
          certificate_type: string
          course_id: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          issued_date: string
          title: string
          user_id: string
          verification_code: string
        }
        Insert: {
          certificate_data: Json
          certificate_type: string
          course_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          issued_date?: string
          title: string
          user_id: string
          verification_code: string
        }
        Update: {
          certificate_data?: Json
          certificate_type?: string
          course_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          issued_date?: string
          title?: string
          user_id?: string
          verification_code?: string
        }
        Relationships: []
      }
      communication_log: {
        Row: {
          communication_type: string
          created_at: string
          direction: string
          id: string
          message: string
          metadata: Json | null
          sent_by: string | null
          status: string | null
          subject: string | null
          user_id: string
        }
        Insert: {
          communication_type: string
          created_at?: string
          direction: string
          id?: string
          message: string
          metadata?: Json | null
          sent_by?: string | null
          status?: string | null
          subject?: string | null
          user_id: string
        }
        Update: {
          communication_type?: string
          created_at?: string
          direction?: string
          id?: string
          message?: string
          metadata?: Json | null
          sent_by?: string | null
          status?: string | null
          subject?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "communication_log_sent_by_fkey"
            columns: ["sent_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_announcements: {
        Row: {
          content: string
          course_id: string
          created_at: string
          created_by: string
          id: string
          is_pinned: boolean
          priority: string
          professor_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          course_id: string
          created_at?: string
          created_by: string
          id?: string
          is_pinned?: boolean
          priority?: string
          professor_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          course_id?: string
          created_at?: string
          created_by?: string
          id?: string
          is_pinned?: boolean
          priority?: string
          professor_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_announcements_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_announcements_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
        ]
      }
      course_bookmarks: {
        Row: {
          course_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      course_enrollments: {
        Row: {
          completion_date: string | null
          course_id: string
          enrolled_at: string
          id: string
          last_accessed_at: string | null
          progress_percentage: number | null
          status: string
          user_id: string
        }
        Insert: {
          completion_date?: string | null
          course_id: string
          enrolled_at?: string
          id?: string
          last_accessed_at?: string | null
          progress_percentage?: number | null
          status?: string
          user_id: string
        }
        Update: {
          completion_date?: string | null
          course_id?: string
          enrolled_at?: string
          id?: string
          last_accessed_at?: string | null
          progress_percentage?: number | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_lessons: {
        Row: {
          content: string
          course_id: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_preview: boolean
          lesson_order: number
          status: string
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content: string
          course_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean
          lesson_order: number
          status?: string
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content?: string
          course_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean
          lesson_order?: number
          status?: string
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_materials: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          download_count: number
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          is_public: boolean
          lesson_id: string | null
          title: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          download_count?: number
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          is_public?: boolean
          lesson_id?: string | null
          title: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          download_count?: number
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          is_public?: boolean
          lesson_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_materials_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_materials_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      course_progress_detailed: {
        Row: {
          course_id: string
          id: string
          lesson_id: string | null
          metadata: Json | null
          progress_type: string
          progress_value: number | null
          recorded_at: string
          time_spent_minutes: number | null
          user_id: string
        }
        Insert: {
          course_id: string
          id?: string
          lesson_id?: string | null
          metadata?: Json | null
          progress_type: string
          progress_value?: number | null
          recorded_at?: string
          time_spent_minutes?: number | null
          user_id: string
        }
        Update: {
          course_id?: string
          id?: string
          lesson_id?: string | null
          metadata?: Json | null
          progress_type?: string
          progress_value?: number | null
          recorded_at?: string
          time_spent_minutes?: number | null
          user_id?: string
        }
        Relationships: []
      }
      course_reviews: {
        Row: {
          course_id: string
          created_at: string
          id: string
          rating: number
          review_text: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          rating: number
          review_text?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          rating?: number
          review_text?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          button_text_color: string | null
          certification_provider_logo: string | null
          certification_provider_name: string | null
          certification_recognition: string | null
          created_at: string | null
          created_by: string | null
          diploma: string | null
          display_order: number | null
          duration: string | null
          feature1: string | null
          feature2: string | null
          floating_color1: string | null
          floating_color2: string | null
          gradient_from: string | null
          gradient_to: string | null
          icon: string | null
          id: string
          last_viewed_at: string | null
          link_to: string | null
          modules: string | null
          status: Database["public"]["Enums"]["course_status"] | null
          subtitle: string | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          button_text_color?: string | null
          certification_provider_logo?: string | null
          certification_provider_name?: string | null
          certification_recognition?: string | null
          created_at?: string | null
          created_by?: string | null
          diploma?: string | null
          display_order?: number | null
          duration?: string | null
          feature1?: string | null
          feature2?: string | null
          floating_color1?: string | null
          floating_color2?: string | null
          gradient_from?: string | null
          gradient_to?: string | null
          icon?: string | null
          id?: string
          last_viewed_at?: string | null
          link_to?: string | null
          modules?: string | null
          status?: Database["public"]["Enums"]["course_status"] | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          button_text_color?: string | null
          certification_provider_logo?: string | null
          certification_provider_name?: string | null
          certification_recognition?: string | null
          created_at?: string | null
          created_by?: string | null
          diploma?: string | null
          display_order?: number | null
          duration?: string | null
          feature1?: string | null
          feature2?: string | null
          floating_color1?: string | null
          floating_color2?: string | null
          gradient_from?: string | null
          gradient_to?: string | null
          icon?: string | null
          id?: string
          last_viewed_at?: string | null
          link_to?: string | null
          modules?: string | null
          status?: Database["public"]["Enums"]["course_status"] | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      email_campaigns: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          scheduled_at: string | null
          sent_at: string | null
          status: string | null
          subject: string
          template_type: string | null
          total_clicked: number | null
          total_opened: number | null
          total_recipients: number | null
          total_sent: number | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
          template_type?: string | null
          total_clicked?: number | null
          total_opened?: number | null
          total_recipients?: number | null
          total_sent?: number | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
          template_type?: string | null
          total_clicked?: number | null
          total_opened?: number | null
          total_recipients?: number | null
          total_sent?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      email_stats: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          subscriber_email: string
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          subscriber_email: string
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          subscriber_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_stats_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          body: string
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          subject: string
          template_type: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          body: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          subject: string
          template_type?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          body?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          subject?: string
          template_type?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      grades: {
        Row: {
          assignment_name: string
          comment: string | null
          course_id: string
          created_at: string | null
          grade: number
          graded_at: string | null
          id: string
          max_grade: number | null
          professor_id: string
          student_id: string
          updated_at: string | null
        }
        Insert: {
          assignment_name: string
          comment?: string | null
          course_id: string
          created_at?: string | null
          grade: number
          graded_at?: string | null
          id?: string
          max_grade?: number | null
          professor_id: string
          student_id: string
          updated_at?: string | null
        }
        Update: {
          assignment_name?: string
          comment?: string | null
          course_id?: string
          created_at?: string | null
          grade?: number
          graded_at?: string | null
          id?: string
          max_grade?: number | null
          professor_id?: string
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grades_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          due_date: string | null
          email_sent_at: string | null
          id: string
          invoice_date: string
          invoice_number: string
          metadata: Json | null
          pdf_url: string | null
          status: string
          tax_amount: number
          total_amount: number
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date?: string | null
          email_sent_at?: string | null
          id?: string
          invoice_date?: string
          invoice_number: string
          metadata?: Json | null
          pdf_url?: string | null
          status?: string
          tax_amount?: number
          total_amount: number
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string | null
          email_sent_at?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string
          metadata?: Json | null
          pdf_url?: string | null
          status?: string
          tax_amount?: number
          total_amount?: number
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_paths: {
        Row: {
          created_at: string
          description: string | null
          difficulty_level: string
          estimated_duration_weeks: number | null
          id: string
          path_data: Json
          progress_percentage: number
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty_level?: string
          estimated_duration_weeks?: number | null
          id?: string
          path_data: Json
          progress_percentage?: number
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty_level?: string
          estimated_duration_weeks?: number | null
          id?: string
          path_data?: Json
          progress_percentage?: number
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lesson_discussions: {
        Row: {
          content: string
          created_at: string
          id: string
          is_pinned: boolean
          lesson_id: string
          likes_count: number
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          lesson_id: string
          likes_count?: number
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          lesson_id?: string
          likes_count?: number
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_discussions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_discussions_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "lesson_discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          is_private: boolean
          lesson_id: string
          note_timestamp: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_private?: boolean
          lesson_id: string
          note_timestamp?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_private?: boolean
          lesson_id?: string
          note_timestamp?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_notes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completion_date: string | null
          created_at: string
          id: string
          is_completed: boolean
          last_accessed_at: string | null
          lesson_id: string
          time_spent_minutes: number | null
          user_id: string
        }
        Insert: {
          completion_date?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          last_accessed_at?: string | null
          lesson_id: string
          time_spent_minutes?: number | null
          user_id: string
        }
        Update: {
          completion_date?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          last_accessed_at?: string | null
          lesson_id?: string
          time_spent_minutes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string
          email_notifications: Json
          id: string
          notification_frequency: string
          push_notifications: Json
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: Json
          id?: string
          notification_frequency?: string
          push_notifications?: Json
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: Json
          id?: string
          notification_frequency?: string
          push_notifications?: Json
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_read: boolean
          message: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message: string
          read_at?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_plans: {
        Row: {
          course_id: string | null
          created_at: string
          id: string
          installments: Json
          notes: string | null
          paid_amount: number
          remaining_amount: number | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          id?: string
          installments?: Json
          notes?: string | null
          paid_amount?: number
          remaining_amount?: number | null
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          id?: string
          installments?: Json
          notes?: string | null
          paid_amount?: number
          remaining_amount?: number | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_plans_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          course_id: string | null
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          notes: string | null
          paid_at: string | null
          payment_method: string
          payment_status: string
          stripe_payment_id: string | null
          stripe_session_id: string | null
          transaction_ref: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          course_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          paid_at?: string | null
          payment_method: string
          payment_status?: string
          stripe_payment_id?: string | null
          stripe_session_id?: string | null
          transaction_ref?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          course_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          paid_at?: string | null
          payment_method?: string
          payment_status?: string
          stripe_payment_id?: string | null
          stripe_session_id?: string | null
          transaction_ref?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pending_users: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          email: string
          encrypted_password: string
          formation_domaine: string | null
          formation_programme: string | null
          formation_programme_title: string | null
          formation_tag: string | null
          formation_type: string | null
          full_name: string
          id: string
          metadata: Json | null
          phone: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["approval_status"]
          submitted_at: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email: string
          encrypted_password: string
          formation_domaine?: string | null
          formation_programme?: string | null
          formation_programme_title?: string | null
          formation_tag?: string | null
          formation_type?: string | null
          full_name: string
          id?: string
          metadata?: Json | null
          phone?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email?: string
          encrypted_password?: string
          formation_domaine?: string | null
          formation_programme?: string | null
          formation_programme_title?: string | null
          formation_tag?: string | null
          formation_type?: string | null
          full_name?: string
          id?: string
          metadata?: Json | null
          phone?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          submitted_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pending_users_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      professors: {
        Row: {
          bio: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          photo_url: string | null
          specialization: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          phone?: string | null
          photo_url?: string | null
          specialization?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          photo_url?: string | null
          specialization?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          academic_level: string | null
          address: string | null
          bio: string | null
          career_goals: string | null
          city: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          expected_completion: string | null
          formation_domaine: string | null
          formation_programme: string | null
          formation_tag: string | null
          formation_type: string | null
          full_name: string | null
          id: string
          last_activity_at: string | null
          phone: string | null
          postal_code: string | null
          previous_education: string | null
          status: Database["public"]["Enums"]["approval_status"] | null
          student_status: string | null
          updated_at: string | null
        }
        Insert: {
          academic_level?: string | null
          address?: string | null
          bio?: string | null
          career_goals?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          expected_completion?: string | null
          formation_domaine?: string | null
          formation_programme?: string | null
          formation_tag?: string | null
          formation_type?: string | null
          full_name?: string | null
          id: string
          last_activity_at?: string | null
          phone?: string | null
          postal_code?: string | null
          previous_education?: string | null
          status?: Database["public"]["Enums"]["approval_status"] | null
          student_status?: string | null
          updated_at?: string | null
        }
        Update: {
          academic_level?: string | null
          address?: string | null
          bio?: string | null
          career_goals?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          expected_completion?: string | null
          formation_domaine?: string | null
          formation_programme?: string | null
          formation_tag?: string | null
          formation_type?: string | null
          full_name?: string | null
          id?: string
          last_activity_at?: string | null
          phone?: string | null
          postal_code?: string | null
          previous_education?: string | null
          status?: Database["public"]["Enums"]["approval_status"] | null
          student_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          answers: Json
          completed_at: string | null
          id: string
          max_score: number | null
          passed: boolean | null
          quiz_id: string
          score: number | null
          started_at: string
          time_spent_seconds: number | null
          user_id: string
        }
        Insert: {
          answers: Json
          completed_at?: string | null
          id?: string
          max_score?: number | null
          passed?: boolean | null
          quiz_id: string
          score?: number | null
          started_at?: string
          time_spent_seconds?: number | null
          user_id: string
        }
        Update: {
          answers?: Json
          completed_at?: string | null
          id?: string
          max_score?: number | null
          passed?: boolean | null
          quiz_id?: string
          score?: number | null
          started_at?: string
          time_spent_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_answer: string
          created_at: string
          explanation: string | null
          id: string
          options: Json | null
          points: number
          question_order: number
          question_text: string
          question_type: string
          quiz_id: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          explanation?: string | null
          id?: string
          options?: Json | null
          points?: number
          question_order: number
          question_text: string
          question_type?: string
          quiz_id: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          explanation?: string | null
          id?: string
          options?: Json | null
          points?: number
          question_order?: number
          question_text?: string
          question_type?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          lesson_id: string
          max_attempts: number | null
          passing_score: number | null
          time_limit_minutes: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          lesson_id: string
          max_attempts?: number | null
          passing_score?: number | null
          time_limit_minutes?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          lesson_id?: string
          max_attempts?: number | null
          passing_score?: number | null
          time_limit_minutes?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      refunds: {
        Row: {
          amount: number
          created_at: string
          id: string
          notes: string | null
          processed_at: string | null
          processed_by: string | null
          reason: string | null
          requested_at: string
          status: string
          stripe_refund_id: string | null
          transaction_id: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          requested_at?: string
          status?: string
          stripe_refund_id?: string | null
          transaction_id: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          requested_at?: string
          status?: string
          stripe_refund_id?: string | null
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "refunds_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refunds_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refunds_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      report_templates: {
        Row: {
          config: Json
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          config: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      section_visibility: {
        Row: {
          created_at: string
          created_by: string | null
          display_order: number | null
          id: string
          is_visible: boolean
          page_name: string
          section_description: string | null
          section_key: string
          section_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          display_order?: number | null
          id?: string
          is_visible?: boolean
          page_name: string
          section_description?: string | null
          section_key: string
          section_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          display_order?: number | null
          id?: string
          is_visible?: boolean
          page_name?: string
          section_description?: string | null
          section_key?: string
          section_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "section_visibility_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_cohorts: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          enrollment_end_date: string | null
          enrollment_start_date: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          enrollment_end_date?: string | null
          enrollment_start_date?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          enrollment_end_date?: string | null
          enrollment_start_date?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      student_documents: {
        Row: {
          created_at: string
          document_name: string
          document_type: string
          file_size: number | null
          file_url: string
          id: string
          is_verified: boolean | null
          metadata: Json | null
          mime_type: string | null
          updated_at: string
          uploaded_by: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          document_name: string
          document_type: string
          file_size?: number | null
          file_url: string
          id?: string
          is_verified?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          updated_at?: string
          uploaded_by?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          document_name?: string
          document_type?: string
          file_size?: number | null
          file_url?: string
          id?: string
          is_verified?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          updated_at?: string
          uploaded_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_notes: {
        Row: {
          created_at: string
          created_by: string
          id: string
          is_private: boolean | null
          note_text: string
          note_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          is_private?: boolean | null
          note_text: string
          note_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          is_private?: boolean | null
          note_text?: string
          note_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_parents: {
        Row: {
          created_at: string
          id: string
          parent_email: string | null
          parent_name: string | null
          parent_phone: string | null
          parent_relationship: string | null
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          parent_email?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          parent_relationship?: string | null
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          parent_email?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          parent_relationship?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_parents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_tags: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          tag_color: string | null
          tag_name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          tag_color?: string | null
          tag_name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          tag_color?: string | null
          tag_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_tags_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      study_goals: {
        Row: {
          created_at: string
          current_value: number
          goal_type: string
          id: string
          period_end: string
          period_start: string
          status: string
          target_value: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_value?: number
          goal_type: string
          id?: string
          period_end: string
          period_start: string
          status?: string
          target_value: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_value?: number
          goal_type?: string
          id?: string
          period_end?: string
          period_start?: string
          status?: string
          target_value?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          course_id: string | null
          created_at: string
          duration_minutes: number
          ended_at: string | null
          id: string
          lesson_id: string | null
          metadata: Json | null
          session_type: string
          started_at: string
          user_id: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          duration_minutes?: number
          ended_at?: string | null
          id?: string
          lesson_id?: string | null
          metadata?: Json | null
          session_type?: string
          started_at?: string
          user_id: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          duration_minutes?: number
          ended_at?: string | null
          id?: string
          lesson_id?: string | null
          metadata?: Json | null
          session_type?: string
          started_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          formation_domaine: string | null
          formation_programme: string | null
          formation_programme_title: string | null
          formation_tag: string | null
          formation_type: string | null
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          formation_domaine?: string | null
          formation_programme?: string | null
          formation_programme_title?: string | null
          formation_tag?: string | null
          formation_type?: string | null
          full_name: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          formation_domaine?: string | null
          formation_programme?: string | null
          formation_programme_title?: string | null
          formation_tag?: string | null
          formation_type?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      system_analytics: {
        Row: {
          created_at: string
          date: string
          id: string
          metric_data: Json | null
          metric_name: string
          metric_value: number
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          metric_data?: Json | null
          metric_name: string
          metric_value: number
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          metric_data?: Json | null
          metric_name?: string
          metric_value?: number
        }
        Relationships: []
      }
      system_monitoring: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          metric_name: string
          status: string | null
          threshold_critical: number | null
          threshold_warning: number | null
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_name: string
          status?: string | null
          threshold_critical?: number | null
          threshold_warning?: number | null
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_name?: string
          status?: string | null
          threshold_critical?: number | null
          threshold_warning?: number | null
          value?: number
        }
        Relationships: []
      }
      teaching_assignments: {
        Row: {
          assigned_at: string | null
          course_id: string
          created_at: string | null
          id: string
          professor_id: string
        }
        Insert: {
          assigned_at?: string | null
          course_id: string
          created_at?: string | null
          id?: string
          professor_id: string
        }
        Update: {
          assigned_at?: string | null
          course_id?: string
          created_at?: string | null
          id?: string
          professor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teaching_assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teaching_assignments_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
        ]
      }
      unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      unsubscribes: {
        Row: {
          created_at: string
          email: string
          id: string
          reason: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          reason?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          reason?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achieved_at: string
          achievement_description: string | null
          achievement_title: string
          achievement_type: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          achieved_at?: string
          achievement_description?: string | null
          achievement_title: string
          achievement_type: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          achieved_at?: string
          achievement_description?: string | null
          achievement_title?: string
          achievement_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          achievement_notifications: boolean
          appointment_reminders: boolean
          course_reminders: boolean
          created_at: string
          email_notifications: boolean
          id: string
          newsletter_subscription: boolean
          push_notifications: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          achievement_notifications?: boolean
          appointment_reminders?: boolean
          course_reminders?: boolean
          created_at?: string
          email_notifications?: boolean
          id?: string
          newsletter_subscription?: boolean
          push_notifications?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          achievement_notifications?: boolean
          appointment_reminders?: boolean
          course_reminders?: boolean
          created_at?: string
          email_notifications?: boolean
          id?: string
          newsletter_subscription?: boolean
          push_notifications?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_course_material: {
        Args: {
          p_course_id: string
          p_description?: string
          p_file_size?: number
          p_file_type: string
          p_file_url: string
          p_is_public?: boolean
          p_lesson_id?: string
          p_title: string
        }
        Returns: string
      }
      admin_assign_professor_to_course: {
        Args: { p_course_id: string; p_professor_id: string }
        Returns: string
      }
      admin_create_professor: {
        Args: {
          p_bio?: string
          p_email: string
          p_full_name: string
          p_phone?: string
          p_specialization?: string
        }
        Returns: string
      }
      admin_enroll_user_in_course: {
        Args: { p_course_id: string; p_user_id: string }
        Returns: string
      }
      admin_unenroll_user_from_course: {
        Args: { p_course_id: string; p_user_id: string }
        Returns: undefined
      }
      approve_pending_user: {
        Args: { p_admin_id: string; p_pending_user_id: string }
        Returns: Json
      }
      batch_reorder_sections: {
        Args: { p_page_name: string; p_reorders: Json }
        Returns: undefined
      }
      bulk_demote_users_to_student: {
        Args: { p_user_ids: string[] }
        Returns: Json
      }
      bulk_enroll_users: {
        Args: { p_course_id: string; p_user_ids: string[] }
        Returns: Json
      }
      bulk_promote_users_to_admin: {
        Args: { p_user_ids: string[] }
        Returns: Json
      }
      bulk_unenroll_users: {
        Args: { p_course_id: string; p_user_ids: string[] }
        Returns: Json
      }
      cleanup_security_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_bulk_email_task: {
        Args: {
          p_custom_variables?: Json
          p_template_id: string
          p_user_ids: string[]
        }
        Returns: string
      }
      create_course_announcement: {
        Args: {
          p_content: string
          p_course_id: string
          p_is_pinned?: boolean
          p_priority?: string
          p_title: string
        }
        Returns: string
      }
      create_notification: {
        Args: {
          p_action_url?: string
          p_message: string
          p_title: string
          p_type?: string
          p_user_id: string
        }
        Returns: string
      }
      delete_course_announcement: {
        Args: { p_announcement_id: string }
        Returns: undefined
      }
      delete_course_material: {
        Args: { p_material_id: string }
        Returns: undefined
      }
      delete_grade_record: {
        Args: { p_grade_id: string }
        Returns: undefined
      }
      demote_user_to_user: {
        Args: { p_target_user_id: string }
        Returns: undefined
      }
      enroll_in_course: {
        Args: { p_course_id: string }
        Returns: string
      }
      final_security_check: {
        Args: Record<PropertyKey, never>
        Returns: {
          admin_access: boolean
          anonymous_blocked: boolean
          rls_enabled: boolean
          security_score: string
          table_name: string
        }[]
      }
      generate_certificate: {
        Args: { p_certificate_type?: string; p_course_id: string }
        Returns: string
      }
      generate_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_advanced_analytics: {
        Args: {
          p_end_date?: string
          p_metric_types?: string[]
          p_start_date?: string
        }
        Returns: {
          date: string
          metadata: Json
          metric_name: string
          metric_type: string
          value: number
        }[]
      }
      get_at_risk_students: {
        Args: Record<PropertyKey, never>
        Returns: {
          email: string
          full_name: string
          last_activity: string
          risk_details: Json
          risk_type: string
          user_id: string
        }[]
      }
      get_attendance_statistics: {
        Args: { p_course_id: string }
        Returns: Json
      }
      get_course_attendance: {
        Args: {
          p_course_id: string
          p_end_date?: string
          p_start_date?: string
        }
        Returns: {
          attendance_date: string
          attendance_id: string
          created_at: string
          notes: string
          status: string
          student_id: string
          student_name: string
        }[]
      }
      get_course_gradebook: {
        Args: { p_course_id: string }
        Returns: {
          assignment_name: string
          comment: string
          grade: number
          grade_id: string
          graded_at: string
          max_grade: number
          percentage: number
          student_id: string
          student_name: string
        }[]
      }
      get_course_students: {
        Args: { p_course_id: string }
        Returns: {
          absent_count: number
          average_grade: number
          email: string
          enrolled_at: string
          full_name: string
          present_count: number
          progress_percentage: number
          status: string
          student_id: string
          total_attendance: number
        }[]
      }
      get_dashboard_metrics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_grade_statistics: {
        Args: { p_course_id: string }
        Returns: Json
      }
      get_professor_course_materials: {
        Args: { p_course_id: string }
        Returns: {
          created_at: string
          description: string
          download_count: number
          file_size: number
          file_type: string
          file_url: string
          is_public: boolean
          lesson_id: string
          material_id: string
          title: string
        }[]
      }
      get_professor_dashboard_stats: {
        Args: Record<PropertyKey, never> | { p_professor_id?: string }
        Returns: Json
      }
      get_professor_id: {
        Args: { _user_id?: string }
        Returns: string
      }
      get_revenue_analytics: {
        Args: { p_end_date?: string; p_start_date?: string }
        Returns: Json
      }
      get_student_analytics: {
        Args: { p_end_date?: string; p_start_date?: string }
        Returns: Json
      }
      get_student_detail: {
        Args: { p_course_id: string; p_student_id: string }
        Returns: Json
      }
      get_student_engagement_score: {
        Args: { p_user_id: string }
        Returns: Json
      }
      get_student_financial_summary: {
        Args: { p_user_id: string }
        Returns: Json
      }
      get_student_segments: {
        Args: Record<PropertyKey, never>
        Returns: {
          segment_count: number
          segment_name: string
          student_ids: string[]
        }[]
      }
      get_student_timeline: {
        Args: { p_limit?: number; p_user_id: string }
        Returns: {
          description: string
          event_date: string
          event_id: string
          event_type: string
          metadata: Json
          title: string
        }[]
      }
      get_study_statistics: {
        Args: { p_user_id?: string }
        Returns: Json
      }
      get_system_health: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_enrollments_for_admin: {
        Args: { p_user_id: string }
        Returns: {
          course_id: string
          course_title: string
          enrolled_at: string
          enrollment_id: string
          progress_percentage: number
          status: string
        }[]
      }
      get_user_statistics: {
        Args: { p_user_id: string }
        Returns: Json
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: { _user_id?: string }
        Returns: boolean
      }
      is_professor: {
        Args: { _user_id?: string }
        Returns: boolean
      }
      log_admin_activity: {
        Args: {
          p_action: string
          p_details?: Json
          p_entity_id?: string
          p_entity_type: string
        }
        Returns: undefined
      }
      mark_attendance_bulk: {
        Args: {
          p_attendance_date: string
          p_course_id: string
          p_notes?: string
          p_status: string
          p_student_ids: string[]
        }
        Returns: Json
      }
      mark_notification_read: {
        Args: { p_notification_id: string }
        Returns: undefined
      }
      promote_user_to_admin: {
        Args: { p_target_user_id: string }
        Returns: undefined
      }
      reject_pending_user: {
        Args: {
          p_admin_id: string
          p_pending_user_id: string
          p_rejection_reason?: string
        }
        Returns: Json
      }
      reorder_sections_atomic: {
        Args: {
          p_new_order: number
          p_page_name: string
          p_section_key: string
        }
        Returns: undefined
      }
      reorder_sections_on_page: {
        Args: {
          p_new_order: number
          p_page_name: string
          p_section_key: string
        }
        Returns: undefined
      }
      simple_reorder_section: {
        Args: { p_new_order: number; p_section_key: string }
        Returns: undefined
      }
      test_anonymous_access_blocked: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      track_analytics: {
        Args: {
          p_date?: string
          p_metadata?: Json
          p_metric_name: string
          p_metric_type: string
          p_value: number
        }
        Returns: undefined
      }
      track_study_session: {
        Args: {
          p_course_id: string
          p_duration_minutes?: number
          p_lesson_id?: string
          p_session_type?: string
        }
        Returns: string
      }
      update_appointment_status: {
        Args: { appointment_id: string; new_status: string }
        Returns: undefined
      }
      update_attendance_record: {
        Args: { p_attendance_id: string; p_notes?: string; p_status: string }
        Returns: undefined
      }
      update_course_announcement: {
        Args: {
          p_announcement_id: string
          p_content?: string
          p_is_pinned?: boolean
          p_priority?: string
          p_title?: string
        }
        Returns: undefined
      }
      update_study_goal: {
        Args: { p_goal_id: string; p_target_value: number }
        Returns: undefined
      }
      upsert_grade: {
        Args: {
          p_assignment_name: string
          p_comment?: string
          p_course_id: string
          p_grade: number
          p_max_grade?: number
          p_student_id: string
        }
        Returns: string
      }
      validate_comprehensive_security: {
        Args: Record<PropertyKey, never>
        Returns: {
          issue_type: string
          recommendation: string
          security_level: string
          severity: string
          table_name: string
        }[]
      }
      validate_rls_security: {
        Args: Record<PropertyKey, never>
        Returns: {
          issues: string[]
          security_level: string
          table_name: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "instructor" | "student" | "professor"
      approval_status: "pending" | "approved" | "rejected"
      course_status: "draft" | "published" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "instructor", "student", "professor"],
      approval_status: ["pending", "approved", "rejected"],
      course_status: ["draft", "published", "archived"],
    },
  },
} as const
