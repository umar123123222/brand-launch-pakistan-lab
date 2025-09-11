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
        Relationships: []
      }
      addons: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          payment_type: Database["public"]["Enums"]["payment_type"]
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          payment_type?: Database["public"]["Enums"]["payment_type"]
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          payment_type?: Database["public"]["Enums"]["payment_type"]
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      agent_capacity_tracking: {
        Row: {
          agent_id: string
          booking_count: number
          created_at: string
          id: string
          tracking_date: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          booking_count?: number
          created_at?: string
          id?: string
          tracking_date: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          booking_count?: number
          created_at?: string
          id?: string
          tracking_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      agent_schedules: {
        Row: {
          created_at: string
          day_of_week: number
          duty_end_time: string
          duty_start_time: string
          id: string
          is_active: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          duty_end_time: string
          duty_start_time: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          duty_end_time?: string
          duty_start_time?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      availability_slots: {
        Row: {
          created_at: string
          end_time: string
          id: string
          is_booked: boolean
          start_time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_time: string
          id?: string
          is_booked?: boolean
          start_time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: string
          is_booked?: boolean
          start_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      booking_assignments: {
        Row: {
          assigned_agent_id: string
          assignment_date: string
          assignment_time: string
          booking_id: string
          created_at: string
          id: string
        }
        Insert: {
          assigned_agent_id: string
          assignment_date: string
          assignment_time: string
          booking_id: string
          created_at?: string
          id?: string
        }
        Update: {
          assigned_agent_id?: string
          assignment_date?: string
          assignment_time?: string
          booking_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_assignments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_form_submissions: {
        Row: {
          "Booking Date PKT": string | null
          booking_datetime: string
          business_timeline: string
          categories: string[]
          "Created Date PKT": string | null
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
          "Booking Date PKT"?: string | null
          booking_datetime: string
          business_timeline: string
          categories: string[]
          "Created Date PKT"?: string | null
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
          "Booking Date PKT"?: string | null
          booking_datetime?: string
          business_timeline?: string
          categories?: string[]
          "Created Date PKT"?: string | null
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
      bookings: {
        Row: {
          "Booking Date PKT": string | null
          booking_datetime: string
          business_timeline: string
          categories: string[]
          "Created Date PKT": string | null
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
          "Booking Date PKT"?: string | null
          booking_datetime: string
          business_timeline: string
          categories: string[]
          "Created Date PKT"?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          investment_ready: boolean
          seen_elyscents: boolean
          status?: string
          updated_at?: string
          whatsapp_number: string
        }
        Update: {
          "Booking Date PKT"?: string | null
          booking_datetime?: string
          business_timeline?: string
          categories?: string[]
          "Created Date PKT"?: string | null
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
      bookings_elevate: {
        Row: {
          agenda: string | null
          brand_name: string
          contact_name: string
          created_at: string
          email: string
          id: string
          lead_id: string | null
          phone: string | null
          slot_id: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          agenda?: string | null
          brand_name: string
          contact_name: string
          created_at?: string
          email: string
          id?: string
          lead_id?: string | null
          phone?: string | null
          slot_id?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          agenda?: string | null
          brand_name?: string
          contact_name?: string
          created_at?: string
          email?: string
          id?: string
          lead_id?: string | null
          phone?: string | null
          slot_id?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_elevate_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_elevate"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_elevate_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "availability_slots"
            referencedColumns: ["id"]
          },
        ]
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
      categories: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      checklist_templates: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          name: string
          required_role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          required_role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          required_role?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_activity_log: {
        Row: {
          changed_at: string
          changed_by: string | null
          changed_by_role: string | null
          client_id: string
          field_name: string
          id: string
          new_value: string | null
          old_value: string | null
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          changed_by_role?: string | null
          client_id: string
          field_name: string
          id?: string
          new_value?: string | null
          old_value?: string | null
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          changed_by_role?: string | null
          client_id?: string
          field_name?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_activity_log_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_addons: {
        Row: {
          addon_id: string
          client_id: string
          created_at: string
          id: string
          quantity: number
          updated_at: string
        }
        Insert: {
          addon_id: string
          client_id: string
          created_at?: string
          id?: string
          quantity?: number
          updated_at?: string
        }
        Update: {
          addon_id?: string
          client_id?: string
          created_at?: string
          id?: string
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_addons_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "addons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_addons_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_auth: {
        Row: {
          client_id: string
          created_at: string
          email: string
          id: string
          is_active: boolean
          last_login: string | null
          password_hash: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          password_hash: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          password_hash?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_auth_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_checklist_progress: {
        Row: {
          checklist_template_id: string
          client_id: string
          completed_at: string | null
          completed_by: string | null
          created_at: string
          id: string
          is_completed: boolean
          notes: string | null
          updated_at: string
        }
        Insert: {
          checklist_template_id: string
          client_id: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          notes?: string | null
          updated_at?: string
        }
        Update: {
          checklist_template_id?: string
          client_id?: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_checklist_progress_checklist_template_id_fkey"
            columns: ["checklist_template_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_checklist_progress_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_notes: {
        Row: {
          author_id: string | null
          author_name: string | null
          client_id: string
          created_at: string | null
          created_by: string | null
          id: string
          note: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          client_id: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          note: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          client_id?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          note?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_packaging: {
        Row: {
          client_id: string
          created_at: string
          id: string
          packaging_id: string
          quantity: number
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          packaging_id: string
          quantity?: number
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          packaging_id?: string
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_packaging_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_packaging_packaging_id_fkey"
            columns: ["packaging_id"]
            isOneToOne: false
            referencedRelation: "packaging"
            referencedColumns: ["id"]
          },
        ]
      }
      client_products: {
        Row: {
          client_id: string
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_products_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          advance_payment_date: string | null
          advance_payment_paid: boolean | null
          assigned_agent_id: string | null
          bank_details: string | null
          brand_name: string | null
          business_address: string | null
          business_email: string | null
          business_number: string | null
          city: string | null
          cnic_back_image: string | null
          cnic_front_image: string | null
          cnic_number: string | null
          country: string | null
          courier_password: string | null
          courier_url: string | null
          courier_username: string | null
          created_at: string | null
          dashboard_password: string | null
          dashboard_suspended: boolean | null
          domain: string | null
          drive_link: string | null
          email: string
          facebook_page_url: string | null
          form_filled_date: string | null
          full_payment_date: string | null
          full_payment_paid: boolean | null
          id: string
          instagram_password: string | null
          instagram_profile_url: string | null
          instagram_username: string | null
          labels_details: string | null
          labels_name: string | null
          lead_source: string | null
          name: string
          niche: string | null
          notes: string | null
          ntn: string | null
          packaging_id: string | null
          phone: string | null
          product_id: string | null
          product_quantity: number | null
          shopify_password: string | null
          shopify_url: string | null
          shopify_username: string | null
          status: string
          strn: string | null
          subscription_package: string | null
          total_value: number | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          advance_payment_date?: string | null
          advance_payment_paid?: boolean | null
          assigned_agent_id?: string | null
          bank_details?: string | null
          brand_name?: string | null
          business_address?: string | null
          business_email?: string | null
          business_number?: string | null
          city?: string | null
          cnic_back_image?: string | null
          cnic_front_image?: string | null
          cnic_number?: string | null
          country?: string | null
          courier_password?: string | null
          courier_url?: string | null
          courier_username?: string | null
          created_at?: string | null
          dashboard_password?: string | null
          dashboard_suspended?: boolean | null
          domain?: string | null
          drive_link?: string | null
          email: string
          facebook_page_url?: string | null
          form_filled_date?: string | null
          full_payment_date?: string | null
          full_payment_paid?: boolean | null
          id?: string
          instagram_password?: string | null
          instagram_profile_url?: string | null
          instagram_username?: string | null
          labels_details?: string | null
          labels_name?: string | null
          lead_source?: string | null
          name: string
          niche?: string | null
          notes?: string | null
          ntn?: string | null
          packaging_id?: string | null
          phone?: string | null
          product_id?: string | null
          product_quantity?: number | null
          shopify_password?: string | null
          shopify_url?: string | null
          shopify_username?: string | null
          status?: string
          strn?: string | null
          subscription_package?: string | null
          total_value?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          advance_payment_date?: string | null
          advance_payment_paid?: boolean | null
          assigned_agent_id?: string | null
          bank_details?: string | null
          brand_name?: string | null
          business_address?: string | null
          business_email?: string | null
          business_number?: string | null
          city?: string | null
          cnic_back_image?: string | null
          cnic_front_image?: string | null
          cnic_number?: string | null
          country?: string | null
          courier_password?: string | null
          courier_url?: string | null
          courier_username?: string | null
          created_at?: string | null
          dashboard_password?: string | null
          dashboard_suspended?: boolean | null
          domain?: string | null
          drive_link?: string | null
          email?: string
          facebook_page_url?: string | null
          form_filled_date?: string | null
          full_payment_date?: string | null
          full_payment_paid?: boolean | null
          id?: string
          instagram_password?: string | null
          instagram_profile_url?: string | null
          instagram_username?: string | null
          labels_details?: string | null
          labels_name?: string | null
          lead_source?: string | null
          name?: string
          niche?: string | null
          notes?: string | null
          ntn?: string | null
          packaging_id?: string | null
          phone?: string | null
          product_id?: string | null
          product_quantity?: number | null
          shopify_password?: string | null
          shopify_url?: string | null
          shopify_username?: string | null
          status?: string
          strn?: string | null
          subscription_package?: string | null
          total_value?: number | null
          updated_at?: string | null
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
        Relationships: []
      }
      company_settings: {
        Row: {
          accent_color: string | null
          addons_necessary: boolean
          client_dashboard_access_days: number | null
          company_logo: string | null
          company_name: string | null
          created_at: string
          currency: string | null
          description: string | null
          email_notifications: boolean | null
          id: string
          invoice_logo: string | null
          invoice_note: string | null
          packaging_moq_with_addon: number
          packaging_moq_without_addon: number
          packaging_necessary: boolean
          payment_currency: string | null
          payment_methods: Json | null
          payment_mode: string | null
          primary_color: string | null
          primary_email: string | null
          primary_phone: string | null
          products_moq_with_addon: number
          products_moq_without_addon: number
          products_necessary: boolean
          secondary_color: string | null
          secondary_email: string | null
          secondary_phone: string | null
          sms_notifications: boolean | null
          timezone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          accent_color?: string | null
          addons_necessary?: boolean
          client_dashboard_access_days?: number | null
          company_logo?: string | null
          company_name?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          email_notifications?: boolean | null
          id?: string
          invoice_logo?: string | null
          invoice_note?: string | null
          packaging_moq_with_addon?: number
          packaging_moq_without_addon?: number
          packaging_necessary?: boolean
          payment_currency?: string | null
          payment_methods?: Json | null
          payment_mode?: string | null
          primary_color?: string | null
          primary_email?: string | null
          primary_phone?: string | null
          products_moq_with_addon?: number
          products_moq_without_addon?: number
          products_necessary?: boolean
          secondary_color?: string | null
          secondary_email?: string | null
          secondary_phone?: string | null
          sms_notifications?: boolean | null
          timezone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          accent_color?: string | null
          addons_necessary?: boolean
          client_dashboard_access_days?: number | null
          company_logo?: string | null
          company_name?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          email_notifications?: boolean | null
          id?: string
          invoice_logo?: string | null
          invoice_note?: string | null
          packaging_moq_with_addon?: number
          packaging_moq_without_addon?: number
          packaging_necessary?: boolean
          payment_currency?: string | null
          payment_methods?: Json | null
          payment_mode?: string | null
          primary_color?: string | null
          primary_email?: string | null
          primary_phone?: string | null
          products_moq_with_addon?: number
          products_moq_without_addon?: number
          products_necessary?: boolean
          secondary_color?: string | null
          secondary_email?: string | null
          secondary_phone?: string | null
          sms_notifications?: boolean | null
          timezone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      consultation_form_submissions: {
        Row: {
          category: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          submitted_at: string | null
          vision: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          submitted_at?: string | null
          vision?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          submitted_at?: string | null
          vision?: string | null
        }
        Relationships: []
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
      contact_form_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone_number: string | null
          product_category: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone_number?: string | null
          product_category?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone_number?: string | null
          product_category?: string | null
        }
        Relationships: []
      }
      elevate_booking_submissions: {
        Row: {
          agenda: string | null
          brand_name: string
          contact_name: string
          created_at: string
          email: string
          id: string
          lead_id: string | null
          phone: string | null
          slot_id: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          agenda?: string | null
          brand_name: string
          contact_name: string
          created_at?: string
          email: string
          id?: string
          lead_id?: string | null
          phone?: string | null
          slot_id?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          agenda?: string | null
          brand_name?: string
          contact_name?: string
          created_at?: string
          email?: string
          id?: string
          lead_id?: string | null
          phone?: string | null
          slot_id?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          context: Json | null
          created_at: string
          id: string
          level: string | null
          message: string
          stack: string | null
          timestamp: string
          url: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string
          id?: string
          level?: string | null
          message: string
          stack?: string | null
          timestamp: string
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string
          id?: string
          level?: string | null
          message?: string
          stack?: string | null
          timestamp?: string
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      front_leads: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone_number: string | null
          product_category: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          message?: string | null
          name: string
          phone_number?: string | null
          product_category?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone_number?: string | null
          product_category?: string | null
        }
        Relationships: []
      }
      full_applications: {
        Row: {
          build_support: string | null
          category: string | null
          city: string | null
          created_at: string
          email: string
          has_business: string | null
          id: string
          investment_range: string | null
          motivation: string | null
          name: string
          phone: string
        }
        Insert: {
          build_support?: string | null
          category?: string | null
          city?: string | null
          created_at?: string
          email: string
          has_business?: string | null
          id: string
          investment_range?: string | null
          motivation?: string | null
          name: string
          phone: string
        }
        Update: {
          build_support?: string | null
          category?: string | null
          city?: string | null
          created_at?: string
          email?: string
          has_business?: string | null
          id?: string
          investment_range?: string | null
          motivation?: string | null
          name?: string
          phone?: string
        }
        Relationships: []
      }
      funnel_step1_submissions: {
        Row: {
          build_support: string | null
          category: string | null
          city: string | null
          created_at: string
          email: string
          has_business: string | null
          id: string
          investment_range: string | null
          motivation: string | null
          name: string
          phone: string
        }
        Insert: {
          build_support?: string | null
          category?: string | null
          city?: string | null
          created_at?: string
          email: string
          has_business?: string | null
          id?: string
          investment_range?: string | null
          motivation?: string | null
          name: string
          phone: string
        }
        Update: {
          build_support?: string | null
          category?: string | null
          city?: string | null
          created_at?: string
          email?: string
          has_business?: string | null
          id?: string
          investment_range?: string | null
          motivation?: string | null
          name?: string
          phone?: string
        }
        Relationships: []
      }
      holidays: {
        Row: {
          created_at: string
          created_by: string | null
          date: string
          description: string | null
          id: string
          is_recurring: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          date: string
          description?: string | null
          id?: string
          is_recurring?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          date?: string
          description?: string | null
          id?: string
          is_recurring?: boolean
          name?: string
          updated_at?: string
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
          client_id: string | null
          created_at: string | null
          created_by: number | null
          due_date: string
          id: string
          invoice_number: string
          invoice_title: string | null
          invoice_url: string | null
          items: Json | null
          lead_id: string
          status: string | null
          subtotal: number | null
          tax_amount: number | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          amount_due_now: number
          client_id?: string | null
          created_at?: string | null
          created_by?: number | null
          due_date: string
          id?: string
          invoice_number: string
          invoice_title?: string | null
          invoice_url?: string | null
          items?: Json | null
          lead_id: string
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          amount_due_now?: number
          client_id?: string | null
          created_at?: string | null
          created_by?: number | null
          due_date?: string
          id?: string
          invoice_number?: string
          invoice_title?: string | null
          invoice_url?: string | null
          items?: Json | null
          lead_id?: string
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      lead_client_mapping: {
        Row: {
          client_id: string
          created_at: string
          id: string
          lead_id: string
          lead_type: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          lead_id: string
          lead_type: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          lead_id?: string
          lead_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_client_mapping_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_flags: {
        Row: {
          created_at: string
          flag_notes: string | null
          flag_reason: string
          flagged_by: string
          id: string
          is_resolved: boolean
          lead_id: string
          lead_type: string
          resolved_at: string | null
          resolved_by: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          flag_notes?: string | null
          flag_reason: string
          flagged_by: string
          id?: string
          is_resolved?: boolean
          lead_id: string
          lead_type: string
          resolved_at?: string | null
          resolved_by?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          flag_notes?: string | null
          flag_reason?: string
          flagged_by?: string
          id?: string
          is_resolved?: boolean
          lead_id?: string
          lead_type?: string
          resolved_at?: string | null
          resolved_by?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      leads_elevate: {
        Row: {
          aov: number | null
          brand_name: string | null
          contact_name: string | null
          cps_breakeven: number | null
          cps_target: number | null
          created_at: string
          currency: string
          current_orders_per_month: number | null
          email: string | null
          geo: string | null
          gp_per_order: number | null
          gross_margin_pct: number | null
          id: string
          monthly_ad_budget: number | null
          notes: string | null
          per_sale_fee: number | null
          phone: string | null
          roas_breakeven: number | null
          source: string
          status: string
          target_net_margin_pct: number | null
          updated_at: string
          vertical: string | null
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          aov?: number | null
          brand_name?: string | null
          contact_name?: string | null
          cps_breakeven?: number | null
          cps_target?: number | null
          created_at?: string
          currency?: string
          current_orders_per_month?: number | null
          email?: string | null
          geo?: string | null
          gp_per_order?: number | null
          gross_margin_pct?: number | null
          id?: string
          monthly_ad_budget?: number | null
          notes?: string | null
          per_sale_fee?: number | null
          phone?: string | null
          roas_breakeven?: number | null
          source: string
          status?: string
          target_net_margin_pct?: number | null
          updated_at?: string
          vertical?: string | null
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          aov?: number | null
          brand_name?: string | null
          contact_name?: string | null
          cps_breakeven?: number | null
          cps_target?: number | null
          created_at?: string
          currency?: string
          current_orders_per_month?: number | null
          email?: string | null
          geo?: string | null
          gp_per_order?: number | null
          gross_margin_pct?: number | null
          id?: string
          monthly_ad_budget?: number | null
          notes?: string | null
          per_sale_fee?: number | null
          phone?: string | null
          roas_breakeven?: number | null
          source?: string
          status?: string
          target_net_margin_pct?: number | null
          updated_at?: string
          vertical?: string | null
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      live_sessions: {
        Row: {
          class_url: string
          created_at: string
          created_by: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean
          session_date: string
          session_time: string
          title: string
          updated_at: string
          zoom_email: string | null
          zoom_password: string | null
        }
        Insert: {
          class_url: string
          created_at?: string
          created_by?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean
          session_date: string
          session_time: string
          title: string
          updated_at?: string
          zoom_email?: string | null
          zoom_password?: string | null
        }
        Update: {
          class_url?: string
          created_at?: string
          created_by?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean
          session_date?: string
          session_time?: string
          title?: string
          updated_at?: string
          zoom_email?: string | null
          zoom_password?: string | null
        }
        Relationships: []
      }
      meetings: {
        Row: {
          assigned_agent_email: string
          client_id: string | null
          client_name: string
          created_at: string
          created_by_email: string | null
          duration_minutes: number | null
          id: string
          meeting_date: string
          meeting_time: string
          notes: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_agent_email: string
          client_id?: string | null
          client_name: string
          created_at?: string
          created_by_email?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_date: string
          meeting_time: string
          notes?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_agent_email?: string
          client_id?: string | null
          client_name?: string
          created_at?: string
          created_by_email?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_date?: string
          meeting_time?: string
          notes?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      msas: {
        Row: {
          created_at: string
          html_snapshot: string
          id: string
          json_payload: Json
          lead_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          html_snapshot: string
          id?: string
          json_payload: Json
          lead_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          html_snapshot?: string
          id?: string
          json_payload?: Json
          lead_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "msas_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_elevate"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          is_read: boolean
          message: string
          notification_type: string
          recipient_user_id: string
          title: string
          triggered_by_user_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          is_read?: boolean
          message: string
          notification_type?: string
          recipient_user_id: string
          title: string
          triggered_by_user_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          is_read?: boolean
          message?: string
          notification_type?: string
          recipient_user_id?: string
          title?: string
          triggered_by_user_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      packaging: {
        Row: {
          capacity: string | null
          Category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          images: string[] | null
          lead_time: number | null
          manage_stock: boolean
          material: string | null
          min_order_quantity: number
          name: string
          price: number
          size: string
          size_metric: string
          supplier: string | null
          type: string
          updated_at: string
        }
        Insert: {
          capacity?: string | null
          Category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          lead_time?: number | null
          manage_stock?: boolean
          material?: string | null
          min_order_quantity: number
          name: string
          price: number
          size: string
          size_metric: string
          supplier?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          capacity?: string | null
          Category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          lead_time?: number | null
          manage_stock?: boolean
          material?: string | null
          min_order_quantity?: number
          name?: string
          price?: number
          size?: string
          size_metric?: string
          supplier?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "packaging_Category_fkey"
            columns: ["Category"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          Category: string | null
          content_size: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          inspired_by: string | null
          moq: number
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          Category?: string | null
          content_size?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          inspired_by?: string | null
          moq?: number
          name: string
          price?: number
          updated_at?: string | null
        }
        Update: {
          Category?: string | null
          content_size?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          inspired_by?: string | null
          moq?: number
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_Category_fkey"
            columns: ["Category"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      recordings: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          name: string
          recording_url: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          recording_url: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          recording_url?: string
          updated_at?: string
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
      supplier_leads: {
        Row: {
          brand_name: string
          concentration: string | null
          created_at: string
          email: string
          estimated_per_unit_cost: number | null
          estimated_total_cost: number | null
          id: string
          moq: number
          name: string
          selected_bottle: string | null
          selected_oil: string | null
          selected_packaging: string | null
          status: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          brand_name: string
          concentration?: string | null
          created_at?: string
          email: string
          estimated_per_unit_cost?: number | null
          estimated_total_cost?: number | null
          id?: string
          moq: number
          name: string
          selected_bottle?: string | null
          selected_oil?: string | null
          selected_packaging?: string | null
          status?: string
          updated_at?: string
          whatsapp: string
        }
        Update: {
          brand_name?: string
          concentration?: string | null
          created_at?: string
          email?: string
          estimated_per_unit_cost?: number | null
          estimated_total_cost?: number | null
          id?: string
          moq?: number
          name?: string
          selected_bottle?: string | null
          selected_oil?: string | null
          selected_packaging?: string | null
          status?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      test_booking: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          phone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          active: boolean | null
          auth_user_id: string
          can_be_assigned_clients: boolean
          contact1: string | null
          contact2: string | null
          created_at: string | null
          current_password: string | null
          duty_end_time: string | null
          duty_start_time: string | null
          duty_timezone: string | null
          email: string
          last_login_at: string | null
          name: string
          password_changed: boolean | null
          role: Database["public"]["Enums"]["Role"] | null
          temp_password: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          auth_user_id: string
          can_be_assigned_clients?: boolean
          contact1?: string | null
          contact2?: string | null
          created_at?: string | null
          current_password?: string | null
          duty_end_time?: string | null
          duty_start_time?: string | null
          duty_timezone?: string | null
          email: string
          last_login_at?: string | null
          name: string
          password_changed?: boolean | null
          role?: Database["public"]["Enums"]["Role"] | null
          temp_password?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          auth_user_id?: string
          can_be_assigned_clients?: boolean
          contact1?: string | null
          contact2?: string | null
          created_at?: string | null
          current_password?: string | null
          duty_end_time?: string | null
          duty_start_time?: string | null
          duty_timezone?: string | null
          email?: string
          last_login_at?: string | null
          name?: string
          password_changed?: boolean | null
          role?: Database["public"]["Enums"]["Role"] | null
          temp_password?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      analytics_dashboard: {
        Row: {
          clients_work_completed: number | null
          full_payment_clients: number | null
          ghosted_clients: number | null
          half_payment_clients: number | null
          total_bookings: number | null
          total_clients: number | null
          total_invoices: number | null
          total_members: number | null
          total_revenue: number | null
        }
        Relationships: []
      }
      monthly_revenue_trend: {
        Row: {
          month: string | null
          month_start: string | null
          new_clients: number | null
          revenue: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_user_with_temp_password: {
        Args: {
          temp_pass?: string
          user_email: string
          user_name: string
          user_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: Json
      }
      find_existing_client: {
        Args: { email_input?: string; phone_input?: string }
        Returns: string
      }
      get_client_assignment_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_clients_work_completed: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_next_assignee: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_next_available_agent: {
        Args: { booking_date: string; booking_time: string }
        Returns: string
      }
      get_next_client_assignee: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_notification_recipients: {
        Args: {
          action_type: string
          actor_role: string
          assigned_agent_id?: string
          client_id?: string
        }
        Returns: string[]
      }
      get_or_create_client_by_contact: {
        Args: {
          brand_name_input?: string
          business_email_input?: string
          city_input?: string
          domain_input?: string
          email_input?: string
          name_input?: string
          niche_input?: string
          phone_input?: string
        }
        Returns: string
      }
      get_total_packaging: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_total_products: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_user_meetings_count: {
        Args: { user_email?: string }
        Returns: number
      }
      hash_password: {
        Args: { password: string }
        Returns: string
      }
      normalize_phone: {
        Args: { phone_input: string }
        Returns: string
      }
      redistribute_unassigned_clients: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      upsert_client_auth: {
        Args: {
          p_client_id: string
          p_email: string
          p_is_active?: boolean
          p_password_hash: string
        }
        Returns: string
      }
      verify_client_password: {
        Args: { email: string; password: string }
        Returns: boolean
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
      payment_type: "one_time" | "monthly"
      Role:
        | "SuperAdmin"
        | "Admin"
        | "SalesAgent"
        | "WebDeveloper"
        | "MediaTeam"
        | "Client"
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
        | "Sales Agent"
        | "Media Team"
        | "Web Developer"
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
      payment_type: ["one_time", "monthly"],
      Role: [
        "SuperAdmin",
        "Admin",
        "SalesAgent",
        "WebDeveloper",
        "MediaTeam",
        "Client",
      ],
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
        "Sales Agent",
        "Media Team",
        "Web Developer",
      ],
    },
  },
} as const
