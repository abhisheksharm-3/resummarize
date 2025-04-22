export interface Database {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          content: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          content: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          content?: string
          user_id?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          display_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          display_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          display_name?: string | null
          avatar_url?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
}

export type Note = Database['public']['Tables']['notes']['Row'];
export type InsertNote = Database['public']['Tables']['notes']['Insert'];
export type UpdateNote = Database['public']['Tables']['notes']['Update'];
export type Profile = Database['public']['Tables']['profiles']['Row'];