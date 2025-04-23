/**
 * Type definitions for Supabase database schema
 */
export interface Database {
  public: {
    Tables: {
      /**
       * Notes table schema
       */
      notes: {
        Row: {
          /** Unique identifier for the note */
          id: string;
          /** Timestamp when the note was created */
          created_at: string;
          /** Timestamp when the note was last updated */
          updated_at: string;
          /** Title of the note */
          title: string;
          /** Content/body of the note */
          content: string;
          /** ID of the user who owns this note */
          user_id: string;
        };
        Insert: {
          /** Unique identifier for the note (auto-generated if not provided) */
          id?: string;
          /** Timestamp when the note was created (auto-generated if not provided) */
          created_at?: string;
          /** Timestamp when the note was last updated (auto-generated if not provided) */
          updated_at?: string;
          /** Title of the note */
          title: string;
          /** Content/body of the note */
          content: string;
          /** ID of the user who owns this note */
          user_id: string;
        };
        Update: {
          /** Unique identifier for the note */
          id?: string;
          /** Timestamp when the note was created */
          created_at?: string;
          /** Timestamp when the note was last updated */
          updated_at?: string;
          /** Title of the note */
          title?: string;
          /** Content/body of the note */
          content?: string;
          /** ID of the user who owns this note */
          user_id?: string;
        };
      };
      /**
       * User profiles table schema
       */
      profiles: {
        Row: {
          /** User ID (references auth.users) */
          id: string;
          /** Timestamp when the profile was created */
          created_at: string;
          /** Timestamp when the profile was last updated */
          updated_at: string;
          /** User's display name */
          display_name: string | null;
          /** URL to the user's avatar image */
          avatar_url: string | null;
        };
        Insert: {
          /** User ID (references auth.users) */
          id: string;
          /** Timestamp when the profile was created (auto-generated if not provided) */
          created_at?: string;
          /** Timestamp when the profile was last updated (auto-generated if not provided) */
          updated_at?: string;
          /** User's display name */
          display_name?: string | null;
          /** URL to the user's avatar image */
          avatar_url?: string | null;
        };
        Update: {
          /** User ID (references auth.users) */
          id?: string;
          /** Timestamp when the profile was created */
          created_at?: string;
          /** Timestamp when the profile was last updated */
          updated_at?: string;
          /** User's display name */
          display_name?: string | null;
          /** URL to the user's avatar image */
          avatar_url?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
}

/**
 * Type representing a complete note record
 */
export type Note = Database['public']['Tables']['notes']['Row'];

/**
 * Type for inserting a new note
 */
export type InsertNote = Database['public']['Tables']['notes']['Insert'];

/**
 * Type for updating an existing note
 */
export type UpdateNote = Database['public']['Tables']['notes']['Update'];

/**
 * Type representing a user profile record
 */
export type Profile = Database['public']['Tables']['profiles']['Row'];