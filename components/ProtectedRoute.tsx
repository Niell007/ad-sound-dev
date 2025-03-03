"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useRBAC } from "@/hooks/useRBAC";
import { useAuth } from "@/contexts/auth-context";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "manager" | "staff" | "user";
  requiredPermission?: {
    action: "create" | "read" | "update" | "delete";
    resource: string;
  };
  fallback?: ReactNode;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  fallback
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { hasRole, can, isLoading: rbacLoading } = useRBAC();
  
  const isLoading = authLoading || rbacLoading;

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && !user) {
      router.push("/auth/signin");
      return;
    }

    // If user exists but doesn't have required role, show fallback or redirect
    if (!isLoading && user) {
      if (requiredRole && !hasRole(requiredRole)) {
        if (!fallback) {
          router.push("/dashboard");
        }
      }

      if (requiredPermission && !can(requiredPermission.action, requiredPermission.resource)) {
        if (!fallback) {
          router.push("/dashboard");
        }
      }
    }
  }, [user, isLoading, requiredRole, requiredPermission, router, hasRole, can, fallback]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Loading...</h2>
          <p className="text-muted-foreground mt-2">Please wait while we check your permissions</p>
        </div>
      </div>
    );
  }

  // If no user, show nothing (will redirect)
  if (!user) {
    return null;
  }

  // If user doesn't have required role or permission, show fallback
  if ((requiredRole && !hasRole(requiredRole)) || 
      (requiredPermission && !can(requiredPermission.action, requiredPermission.resource))) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return null;
  }

  // User has required role and permissions, show children
  return <>{children}</>;
} 