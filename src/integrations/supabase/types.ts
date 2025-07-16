export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          lead_id: string | null
          new_value: string | null
          notes: string | null
          old_value: string | null
          user_id: number | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          lead_id?: string | null
          new_value?: string | null
          notes?: string | null
          old_value?: string | null
          user_id?: number | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          lead_id?: string | null
          new_value?: string | null
          notes?: string | null
          old_value?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_datetime: string
          business_timeline: string
          categories: string[]
          created_at: string
          email: string
          full_name: string
          id: string
          investment_ready: boolean
          seen_elyscents: boolean
          status: string
          updated_at: string
          whatsapp_number: string
        }
        Insert: {
          booking_datetime: string
          business_timeline: string
          categories: string[]
          created_at?: string
          email: string
          full_name: string
          id?: string
          investment_ready: boolean
          seen_elyscents: boolean
          status?: string
          updated_at?: string
          whatsapp_number: string
        }
        Update: {
          booking_datetime?: string
          business_timeline?: string
          categories?: string[]
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          investment_ready?: boolean
          seen_elyscents?: boolean
          status?: string
          updated_at?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      brand_tasks: {
        Row: {
          brand_id: string
          completion_date: string | null
          created_at: string
          id: string
          notes: string | null
          status: string
          task_name: string
          task_order: number
          updated_at: string
        }
        Insert: {
          brand_id: string
          completion_date?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          task_name: string
          task_order: number
          updated_at?: string
        }
        Update: {
          brand_id?: string
          completion_date?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          task_name?: string
          task_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_tasks_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          assigned_team_member: string
          brand_name: string
          client_name: string
          client_phone: string
          created_at: string
          estimated_delivery_date: string
          id: string
          notes: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_team_member: string
          brand_name: string
          client_name: string
          client_phone: string
          created_at?: string
          estimated_delivery_date?: string
          id?: string
          notes?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_team_member?: string
          brand_name?: string
          client_name?: string
          client_phone?: string
          created_at?: string
          estimated_delivery_date?: string
          id?: string
          notes?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      commissions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          lead_id: string | null
          paid_at: string | null
          user_id: number | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          lead_id?: string | null
          paid_at?: string | null
          user_id?: number | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          lead_id?: string | null
          paid_at?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "commissions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          category: string | null
          email: string
          id: string
          name: string
          phone: string | null
          submitted_at: string | null
          vision: string | null
        }
        Insert: {
          category?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          submitted_at?: string | null
          vision?: string | null
        }
        Update: {
          category?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          submitted_at?: string | null
          vision?: string | null
        }
        Relationships: []
      }
      front_leads: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      full_applications: {
        Row: {
          build_support: string
          category: string
          city: string
          created_at: string
          email: string
          has_business: string
          id: string
          investment_range: string
          motivation: string
          phone: string
        }
        Insert: {
          build_support: string
          category: string
          city: string
          created_at?: string
          email: string
          has_business: string
          id?: string
          investment_range: string
          motivation: string
          phone: string
        }
        Update: {
          build_support?: string
          category?: string
          city?: string
          created_at?: string
          email?: string
          has_business?: string
          id?: string
          investment_range?: string
          motivation?: string
          phone?: string
        }
        Relationships: []
      }
      invoice_settings: {
        Row: {
          created_at: string | null
          id: string
          logo_url: string | null
          sender_address: string
          sender_email: string
          sender_name: string
          sender_phone: string
          terms: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          sender_address: string
          sender_email: string
          sender_name: string
          sender_phone: string
          terms?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          sender_address?: string
          sender_email?: string
          sender_name?: string
          sender_phone?: string
          terms?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount_due_now: number
          created_at: string | null
          created_by: number | null
          due_date: string
          id: string
          invoice_number: string
          invoice_title: string | null
          invoice_url: string | null
          lead_id: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          amount_due_now: number
          created_at?: string | null
          created_by?: number | null
          due_date: string
          id?: string
          invoice_number: string
          invoice_title?: string | null
          invoice_url?: string | null
          lead_id: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          amount_due_now?: number
          created_at?: string | null
          created_by?: number | null
          due_date?: string
          id?: string
          invoice_number?: string
          invoice_title?: string | null
          invoice_url?: string | null
          lead_id?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: number | null
          build_support: string | null
          category: string | null
          city: string
          commission_amount: number | null
          created_at: string | null
          created_by: number | null
          email: string | null
          has_business: string | null
          has_whatsapped_mehreen: boolean | null
          id: string
          investment_range: string | null
          motivation: string | null
          notes: string | null
          package_chosen: Database["public"]["Enums"]["package_type"] | null
          payment_amount: number | null
          payment_screenshot: string | null
          phone: string
          product_id: string | null
          sample_status: Database["public"]["Enums"]["sample_status"] | null
          source: string
          status: Database["public"]["Enums"]["lead_status"] | null
          submitted_at: string | null
          updated_at: string | null
          whatsapped_by_mehreen_at: string | null
        }
        Insert: {
          assigned_to?: number | null
          build_support?: string | null
          category?: string | null
          city: string
          commission_amount?: number | null
          created_at?: string | null
          created_by?: number | null
          email?: string | null
          has_business?: string | null
          has_whatsapped_mehreen?: boolean | null
          id?: string
          investment_range?: string | null
          motivation?: string | null
          notes?: string | null
          package_chosen?: Database["public"]["Enums"]["package_type"] | null
          payment_amount?: number | null
          payment_screenshot?: string | null
          phone: string
          product_id?: string | null
          sample_status?: Database["public"]["Enums"]["sample_status"] | null
          source: string
          status?: Database["public"]["Enums"]["lead_status"] | null
          submitted_at?: string | null
          updated_at?: string | null
          whatsapped_by_mehreen_at?: string | null
        }
        Update: {
          assigned_to?: number | null
          build_support?: string | null
          category?: string | null
          city?: string
          commission_amount?: number | null
          created_at?: string | null
          created_by?: number | null
          email?: string | null
          has_business?: string | null
          has_whatsapped_mehreen?: boolean | null
          id?: string
          investment_range?: string | null
          motivation?: string | null
          notes?: string | null
          package_chosen?: Database["public"]["Enums"]["package_type"] | null
          payment_amount?: number | null
          payment_screenshot?: string | null
          phone?: string
          product_id?: string | null
          sample_status?: Database["public"]["Enums"]["sample_status"] | null
          source?: string
          status?: Database["public"]["Enums"]["lead_status"] | null
          submitted_at?: string | null
          updated_at?: string | null
          whatsapped_by_mehreen_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      seminar_registrations: {
        Row: {
          age: number
          current_work: string
          email: string
          id: string
          name: string
          phone: string
          submitted_at: string | null
          work_details: string | null
        }
        Insert: {
          age: number
          current_work: string
          email: string
          id?: string
          name: string
          phone: string
          submitted_at?: string | null
          work_details?: string | null
        }
        Update: {
          age?: number
          current_work?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          submitted_at?: string | null
          work_details?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          active: boolean | null
          auth_user_id: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          password_changed: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          temp_password: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          auth_user_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          password_changed?: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          temp_password?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          auth_user_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          password_changed?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          temp_password?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      Users: {
        Row: {
          active: string | null
          auth_user_id: string
          created_at: string | null
          email: string | null
          id: number
          name: string
          password_hash: number | null
          password_set: boolean | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          active?: string | null
          auth_user_id: string
          created_at?: string | null
          email?: string | null
          id?: number
          name: string
          password_hash?: number | null
          password_set?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          active?: string | null
          auth_user_id?: string
          created_at?: string | null
          email?: string | null
          id?: number
          name?: string
          password_hash?: number | null
          password_set?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_user_with_temp_password: {
        Args: {
          user_email: string
          user_name: string
          user_role: Database["public"]["Enums"]["user_role"]
          temp_pass?: string
        }
        Returns: Json
      }
      get_next_assignee: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
    }
    Enums: {
      lead_status:
        | "New"
        | "Interested"
        | "Not Interested"
        | "Forwarded to Naba"
        | "Not Qualified"
        | "Qualified - Starter"
        | "Qualified - Growth"
        | "Closed"
        | "Dropped"
        | "In Follow-Up"
        | "Forwarded to Arbaz"
      package_type: "Starter" | "Growth"
      sample_status: "Sent" | "Visited" | "Not Sent"
      user_role:
        | "admin"
        | "mehreen"
        | "naba"
        | "arbaz"
        | "SuperAdmin"
        | "OutreachAgent"
        | "QualifyingAgent"
        | "LeadCloser"
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
      lead_status: [
        "New",
        "Interested",
        "Not Interested",
        "Forwarded to Naba",
        "Not Qualified",
        "Qualified - Starter",
        "Qualified - Growth",
        "Closed",
        "Dropped",
        "In Follow-Up",
        "Forwarded to Arbaz",
      ],
      package_type: ["Starter", "Growth"],
      sample_status: ["Sent", "Visited", "Not Sent"],
      user_role: [
        "admin",
        "mehreen",
        "naba",
        "arbaz",
        "SuperAdmin",
        "OutreachAgent",
        "QualifyingAgent",
        "LeadCloser",
      ],
    },
  },
} as const
