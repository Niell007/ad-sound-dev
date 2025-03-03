"use client";

import { useAuth } from "@/contexts/auth-context";
import { useState, useEffect } from "react";

// Define the role hierarchy
const roleHierarchy = {
  admin: 4,
  manager: 3,
  staff: 2,
  user: 1
};

type Role = keyof typeof roleHierarchy;

// Define permission types
type Action = "create" | "read" | "update" | "delete";

interface ResourcePermissions {
  [resource: string]: Action[];
}

interface RolePermissions {
  [role: string]: {
    [resource: string]: Action[];
  };
}

export function useRBAC() {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<Role>("user");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Get role from user metadata or fetch from API
      const role = user.user_metadata?.role || "user";
      setUserRole(role as Role);
    }
    setIsLoading(false);
  }, [user]);

  // Check if user has at least the specified role
  const hasRole = (requiredRole: Role): boolean => {
    if (!user) return false;
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  };

  // Check if user has exactly the specified role
  const isExactRole = (role: Role): boolean => {
    if (!user) return false;
    return userRole === role;
  };

  // Check if user has permission for a specific action
  const can = (action: Action, resource: string): boolean => {
    if (!user) return false;

    // Define permissions based on roles and resources
    const permissions: RolePermissions = {
      admin: {
        all: ["create", "read", "update", "delete"]
      },
      manager: {
        users: ["read"],
        staff: ["create", "read", "update"],
        bookings: ["create", "read", "update", "delete"],
        services: ["create", "read", "update", "delete"],
        settings: ["read", "update"]
      },
      staff: {
        bookings: ["read", "update"],
        services: ["read"],
        clients: ["read"]
      },
      user: {
        profile: ["read", "update"]
      }
    };

    // Admin has all permissions
    if (userRole === "admin") return true;

    // Check if the role has permissions for the resource
    const rolePermissions = permissions[userRole];
    if (!rolePermissions) return false;

    // Check if the role has all permissions for all resources
    if (rolePermissions["all"] && rolePermissions["all"].includes(action)) return true;

    // Check if the role has the specific permission for the resource
    return !!rolePermissions[resource]?.includes(action);
  };

  return {
    role: userRole,
    isLoading,
    hasRole,
    isExactRole,
    can,
    isAdmin: () => hasRole("admin"),
    isManager: () => hasRole("manager"),
    isStaff: () => hasRole("staff"),
    isUser: () => isExactRole("user")
  };
} 