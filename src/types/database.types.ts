/**
 * Supabase Database Types
 * 
 * This file will contain TypeScript types for your Supabase database.
 * To generate types automatically from your database schema, run:
 * 
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
 * 
 * Or use the supabase-cli.sh helper script (option 7)
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Add your table definitions here
      // Example:
      // items: {
      //   Row: {
      //     id: string
      //     name: string
      //     created_at: string
      //   }
      //   Insert: {
      //     id?: string
      //     name: string
      //     created_at?: string
      //   }
      //   Update: {
      //     id?: string
      //     name?: string
      //     created_at?: string
      //   }
      // }
    }
    Views: {
      // Add your view definitions here
    }
    Functions: {
      // Add your function definitions here
    }
    Enums: {
      // Add your enum definitions here
    }
  }
}
