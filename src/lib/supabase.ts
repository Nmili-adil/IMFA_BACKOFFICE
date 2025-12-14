import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Database Types
export interface Role {
  id: number;
  created_at: string;
  name: string;
}

export interface User {
  code_pin: number;
  rfid: number;
  created_at: string;
  nomEmp: string;
  dateNaissanceEmp: string | null;
  adressEmp: string | null;
  mobileEmp: string | null;
  emailEmp: string;
  image: string | null;
  role_id: number | null;
  role?: Role; // Joined role data
}

// Helper function to check if role allows admin access
export const hasAdminAccess = (roleName: string | null | undefined): boolean => {
  if (!roleName) return false;
  if (typeof roleName !== 'string') return false;
  const adminRoles = ['admin', 'manager', 'super-admin'];
  return adminRoles.includes(roleName.toLowerCase());
};

// Helper function to check if user is super admin
export const isSuperAdmin = (roleName: string | null | undefined): boolean => {
  return roleName?.toLowerCase() === 'super-admin';
};

// Helper function to check if user is manager
export const isManager = (roleName: string | null | undefined): boolean => {
  return roleName?.toLowerCase() === 'manager';
};

// Helper function to check if user is admin
export const isAdmin = (roleName: string | null | undefined): boolean => {
  return roleName?.toLowerCase() === 'admin';
};
