// Authentication and Authorization Types
export const USER_ROLES = {
  SUPER_ADMIN: 'super-admin',
  MANAGER: 'manager',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Route Constants
export const ROUTES = {
  LOGIN: '/login',
  HOME: '/',
  DASHBOARD: '/dashboard',
  // Add more routes as needed
} as const;

// API Endpoints (if using custom API alongside Supabase)
export const API_ENDPOINTS = {
  // Add your API endpoints here
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH: 'auth-storage',
} as const;

// Query Keys (for React Query)
export const QUERY_KEYS = {
  USER_PROFILE: 'profile',
  ITEMS: 'items',
  // Add more query keys as needed
} as const;
