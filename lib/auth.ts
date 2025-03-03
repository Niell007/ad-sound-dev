import { supabase } from './supabase';

// Define user roles
export enum UserRole {
  USER = 'user',
  STAFF = 'staff',
  ADMIN = 'admin'
}

// Define permissions for each role
export const rolePermissions = {
  [UserRole.USER]: {
    canViewBookings: true,
    canCreateBookings: true,
    canEditOwnBookings: true,
    canDeleteOwnBookings: true,
    canViewOwnProfile: true,
    canEditOwnProfile: true,
    canAccessDashboard: false,
    canManageClients: false,
    canManageServices: false,
    canManagePayments: false,
    canManageUsers: false,
  },
  [UserRole.STAFF]: {
    canViewBookings: true,
    canCreateBookings: true,
    canEditBookings: true,
    canDeleteBookings: true,
    canViewOwnProfile: true,
    canEditOwnProfile: true,
    canAccessDashboard: true,
    canManageClients: true,
    canManageServices: true,
    canManagePayments: true,
    canManageUsers: false,
  },
  [UserRole.ADMIN]: {
    canViewBookings: true,
    canCreateBookings: true,
    canEditBookings: true,
    canDeleteBookings: true,
    canViewOwnProfile: true,
    canEditOwnProfile: true,
    canAccessDashboard: true,
    canManageClients: true,
    canManageServices: true,
    canManagePayments: true,
    canManageUsers: true,
  }
};

// Get user role from Supabase
export async function getUserRole(userId: string): Promise<UserRole> {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return UserRole.USER; // Default to basic user role
    }

    return data?.role as UserRole || UserRole.USER;
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return UserRole.USER; // Default to basic user role
  }
}

// Set user role in Supabase
export async function setUserRole(userId: string, role: UserRole): Promise<boolean> {
  try {
    // Check if user role record exists
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingRole) {
      // Update existing role
      const { error } = await supabase
        .from('user_roles')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating user role:', error);
        return false;
      }
    } else {
      // Create new role record
      const { error } = await supabase
        .from('user_roles')
        .insert({ 
          user_id: userId, 
          role, 
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating user role:', error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error in setUserRole:', error);
    return false;
  }
}

// Check if user has a specific permission
export async function hasPermission(userId: string, permission: keyof typeof rolePermissions[UserRole]): Promise<boolean> {
  try {
    const userRole = await getUserRole(userId);
    return rolePermissions[userRole][permission] || false;
  } catch (error) {
    console.error('Error in hasPermission:', error);
    return false;
  }
}

// Set default role for new users
export async function setDefaultRoleForNewUser(userId: string): Promise<void> {
  try {
    await setUserRole(userId, UserRole.USER);
  } catch (error) {
    console.error('Error setting default role for new user:', error);
  }
} 