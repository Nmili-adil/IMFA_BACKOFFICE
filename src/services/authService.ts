import { supabase } from '@/lib/supabase';
import type { User } from '@/lib/supabase';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User | null;
  error: Error | null;
}

/**
 * Authenticate user with email and password
 * This uses custom authentication against the users table
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    // Query the users table first
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('emailEmp', email)
      .maybeSingle();

    if (userError) {
      console.error('Database error:', userError);
      return {
        user: null,
        error: new Error('Failed to authenticate. Please try again.'),
      };
    }

    if (!userData) {
      return {
        user: null,
        error: new Error('Invalid email or password'),
      };
    }

    // For now, we'll use code_pin as password (you should implement proper password hashing)
    // TODO: Implement proper password verification with bcrypt or similar
    if (userData.code_pin.toString() !== password) {
      return {
        user: null,
        error: new Error('Invalid email or password'),
      };
    }

    // Fetch the role separately
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('*')
      .eq('id', userData.role_id)
      .maybeSingle();

    console.log('Role fetch result:', { roleData, roleError, role_id: userData.role_id });

    if (roleError) {
      console.error('Role fetch error:', roleError);
      return {
        user: null,
        error: new Error('Failed to fetch user role.'),
      };
    }

    // Check if user has admin access based on role_id
    // Assuming: role_id 1 = admin, 2 = manager, 3 = super-admin
    // OR check by role name if roleData exists
    const allowedRoleIds = [1, 2, 3]; // Adjust these IDs based on your actual roles table
    
    if (roleData) {
      const roleName = roleData.name?.toLowerCase();
      console.log('Checking role access:', { roleName, allowedRoles: ['admin', 'manager', 'super-admin'] });
      
      if (!roleName || !['admin', 'manager', 'super-admin'].includes(roleName)) {
        console.log('Access denied - role not in allowed list:', roleName);
        return {
          user: null,
          error: new Error(`Access denied. Your role "${roleData.name}" does not have access. Only admin, manager, and super-admin can access this system.`),
        };
      }
    } else {
      // If role data not found, check by role_id
      console.log('No role data found, checking by role_id:', { role_id: userData.role_id, allowedRoleIds });
      
      if (!userData.role_id || !allowedRoleIds.includes(userData.role_id)) {
        return {
          user: null,
          error: new Error('Access denied. Only admin, manager, and super-admin can access this system.'),
        };
      }
    }

    // Combine user data with role (create fallback if roleData is null)
    const finalRole = roleData || (userData.role_id ? {
      id: userData.role_id,
      created_at: new Date().toISOString(),
      name: userData.role_id === 1 ? 'admin' : userData.role_id === 2 ? 'manager' : 'super-admin',
    } : undefined);

    const user: User = {
      ...userData,
      role: finalRole,
    };

    console.log('Final user object:', { user, hasRole: !!user.role, roleName: user.role?.name });

    return {
      user,
      error: null,
    };
  } catch (err) {
    console.error('Login error:', err);
    return {
      user: null,
      error: err instanceof Error ? err : new Error('An unexpected error occurred'),
    };
  }
};

/**
 * Get user by email
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        role:roles(*)
      `)
      .eq('emailEmp', email)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data as User;
  } catch (err) {
    console.error('Error fetching user:', err);
    return null;
  }
};

/**
 * Get user by code_pin
 */
export const getUserByCodePin = async (codePin: number): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        role:roles(*)
      `)
      .eq('code_pin', codePin)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data as User;
  } catch (err) {
    console.error('Error fetching user:', err);
    return null;
  }
};
