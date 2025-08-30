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
      alerts: {
        Row: {
          action_url: string | null
          created_at: string
          expires_at: string | null
          id: string
          message: string
          metadata: Json | null
          priority: string | null
          scheduled_for: string | null
          sent_at: string | null
          status: string | null
          subscription_id: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          priority?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          subscription_id?: string | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          priority?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          subscription_id?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      course_tags: {
        Row: {
          course_id: string
          created_at: string
          id: string
          tag: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          tag: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_tags_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string
          created_at: string
          description: string
          duration: string
          id: string
          instructor: string
          is_live: boolean | null
          level: string
          original_price: number | null
          price: number
          rating: number
          student_count: number
          thumbnail: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          duration: string
          id?: string
          instructor: string
          is_live?: boolean | null
          level: string
          original_price?: number | null
          price: number
          rating?: number
          student_count?: number
          thumbnail: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          duration?: string
          id?: string
          instructor?: string
          is_live?: boolean | null
          level?: string
          original_price?: number | null
          price?: number
          rating?: number
          student_count?: number
          thumbnail?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      curriculum_items: {
        Row: {
          course_id: string
          created_at: string
          duration: string
          id: string
          is_preview: boolean | null
          order_index: number
          title: string
        }
        Insert: {
          course_id: string
          created_at?: string
          duration: string
          id?: string
          is_preview?: boolean | null
          order_index: number
          title: string
        }
        Update: {
          course_id?: string
          created_at?: string
          duration?: string
          id?: string
          is_preview?: boolean | null
          order_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_items_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      ingest_uploads: {
        Row: {
          created_at: string
          error_details: Json | null
          failed_rows: number | null
          file_size: number | null
          filename: string
          id: string
          metadata: Json | null
          mime_type: string | null
          processed_rows: number | null
          status: string | null
          successful_rows: number | null
          total_rows: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          error_details?: Json | null
          failed_rows?: number | null
          file_size?: number | null
          filename: string
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          processed_rows?: number | null
          status?: string | null
          successful_rows?: number | null
          total_rows?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          error_details?: Json | null
          failed_rows?: number | null
          file_size?: number | null
          filename?: string
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          processed_rows?: number | null
          status?: string | null
          successful_rows?: number | null
          total_rows?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      merchants: {
        Row: {
          cancel_url: string | null
          category_id: string | null
          created_at: string
          domain: string | null
          id: string
          logo_url: string | null
          name: string
          name_normalized: string
          support_url: string | null
          updated_at: string
        }
        Insert: {
          cancel_url?: string | null
          category_id?: string | null
          created_at?: string
          domain?: string | null
          id?: string
          logo_url?: string | null
          name: string
          name_normalized: string
          support_url?: string | null
          updated_at?: string
        }
        Update: {
          cancel_url?: string | null
          category_id?: string | null
          created_at?: string
          domain?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          name_normalized?: string
          support_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchants_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      saving_goals: {
        Row: {
          created_at: string
          current_amount: number | null
          description: string | null
          id: string
          status: string | null
          target_amount: number
          target_date: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_amount?: number | null
          description?: string | null
          id?: string
          status?: string | null
          target_amount: number
          target_date?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_amount?: number | null
          description?: string | null
          id?: string
          status?: string | null
          target_amount?: number
          target_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      savings_records: {
        Row: {
          action_date: string
          amount: number
          created_at: string
          currency: string | null
          description: string
          goal_id: string | null
          id: string
          subscription_id: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_date?: string
          amount: number
          created_at?: string
          currency?: string | null
          description: string
          goal_id?: string | null
          id?: string
          subscription_id?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_date?: string
          amount?: number
          created_at?: string
          currency?: string | null
          description?: string
          goal_id?: string | null
          id?: string
          subscription_id?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "savings_records_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "saving_goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "savings_records_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          billing_cycle: string
          category: string
          category_id: string | null
          created_at: string
          currency: string | null
          description: string | null
          id: string
          last_charged_date: string | null
          logo: string | null
          merchant_id: string | null
          name: string
          next_billing: string | null
          notes: string | null
          price: number
          status: string
          tags: string[] | null
          trial_end_date: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          billing_cycle?: string
          category: string
          category_id?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          last_charged_date?: string | null
          logo?: string | null
          merchant_id?: string | null
          name: string
          next_billing?: string | null
          notes?: string | null
          price: number
          status?: string
          tags?: string[] | null
          trial_end_date?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          billing_cycle?: string
          category?: string
          category_id?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          last_charged_date?: string | null
          logo?: string | null
          merchant_id?: string | null
          name?: string
          next_billing?: string | null
          notes?: string | null
          price?: number
          status?: string
          tags?: string[] | null
          trial_end_date?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string
          currency: string | null
          date_format: string | null
          id: string
          language: string | null
          notifications: Json | null
          privacy: Json | null
          theme: string | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          date_format?: string | null
          id?: string
          language?: string | null
          notifications?: Json | null
          privacy?: Json | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          date_format?: string | null
          id?: string
          language?: string | null
          notifications?: Json | null
          privacy?: Json | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
