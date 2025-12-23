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
  role?: Role; 
}

export interface Client {
  id: string;
  created_at: string;
  nom: string;
  prenom: string;
  CIN: string;
  email: string;
  telephone: string;
  statut_social: string;
  date_naissance: string;
  adresse: string;
  genre: string;
}

export interface Reservation {
  id: string;
  status: string;
  created_at: string;
  clientId: string;
  userId: string;
  date_debut: string;
  date_fin: string;
  nbNights: number;
  room_id: string;
}

export interface Room {
  id: string;
  created_at: string;
  numChambre: string;
  typeChambre: string;
  status: string;
  pricePerNight: number;
  capacity: number;
  surface: number;
  image: string | null;
  bathrooms: number;
  equipements: string[];
  vue: string | null;
}

export interface ReservationRoom {
  id: string;
  created_at: string;
  reservation_id: string;
  room_id: string;
}

export interface Invoice {
  id: string;
  created_at: string;
  invoice_number: string;
  date_invoice: string;
  status: string;
  total_amount: number;
  reservation_id: string;
}

// roles 
export const hasAdminAccess = (roleName: string | null | undefined): boolean => {
  if (!roleName) return false;
  if (typeof roleName !== 'string') return false;
  const adminRoles = ['admin', 'manager', 'super-admin'];
  return adminRoles.includes(roleName.toLowerCase());
};

// super admin
export const isSuperAdmin = (roleName: string | null | undefined): boolean => {
  return roleName?.toLowerCase() === 'super-admin';
};

// manager
export const isManager = (roleName: string | null | undefined): boolean => {
  return roleName?.toLowerCase() === 'manager';
};

// admin
export const isAdmin = (roleName: string | null | undefined): boolean => {
  return roleName?.toLowerCase() === 'admin';
};
