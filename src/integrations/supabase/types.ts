export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      courses: {
        Row: {
          button_text_color: string | null
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
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_admin_role: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_advanced_analytics: {
        Args: {
          p_start_date?: string
          p_end_date?: string
          p_metric_types?: string[]
        }
        Returns: {
          date: string
          metric_type: string
          metric_name: string
          value: number
          metadata: Json
        }[]
      }
      get_dashboard_metrics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_system_health: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      log_admin_activity: {
        Args: {
          p_action: string
          p_entity_type: string
          p_entity_id?: string
          p_details?: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      course_status: "draft" | "published" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      course_status: ["draft", "published", "archived"],
    },
  },
} as const
